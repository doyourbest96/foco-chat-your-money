"use client";
import { useState } from "react";

const SendMoney = () => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendMoney = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/mtn/mtn-setup", {
      method: "POST",
    });
    const { access_token } = await response.json();

    if (!access_token) {
      setMessage("Error getting access token");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/mtn/send-money", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        recipientPhoneNumber: phone,
        accessToken: access_token,
      }),
    });

    const result = await res.json();
    setMessage(result.message || "Error sending money");

    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSendMoney}>
        <div>
          <label htmlFor="phone">Recipient Phone Number</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
