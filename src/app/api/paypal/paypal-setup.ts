import { NextApiRequest, NextApiResponse } from "next";
import paypal from "paypal-rest-sdk";

paypal.configure({
  mode: "sandbox", // Use "live" for production
  client_id: process.env.PAYPAL_CLIENT_ID!,
  client_secret: process.env.PAYPAL_SECRET_KEY!,
});

interface PayoutResponse {
  batch_header: {
    payout_batch_id: string;
    batch_status: string;
  };
  // Add other properties as needed
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const paymentData = req.body; // You can pass the payment data (amount, recipient email, etc.)

      const payoutJson = {
        sender_batch_header: {
          email_subject: "You have a payout!",
        },
        items: [
          {
            recipient_type: "EMAIL",
            amount: {
              value: paymentData.amount,
              currency: "USD",
            },
            receiver: paymentData.recipientEmail,
            note: "Payment for services",
            sender_item_id: `item-${Date.now()}`,
          },
        ],
      };

      paypal.payout.create(payoutJson, (error: Error | null, payout: PayoutResponse) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to initiate payout" });
        } else {
          res.status(200).json({ payout });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
