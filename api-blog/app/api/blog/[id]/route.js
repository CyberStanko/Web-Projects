import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    // In a real app, you would fetch from a database
    // For now, return a dummy post
    const post = {
      id,
      title: `Post ${id}`,
      content: `This is the content for post ${id}`
    };
    
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
} 