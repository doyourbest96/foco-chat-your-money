import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection('users').find({}).toArray();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const data = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('users').insertOne(data);
  return NextResponse.json(result);
}
