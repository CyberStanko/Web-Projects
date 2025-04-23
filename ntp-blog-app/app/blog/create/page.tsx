'use client';
 
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AcmeLogo from '@/app/ui/acme-logo';
import Footer from '@/app/components/Footer';
import Image from 'next/image';
import { BlogStatus } from '@prisma/client';
import { toast } from 'react-hot-toast';
 
export default function CreateBlog() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
 
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
 
  if (!user) {
    router.push('/api/auth/login');
    return null;
  }
 
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
 
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };
 
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
 
    try {
      // First, upload the image if exists
      let image_url = '';
      if (image) {
        try {
          const formData = new FormData();
          formData.append('file', image);
          const imageResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!imageResponse.ok) {
            throw new Error('Failed to upload image');
          }
          
          const imageData = await imageResponse.json();
          image_url = imageData.url;
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          throw new Error('Failed to upload image. Please try again.');
        }
      }
 
      const blogData = {
        title,
        excerpt,
        content,
        slug,
        image_url,
        status: BlogStatus.PENDING
      };
 
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
        credentials: 'include',
      });
 
      // First get the response text
      const responseText = await response.text();
      let data;
      
      try {
        // Try to parse it as JSON
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Invalid response:', responseText);
        throw new Error('Server returned invalid response');
      }
 
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create blog');
      }
 
      toast.success('Blog created successfully!');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Blog creation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create blog');
    } finally {
      setSubmitting(false);
    }
  };
 
  const handleGrammarCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsChecking(true);
 
    try{
      const blogData = {
        excerpt,
        content,
      };
 
      const response = await fetch('/api/grammar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });
      const correctedData = await response.json()
      console.log("correctedData", correctedData);
      setContent(correctedData.data.content);
      setExcerpt(correctedData.data.excerpt);
    }
   
    catch(error)
    {
      console.error("Error fixing errors with AI",error)
    }
    finally{
      setIsChecking(false);
    }
 
  };
 
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <AcmeLogo />
            <div className="flex items-center gap-4">
              {user.picture && (
                <div className="flex items-center gap-4">
                  <Image
                    src={user.picture}
                    alt={user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-blue-900">Welcome, {user.name}!</span>
                </div>
              )}
              <a
                href="/api/auth/logout"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-red-600 rounded-full transition-all hover:bg-red-700 hover:shadow-lg"
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      </header>
 
      {/* Main Content */}
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Blogs
          </Link>
 
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-8">Create New Blog</h1>
           
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
              )}
 
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  placeholder="Enter your blog title"
                  required
                />
              </div>
 
              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  placeholder="url-friendly-title"
                  required
                />
              </div>
 
              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  placeholder="Brief summary of your blog post"
                  required
                />
              </div>
 
              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  placeholder="Write your blog content here..."
                  required
                />
              </div>
 
              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="mb-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-32 w-auto rounded-lg"
                        />
                      </div>
                    ) : (
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
 
              <div className="flex items-center gap-4 pt-4">
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-full transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating...' : 'Publish Blog'}
                </button>
                
                <button
                  type="button"
                  onClick={handleGrammarCheck}
                  disabled={isChecking || !content}
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-full transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChecking ? 'Checking...' : 'Fix with AI'}
                </button>
                
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </Link>
              </div>
 
              {error && error.includes('completed successfully') && (
                <div className="mt-2 p-3 bg-green-50 text-green-700 rounded-lg">
                  ✓ {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
 
      <Footer />
    </div>
  );
}