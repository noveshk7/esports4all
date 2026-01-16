import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔐 server-only
);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, items, promoCode } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid request" });
    }

    /* 🔐 1️⃣ Fetch actual prices from DB */
    const { data: resources, error } = await supabase
      .from("resources")
      .select("id, price")
      .in(
        "id",
        items.map((i: any) => i.id)
      );

    if (error || !resources) {
      return res.status(400).json({ error: "Invalid resources" });
    }

    let totalAmount = resources.reduce(
      (sum, r) => sum + r.price,
      0
    );

    /* 🎟️ 2️⃣ Apply promo securely */
    if (promoCode) {
      const { data: promo } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("active", true)
        .single();

      if (
        promo &&
        (!promo.expires_at || new Date(promo.expires_at) > new Date())
      ) {
        const discount = Math.floor(
          (totalAmount * promo.discount_percent) / 100
        );
        totalAmount -= discount;
      }
    }

    if (totalAmount <= 0) {
      return res.status(400).json({ error: "Invalid total amount" });
    }

    /* 💳 3️⃣ Create Razorpay order */
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `order_${userId}_${Date.now()}`,
    });

    return res.status(200).json(order);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return res.status(500).json({ error: "Order creation failed" });
  }
}
