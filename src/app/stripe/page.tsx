"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({ recipientId }: { recipientId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const res = await fetch("/api/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000, recipientId }), // $10
    });

    const { clientSecret } = await res.json();
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement)! },
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      alert("Payment successful!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Send Money"}
      </button>
    </form>
  );
};

const SendMoney = () => {
  const [recipientId, setRecipientId] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="Recipient Account ID"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
      />
      <Elements stripe={stripePromise}>
        <CheckoutForm recipientId={recipientId} />
      </Elements>
    </div>
  );
};

export default SendMoney;
