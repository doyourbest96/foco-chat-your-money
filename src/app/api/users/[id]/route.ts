import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('users').updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );
  return NextResponse.json(result);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json(result);
}
