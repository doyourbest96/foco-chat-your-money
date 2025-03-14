import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import Transaction, { ITransaction } from "@/models/Transaction";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = headers().get('stripe-signature');

    if (!endpointSecret || !sig) {
      return NextResponse.json({ error: 'Missing endpoint secret or signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      return NextResponse.json({ error: `Webhook Error: ${error}` }, { status: 400 });
    }

    if (event.type !== 'checkout.session.completed') {
      return NextResponse.json({ error: 'Unhandled event type' }, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (!metadata || !metadata.username || !metadata.amount) {
      return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 });
    }

    const userName = metadata.username;
    const amount = parseFloat(metadata.amount);

    if (isNaN(amount)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const newTransaction: Partial<ITransaction> = {
      type: 'onramp',
      from: userName,
      to: 'Stripe',
      amount: amount,
      date: new Date()
    };

    await Transaction.create(newTransaction);

    return NextResponse.json({ message: "Transaction recorded successfully" }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
