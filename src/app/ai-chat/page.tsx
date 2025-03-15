'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import { Navbar } from '@/components/ui/navbar';
import ReactMarkdown from 'react-markdown';

import { Message as BaseMessage } from '@/types/Message';

interface Message extends BaseMessage {
  buttons?: PaymentButton[];
}

interface PaymentButton {
  type: 'Stripe' | 'MTN' | 'PayPal'| 'MoneyGram';
  label: string;
  url: string;
}

interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  buttons?: PaymentButton[];
}

const MessageTimestamp = ({ timestamp }: { timestamp: Date }) => {
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
    }, []);
  
    if (!mounted) {
      return null;
    }
  
    return (
      <span className="text-xs opacity-70 mt-2 block">
        {timestamp.toLocaleTimeString()}
      </span>
    );
  };
export default function AIChat() {
    const [mounted, setMounted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
      {
        id: 1,
        type: 'bot',
        content: `WELCOME!
  
  I'm your AI Assistant, Here to help you send money easily.
  
  We offer three simple methods for sending money:
  
  **1. MOBILE WALLET** – Send money directly to mobile wallet.
  
  **2. BANK TRANSFER / CARD** – Transfer funds using Ramp, Transak, or MoonPay.
  
  **3. CASH DEPOSIT AT AGENT** – Send money through MoneyGram or local partners.
  
  Which method would you like to use?`,
        timestamp: new Date()
      }
    ]);
    const [input, setInput] = useState('');

  
    useEffect(() => {
      setMounted(true);
    }, []);
  
  const [, setPaymentButtons] = useState<PaymentButton[]>([]);

  // Update handleSend to process buttons
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setPaymentButtons([]); // Clear previous buttons

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(msg => ({
            type: msg.type,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
    
      const botMessage: ChatMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        buttons: data.buttons || []
      };
    
      setMessages((prev) => [...prev, botMessage]);
      setPaymentButtons(data.buttons || []);
    } catch (error) {
      console.error('Chat API Error:', error);
      const errorMessage: ChatMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: 'I encountered an error. Please try again later.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };
  if (!mounted) {
    return null;
  }

  // Add button rendering logic
  const PaymentButtons = ({ buttons }: { buttons: PaymentButton[] }) => (
    <div className="flex flex-col gap-2 mt-4">
      {buttons.map((button) => (
        <Button
          key={button.type}
          variant="outline"
          className="justify-start gap-2 hover:bg-primary hover:text-primary-foreground"
          onClick={() => window.open(button.url, '_blank')}
        >
          {button.type === 'Stripe' && <span className="text-blue-500">💳</span>}
          {button.type === 'MTN' && <span className="text-yellow-500">📱</span>}
          {button.type === 'PayPal' && <span className="text-blue-300">🔵</span>}
          {button.type === 'MoneyGram' && <span className="text-blue-300">🌍</span>}
          {button.label}
        </Button>
      ))}
    </div>
  );

  // Update message rendering to include buttons
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <Card className="w-full md:w-">
        <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">Get help with your transfers and account management</p>
          </div>
          <ScrollArea className="h-[500px] p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      message.type === 'user' ? 'bg-primary' : 'bg-secondary'
                    }`}
                  >
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`rounded-lg p-4 max-w-[80%] ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  }`}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                    {message.buttons && message.buttons.length > 0 && (
                      <PaymentButtons buttons={message.buttons} />
                    )}
                    <MessageTimestamp timestamp={message.timestamp} />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}