'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function SuccessContent() {
 const searchParams = useSearchParams();
 const sessionId = searchParams.get('session_id');

 useEffect(() => {
  if (sessionId) {
   // Immediately redirect to API endpoint which will handle everything
   window.location.replace(`/api/auth/create-session?sessionId=${sessionId}`);
  } else {
   // No session ID, redirect to home
   window.location.replace('/');
  }
 }, [sessionId]);

 // Show loading while redirecting
 return (
  <div className="min-h-screen bg-white flex items-center justify-center">
   <div className="text-center">
    <div className="w-16 h-16 border-4 border-[#5B8CFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
    <p className="text-[#94A3B8] text-lg mb-2">Payment successful!</p>
    <p className="text-[#64748B]">Setting up your account and logging you in...</p>
   </div>
  </div>
 );
}

export default function SuccessPage() {
 return (
  <Suspense fallback={
   <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-[#94A3B8]">Loading...</div>
   </div>
  }>
   <SuccessContent />
  </Suspense>
 );
}
