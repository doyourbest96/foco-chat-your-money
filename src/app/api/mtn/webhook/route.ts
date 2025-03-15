import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Transaction, { type ITransaction } from "@/models/Transaction"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = headers()

    // Get MTN webhook signature and other headers
    const mtnSignature = headersList.get("x-mtn-signature")
    const mtnNotificationId = headersList.get("x-notification-id")

    if (!mtnSignature || !mtnNotificationId) {
      return NextResponse.json(
        {
          error: "Missing required MTN webhook headers",
        },
        { status: 400 },
      )
    }

    // Verify the webhook signature
    // This is a simplified example - implement proper signature verification
    // based on MTN's documentation
    const mtnWebhookSecret = process.env.MTN_WEBHOOK_SECRET
    if (!mtnWebhookSecret) {
      return NextResponse.json(
        {
          error: "MTN webhook secret not configured",
        },
        { status: 500 },
      )
    }

    // Parse the webhook event
    const event = JSON.parse(body)

    // Handle different event types
    if (event.type === "PAYMENT_NOTIFICATION") {
      // Extract payment details
      const transactionId = event.data.externalId
      const status = event.data.status
      const amount = Number.parseFloat(event.data.amount)
      const phoneNumber = event.data.payer.partyId

      if (status === "SUCCESSFUL") {
        // Record the transaction
        const newTransaction: Partial<ITransaction> = {
          type: "onramp",
          from: phoneNumber,
          to: "MTN Mobile Money",
          amount: amount,
          date: new Date(),
        }

        await Transaction.create(newTransaction)

        // Here you would also update your user's credits
        // based on the payment amount

        return NextResponse.json(
          {
            message: "MTN transaction recorded successfully",
          },
          { status: 200 },
        )
      } else if (status === "FAILED" || status === "REJECTED") {
        // Handle failed payment
        console.log(`Payment failed for transaction ${transactionId}`)

        return NextResponse.json(
          {
            message: "Failed payment recorded",
          },
          { status: 200 },
        )
      }
    }

    // Return 200 for unhandled events to acknowledge receipt
    return NextResponse.json(
      {
        message: "Webhook received but not processed",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("MTN webhook error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

