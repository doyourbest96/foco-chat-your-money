import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { amount, recipientId } = req.body; // Amount in cents, recipient is a connected account ID

    if (!amount || !recipientId) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    // Create Payment Intent (Money goes to platform first)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
      application_fee_amount: Math.floor(amount * 0.05), // 5% platform fee (optional)
      transfer_data: {
        destination: recipientId,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment initiation failed" });
  }
}
