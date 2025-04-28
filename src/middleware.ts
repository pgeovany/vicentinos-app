import { authConfig } from '@/config/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const AUTH_TOKEN_KEY = process.env.NODE_ENV === 'production' ? '__Host-auth_token' : 'auth_token';

  const isPublicPath = authConfig.publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path),
  );

  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;

  if (!isPublicPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret, { algorithms: ['HS256'] });
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(AUTH_TOKEN_KEY);
      return response;
    }
  }

  if (pathname === '/login' && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret, { algorithms: ['HS256'] });
      return NextResponse.redirect(new URL(authConfig.defaultProtectedPath, request.url));
    } catch {}
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/assistidos/:path*',
    '/produtos/:path*',
    '/doacoes/:path*',
    '/cestas/:path*',
    '/sos/:path*',
    '/painel/:path*',
    '/login',
  ],
};
