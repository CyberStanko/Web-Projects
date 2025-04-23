'use client';

import { useEffect, useState } from 'react';
import {
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  ClockIcon,
  TagIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalUsers: number;
  totalBlogs: number;
  pendingBlogs: number;
  approvedBlogs: number;
  rejectedBlogs: number;
}

const REFRESH_INTERVAL = 30000; // Refresh every 30 seconds

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBlogs: 0,
    pendingBlogs: 0,
    approvedBlogs: 0,
    rejectedBlogs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/stats', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Stats fetch error response:', errorText); // Debug log
        throw new Error(errorText || 'Failed to fetch stats');
      }

      const data = await response.json();
      console.log('Fetched stats:', data); // Debug log

      // Validate the response data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      // Ensure all required fields are present
      const requiredFields = ['totalUsers', 'totalBlogs', 'pendingBlogs', 'approvedBlogs', 'rejectedBlogs'];
      const missingFields = requiredFields.filter(field => !(field in data));
      
      if (missingFields.length > 0) {
        console.error('Missing fields in response:', missingFields); // Debug log
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up periodic refresh
    const intervalId = setInterval(fetchStats, REFRESH_INTERVAL);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <button
          onClick={fetchStats}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border hover:bg-gray-50 flex items-center gap-2"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Refresh Stats
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Blogs</p>
              <p className="text-2xl font-bold">{stats.totalBlogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Blogs</p>
              <p className="text-2xl font-bold">{stats.pendingBlogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved Blogs</p>
              <p className="text-2xl font-bold">{stats.approvedBlogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected Blogs</p>
              <p className="text-2xl font-bold">{stats.rejectedBlogs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => window.location.href = '/admin/blogs'}
            className="p-6 text-left border rounded-lg hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-medium">Manage Blogs</h3>
            </div>
            <p className="text-sm text-gray-500">Review and moderate blog posts</p>
          </button>

          <button
            onClick={() => window.location.href = '/admin/users'}
            className="p-6 text-left border rounded-lg hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <UserGroupIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-medium">Manage Users</h3>
            </div>
            <p className="text-sm text-gray-500">View and manage user accounts</p>
          </button>

          <button
            onClick={() => window.location.href = '/admin/settings'}
            className="p-6 text-left border rounded-lg hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="font-medium">Settings</h3>
            </div>
            <p className="text-sm text-gray-500">Configure application settings</p>
          </button>

          <button
            onClick={() => window.location.href = '/admin/history'}
            className="p-6 text-left border rounded-lg hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <ClockIcon className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-medium">Blog History</h3>
            </div>
            <p className="text-sm text-gray-500">View blog status change history</p>
          </button>

          <button
            onClick={() => window.location.href = '/admin/categories'}
            className="p-6 text-left border rounded-lg hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <TagIcon className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-medium">Categories</h3>
            </div>
            <p className="text-sm text-gray-500">Manage blog categories</p>
          </button>
        </div>
      </div>
    </div>
  );
}