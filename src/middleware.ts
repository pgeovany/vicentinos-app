import { authConfig } from '@/config/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = authConfig.publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path),
  );

  const token = request.cookies.get('auth_token')?.value;

  if (!isPublicPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  if (pathname === '/login' && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
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
