import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {

    // Parse request body
    const body = await req.json()
    const { value, phoneNumber } = body

    if (!value || !phoneNumber) {
      return NextResponse.json(
        {
          error: "Missing required fields: value and phoneNumber",
        },
        { status: 400 },
      )
    }

    // Validate phone number (basic validation)
    if (phoneNumber.length < 10) {
      return NextResponse.json(
        {
          error: "Invalid phone number",
        },
        { status: 400 },
      )
    }

    // Generate a unique transaction ID
    const transactionId = crypto.randomUUID()

    // MTN API Configuration
    const mtnApiUrl = process.env.MTN_API_URL
    const mtnApiKey = process.env.MTN_API_KEY
    const mtnApiUserId = process.env.MTN_API_USER_ID

    if (!mtnApiUrl || !mtnApiKey || !mtnApiUserId) {
      return NextResponse.json(
        {
          error: "MTN API configuration is missing",
        },
        { status: 500 },
      )
    }

    // Prepare the request to MTN API
    const mtnRequestBody = {
      amount: value.toString(),
      currency: "USD", // Change according to your country's currency
      externalId: transactionId,
      payer: {
        partyIdType: "MSISDN",
        partyId: phoneNumber,
      },
      payerMessage: "Payment for credits",
      payeeNote: `Payment credits`,
    }

    // Make request to MTN API
    const mtnResponse = await fetch(`${mtnApiUrl}/collection/v1_0/requesttopay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mtnApiKey}`,
        "X-Reference-Id": transactionId,
        "X-Target-Environment": process.env.NODE_ENV === "production" ? "production" : "sandbox",
        "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY || "",
      },
      body: JSON.stringify(mtnRequestBody),
    })

    // Check if the request was successful
    if (!mtnResponse.ok) {
      const errorData = await mtnResponse.json().catch(() => ({}))
      console.error("MTN API error:", errorData)
      return NextResponse.json(
        {
          error: "Failed to initiate MTN payment",
        },
        { status: 500 },
      )
    }

    // Store transaction in database for tracking
    // This is where you would save the transaction details to your database
    // Similar to how you handle Stripe and PayPal transactions

    return NextResponse.json({
      status: "pending",
      transactionId,
      message: "Payment request sent to your mobile phone",
    })
  } catch (error) {
    console.error("Error initiating MTN payment:", error)
    return NextResponse.json(
      {
        error: "Error initiating MTN payment",
      },
      { status: 500 },
    )
  }
}

