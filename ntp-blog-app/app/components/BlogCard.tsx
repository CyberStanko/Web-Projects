import Link from 'next/link';
import { CalendarIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    content: string;
    author: {
      name: string | null;
      email: string;
      image?: string;
    };
    category?: {
      name: string;
      slug: string;
    };
    createdAt: string;
  };
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <div className="bg-white rounded-lg border hover:shadow-md transition-shadow">
      <div className="p-6 space-y-4">
        <Link href={`/blog/${blog.id}`}>
          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        <p className="text-gray-600 line-clamp-3">
          {blog.content}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <UserIcon className="w-4 h-4" />
            <span>{blog.author.name || 'Anonymous'}</span>
          </div>

          {blog.category && (
            <Link 
              href={`/category/${blog.category.slug}`}
              className="flex items-center gap-1 hover:text-blue-600"
            >
              <TagIcon className="w-4 h-4" />
              <span>{blog.category.name}</span>
            </Link>
          )}

          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}