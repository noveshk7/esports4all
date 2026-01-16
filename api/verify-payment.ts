import crypto from "crypto";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    /* 🔐 1️⃣ Validate payload */
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing payment verification fields",
      });
    }

    /* 🔐 2️⃣ Generate expected signature */
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    /* 🔐 3️⃣ Compare signatures */
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValid) {
      console.warn("⚠️ Invalid Razorpay signature", {
        razorpay_order_id,
        razorpay_payment_id,
      });

      return res.status(400).json({ success: false });
    }

    /* ✅ VERIFIED */
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      error: "Payment verification failed",
    });
  }
}
