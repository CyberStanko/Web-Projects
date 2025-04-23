'use client';

import { useRouter } from 'next/navigation';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface BlogActionsProps {
  blogId: string;
  isAuthor: boolean;
  isAdmin: boolean;
}

export default function BlogActions({ blogId, isAuthor, isAdmin }: BlogActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/blog/edit/${blogId}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAuthor && !isAdmin) return null;

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={handleEdit}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PencilIcon className="w-4 h-4 mr-2" />
        Edit
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
      >
        <TrashIcon className="w-4 h-4 mr-2" />
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}