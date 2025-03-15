import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
})

export async function POST(req: NextRequest) {
  try {

    const username = "Anonymous"

    // Parse request body
    const body = await req.json()
    const { value } = body

    if (!value) {
      return NextResponse.json({ error: "Missing required field: value" }, { status: 400 })
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
      success_url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/stripe`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/stripe`,
      metadata: {
        quantity: value,
        username,
      },
    })

    return NextResponse.json({ id: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}

