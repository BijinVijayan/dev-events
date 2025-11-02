import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // skip auth check for login page and API login route
  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/admin/login')) {
    return NextResponse.next();
  }

  // Protect all other /admin routes
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    try {
      jwt.verify(token, process.env.SESSION_SECRET!);
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
