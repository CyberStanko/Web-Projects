'use client';

import Image from 'next/image';
import { memo } from 'react';

function SubscribeSection() {
  return (
    <div className="relative rounded-3xl overflow-hidden min-h-[400px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/ntp-hero-image.png"
          alt="Background"
          fill
          className="object-cover opacity-75"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-blue-100/60 to-white/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
            Join Our Tech Community
          </h2>
          <p className="text-blue-900 text-base md:text-lg mb-8 font-medium leading-relaxed bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow">
            Stay updated with our latest blogs and tech insights. Join our growing community of developers and tech enthusiasts!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border-2 border-blue-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(SubscribeSection);