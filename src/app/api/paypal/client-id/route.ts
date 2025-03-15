import { NextResponse } from "next/server"

export async function GET() {
  // Return the PayPal client ID from environment variables
  // This keeps the client ID server-side until needed
  return NextResponse.json({
    clientId: process.env.PAYPAL_CLIENT_ID,
  })
}

