import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';
import { updateAuth0UserRole } from '@/app/lib/auth0';
 
export async function GET() {
  try {
    const session = await getSession();
    console.log('Session in admin users:', session); // Debug log
 
    if (!session?.user) {
      console.log('No session found'); // Debug log
      return new NextResponse('Unauthorized - No session', { status: 401 });
    }
 
    // Get roles from Auth0 metadata and session
    const roles = session.user['https://my-app.example.com/roles'];
    const userRole = session.user['role'];
    console.log('User roles from metadata:', roles); // Debug log
    console.log('User role from session:', userRole); // Debug log
 
    // Check for admin role in both places
    const isAdmin =
      userRole === 'ADMIN' ||
      (Array.isArray(roles) && roles.includes('ADMIN')) ||
      roles === 'ADMIN';
 
    console.log('Is admin?', isAdmin); // Debug log
 
    if (!isAdmin) {
      console.log('User is not admin'); // Debug log
      return new NextResponse('Unauthorized - Admin access required', { status: 401 });
    }
 
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
        blogs: {
          select: {
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Get only last 5 blogs for preview
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
 
    // Get blog stats for each user
    const usersWithStats = await Promise.all(
      users.map(async ( user ) => {
        const [approved, rejected, pending] = await Promise.all([
          prisma.blog.count({
            where: {
              authorId: user.id,
              status: 'APPROVED',
            },
          }),
          prisma.blog.count({
            where: {
              authorId: user.id,
              status: 'REJECTED',
            },
          }),
          prisma.blog.count({
            where: {
              authorId: user.id,
              status: 'PENDING',
            },
          }),
        ]);
 
        const lastActive = user.blogs[0]?.createdAt || user.createdAt;
 
        return {
          ...user,
          lastActive,
          stats: {
            approvedBlogs: approved,
            rejectedBlogs: rejected,
            pendingBlogs: pending,
            totalBlogs: approved + rejected + pending,
          },
        };
      })
    );
 
    return NextResponse.json({ users: usersWithStats });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse('Internal Server Error: ' + (error as Error).message, { status: 500 });
  }
}
 
export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
 
    let data;
    try {
      data = await request.json();
    } catch (e) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
 
    const { userId, role } = data;
   
    if (!userId || !role) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
 
    if (!['USER', 'ADMIN'].includes(role)) {
      return new NextResponse('Invalid role', { status: 400 });
    }
 
    // Update both database and Auth0
    const [updatedUser] = await Promise.all([
      // Update user in database
      prisma.user.update({
        where: { id: userId },
        data: { role },
        include: {
          _count: {
            select: {
              blogs: true,
            },
          },
        },
      }),
      // Update user in Auth0
      updateAuth0UserRole(userId, role as 'USER' | 'ADMIN'),
    ]);
 
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}