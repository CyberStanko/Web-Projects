'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import BlogActions from '@/app/components/Blogaction';
import { useEffect, useState } from 'react';
import { Blog } from '@prisma/client';

interface BlogWithAuthor extends Blog {
  author: {
    name: string | null;
    email: string;
  };
}

export default function BlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [blog, setBlog] = useState<BlogWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text(); // First get the response as text
        let data;
        try {
          data = JSON.parse(text); // Then try to parse it
        } catch (e) {
          console.error('Invalid JSON response:', text);
          throw new Error('Invalid JSON response from server');
        }
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id]);

  if (loading || isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!blog) {
    notFound();
  }

  // Calculate read time based on content length (rough estimate)
  const readTime = Math.ceil(blog.content.split(' ').length / 200) + ' min read';

  const isAuthor = user?.sub === blog.authorId;
  const isAdmin = user?.['role'] === 'ADMIN';

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center mb-8 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>

          {blog.image_url && (
            <div className="aspect-[16/9] relative rounded-xl overflow-hidden mb-8">
              <Image
                src={blog.image_url}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{readTime}</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
            
            {blog.excerpt && (
              <p className="text-xl text-gray-600 mb-8">{blog.excerpt}</p>
            )}

            <div className="prose max-w-none">
              {blog.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xl">
                  {blog.author.name ? blog.author.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="font-medium text-lg">{blog.author.name || 'Anonymous'}</p>
                  <p className="text-gray-500">{blog.author.email}</p>
                </div>
              </div>

              <BlogActions
                blogId={blog.id}
                isAuthor={isAuthor}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}