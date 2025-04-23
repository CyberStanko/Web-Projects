'use client';

import { useState } from 'react';

export default function UpdatePostForm({ post, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    slugId: post.data.slugId,
    title: post.data.title,
    content: post.data.content
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdate(post.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded text-gray-900"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 text-gray-700">Content</label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full p-2 border rounded text-gray-900"
          rows="4"
          required
        />
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 