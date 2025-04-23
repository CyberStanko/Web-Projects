import { prisma } from '@/lib/prisma';
import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { BlogStatus } from '@prisma/client';
 
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request, new NextResponse());
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for admin role in both places
    const isAdmin = session.user['role'] === 'ADMIN' || 
                   session.user['https://my-app.example.com/roles']?.includes('ADMIN');
                   
    if (!isAdmin) {
      return NextResponse.json({ error: 'Only admins can access this page' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');

    // Build where clause for admin
    let where = {};
   
    if (statusParam && statusParam !== 'ALL') {
      where = { status: statusParam as BlogStatus };
    }

    // Fetch all blogs for admin
    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Error in admin blogs endpoint:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request, new NextResponse());
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = session.user['role'] === 'ADMIN' || 
                   session.user['https://my-app.example.com/roles']?.includes('ADMIN');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Only admins can delete blogs' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blogId');
    const deleteAll = searchParams.get('deleteAll');

    if (deleteAll === 'true') {
      // Delete all blogs
      const result = await prisma.blog.deleteMany({});
      return NextResponse.json({ 
        message: 'All blogs deleted successfully',
        count: result.count 
      });
    }

    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    // Check if blog exists before deleting
    const blog = await prisma.blog.findUnique({
      where: { id: blogId }
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Delete single blog
    await prisma.blog.delete({
      where: { id: blogId },
    });

    return NextResponse.json({ 
      message: 'Blog deleted successfully',
      blogId 
    });

  } catch (error) {
    console.error('Error deleting blog(s):', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}