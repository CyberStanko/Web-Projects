'use client';
 
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { isAdminFromUser } from '@/app/lib/auth';
 
export default function AdminLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const { user, isLoading } = useUser();
 
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
 
  if (!user || !isAdminFromUser(user)) {
    router.push('/');
    return null;
  }
 
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white">
        <div className="p-4">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
        </div>
        <nav className="mt-8">
          <Link
            href="/admin"
            className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-800"
          >
            <HomeIcon className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            href="/admin/blogs"
            className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-800"
          >
            <DocumentTextIcon className="w-5 h-5 mr-3" />
            Blog Management
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-800"
          >
            <UserGroupIcon className="w-5 h-5 mr-3" />
            User Management
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-800"
          >
            <Cog6ToothIcon className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>
      </aside>
 
      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}