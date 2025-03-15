"use client"
import axios from "axios"
import type React from "react"

import { loadStripe } from "@stripe/stripe-js"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

const StripePay = () => {
  const [value, setValue] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Check for success or canceled status from URL params
  const isSuccess = searchParams.get("success") === "true"
  const isCanceled = searchParams.get("canceled") === "true"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value)
    setValue(newValue)
  }

  const handleBuy = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to initialize")
      }

      const res = await axios.post("/api/stripe", { value })
      const session = res.data

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        throw result.error
      }
    } catch (error) {
      console.error("error", error)
      setError("Payment failed. Please try again.")
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

      <div className="w-full max-w-3xl bg-blue-100 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-semibold mb-8">Make Payment with Stripe</h3>

          <div className="mb-6">
            <label htmlFor="amount" className="block text-lg font-bold mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              className="w-full p-2 border border-gray-300 rounded"
              value={value}
              onChange={handleChange}
              min={1}
              step={1}
            />
          </div>

          <div className="flex flex-col items-center mb-6">
            <button
              className="bg-indigo-600 text-white rounded-xl px-6 py-3 flex items-center justify-center space-x-2 w-full max-w-md mx-auto disabled:bg-indigo-400 mb-4"
              onClick={handleBuy}
              disabled={isLoading}
            >
              <span className="text-xl font-bold">{isLoading ? "Processing..." : "Pay with Stripe"}</span>
            </button>
          </div>
          <div className="flex space-x-4 mt-2">
              <Link href="/mtn" className="text-indigo-600 hover:text-indigo-800">
                Switch to MTN
              </Link>
              <Link href="/paypal" className="text-indigo-600 hover:text-indigo-800">
                Switch to PayPal
              </Link>
            </div>
        </div>
      </div>
    </div>
  )
}

export default StripePay

