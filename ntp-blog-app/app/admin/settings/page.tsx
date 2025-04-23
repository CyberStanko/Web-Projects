'use client';

import { useState } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO: Implement settings save functionality
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Cog6ToothIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {/* Blog Settings */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Blog Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Blog Status
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending Review</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Blog Length (words)
              </label>
              <input
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="5000"
              />
            </div>
          </div>
        </div>

        {/* User Settings */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">User Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Allow New Registrations
                </label>
                <p className="text-sm text-gray-500">
                  Enable or disable new user registrations
                </p>
              </div>
              <button
                type="button"
                className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-600"
                role="switch"
                aria-checked="true"
              >
                <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default User Role
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="user">User</option>
                <option value="contributor">Contributor</option>
                <option value="editor">Editor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Send email notifications for new blog posts
                </p>
              </div>
              <button
                type="button"
                className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-200"
                role="switch"
                aria-checked="false"
              >
                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 