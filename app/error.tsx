'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
 error,
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 useEffect(() => {
  console.error(error);
 }, [error]);

 return (
  <div className="min-h-screen bg-white flex items-center justify-center px-4">
   <div className="max-w-md w-full text-center">
    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
     <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
     </svg>
    </div>

    <h2 className="text-2xl font-bold text-white mb-3">
     Something went wrong
    </h2>
    <p className="text-[#94A3B8] mb-8">
     We&apos;re sorry, but something unexpected happened. Please try again.
    </p>

    <button
     onClick={reset}
     className="bg-[#5B8CFF] text-white px-8 py-3.5 rounded-full text-lg font-bold hover:bg-[#4A7AE8] transition-colors hover:scale-105 active:scale-95 h-14"
    >
     Try again
    </button>

    <div className="mt-8 pt-8 border-t border-gray-300">
     <Link href="/" className="text-[#5B8CFF] hover:underline text-sm">
      Return to home
     </Link>
    </div>
   </div>
  </div>
 );
}
