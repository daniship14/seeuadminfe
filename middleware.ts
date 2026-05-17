import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname === '/login') {
    if (token) return NextResponse.redirect(new URL('/dashboard', request.url));
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

//yaha se favicon dala hai 

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
