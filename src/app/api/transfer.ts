import { NextApiRequest, NextApiResponse } from "next";
import { sendMoneyGramTransfer } from "@/utils/moneygram";
import validator from "validator"; // Importing the validator package

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { senderName, senderPhone, receiverName, receiverPhone, amount } = req.body;

  // Validation checks for phone numbers and email styles
  if (!senderName || !receiverName || !amount) {
    return res.status(400).json({ message: "Name and amount are required" });
  }

  // Check if the phone number is valid
  if (!validator.isMobilePhone(senderPhone, 'any', { strictMode: false })) {
    return res.status(400).json({ message: "Invalid sender phone number format" });
  }

  if (!validator.isMobilePhone(receiverPhone, 'any', { strictMode: false })) {
    return res.status(400).json({ message: "Invalid receiver phone number format" });
  }

  // If needed, you can also validate for a specific email format if you include email fields
  // if (!validator.isEmail(senderEmail)) {
  //   return res.status(400).json({ message: "Invalid sender email format" });
  // }

  try {
    // Assuming sendMoneyGramTransfer is a function that handles the money transfer
    const result = await sendMoneyGramTransfer({ senderName, senderPhone, receiverName, receiverPhone, amount });

    res.status(200).json({ message: "Transfer Successful", data: result });
  } catch (error) {
    res.status(500).json({ message: "Transfer Failed", error });
  }
}
