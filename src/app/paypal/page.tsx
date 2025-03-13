"use client";
import { useState } from "react";

const SendMoney = () => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendMoney = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/paypal-setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientEmail: email,
        amount,
      }),
    });

    if (response.ok) {
      setMessage("Payment sent successfully!");
    } else {
      setMessage("Error sending payment");
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSendMoney}>
        <div>
          <label htmlFor="email">Recipient Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Money"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SendMoney;
