import crypto from "crypto";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const receivedSignature = req.headers["x-razorpay-signature"];

  const body = JSON.stringify(req.body);

  /* 🔐 Verify webhook signature */
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (receivedSignature !== expectedSignature) {
    console.error("❌ Invalid webhook signature");
    return res.status(400).send("Invalid signature");
  }

  /* ✅ Webhook verified */
  const event = req.body.event;
  const payload = req.body.payload;

  try {
    switch (event) {
      case "payment.captured": {
        const payment = payload.payment.entity;

        console.log("✅ PAYMENT CAPTURED:", payment.id);

        // 🔥 OPTIONAL: save to payments table
        // 🔥 OPTIONAL: mark order as paid
        break;
      }

      case "payment.failed": {
        console.warn("❌ PAYMENT FAILED:", payload.payment.entity.id);
        break;
      }

      case "refund.processed": {
        console.log("🔁 REFUND PROCESSED:", payload.refund.entity.id);
        break;
      }

      default:
        console.log("Unhandled event:", event);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return res.status(500).send("Webhook handler error");
  }
}

