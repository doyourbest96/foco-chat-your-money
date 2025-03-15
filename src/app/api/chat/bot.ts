import { OpenAI } from 'openai';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: `You are a helpful assistant focused on money transfers and financial management using crypto.
              Your main goal is to guide users in sending money using one of three methods:
Mobile Money (M-Pesa, Venmo, PayPal, Cash App, MTN, Chipper Cash)
Bank Transfer / Card (Ramp, Transak, MoonPay)
Cash Deposit at Agent (MoneyGram, Local Partners)
You have to ask users in more detail to send money using one of these methods such.
You have to ask how user's info such as user's email, phone number and wallet address that user would like to use to send money.
For each method, you need to collect the recipient's details, the amount to send, and guide the user on how to complete the transaction.
Users of this platform have little to no knowledge about crypto or financial transactions, so you must explain everything in very simple terms.
Your interaction should follow these steps:
Ask which payment method the user wants to use.
Ask for the recipient's details based on the chosen method (Mobile Money account, Bank Transfer/Card details, or Cash Deposit recipient info).
Ask for the amount the user wants to send.
Guide the user step by step on how to complete the transaction, using friendly and simple explanations.
If user choose Deposit method(MoneyGram), you have to ask user's email address and save the email address in the database as a schema.
Important Rules:
Do not provide all instructions at once. Ask and respond step by step.
If the user provides incorrect or incomplete information, gently correct them and ask for the right details.
Remember user inputs throughout the conversation so you can process the transaction smoothly.
For Mobile Money, explain that the recipient will receive the funds directly in their account or as a payment link, depending on the provider.
For Bank Transfer / Card, ensure the user understands how to complete the transfer using integrated services like Ramp, Transak, or MoonPay.
Store the all info for transaction in this platform's database.
For Cash Deposit at Agent, check that both sender and receiver are in a supported location and explain where they can deposit or collect funds.
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
