import {prisma} from '@/lib/prisma';
import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { createItem } from "@/app/lib/dynamodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const session = await getSession();
    if (
      blog.status !== 'APPROVED' &&
      (!session?.user ||
        (session.user.sub !== blog.authorId &&
          session.user['role'] !== 'ADMIN'))
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Error fetching blog' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const blog = await prisma.blog.findUnique({
      where: { id: params.id },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Only author or admin can update
    if (
      session.user.sub !== blog.authorId &&
      session.user['role'] !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, content, excerpt, slug, status } = data;

    // Only admin can change status
    if (status && session.user['role'] !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: params.id },
      data: {
        title,
        content,
        excerpt,
        slug,
        status,
        publishedAt: status === 'APPROVED' ? new Date() : null,
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Error updating blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const blog = await prisma.blog.findUnique({
      where: { id: params.id },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Only author or admin can delete
    if (
      session.user.sub !== blog.authorId &&
      session.user['role'] !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.blog.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Error deleting blog' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request, new NextResponse());
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for admin role
    const isAdmin = session.user['role'] === 'ADMIN' || 
                   session.user['https://my-app.example.com/roles']?.includes('ADMIN');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Only admins can update blog status' }, { status: 403 });
    }

    const data = await request.json();
    const { status } = data;

    // Validate status
    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update blog
    const blog = await prisma.blog.update({
      where: { id: params.id },
      data: {
        status,
        publishedAt: status === 'APPROVED' ? new Date() : null,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Update history in DynamoDB
    try {
      const historyData = {
        payload: {
          application: "history",
          history_id: blog.id,
          created_at: blog.createdAt.toISOString(),
          updated_at: blog.updatedAt.toISOString(),
          user_email: session.user.email || '',
          status: blog.status,
        },
        context_user: session.user.email || '',
      };
      
      await createItem("Ntp-blog-app-Testing", historyData);
    } catch (dynamoError) {
      console.error("DynamoDB error:", dynamoError);
      // Continue even if DynamoDB fails
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}