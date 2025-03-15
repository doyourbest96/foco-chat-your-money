import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    
    // Parse request body
    const body = await req.json()
    const { value } = body

    if (!value) {
      return NextResponse.json({ error: "Missing required field: value" }, { status: 400 })
    }

    // Create PayPal order
    const paypalUrl = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com"

    // Get access token
    const authResponse = await fetch(`${paypalUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    })

    const authData = await authResponse.json()

    if (!authResponse.ok) {
      console.error("PayPal auth error:", authData)
      return NextResponse.json({ error: "Failed to authenticate with PayPal" }, { status: 500 })
    }

    // Create order
    const orderResponse = await fetch(`${paypalUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.access_token}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: value.toString(),
            },
            description: "Credit purchase",
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/paypal`,
          cancel_url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/paypal`,
        },
      }),
    })

    const orderData = await orderResponse.json()

    if (!orderResponse.ok) {
      console.error("PayPal order error:", orderData)
      return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 })
    }

    return NextResponse.json({ id: orderData.id })
  } catch (error) {
    console.error("Error creating PayPal order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

