import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, process.env.SESSION_SECRET!, {
      expiresIn: '7d',
    });

    (await cookies()).set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}
