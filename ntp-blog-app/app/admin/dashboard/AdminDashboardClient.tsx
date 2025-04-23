'use client';

import { useState } from 'react';

interface Blog {
  id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  author: {
    name: string;
    email: string;
  };
}

interface SerializedSession {
  user: {
    sub?: string;
    name?: string;
    email?: string;
    role?: string;
    updated_at: string | null;
    last_login: string | null;
  };
  accessToken?: string;
  accessTokenExpiresAt: string | null;
  idToken?: string;
  refreshToken?: string;
}

interface AdminDashboardClientProps {
  blogs: Blog[];
  session: SerializedSession;
}

export default function AdminDashboardClient({ blogs: initialBlogs, session }: AdminDashboardClientProps) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [loading, setLoading] = useState<string | null>(null);

  const handleBlogAction = async (blogId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setLoading(blogId);
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setBlogs(blogs.filter(blog => blog.id !== blogId));
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update blog status');
      }
    } catch (error) {
      console.error('Error updating blog status:', error);
      alert('Failed to update blog status. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard - Pending Blogs</h1>
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white shadow-md rounded-lg p-6 space-y-4"
            >
              <div>
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-gray-600">
                  By {blog.author.name} ({blog.author.email})
                </p>
                <p className="text-gray-500 text-sm">
                  Created on {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-gray-700">{blog.content}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleBlogAction(blog.id, 'APPROVED')}
                  disabled={loading === blog.id}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === blog.id ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleBlogAction(blog.id, 'REJECTED')}
                  disabled={loading === blog.id}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === blog.id ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
          {blogs.length === 0 && (
            <p className="text-center text-gray-500">No pending blogs to review</p>
          )}
        </div>
      </div>
    </div>
  );
}