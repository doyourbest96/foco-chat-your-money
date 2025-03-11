import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const messages = await db.collection('messages').find({}).toArray();
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const data = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('messages').insertOne(data);
  return NextResponse.json(result);
}
