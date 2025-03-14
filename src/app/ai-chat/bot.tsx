'use client';
import React from 'react';

import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Send, Bot, User, History } from 'lucide-react';
import { Navbar } from '../../components/ui/navbar';
import ReactMarkdown from 'react-markdown';

import { Message } from '../../types/Message';

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
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('/api/chat/history');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(msg => ({
            type: msg.type,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
    
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

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <Card className="w-full md:w-2/3">
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
                    <ReactMarkdown>{message.content}</ReactMarkdown>
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

        <Card className={`w-full md:w-1/3 bg-white-gray text-black rounded-lg border shadow-sm ${showHistory ? 'block' : 'hidden'} md:block`}>
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Chat History</h2>
          </div>
          <ScrollArea className="h-[500px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <Button key={message.id} className="w-full text-left p-2 border-b bg-white-gray text-black">
                  <p className="text-sm">{message.content.substring(0, 40)}...</p>
                  <p className="text-xs opacity-60">{message.timestamp.toLocaleDateString()} {message.timestamp.toLocaleTimeString()}</p>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
      <Button
        className="fixed bottom-4 left-4 md:hidden"
        onClick={() => setShowHistory(!showHistory)}
      >
        <History className="h-6 w-6" />
      </Button>
    </div>
  );
}