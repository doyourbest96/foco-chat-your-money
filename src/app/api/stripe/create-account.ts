import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const account = await stripe.accounts.create({
      type: "express",
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "http://localhost:3000/onboarding/refresh",
      return_url: "http://localhost:3000/onboarding/success",
      type: "account_onboarding",
    });

    res.json({ accountId: account.id, onboardingUrl: accountLink.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create account" });
  }
}
