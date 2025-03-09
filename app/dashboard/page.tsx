'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/ui/navbar';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Clock,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const transactions = [
    {
      id: 1,
      type: 'incoming',
      amount: 500,
      from: 'John Doe',
      date: '2024-03-20'
    },
    {
      id: 2,
      type: 'outgoing',
      amount: 250,
      to: 'Jane Smith',
      date: '2024-03-19'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button asChild>
            <Link href="/ai-chat">
              <MessageSquare className="mr-2 h-4 w-4" />
              AI Assistant
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <h2 className="text-2xl font-bold">$2,500.00</h2>
              </div>
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Activity</p>
                <h2 className="text-2xl font-bold">12 transfers</h2>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth</p>
                <h2 className="text-2xl font-bold">+15.3%</h2>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-24">
                <Link href="/on-ramp">
                  <ArrowDownLeft className="h-6 w-6 mb-2" />
                  <span>Deposit</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24">
                <Link href="/off-ramp">
                  <ArrowUpRight className="h-6 w-6 mb-2" />
                  <span>Withdraw</span>
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center">
                    {transaction.type === 'incoming' ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-500 mr-3" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-500 mr-3" />
                    )}
                    <div>
                      <p className="font-medium">
                        {transaction.type === 'incoming' ? `From ${transaction.from}` : `To ${transaction.to}`}
                      </p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    transaction.type === 'incoming' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'incoming' ? '+' : '-'}${transaction.amount}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}