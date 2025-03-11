import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const transactions = await db.collection('transactions').find({}).toArray();
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const data = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('transactions').insertOne(data);
  return NextResponse.json(result);
}
