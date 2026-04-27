'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CATEGORIES } from '@/types';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'NewsITA';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/newsITA.jpg"
              alt={siteName}
              width={40}
              height={40}
              className="rounded-lg shadow-md object-cover"
              priority
            />
            <span className="text-xl font-bold text-gray-900 tracking-tight">{siteName}</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Home
            </Link>
            {CATEGORIES.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.id}`}
                className="text-gray-700 hover:text-red-600 font-medium transition-colors capitalize"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.id}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 capitalize"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="hidden md:block bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 py-2 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.id}`}
                className="text-sm text-gray-600 hover:text-red-600 whitespace-nowrap transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
