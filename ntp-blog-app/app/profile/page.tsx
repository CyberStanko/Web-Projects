'use client'

import { useUser } from "@auth0/nextjs-auth0/client"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const ProfilePage = () => {
  const { user, isLoading } = useUser()

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="animate-pulse text-blue-600">Loading...</div>
    </div>
  )

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-blue-600 mb-4">Please login to view profile</p>
        <Link href="/api/auth/login" className="text-white bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-700">
          Login
        </Link>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-2xl mx-auto bg-white rounded-3xl border-2 border-blue-200 p-8 transition-all hover:shadow-[5px_5px_0_0_rgba(37,99,235,0.2)]">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {user.picture ? (
              <Image
                src={user.picture}
                alt="Profile"
                width={128}
                height={128}
                className="rounded-full border-4 border-blue-100"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                <span className="text-4xl text-blue-600">
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">{user.name}</h1>
              <p className="text-blue-600">{user.email}</p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-semibold text-blue-900 mb-6 pb-2 border-b-2 border-blue-100">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-blue-600">Username</label>
                <p className="font-medium text-blue-900">
                  {user.name}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-blue-600">Email Address</label>
                <p className="font-medium text-blue-900">
                  {user.email}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-blue-600">Email Status</label>
                <p className="font-medium text-blue-900">
                  {user.email_verified ? 
                    <span className="text-green-600">✓ Verified</span> : 
                    <span className="text-yellow-600">Pending Verification</span>
                  }
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-blue-600">Account Created</label>
                <p className="font-medium text-blue-900">
                  {new Date(user.updated_at || '').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-blue-600">User ID</label>
                <p className="font-mono text-sm text-blue-900 bg-blue-50 p-2 rounded">
                  {user.sub?.split('|')[1] || user.sub}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-blue-600">Login Provider</label>
                <p className="font-medium text-blue-900">
                  {user.sub?.split('|')[0] || 'Auth0'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href="/api/auth/logout"
              className="px-6 py-3 text-red-600 border-2 border-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors"
            >
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage