'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MarketingHeaderProps {
 onGetStarted?: () => void;
}

export default function MarketingHeader({ onGetStarted }: MarketingHeaderProps) {
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

 return (
  <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8">
   <div className="max-w-7xl mx-auto bg-white rounded-full border border-gray-200">
    <div className="flex items-center justify-between h-20 px-6 lg:px-10">
     {/* Logo with Icon */}
     <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
      <div className="w-10 h-10 flex items-center justify-center">
       <Image
        src="/logo-icon.svg"
        alt="BuzEntry"
        width={40}
        height={40}
        className="group-hover:scale-105 transition-transform"
       />
      </div>
      <span className="text-xl font-black text-gray-900 tracking-tight">
       BuzEntry
      </span>
     </Link>

     {/* Desktop Navigation */}
     <nav className="hidden lg:flex items-center gap-10">
      <Link href="/" className="text-sm text-gray-900 hover:text-[#5B8CFF] font-medium transition-colors px-4 py-2 rounded-full hover:bg-gray-50">
       Home
      </Link>
      <Link href="/#how-it-works" className="text-sm text-gray-600 hover:text-[#5B8CFF] font-medium transition-colors">
       How It Works
      </Link>
      <Link href="/pricing" className="text-sm text-gray-600 hover:text-[#5B8CFF] font-medium transition-colors">
       Pricing
      </Link>
     </nav>

     {/* Right Side - CTA */}
     <div className="flex items-center gap-6">
      {/* Login Button */}
      <Link
       href="/login"
       className="hidden sm:inline-block text-sm text-gray-900 font-semibold transition-colors px-5 py-2.5 rounded-full hover:bg-gray-50 h-10"
      >
       Login
      </Link>

      {/* Register Button */}
      {onGetStarted ? (
       <button
        onClick={onGetStarted}
        className="hidden sm:inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:from-blue-600 hover:to-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30 h-12"
       >
        Register
       </button>
      ) : (
       <Link
        href="/"
        className="hidden sm:inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:from-blue-600 hover:to-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30 h-12"
       >
        Register
       </Link>
      )}

      {/* Mobile Menu Button */}
      <button
       onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
       className="lg:hidden p-2 text-gray-900 hover:text-[#5B8CFF] transition-colors"
       aria-label="Toggle menu"
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

    {/* Mobile Menu */}
    {mobileMenuOpen && (
     <div className="lg:hidden border-t border-gray-200 bg-white rounded-b-2xl">
      <div className="px-6 py-4 space-y-3">
       <Link
        href="/"
        className="block py-2 text-gray-900 hover:text-[#5B8CFF] font-medium transition-colors"
        onClick={() => setMobileMenuOpen(false)}
       >
        Home
       </Link>
       <Link
        href="/#how-it-works"
        className="block py-2 text-gray-600 hover:text-[#5B8CFF] font-medium transition-colors"
        onClick={() => setMobileMenuOpen(false)}
       >
        How It Works
       </Link>
       <Link
        href="/pricing"
        className="block py-2 text-gray-600 hover:text-[#5B8CFF] font-medium transition-colors"
        onClick={() => setMobileMenuOpen(false)}
       >
        Pricing
       </Link>
      </div>
     </div>
    )}
   </div>
  </header>
 );
}
