"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import AcmeLogo from "@/app/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import ListBlogItem from "@/app/components/ListBlogItem";
import SubscribeSection from "@/app/components/SubscribeSection";
import Footer from "@/app/components/Footer";
import { Suspense, useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { isAdminFromUser } from "@/app/lib/auth";

type BlogWithAuthor = Prisma.BlogGetPayload<{
  include: { author: true };
}>;

export default function Page() {
  const { user, isLoading } = useUser();
  const [blogs, setBlogs] = useState<BlogWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user ? isAdminFromUser(user) : false;
  
  useEffect(() => {
    if (user) {
      console.log('Full User Object:', {
        user,
        isAdmin,
        metadata: {
          roles: user['https://ntp-blog-app.com/roles'],
          userMetadata: user['https://ntp-blog-app.com/user_metadata'],
          appMetadata: user['https://ntp-blog-app.com/app_metadata'],
          role: user['role']
        }
      });
    }
  }, [user, isAdmin]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Only fetch approved blogs for non-logged-in users
        const url = user ? "/api/blogs" : "/api/blogs?status=APPROVED";
        const response = await fetch(url);
        const data = await response.json();
        setBlogs(data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <header className="border-b border-blue-100 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <AcmeLogo />
            {isLoading ? (
              <div className="h-10 w-24 bg-blue-100 rounded-full animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-4">
                {user.picture && (
                  <Link href="/profile">
                    <div className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                      <Image
                        src={user.picture}
                        alt={user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full cursor-pointer"
                      />
                      <span className="text-blue-900">
                        Welcome, {user.name}!
                      </span>
                    </div>
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-full transition-all hover:bg-blue-700 hover:shadow-lg"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/blog/create"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-full transition-all hover:bg-blue-700 hover:shadow-lg"
                >
                  Create Blog
                </Link>
                <a
                  href="/api/auth/logout"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-red-600 rounded-full transition-all hover:bg-red-700 hover:shadow-lg"
                >
                  Logout
                </a>
              </div>
            ) : (
              <a
                href="/api/auth/login"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-full transition-all hover:bg-blue-700 hover:shadow-lg"
              >
                Get started <ArrowRightIcon className="ml-2 w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 text-blue-900">
              Welcome to NearTekPod Blogs
            </h1>
            <p className="text-blue-600 max-w-2xl mx-auto">
              This is an application created during FullStack Development Course
              brought to you by NearTekPod with the help of Vercel.
            </p>
          </div>

          {/* Subscribe Section */}
          <div className="mb-16">
            <Suspense
              fallback={
                <div className="h-[400px] bg-blue-50 rounded-3xl animate-pulse" />
              }
            >
              <SubscribeSection />
            </Suspense>
          </div>

          {/* Create Blog Button */}
          {user && (
            <div className="mb-4 text-right">
              <Link
                href="/blog/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Blog
              </Link>
            </div>
          )}

          {/* Category Filters */}
          <div className="flex justify-center gap-4 mb-12">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              All
            </button>
            <button className="px-6 py-2 border-2 border-blue-200 rounded-full hover:border-blue-300 transition-colors">
              Latest
            </button>
            <button className="px-6 py-2 border-2 border-blue-200 rounded-full hover:border-blue-300 transition-colors">
              Popular
            </button>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <Suspense fallback={<BlogGridSkeleton />}>
              {loading ? (
                <BlogGridSkeleton />
              ) : blogs.length > 0 ? (
                blogs.map((blog) => <ListBlogItem key={blog.id} post={blog} />)
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No blogs found. Be the first to create one!
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function BlogGridSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-4 shadow-sm animate-pulse"
        >
          <div className="w-full h-48 bg-blue-100 rounded-lg mb-4" />
          <div className="h-6 bg-blue-100 rounded w-3/4 mb-2" />
          <div className="h-4 bg-blue-50 rounded w-1/2" />
        </div>
      ))}
    </>
  );
}