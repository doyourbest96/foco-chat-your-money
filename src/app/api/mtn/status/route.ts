export const dynamic = 'force-dynamic';

import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const transactionId = url.searchParams.get("transactionId")

    if (!transactionId) {
      return NextResponse.json(
        {
          error: "Missing transaction ID",
        },
        { status: 400 },
      )
    }

    // MTN API Configuration
    const mtnApiUrl = process.env.MTN_API_URL
    const mtnApiKey = process.env.MTN_API_KEY

    if (!mtnApiUrl || !mtnApiKey) {
      return NextResponse.json(
        {
          error: "MTN API configuration is missing",
        },
        { status: 500 },
      )
    }

    // Check transaction status with MTN API
    const statusResponse = await fetch(`${mtnApiUrl}/collection/v1_0/requesttopay/${transactionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${mtnApiKey}`,
        "X-Target-Environment": process.env.NODE_ENV === "production" ? "production" : "sandbox",
        "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY || "",
      },
    })

    if (!statusResponse.ok) {
      const errorData = await statusResponse.json().catch(() => ({}))
      console.error("MTN API status check error:", errorData)
      return NextResponse.json(
        {
          error: "Failed to check payment status",
        },
        { status: 500 },
      )
    }

    const statusData = await statusResponse.json()

    return NextResponse.json({
      status: statusData.status,
      transactionId: transactionId,
    })
  } catch (error) {
    console.error("Error checking MTN payment status:", error)
    return NextResponse.json(
      {
        error: "Error checking payment status",
      },
      { status: 500 },
    )
  }
}

