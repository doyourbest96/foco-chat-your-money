"use client"
import axios from "axios"
import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { PhoneIcon } from "lucide-react"

const MtnPay = () => {
  const [value, setValue] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Check for success or canceled status from URL params
  const isSuccess = searchParams.get("success") === "true"
  const isCanceled = searchParams.get("canceled") === "true"
  const txnId = searchParams.get("transaction_id")

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    let input = e.target.value.replace(/\D/g, "")

    // Apply MTN format (e.g., +233 XX XXX XXXX for Ghana)
    if (input.length > 0) {
      // This is a simplified example - adjust based on your target countries
      if (!input.startsWith("233") && input.length >= 10) {
        input = "233" + input.substring(input.length - 9)
      }
    }

    setPhoneNumber(input)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value)
    setValue(newValue)
  }

  const handleMtnPayment = async () => {
    // Validate phone number (basic validation)
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Call MTN payment API
      const response = await axios.post("/api/mtn", {
        value,
        phoneNumber,
      })

      // Handle the response
      if (response.data.status === "pending") {
        setTransactionId(response.data.transactionId)
        setSuccess(true)
      } else {
        throw new Error("Payment initiation failed")
      }
    } catch (error) {
      console.error("MTN payment error:", error)
      setError("Payment request failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <p className="text-orange-500 text-sm md:text-lg uppercase tracking-wider mt-2 md:mt-5">- UPLOAD DOCUMENT -</p>
      <h2 className="text-2xl md:text-3xl font-bold mt-2 md:mt-5 mb-6">Purchase Credits</h2>

      {isSuccess && (
        <div className="w-full max-w-3xl bg-green-100 text-green-800 rounded-lg p-4 mb-6">
          Payment successful! Your credits have been added to your account.
        </div>
      )}

      {isCanceled && (
        <div className="w-full max-w-3xl bg-yellow-100 text-yellow-800 rounded-lg p-4 mb-6">
          Payment canceled. No charges were made.
        </div>
      )}

      {error && <div className="w-full max-w-3xl bg-red-100 text-red-800 rounded-lg p-4 mb-6">{error}</div>}

      {success && !isSuccess && (
        <div className="w-full max-w-3xl bg-green-100 text-green-800 rounded-lg p-4 mb-6">
          <p>
            Payment request sent to your mobile phone. Please check your MTN Mobile Money app to complete the payment.
          </p>
          {transactionId && <p className="mt-2 font-medium">Transaction ID: {transactionId}</p>}
        </div>
      )}

      <div className="w-full max-w-3xl bg-blue-100 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-semibold mb-8">Make Payment with MTN Mobile Money</h3>

          <div className="mb-6">
            <label htmlFor="amount" className="block text-lg font-bold mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              className="w-full p-2 border border-gray-300 rounded"
              value={value}
              onChange={handleAmountChange}
              min={1}
              step={1}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="phone" className="block text-lg font-bold mb-2">
              MTN Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                className="w-full p-2 pl-10 border border-gray-300 rounded"
                placeholder="e.g., 233XXXXXXXXX"
                value={phoneNumber}
                onChange={handlePhoneChange}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Enter your MTN mobile number including country code (e.g., 233 for Ghana)
            </p>
          </div>

          <div className="flex flex-col items-center mb-6">
            <button
              className="bg-yellow-500 text-white rounded-xl px-6 py-3 flex items-center justify-center space-x-2 w-full max-w-md mx-auto disabled:bg-yellow-300 mb-4"
              onClick={handleMtnPayment}
              disabled={isLoading || !phoneNumber}
            >
              <span className="text-xl font-bold">{isLoading ? "Processing..." : "Pay with MTN Mobile Money"}</span>
            </button>

            <div className="flex space-x-4 mt-2">
              <Link href="/stripe" className="text-indigo-600 hover:text-indigo-800">
                Switch to Stripe
              </Link>
              <Link href="/paypal" className="text-indigo-600 hover:text-indigo-800">
                Switch to PayPal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MtnPay

