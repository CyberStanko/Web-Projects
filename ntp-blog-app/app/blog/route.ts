import { prisma } from '@/lib/prisma';
import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { BlogStatus } from '@prisma/client';
 
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
 
    const data = await request.json();
    const { title, content, excerpt, slug, image_url, status } = data;
 
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
 
    // First, get or create the user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
 
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: session.user.sub,
          email: session.user.email,
          name: session.user.name || session.user.email.split('@')[0],
        }
      });
    }
 
    // Then create the blog post
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        excerpt: excerpt || title.substring(0, 150), // Use title as excerpt if not provided
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        image_url: image_url || null,
        authorId: user.id,
        status: (status || 'PENDING') as BlogStatus,
      },
    });
 
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Error creating blog: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
 
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
 
    let where = {};
    if (status) {
      where = { status };
    }
 
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
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });
 
    const total = await prisma.blog.count({ where });
 
    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}