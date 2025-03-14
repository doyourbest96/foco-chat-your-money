"use client"
import axios from "axios"
import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

const PayPalPay = () => {
  const [value, setValue] = useState(1)
  const [clientId, setClientId] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()

  // Check for success or canceled status from URL params
  const isSuccess = searchParams.get("success") === "true"
  const isCanceled = searchParams.get("canceled") === "true"

  useEffect(() => {
    // Fetch the PayPal client ID from the server
    const getPaypalClientId = async () => {
      try {
        const response = await axios.get("/api/paypal/client-id")
        setClientId(response.data.clientId)
      } catch (error) {
        console.error("Failed to fetch PayPal client ID:", error)
        setError("Failed to load PayPal. Please try again later.")
      }
    }

    getPaypalClientId()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value)
    setValue(newValue)
  }

  const handlePaypalSuccess = (details: any) => {
    console.log("PayPal payment successful:", details)
    setSuccess(true)
    setError(null)
  }

  const handlePaypalError = (error: any) => {
    console.error("PayPal payment error:", error)
    setError("PayPal payment failed. Please try again.")
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
          Payment successful! Your credits have been added to your account.
        </div>
      )}

      <div className="w-full max-w-3xl bg-blue-100 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-semibold mb-8">Make Payment with PayPal</h3>

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
            <div className="w-full max-w-md mx-auto mb-4">
              {clientId ? (
                <PayPalScriptProvider options={{ clientId: clientId, currency: "USD" }}>
                  <PayPalButtons
                    style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                    createOrder={async () => {
                      try {
                        const response = await axios.post("/api/paypal", { value })
                        return response.data.id
                      } catch (error) {
                        console.error("Error creating PayPal order:", error)
                        handlePaypalError(error)
                        throw error
                      }
                    }}
                    onApprove={async (data, actions) => {
                      try {
                        if (actions.order) {
                          const details = await actions.order.capture()
                          handlePaypalSuccess(details)
                        }
                      } catch (error) {
                        handlePaypalError(error)
                        throw error
                      }
                    }}
                    onError={handlePaypalError}
                  />
                </PayPalScriptProvider>
              ) : (
                <div className="text-center py-4 bg-gray-100 rounded-lg">Loading PayPal...</div>
              )}
            </div>

            <div className="flex space-x-4 mt-2">
              <Link href="/stripe" className="text-indigo-600 hover:text-indigo-800">
                Switch to Stripe
              </Link>
              <Link href="/mtn" className="text-indigo-600 hover:text-indigo-800">
                Switch to MTN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayPalPay
