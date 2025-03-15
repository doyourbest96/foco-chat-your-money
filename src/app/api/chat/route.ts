import { OpenAI } from 'openai';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

// Add Button interface
interface PaymentButton {
  type: 'Stripe' | 'MTN' | 'PayPal' | 'MoneyGram';
  label: string;
  url: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Detect payment method from last message
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    const buttons: PaymentButton[] = [];

    // Update system prompt to handle payment method selection
    const systemPrompt = `You are a helpful assistant focused on money transfers and financial management On Foco.chat.
    Foco is a platform that allows users to send and receive money.
Your main goal is to assist to send or recieve money between people.
First  you have to ask user if user want to send money or to recive the money.
-If user want to send money, you have to guid as follow:
There are some kind of payment this Platform:
Paypal, Stripe, MTN, Crypto...
You have to ask users in more detail to send money using one of these methods such.
You have to ask needed info, to send money such as user's email, phone number that user would like to use to send money.
For each method, you need to collect the recipient's details and guide the user on how to complete the transaction.
Users of this platform have little to no knowledge about crypto or financial transactions, so you must explain everything in very simple terms.
Your interaction should follow these steps:
Ask which payment method the user wants to use.
Guide the user step by step on how to complete the transaction, using friendly and simple explanations.
Important Rules:
Do not provide all instructions at once. Ask and respond step by step.
If the user provides incorrect or incomplete information, gently correct them and ask for the right details.
Remember user inputs throughout the conversation so you can process the transaction smoothly.
For Mobile Money, explain that the recipient will receive the funds directly in their account or as a payment link, depending on the provider.
Store the all info for transaction in this platform's database.
Once all necessary details are collected correctly, confirm the transaction and send a friendly welcome message summarizing the payment details.
Be patient, engaging, and make the process easy for beginners!
      When user selects a payment method, respond with one of these markers:
      [STRIPE_BUTTON] for Stripe transfers
      [MTN_BUTTON] for MTN transfers
      [PAYPAL_BUTTON] for PayPal transfers
      [MONEYGRAM_BUTTON] for MoneyGram transfers

-If user want to receive money sent to himself, you have to guid as follow:
You have to ask which payment method does he would like to receive.
There are several kind of payment in this platform: 
PayPal, Stripe, MTN, Crypto....
You have to ask needed info, to receive money such as user's email, phone number that user would like to use to receive money.
For each method, you need to collect the receiver's details and guide the user on how to complete the transaction.
Users of this platform have little to no knowledge about crypto or financial transactions, so you must explain everything in very simple terms.
Your interaction should follow these steps:
Ask which payment method the user wants to use.
Guide the user step by step on how to complete the transaction, using friendly and simple explanations.
Important Rules:
Do not provide all instructions at once. Ask and respond step by step.
If the user provides incorrect or incomplete information, gently correct them and ask for the right details.
Remember user inputs throughout the conversation so you can process the transaction smoothly.
For Mobile Money, explain that the recipient will receive the funds directly in their account or as a payment link, depending on the provider.
Store the all info for transaction in this platform's database.
Once all necessary details are collected correctly, confirm the transaction and send a friendly welcome message summarizing the payment details.
Be patient, engaging, and make the process easy for beginners!`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((msg: Message) => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.content
            }))
        ],
        temperature: 0.7,
    });

    // Parse response for payment method markers
    const responseText = completion.choices[0].message.content ?? '';
    
    if (responseText.includes('[STRIPE_BUTTON]')) {
      buttons.push({
        type: 'Stripe',
        label: 'Proceed with Stripe',
        url: 'https://foco-chat-your-money.vercel.app/stripe'
      });
    } else if (responseText.includes('[MTN_BUTTON]')) {
      buttons.push({
        type: 'MTN',
        label: 'Proceed with MTN',
        url: 'https://foco-chat-your-money.vercel.app/mtn'
      });
    } else if (responseText.includes('[PAYPAL_BUTTON]')) {
      buttons.push({
        type: 'PayPal',
        label: 'Proceed with PayPal',
        url: 'https://foco-chat-your-money.vercel.app/paypal'
      });
    } else if (responseText.includes('[MONEYGRAM_BUTTON]')) {
      buttons.push({
        type: 'MoneyGram',
        label: 'Proceed with MoneyGram',
        url: 'https://foco-chat-your-money.vercel.app/Moneygramtransfer'
      });
    }

    return new Response(JSON.stringify({
      response: responseText.replace(/\[(STRIPE|MTN|PAYPAL)_BUTTON\]/g, ''),
      buttons
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
