// filepath: /d:/foco-chat-your-money/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow unauthenticated access to the home, sign in, and sign up pages.
  if (
    pathname === '/' ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up')
  ) {
    return NextResponse.next();
  }

  // Check for an authentication token in cookies.
  const token = req.cookies.get('auth-token')?.value;

  console.log('token', token);

  if (!token) {
    // Redirect unauthenticated users to the sign-in page.
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  try {
    // Verify the token
    console.log('verifying token');
    // const decoded = jwt.verify("Bearer " + token, JWT_SECRET);
    console.log('token verified');
    return NextResponse.next();
  } catch (error) {
    // Redirect to sign-in page if token is invalid
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image).*)'],
};