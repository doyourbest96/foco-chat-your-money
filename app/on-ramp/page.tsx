'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreditCard, Building, Wallet } from 'lucide-react';
import { Navbar } from '@/components/ui/navbar';

export default function OnRamp() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement deposit logic
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-bold mb-8">Deposit Funds</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <form onSubmit={handleDeposit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="wallet">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Available Methods</h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-secondary rounded-lg">
                  <CreditCard className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-muted-foreground">Instant deposit</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-secondary rounded-lg">
                  <Building className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-muted-foreground">1-3 business days</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-secondary rounded-lg">
                  <Wallet className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Digital Wallet</p>
                    <p className="text-sm text-muted-foreground">Instant deposit</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Important Information</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Minimum deposit amount: $10</li>
                <li>• Maximum deposit amount: $10,000</li>
                <li>• No deposit fees</li>
                <li>• Funds are available immediately for card and wallet deposits</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}