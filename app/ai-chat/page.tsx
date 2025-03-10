'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import { Navbar } from '@/components/ui/navbar';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI assistant. How can I help you with your money transfers today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  if (!mounted) {
    return null;
  }

// In the handleSend function, update the error handling:
const handleSend = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!input.trim()) return;

  const userMessage: Message = {
    id: messages.length + 1,
    type: 'user',
    content: input,
    timestamp: new Date()
  };

  console.log('Sending user message:', userMessage);
  setMessages([...messages, userMessage]);
  setInput('');

  try {
    console.log('Making API request with message:', input);
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received API response:', data);
  
    const botMessage: Message = {
      id: messages.length + 2,
      type: 'bot',
      content: data.response,
      timestamp: new Date()
    };
  
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMessage: Message = {
      id: messages.length + 2,
      type: 'bot',
      content: 'I encountered an error. Please try again later.',
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, errorMessage]);
  }
};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <Card className="max-w-4xl mx-auto">
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
                  <div
                    className={`rounded-lg p-4 max-w-[80%] ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    <p>{message.content}</p>
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