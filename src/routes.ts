import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import mongoose, { mongo } from 'mongoose';
dotenv.config();

const router = express.Router();

const MONEYGRAM_API_URL = 'https://api.moneygram.com';
const MONEYGRAM_API_KEY = process.env.MONEYGRAM_API_KEY;

//bring the user's email address from mongoose database and verify if user have account or not in moneygram api
mongoose.connect(process.env.MONGODB_URI || '');
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  fullName: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
router.post('/verifyUser', async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const response = await axios.get(`${MONEYGRAM_API_URL}/verify-user?email=${email}`, {
      headers: {
        'Authorization': `Bearer ${MONEYGRAM_API_KEY}`,
      },
    });
    res.json({ exists: response.data.exists });
  } catch (err) {
    res.status(500).json({ error: 'Your email is not registered with MoneyGram. if you want to register, please go to the website and register on MoneyGrram' });
  }
});
// Transfer Money
router.post('/transferMoney', async (req: Request, res: Response) => {
  const { senderEmail, receiverEmail, amount } = req.body;
  try {
    const response = await axios.post(
      `${MONEYGRAM_API_URL}/transfer`,
      { senderEmail, receiverEmail, amount },
      {
        headers: {
          'Authorization': `Bearer ${MONEYGRAM_API_KEY}`,
        },
      }
    );
    res.json({ status: response.data.status });
  } catch (err) {
    res.status(500).json({ error: 'Transfer failed' });
  }
});

export default router;
