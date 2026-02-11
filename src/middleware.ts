import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Athletes trying to access coach dashboard
    if (path.startsWith('/dashboard') && token?.role === 'athlete') {
      return NextResponse.redirect(new URL('/athlete', req.url));
    }

    // Staff trying to access athlete portal
    if (path.startsWith('/athlete') && token?.role !== 'athlete') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/athlete/:path*'],
};
