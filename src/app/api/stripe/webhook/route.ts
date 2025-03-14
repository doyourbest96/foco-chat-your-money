import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import Transaction, { type ITransaction } from "@/models/Transaction"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = headers()
    const sig = headersList.get("stripe-signature")
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!endpointSecret || !sig) {
      return NextResponse.json({ error: "Missing endpoint secret or signature" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unknown error"
      return NextResponse.json({ error: `Webhook Error: ${error}` }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const metadata = session.metadata

      if (!metadata || !metadata.username) {
        return NextResponse.json({ error: "Missing required metadata" }, { status: 400 })
      }

      const userName = metadata.username
      const amount = session.amount_total ? session.amount_total / 100 : 0

      const newTransaction: Partial<ITransaction> = {
        type: "onramp",
        from: userName,
        to: "Stripe",
        amount: amount,
        date: new Date(),
      }

      await Transaction.create(newTransaction)

      return NextResponse.json({ message: "Transaction recorded successfully" }, { status: 200 })
    }

    // Return 200 for unhandled events to acknowledge receipt
    return NextResponse.json({ message: "Webhook received but not processed" }, { status: 200 })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

