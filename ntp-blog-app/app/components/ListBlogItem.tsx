import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { Blog, BlogStatus } from '@prisma/client';

interface BlogWithAuthor extends Blog {
  author: {
    name: string | null;
    email: string;
  };
}

const statusColors = {
  [BlogStatus.PENDING]: 'bg-yellow-600',
  [BlogStatus.APPROVED]: 'bg-green-600',
  [BlogStatus.REJECTED]: 'bg-red-600'
};

export default function ListBlogItem({ post }: { post: BlogWithAuthor }) {
  // Calculate read time based on content length (rough estimate)
  const readTime = Math.ceil(post.content.split(' ').length / 200) + ' min read';
  
  return (
    <div className="group bg-white rounded-3xl border-2 border-blue-200 p-4 transition-all hover:shadow-[5px_5px_0_0_rgba(37,99,235,0.2)] hover:-translate-x-[5px] hover:-translate-y-[5px]">
      <div className="aspect-[16/9] relative rounded-2xl overflow-hidden mb-4">
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-400">No image</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-2 ${statusColors[post.status]} text-white text-sm rounded-full`}>
            {post.status.toLowerCase()}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-blue-600 mb-3">
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" />
          <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
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
      
      <Link href={`/blog/${post.id}`} className="block group-hover:text-blue-600">
        <h3 className="font-bold text-xl mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 line-clamp-3 mb-4">
          {post.excerpt || post.content.substring(0, 150)}...
        </p>
      </Link>
      
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
          {post.author.name ? post.author.name[0].toUpperCase() : 'U'}
        </div>
        <div>
          <p className="font-medium">{post.author.name || 'Anonymous'}</p>
          <p className="text-sm text-gray-500">{post.author.email}</p>
        </div>
      </div>
    </div>
  );
}