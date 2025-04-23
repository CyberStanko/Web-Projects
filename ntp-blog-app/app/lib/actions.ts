'use server';
 
import { prisma } from './prisma';
 
export async function getBlogs() {
    try {
        const blogs = await prisma.blog.findMany({
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
        });
 
        return { blogs };
    } catch (error) {
        console.error('Error fetching blogs:', error);
        throw new Error('Failed to fetch blogs');
    }
}