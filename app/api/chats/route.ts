import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const chats = await db.collection('chats').find({}).toArray();
  return NextResponse.json(chats);
}

export async function POST(req: Request) {
  const data = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('chats').insertOne(data);
  return NextResponse.json(result);
}
