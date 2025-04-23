'use client';

import { useEffect, useState } from 'react';
import { Blog } from '@prisma/client';
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  XMarkIcon,
  ClockIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BlogWithAuthor extends Blog {
  author: {
    name: string | null;
    email: string;
  };
  rejectionReason: string | null;
  publishedAt: Date | null;
}

type BlogStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export default function BlogManagementPage() {
  const { user, isLoading: userLoading, error: userError } = useUser();
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BlogStatus>('ALL');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showDeleteAllConfirmModal, setShowDeleteAllConfirmModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  // Check for admin role from Auth0 user metadata
  const isAdmin = user && (
    user['role'] === 'ADMIN' || 
    (user['https://my-app.example.com/roles'] as string[] | undefined)?.includes('ADMIN')
  );

  useEffect(() => {
    const initializePage = async () => {
      if (userLoading) return;

      if (!user) {
        router.push('/api/auth/login');
        return;
      }

      // Don't redirect immediately if not admin, let's try to fetch blogs first
      await fetchBlogs();
    };

    initializePage();
  }, [user, userLoading, filter]); // Added filter as dependency

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const url = `/api/admin/blogs${filter !== 'ALL' ? `?status=${filter}` : ''}`;
      console.log('Fetching blogs from:', url); // Debug log
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText); // Debug log
        throw new Error(errorText || 'Failed to fetch blogs');
      }

      const data = await response.json();
      console.log('Fetched blogs:', data); // Debug log
      
      if (!data.blogs) {
        console.error('No blogs array in response:', data); // Debug log
        throw new Error('Invalid response format');
      }

      setBlogs(data.blogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (blogId: string, action: 'APPROVED' | 'REJECTED', reason?: string) => {
    try {
      if (!isAdmin) {
        throw new Error('Only administrators can perform this action');
      }

      setUpdating(true);
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: action,
          ...(reason && { rejectionReason: reason })
        }),
        credentials: 'include',
      });

      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Invalid JSON response:', responseText);
        throw new Error('Server returned invalid JSON');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update blog status');
      }
      
      await fetchBlogs();
      
      if (action === 'REJECTED') {
        setShowRejectionModal(false);
        setRejectionReason('');
        setSelectedBlogId(null);
      }
    } catch (error) {
      console.error('Error updating blog status:', error);
      alert('Failed to update blog status: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUpdating(false);
    }
  };

  const handleRejectionSubmit = () => {
    if (!selectedBlogId || !rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    handleAction(selectedBlogId, 'REJECTED', rejectionReason.trim());
  };

  const handleReject = (blogId: string) => {
    if (!isAdmin) {
      alert('Only administrators can reject blogs');
      return;
    }
    setSelectedBlogId(blogId);
    setShowRejectionModal(true);
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/blogs?blogId=${blogId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete blog');
      }

      // Remove the deleted blog from state
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      setShowDeleteConfirmModal(false);
      setSelectedBlogId(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAllBlogs = async () => {
    try {
      setDeleting(true);
      const response = await fetch('/api/admin/blogs?deleteAll=true', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete all blogs');
      }

      // Clear all blogs from state
      setBlogs([]);
      setShowDeleteAllConfirmModal(false);
    } catch (error) {
      console.error('Error deleting all blogs:', error);
      alert('Failed to delete all blogs: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setDeleting(false);
    }
  };

  const handleApprove = async (blogId: string) => {
    try {
      if (!isAdmin) {
        throw new Error('Only administrators can approve blogs');
      }

      setUpdating(true);
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'APPROVED',
        }),
        credentials: 'include',
      });

      // First get the response text
      const responseText = await response.text();
      let data;
      
      try {
        // Try to parse it as JSON
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Invalid JSON response:', responseText);
        throw new Error('Server returned invalid JSON');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve blog');
      }

      // Refresh the blogs list
      await fetchBlogs();
    } catch (error) {
      console.error('Error approving blog:', error);
      alert('Failed to approve blog: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUpdating(false);
    }
  };

  const getStatusDetails = (blog: BlogWithAuthor) => {
    switch (blog.status) {
      case 'APPROVED':
        return {
          label: 'Approved',
          className: 'bg-green-100 text-green-800',
          date: blog.publishedAt ? `Published on ${new Date(blog.publishedAt).toLocaleDateString()}` : null,
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          className: 'bg-red-100 text-red-800',
          reason: blog.rejectionReason,
        };
      default:
        return {
          label: 'Pending',
          className: 'bg-yellow-100 text-yellow-800',
        };
    }
  };

  if (userLoading || loading) {
    return <div>Loading...</div>;
  }

  if (userError || error) {
    return <div>Error: {userError?.message || error}</div>;
  }

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        
        <div className="flex gap-4">
          {/* Filter Buttons */}
          <div className="flex gap-2">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as BlogStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Delete All Blogs Button */}
          <button
            onClick={() => setShowDeleteAllConfirmModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            disabled={deleting || blogs.length === 0}
          >
            Delete All Blogs
          </button>
        </div>
      </div>

      {/* Blog List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.length > 0 ? (
              blogs.map((blog) => {
                const statusDetails = getStatusDetails(blog);
                return (
                  <tr key={blog.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                      <div className="text-xs text-gray-500">Created on {new Date(blog.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{blog.author.name || blog.author.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDetails.className}`}>
                        {statusDetails.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {statusDetails.date && (
                          <div className="flex items-center text-green-600">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {statusDetails.date}
                          </div>
                        )}
                        {statusDetails.reason && (
                          <div className="text-red-600">
                            Reason: {statusDetails.reason}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      {blog.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(blog.id)}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            disabled={updating}
                            title="Approve"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(blog.id)}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            disabled={updating}
                            title="Reject"
                          >
                            <XCircleIcon className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <Link
                        href={`/blog/${blog.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedBlogId(blog.id);
                          setShowDeleteConfirmModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        disabled={deleting}
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No blogs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Reject Blog</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full p-2 border rounded-lg mb-4"
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setSelectedBlogId(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectionSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={!rejectionReason.trim() || updating}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Delete Blog</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this blog? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setSelectedBlogId(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedBlogId && handleDeleteBlog(selectedBlogId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      {showDeleteAllConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Delete All Blogs</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete all blogs? This action cannot be undone and will remove {blogs.length} blogs.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteAllConfirmModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllBlogs}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 