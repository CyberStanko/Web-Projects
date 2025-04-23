import { withMiddlewareAuthRequired, getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withMiddlewareAuthRequired(async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getSession(req, res);

  // Add role to the session if it exists in Auth0 user metadata
  if (session?.user) {
    const user = session.user;
    console.log('Middleware - Processing user:', user.email);

    // Get roles from Auth0 metadata
    const roles = user['https://my-app.example.com/roles'];
    console.log('Middleware - Roles from Auth0:', roles);

    // Simple check for admin role
    const isAdmin = Array.isArray(roles) 
      ? roles.includes('ADMIN')
      : roles === 'ADMIN';

    console.log('Middleware - Is admin?', isAdmin);

    // Set role consistently
    user['role'] = isAdmin ? 'ADMIN' : 'USER';
    console.log('Middleware - Assigned role:', user['role']);
  }

  return res;
});

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/blogs',
    '/api/blogs/:path*',
    '/blog/create',
    '/blog/edit/:path*',
    '/profile',
  ],
};