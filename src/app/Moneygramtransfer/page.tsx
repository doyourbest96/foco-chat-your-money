'use client'

import { useState } from "react";
import TransferForm from "@/components/ui/TransferForm";

export default function MoneygramTransfer() {
  const [message, setMessage] = useState("");

  const handleTransfer = async (formData: any) => {
    const response = await fetch("/api/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    setMessage(data.message || "Transfer request sent!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 p-6">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          MoneyGram Transfer
        </h1>
        <TransferForm onSubmit={handleTransfer} />
        {message && (
          <p className="mt-6 text-lg text-center text-green-600 font-semibold">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
