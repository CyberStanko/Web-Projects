import { NextResponse } from "next/server";

// Mock data
const mockPosts = [
  {
    id: 1,
    data: {
      slugId: "welcome-post",
      title: "Welcome to Our Blog",
      content: "This is our first blog post. We're excited to share our thoughts and ideas with you!"
    }
  },
  {
    id: 2,
    data: {
      slugId: "getting-started",
      title: "Getting Started with Next.js",
      content: "Next.js is a powerful framework for building React applications. Let's explore its features together."
    }
  },
  {
    id: 3,
    data: {
      slugId: "web-development",
      title: "Modern Web Development",
      content: "Learn about the latest trends in web development, from responsive design to progressive web apps."
    }
  }
];

// Initialize posts with mock data
let posts = [...mockPosts];

// GET all posts
export async function GET() {
  return NextResponse.json(posts);
}

// CREATE new post
export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.slugId || !data.title || !data.content) {
      return NextResponse.json(
        { error: "Slug ID, title and content are required" },
        { status: 400 }
      );
    }

    const newPost = {
      id: Date.now(),
      data: {
        slugId: data.slugId,
        title: data.title,
        content: data.content
      }
    };

    posts.push(newPost);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

// DELETE post
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const initialLength = posts.length;
    posts = posts.filter(post => post.id !== id);

    if (posts.length === initialLength) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Post ${id} deleted successfully`
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

// UPDATE post
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    const updates = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    posts[postIndex] = {
      id: posts[postIndex].id,
      data: {
        slugId: updates.slugId || posts[postIndex].data.slugId,
        title: updates.title || posts[postIndex].data.title,
        content: updates.content || posts[postIndex].data.content
      }
    };

    return NextResponse.json({
      message: `Post ${id} updated successfully`,
      post: posts[postIndex]
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}  