import { useState } from "react";

interface TransferFormProps {
  onSubmit: (formData: any) => void;
}

export default function TransferForm({ onSubmit }: TransferFormProps) {
  const [form, setForm] = useState({
    senderName: "",
    senderPhone: "",
    receiverName: "",
    receiverPhone: "",
    amount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-8 rounded-xl shadow-xl w-full max-w-lg mx-auto space-y-6 transition-all ease-in-out duration-300 transform hover:scale-105"
    >
      <h2 className="text-2xl font-semibold text-white text-center">Money Transfer</h2>
      <div className="space-y-4">
        <input
          className="input p-3 w-full rounded-md text-gray-800 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          name="senderName"
          placeholder="Sender Name"
          onChange={handleChange}
          required
        />
        <input
          className="input p-3 w-full rounded-md text-gray-800 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          name="senderPhone"
          placeholder="Sender Phone"
          onChange={handleChange}
          required
        />
        <input
          className="input p-3 w-full rounded-md text-gray-800 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          name="receiverName"
          placeholder="Receiver Name"
          onChange={handleChange}
          required
        />
        <input
          className="input p-3 w-full rounded-md text-gray-800 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          name="receiverPhone"
          placeholder="Receiver Phone"
          onChange={handleChange}
          required
        />
        <input
          className="input p-3 w-full rounded-md text-gray-800 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          name="amount"
          placeholder="Amount"
          type="number"
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Transfer
      </button>
    </form>
  );
}
