'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const formData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt?.trim(),
        image_url: imageUrl?.trim(),
      };

      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create blog');
      }

      if (!data.blog) {
        throw new Error('Invalid response from server');
      }

      router.push(`/blog/${data.blog.id}`);
      router.refresh();
    } catch (error) {
      console.error('Blog creation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... rest of your component JSX
} 