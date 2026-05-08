import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/(auth)/login', '/(auth)/register', '/api'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) =>
    pathname === p || pathname.startsWith(p + '/') || pathname.startsWith('/_next') || pathname.startsWith('/favicon')
  );
  if (isPublic) return NextResponse.next();

  // Note: JWT verification on edge requires jose — cookie-based auth preferred in production.
  // For demo, we redirect unauthenticated users to login via client-side check.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
