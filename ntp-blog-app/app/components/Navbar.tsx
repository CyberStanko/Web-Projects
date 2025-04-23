"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="p-4 bg-blue-500 text-white flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        NearTekPod Blog
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              {user.picture && (
                <Image
                  src={user.picture}
                  alt={user.name || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span>Welcome, {user.name}</span>
            </Link>
            <a
              href="/api/auth/logout"
              className="underline hover:text-gray-300"
            >
              Logout
            </a>
          </div>
        ) : (
          <Link
            href="/api/auth/login"
            className="underline hover:text-gray-300"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;