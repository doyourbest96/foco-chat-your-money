import Stripe from 'stripe';
import { currentUser } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-02-24.acacia',
});

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Fetch current user information
        const userInfo = await currentUser();
        if (!userInfo) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const username = userInfo.username || 'Anonymous';
        console.log("userid-------->", username);

        // Parse request body
        const { value } = req.body;
        if (!value) {
            return res.status(400).json({ error: "Missing required field: value" });
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID as string,
                    quantity: value,
                },
            ],
            mode: "payment",
            success_url: "http://localhost:3000/freeupload?success=true",
            cancel_url: "http://localhost:3000/payment/pay?canceled=true",
            metadata: {
                quantity: value,
                username,
            },
        });

        console.log(session.id, "sessionId----->");

        return res.status(200).json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return res.status(500).json({ error: 'Error creating checkout session' });
    }
}
