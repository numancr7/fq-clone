import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Allow access to setup routes without authentication
    if (req.nextUrl.pathname === '/admin/setup' || req.nextUrl.pathname === '/api/admin/setup') {
      return NextResponse.next();
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow setup routes without authentication
        if (req.nextUrl.pathname === '/admin/setup' || req.nextUrl.pathname === '/api/admin/setup') {
          return true;
        }
        
        // The user is authorized if they have a token AND their role is admin.
        return !!token && token.role === 'admin';
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'], // Only protect admin routes
};
