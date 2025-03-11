import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db();
  const chat = await db.collection('chats').findOne({ _id: new ObjectId(params.id) });
  if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  return NextResponse.json(chat);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('chats').updateOne(
    { _id: new ObjectId(params.id) },
    { $set: data }
  );
  return NextResponse.json(result);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('chats').deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json(result);
}
