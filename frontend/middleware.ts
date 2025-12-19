import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proxy API requests to backend
  if (pathname.startsWith('/api/')) {
    const backendUrl = process.env.BACKEND_URL || 'http://backend:8000';
    const apiUrl = new URL(pathname + request.nextUrl.search, backendUrl);
    
    console.log(`[PROXY] ${pathname} -> ${apiUrl.toString()}`);
    
    return NextResponse.rewrite(apiUrl);
  }

  // Force HTTPS redirect (disabled in development)
  if (process.env.NODE_ENV === 'production') {
    const requestHeaders = new Headers(request.headers);
    const proto = requestHeaders.get('x-forwarded-proto');
    
    if (proto === 'http') {
      const httpsUrl = request.url.replace('http://', 'https://');
      return NextResponse.redirect(httpsUrl, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
