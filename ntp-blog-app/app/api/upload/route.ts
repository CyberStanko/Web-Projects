import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
 
export async function POST(request: NextRequest) {
  try {
    // Extract file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
 
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
 
    // Convert file to buffer and generate a unique filename
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + '_' + file.name.replace(/\s+/g, '_');
 
    // Define upload directory path
    const publicDir = path.join(process.cwd(), 'public');
    const uploadDir = path.join(publicDir, 'blog_images');
 
    try {
      // Attempt to write the file to the directory
      await writeFile(path.join(uploadDir, filename), buffer);
    } catch (error) {
      console.error('Error writing file:', error);
      // Create directory if it doesn't exist, then retry
      const { mkdir } = require('fs/promises');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
    }
 
    // Return the file's public URL
    return NextResponse.json({
      url: `/blog_images/${filename}`,
      success: true
    });
  } catch (error) {
    console.error('Error in upload handler:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}