import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import crypto from "crypto";

// Your MTN API credentials
const MTN_API_KEY = process.env.MTN_API_KEY!;
const MTN_API_SECRET = process.env.MTN_API_SECRET!;
const MTN_API_URL = "https://sandbox.momodeveloper.mtn.com"; // Change to production URL when you're ready
const MTN_OAUTH_URL = `${MTN_API_URL}/v1_0/authentication`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;
    if (method === "POST") {
      const response = await axios.post(
        MTN_OAUTH_URL,
        {},
        {
          headers: {
            Authorization: `Basic ${Buffer.from(MTN_API_KEY + ":" + MTN_API_SECRET).toString("base64")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { access_token } = response.data;
      res.status(200).json({ access_token });
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  } catch (error) {
    console.error("MTN OAuth Error:", error);
    res.status(500).json({ error: "Error authenticating with MTN" });
  }
}
