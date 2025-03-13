import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const signature = req.headers["paypal-transmission-sig"] as string;
  const transmissionId = req.headers["paypal-transmission-id"] as string;
  const certUrl = req.headers["paypal-cert-url"] as string;
  const transmissionTime = req.headers["paypal-transmission-time"] as string;
  const authAlgo = req.headers["paypal-auth-algo"] as string;
  const webhookEvent = req.body;

  try {
    const verificationData = {
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: signature,
      transmission_time: transmissionTime,
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: webhookEvent
    };

    const response = await axios.post(
      "https://api.sandbox.paypal.com/v1/notifications/verify-webhook-signature",
      verificationData,
      {
        auth: {
          username: process.env.PAYPAL_CLIENT_ID!,
          password: process.env.PAYPAL_SECRET_KEY!
        }
      }
    );

    if (response.data.verification_status !== "SUCCESS") {
      res.status(400).json({ error: "Invalid webhook" });
      return;
    }

    // Process the webhook event
    if (webhookEvent.event_type === "PAYMENT.PAYOUT.SALE.COMPLETED") {
      console.log("Payout successful!", webhookEvent);
      // Handle the completed payout (e.g., update user balance, notify users)
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error verifying webhook" });
  }
}
