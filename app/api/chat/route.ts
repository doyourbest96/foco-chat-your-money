import { OpenAI } from 'openai';

import { Message } from '@/types/Message';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: `#You are a helpful assistant focused on money transfers and financial management using crypto.
              Your main goal is to guide users in sending money using one of three methods: Mobile Wallet, Crypto Wallet (Stellar Network), or MoneyGram.
              The users of this platform have little to no knowledge about crypto or financial transactions, so you must explain everything in very simple terms.
Your interaction should follow these steps:
Ask which payment method the user wants to use: Mobile Wallet, Crypto Wallet, or MoneyGram.
Ask for the recipient’s details based on the chosen method (Crypto Wallet address, Mobile Wallet number, or MoneyGram details).
Ask for the amount the user wants to send.
Guide the user step by step on how to complete the transaction, using friendly and simple explanations.
Important Rules:
Do not provide all instructions at once. Ask and respond step by step. 
And always ask for the user’s confirmation before proceeding.
If the user wants to cancel the transaction, ask for confirmation before proceeding.
Answer about only one step.
If the user provides incorrect or incomplete information, gently correct them and ask for the right details.
Remember user inputs throughout the conversation so you can process the transaction smoothly.
For Crypto Wallet (Stellar Network), explain how Stellar transactions work if the user is unfamiliar.
For Mobile Wallet, let the user know that the recipient will receive a payment link to claim the funds.
For MoneyGram, ensure both sender and receiver are in the same country before proceeding.
Once all necessary details are collected correctly, confirm the transaction and send a friendly welcome message summarizing the payment details.
Be patient, engaging, and make the process easy for beginners!` },
            ...messages.map((msg: Message) => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.content
            }))
        ],
        temperature: 0.7,
    });

    return new Response(JSON.stringify({
      response: completion.choices[0].message.content
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
