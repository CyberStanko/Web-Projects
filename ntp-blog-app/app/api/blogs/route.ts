import { prisma } from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { BlogStatus } from "@prisma/client";
import { createItem } from "@/app/lib/dynamodb";

// Initialize DynamoDB client

export async function POST(request: NextRequest) {
  try {
    // Get session using the request object
    const session = await getSession(request, new NextResponse());
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body first to fail fast if invalid
    let data;
    try {
      const rawData = await request.text();
      data = JSON.parse(rawData);
    } catch (e) {
      return NextResponse.json({ 
        error: 'Invalid request data',
        details: 'Failed to parse request body'
      }, { status: 400 });
    }

    // Validate required fields
    if (!data.title || !data.content) {
      return NextResponse.json({ 
        error: 'Title and content are required' 
      }, { status: 400 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { 
        email: session.user.email 
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: session.user.sub,
          email: session.user.email || '',
          name: session.user.name || session.user.email?.split('@')[0] || 'Anonymous',
        }
      });
    }

    // Create blog post
    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || data.title.substring(0, 150),
        image_url: data.image_url || '',
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        authorId: user.id,
        status: 'PENDING',
        publishedAt: null,
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

    // Store history in DynamoDB
    if (blog) {
      try {
        const historyData = {
          payload: {
            application: "history",
            history_id: blog.id,
            created_at: blog.createdAt.toISOString(),
            updated_at: blog.updatedAt.toISOString(),
            user_email: user.email,
            status: blog.status,
          },
          context_user: user.email,
        };
        
        await createItem("Ntp-blog-app-Testing", historyData);
      } catch (dynamoError) {
        console.error("DynamoDB error:", dynamoError);
        // Continue even if DynamoDB fails
      }
    }

    return NextResponse.json({ blog }, { status: 201 });

  } catch (error) {
    console.error('Blog creation error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request, new NextResponse());
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const status = searchParams.get('status');

    // Check user role and metadata
    const isAdmin = session.user["role"] === "ADMIN";

    // Build the where clause
    let where: any = {};

    if (isAdmin) {
      if (status && status !== "ALL") {
        where.status = status;
      }
    } else {
      where = {
        OR: [{ authorId: session.user.sub }, { status: BlogStatus.APPROVED }],
      };

      if (status && status !== "ALL") {
        where = {
          OR: [
            { authorId: session.user.sub, status: status },
            { status: BlogStatus.APPROVED },
          ],
        };
      }
    }

    if (categorySlug) {
      where.category = {
        slug: categorySlug
      };
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
        // category: {
        //   select: {
        //     name: true,
        //     slug: true,
        //   },
        // }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ blogs });

  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
