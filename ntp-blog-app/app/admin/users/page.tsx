'use client';

import { useEffect, useState } from 'react';
import { User } from '@prisma/client';
import {
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface UserWithStats extends Omit<User, 'emailVerified' | 'image'> {
  image?: string | null;
  emailVerified?: Date | null;
  lastActive?: Date;
  _count?: {
    blogs: number;
  };
  stats?: {
    approvedBlogs: number;
    rejectedBlogs: number;
    pendingBlogs: number;
    totalBlogs: number;
  };
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    try {
      setUpdatingUserId(userId);
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update user role');
      }

      // Refresh the users list
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      setError(error instanceof Error ? error.message : 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Refresh Users
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Blogs</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Blog Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Last Active</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || ''}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <UserIcon className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'Anonymous'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'ADMIN' ? (
                          <ShieldCheckIcon className="w-4 h-4 mr-1" />
                        ) : (
                          <UserIcon className="w-4 h-4 mr-1" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <DocumentTextIcon className="w-4 h-4 mr-1" />
                        {user.stats?.totalBlogs || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          {user.stats?.approvedBlogs || 0} Approved
                        </div>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {user.stats?.pendingBlogs || 0} Pending
                        </div>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircleIcon className="w-4 h-4 mr-1" />
                          {user.stats?.rejectedBlogs || 0} Rejected
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-500">
                        {user.lastActive ? (
                          <>
                            <ClockIcon className="w-4 h-4 inline mr-1" />
                            {new Date(user.lastActive).toLocaleDateString()}
                          </>
                        ) : (
                          'Never'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleRoleUpdate(
                          user.id,
                          user.role === 'ADMIN' ? 'USER' : 'ADMIN'
                        )}
                        disabled={updatingUserId === user.id}
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                          user.role === 'ADMIN'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        } transition-colors duration-200`}
                      >
                        {updatingUserId === user.id ? (
                          <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            {user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 