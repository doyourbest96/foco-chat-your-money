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
import { Building, Wallet } from 'lucide-react';
import { Navbar } from '@/components/ui/navbar';

export default function OffRamp() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement withdrawal logic
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-bold mb-8">Withdraw Funds</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <form onSubmit={handleWithdraw} className="space-y-6">
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
                <p className="text-sm text-muted-foreground">Available balance: $2,500.00</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Withdrawal Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select withdrawal method" />
                  </SelectTrigger>
                  <SelectContent>
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
                    <p className="text-sm text-muted-foreground">Instant withdrawal</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Important Information</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Minimum withdrawal: $10</li>
                <li>• Maximum withdrawal: $5,000 per day</li>
                <li>• No withdrawal fees</li>
                <li>• Bank transfers may take 1-3 business days</li>
                <li>• Digital wallet transfers are instant</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}