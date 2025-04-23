'use client';

export default function BlogPost({ post }) {
  return (
    <div className="border p-4 rounded shadow-sm">
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700">{post.content}</p>
    </div>
  );
}