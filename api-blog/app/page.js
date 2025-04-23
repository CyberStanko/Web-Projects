'use client';
import { useState, useEffect } from 'react';
import UpdatePostForm from './components/UpdatePostForm';

export default function Page() {
  const [formData, setFormData] = useState({
    slugId: '',
    title: '',
    content: ''
  });
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  // Fetch initial posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // First try to get posts from localStorage
        const storedPosts = localStorage.getItem('blogPosts');
        if (storedPosts) {
          setPosts(JSON.parse(storedPosts));
        } else {
          // If no stored posts, fetch from API
          const res = await fetch('/api/blog');
          const data = await res.json();
          setPosts(data);
          // Store in localStorage
          localStorage.setItem('blogPosts', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      const updatedPosts = [...posts, data];
      setPosts(updatedPosts);
      // Update localStorage
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      setFormData({ slugId: '', title: '', content: '' });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch('/api/blog', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const updatedPosts = posts.filter(post => post.id !== id);
      setPosts(updatedPosts);
      // Update localStorage
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpdate = async (id, updateData) => {
    try {
      const res = await fetch(`/api/blog?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await res.json();
      
      if (data.post) {
        const updatedPosts = posts.map(post => 
          post.id === id ? data.post : post
        );
        setPosts(updatedPosts);
        localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
        setEditingPost(null);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label htmlFor="slugId" className="block mb-2 text-gray-700">Slug ID</label>
          <input
            type="text"
            id="slugId"
            value={formData.slugId}
            onChange={(e) => setFormData({ ...formData, slugId: e.target.value })}
            className="w-full p-2 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter slug ID"
            required
          />
        </div>
        <div>
          <label htmlFor="title" className="block mb-2 text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter title"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block mb-2 text-gray-700">Content</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full p-2 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Enter content"
            required
          />
        </div>
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Create Post
        </button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded shadow-lg bg-gray-800">
            {editingPost === post.id ? (
              <UpdatePostForm 
                post={post}
                onUpdate={handleUpdate}
                onCancel={() => setEditingPost(null)}
              />
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Slug: {post.data.slugId}</p>
                  <h2 className="text-xl font-bold text-white mb-2">{post.data.title}</h2>
                  <p className="text-gray-300 mt-2">{post.data.content}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => setEditingPost(post.id)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}