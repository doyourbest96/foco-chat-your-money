import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Transaction, { type ITransaction } from "@/models/Transaction"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = headers()

    // Get PayPal webhook ID and signature
    const paypalWebhookId = process.env.PAYPAL_WEBHOOK_ID
    const transmissionId = headersList.get("paypal-transmission-id")
    const timestamp = headersList.get("paypal-transmission-time")
    const webhookSignature = headersList.get("paypal-transmission-sig")
    const certUrl = headersList.get("paypal-cert-url")

    if (!paypalWebhookId || !transmissionId || !timestamp || !webhookSignature || !certUrl) {
      return NextResponse.json({ error: "Missing required PayPal webhook headers" }, { status: 400 })
    }

    // In a production environment, you should verify the webhook signature
    // This is a simplified example - in production, implement proper signature verification
    // using PayPal's verification process

    // Parse the webhook event
    const event = JSON.parse(body)

    // Handle different event types
    if (event.event_type === "CHECKOUT.ORDER.APPROVED" || event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      // Extract payment details
      const resource = event.resource
      const paymentAmount = resource.amount
        ? Number.parseFloat(resource.amount.value)
        : Number.parseFloat(resource.purchase_units?.[0]?.amount?.value || "0")

      // Extract customer information
      const customerId = resource.payer?.payer_id || "unknown"
      const customerEmail = resource.payer?.email_address || "unknown"

      // Record the transaction
      const newTransaction: Partial<ITransaction> = {
        type: "onramp",
        from: customerEmail,
        to: "PayPal",
        amount: paymentAmount,
        date: new Date(),
      }

      await Transaction.create(newTransaction)

      return NextResponse.json({ message: "PayPal transaction recorded successfully" }, { status: 200 })
    }

    // Return 200 for unhandled events to acknowledge receipt
    return NextResponse.json({ message: "Webhook received but not processed" }, { status: 200 })
  } catch (error) {
    console.error("PayPal webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

