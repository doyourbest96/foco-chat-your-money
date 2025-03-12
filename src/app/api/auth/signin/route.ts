import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

// Ensure a mongoose connection
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI || '');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Email not found. Please sign up.' }, { status: 404 });
    }

    // Check if the user document has a password
    if (!user.password) {
      return NextResponse.json({ error: 'User does not have a password set. Please sign up.' }, { status: 404 });
    }

    // Compare the provided password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Your password is wrong.' }, { status: 401 });
    }

    // Create JWT token
    const token = await signToken({ 
      sub: user._id.toString(),
      email: user.email
    });

    return NextResponse.json({ token, message: 'Sign in successful' }, { status: 200 });
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}