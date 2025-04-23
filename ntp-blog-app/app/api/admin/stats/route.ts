import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
 
export async function GET() {
  try {
    const [totalBlogs, pendingBlogs, approvedBlogs, rejectedBlogs, totalUsers] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({ where: { status: 'PENDING' } }),
      prisma.blog.count({ where: { status: 'APPROVED' } }),
      prisma.blog.count({ where: { status: 'REJECTED' } }),
      prisma.user.count()
    ]);
 
    return NextResponse.json({
      totalBlogs,
      pendingBlogs,
      approvedBlogs,
      rejectedBlogs,
      totalUsers
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}