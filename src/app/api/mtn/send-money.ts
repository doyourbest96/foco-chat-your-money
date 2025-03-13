import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Your MTN API credentials and URLs
const MTN_API_URL = "https://sandbox.momodeveloper.mtn.com"; // Change to production URL when you're ready
const MTN_OAUTH_URL = `${MTN_API_URL}/v1_0/authentication`;
const MTN_PAYMENT_URL = `${MTN_API_URL}/v1_0/transfer`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;
    if (method === "POST") {
      const { amount, recipientPhoneNumber, accessToken } = req.body;

      // Check if all required fields are provided
      if (!amount || !recipientPhoneNumber || !accessToken) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const transactionId = uuidv4();

      const transferPayload = {
        amount,
        currency: "USD",
        externalId: transactionId,
        payerMessage: "Payment for services",
        payeeMessage: "Payment received",
        partyB: recipientPhoneNumber,
      };

      const response = await axios.post(
        MTN_PAYMENT_URL,
        transferPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.status(200).json({ transactionId, message: "Transfer initiated successfully" });
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  } catch (error) {
    console.error("MTN Transfer Error:", error);
    res.status(500).json({ error: "Error initiating transfer" });
  }
}
