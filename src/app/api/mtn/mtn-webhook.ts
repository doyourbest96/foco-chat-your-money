import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const webhookEvent = req.body; // Get the data sent by MTN

    // Process the webhook data (e.g., transaction success or failure)
    if (webhookEvent.status === "SUCCESS") {
      console.log("Transfer successful:", webhookEvent);
      // You can update your database or send notifications here
    } else {
      console.log("Transfer failed:", webhookEvent);
    }

    // Respond to MTN that the webhook was successfully received
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).json({ error: "Error processing webhook" });
  }
}
