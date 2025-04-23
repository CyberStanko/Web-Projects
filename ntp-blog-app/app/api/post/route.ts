import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
 
const prisma = new PrismaClient();
 
export async function GET(request: Request) {
    const blogs = await prisma.blog.findMany();
    return NextResponse.json(blogs, { status: 200 });
}
 
export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        const { title, content, authorId } = requestBody;
 
        if (!title || !content || !authorId) {
            return NextResponse.json(
                { error: "Title, Content, and Author ID are required" },
                { status: 400 }
            )
        }
 
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
 
        const blog = await prisma.blog.create({
            data: {
                title,
                content,
                slug,
                authorId
            }
        })
        return NextResponse.json(
            { message: "Blog saved successfully", blog },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to save blog" },
            { status: 500 }
        );
    }
}
 
export async function PUT(request: Request) {
    try {
        const requestBody = await request.json();
        const { id, title, content } = requestBody;
 
        if (!id) {
            return NextResponse.json(
                { error: "Blog ID is required" },
                { status: 400 }
            );
        }
 
        const existingBlog = await prisma.blog.findUnique({
            where: { id }
        });
 
        if (!existingBlog) {
            return NextResponse.json(
                { error: "Blog not found" },
                { status: 404 }
            );
        }
 
        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: {
                title: title || existingBlog.title,
                content: content || existingBlog.content
            }
        });
 
        return NextResponse.json(
            { message: "Blog updated successfully", blog: updatedBlog },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update blog" },
            { status: 500 }
        );
    }
}
 
export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;
 
        if (!id) {
            return NextResponse.json(
                { error: "Id is required" },
                { status: 400 }
            );
        }
 
        const existingBlog = await prisma.blog.findUnique({
            where: { id }
        });
 
        if (!existingBlog) {
            return NextResponse.json(
                { error: "Blog not found" },
                { status: 404 }
            );
        }
 
        await prisma.blog.delete({
            where: { id }
        });
 
        return NextResponse.json(
            { message: "Blog deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete blog" },
            { status: 500 }
        );
    }
}