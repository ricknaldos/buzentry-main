'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { track } from '@vercel/analytics';
import Image from 'next/image';

export default function LoginPage() {
 const [email, setEmail] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [emailSent, setEmailSent] = useState(false);
 const [showSignUpModal, setShowSignUpModal] = useState(false);
 const [modalStep, setModalStep] = useState(1);
 const [signUpEmail, setSignUpEmail] = useState('');

 const handleSignUpClick = (e: React.MouseEvent) => {
  e.preventDefault();
  track('Sign Up Clicked from Login');
  setShowSignUpModal(true);
  setModalStep(1);
 };

 const handleEmailSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!signUpEmail || !signUpEmail.includes('@')) {
   alert('Please enter a valid email address');
   return;
  }
  track('Email Submitted from Login');
  setModalStep(2);
 };

 const handleCheckout = async () => {
  track('Checkout Initiated from Login');
  setIsLoading(true);
  try {
   const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: signUpEmail }),
   });
   const data = await response.json();

   if (data.url) {
    window.location.href = data.url;
   } else if (data.error) {
    alert('Error: ' + data.error);
    setIsLoading(false);
   }
  } catch (error) {
   console.error('Error:', error);
   alert('Something went wrong. Please try again.');
   setIsLoading(false);
  }
 };

 const closeModal = () => {
  setShowSignUpModal(false);
  setModalStep(1);
  setSignUpEmail('');
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
   // Check if user exists first
   const checkRes = await fetch('/api/user/check-exists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
   });

   const checkData = await checkRes.json();

   if (!checkData.exists) {
    alert('No account found with this email. Please sign up first.');
    setIsLoading(false);
    return;
   }

   // DEV MODE: Simulate magic link sent
   if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    console.log('[DEV MODE] Simulating magic link sent to:', email);
    setEmailSent(true);
    setIsLoading(false);
    return;
   }

   // PRODUCTION: User exists, proceed with magic link
   const result = await signIn('resend', {
    email,
    redirect: false,
    callbackUrl: '/dashboard'
   });

   if (result?.error) {
    console.error('Error signing in:', result.error);
    alert('Failed to send magic link. Please try again.');
    setIsLoading(false);
   } else {
    setEmailSent(true);
    setIsLoading(false);
   }
  } catch (error) {
   console.error('Error signing in:', error);
   alert('Failed to send magic link. Please try again.');
   setIsLoading(false);
  }
 };

 const handleDevLogin = async () => {
  if (process.env.NEXT_PUBLIC_DEV_MODE !== 'true') return;

  setIsLoading(true);
  try {
   const response = await fetch('/api/auth/dev-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
   });

   if (response.ok) {
    // Redirect to dashboard
    window.location.href = '/dashboard';
   } else {
    alert('Failed to login. Please try again.');
   }
  } catch (error) {
   console.error('Dev login error:', error);
   alert('Failed to login. Please try again.');
  } finally {
   setIsLoading(false);
  }
 };

 if (emailSent) {
  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 flex items-center justify-center px-4 relative overflow-hidden">
    {/* Decorative Background Elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
     <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
     <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
    </div>

    <div className="max-w-lg w-full text-center relative z-10">
     <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-[2rem] p-10 shadow-2xl shadow-blue-500/10">
      {/* Success Icon with Animation */}
      <div className="mb-8 relative">
       <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 animate-bounce">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
       </div>
       <h1 className="text-4xl font-black text-gray-900 mb-3">Check your email</h1>
       <p className="text-lg text-gray-600 mb-2">
        We sent a magic link to
       </p>
       <p className="text-xl font-bold text-[#5B8CFF] mb-4">
        {email}
       </p>
       <p className="text-base text-gray-500">
        Click the link in the email to sign in to your dashboard.
       </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-full p-6 mb-6">
       <p className="text-sm text-gray-700 flex items-start gap-2">
        <svg className="w-5 h-5 text-[#5B8CFF] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span>
         <strong>Can't find the email?</strong> Check your spam folder or try again with a different email address.
        </span>
       </p>
      </div>

      {/* DEV MODE: Direct login button */}
      {process.env.NEXT_PUBLIC_DEV_MODE === 'true' && (
       <div className="space-y-3">
        <button
         onClick={handleDevLogin}
         disabled={isLoading}
         className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full text-base font-bold hover:from-green-600 hover:to-emerald-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-green-500/30"
        >
         {isLoading ? 'Logging in...' : '[DEV] Skip Email - Login Now'}
        </button>
        <div className="text-center text-sm text-gray-500">or</div>
        <button
         onClick={async () => {
          setEmail('demo@buzentry.com');
          setIsLoading(true);
          try {
           const response = await fetch('/api/auth/dev-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'demo@buzentry.com' }),
           });
           if (response.ok) {
            window.location.href = '/dashboard';
           } else {
            alert('Failed to login. Please try again.');
            setIsLoading(false);
           }
          } catch (error) {
           console.error('Demo login error:', error);
           alert('Failed to login. Please try again.');
           setIsLoading(false);
          }
         }}
         disabled={isLoading}
         className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full text-base font-bold hover:from-blue-600 hover:to-indigo-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-500/30"
        >
         {isLoading ? 'Logging in...' : '🚀 Quick Demo Login'}
        </button>
       </div>
      )}

      <button
       onClick={() => {
        setEmailSent(false);
        setEmail('');
       }}
       className="text-[#5B8CFF] hover:text-[#4A7AEF] text-sm font-bold flex items-center gap-2 mx-auto transition-colors"
      >
       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
       </svg>
       Use a different email
      </button>
     </div>
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 flex items-center justify-center px-4 relative overflow-hidden">
   {/* Decorative Background Elements */}
   <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-100/10 rounded-full blur-3xl"></div>
   </div>

   <div className="max-w-md w-full relative z-10">
    {/* Logo and Title */}
    <div className="text-center mb-10">
     <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
      <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
       <Image
        src="/logo-icon.svg"
        alt="BuzEntry"
        width={48}
        height={48}
       />
      </div>
      <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
       BuzEntry
      </span>
     </Link>
     <h1 className="text-3xl font-black text-gray-900 mb-2">
      Welcome back
     </h1>
     <p className="text-gray-600 text-lg">Sign in to your dashboard</p>
    </div>

    {/* Login Card */}
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-[2rem] p-8 shadow-2xl shadow-blue-500/10">
     <form onSubmit={handleSubmit} className="space-y-6">
      <div>
       <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#5B8CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
        Email address
       </label>
       <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full px-5 py-3.5 border border-gray-200 bg-white text-gray-900 rounded-full focus:border-[#5B8CFF] focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all placeholder:text-gray-400 text-base"
        required
        disabled={isLoading}
        autoFocus
       />
      </div>

      <button
       type="submit"
       disabled={isLoading}
       className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-full text-base font-bold hover:from-blue-600 hover:to-indigo-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
      >
       {isLoading ? (
        <>
         <div className="w-5 h-5 border border-white/30 border-t-white rounded-full animate-spin"></div>
         Sending magic link...
        </>
       ) : (
        <>
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
         </svg>
         Send magic link
        </>
       )}
      </button>
     </form>

     {/* Info Message */}
     <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-full p-4">
      <p className="text-xs text-gray-600 text-center flex items-center justify-center gap-2">
       <svg className="w-4 h-4 text-[#5B8CFF]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
       </svg>
       We'll email you a magic link for a password-free sign in.
      </p>
     </div>
    </div>

    {/* Sign Up Link */}
    <div className="mt-8 text-center">
     <p className="text-base text-gray-600">
      Don't have an account?{' '}
      <a
       href="#"
       onClick={handleSignUpClick}
       className="text-[#5B8CFF] hover:text-[#4A7AEF] font-bold inline-flex items-center gap-1 transition-colors"
      >
       Sign up
       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
       </svg>
      </a>
     </p>
    </div>

    {/* Back to Home Link */}
    <div className="mt-6 text-center">
     <Link
      href="/"
      className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1 transition-colors"
     >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to home
     </Link>
    </div>
   </div>

   {/* Sign Up Modal */}
   {showSignUpModal && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closeModal}>
     <div className="bg-white border border-gray-200 rounded-[2rem] max-w-md w-full p-8 shadow-2xl shadow-blue-500/10" onClick={(e) => e.stopPropagation()}>
      {modalStep === 1 ? (
       // Step 1: Email Collection
       <>
        <div className="text-center mb-6">
         <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
         </div>
         <h3 className="text-2xl font-black text-gray-900 mb-2">Get Started</h3>
         <p className="text-gray-600 text-base">Enter your email to continue</p>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
         <input
          type="email"
          value={signUpEmail}
          onChange={(e) => setSignUpEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-5 py-3 border border-gray-300 bg-white text-gray-900 rounded-full focus:border-[#5B8CFF] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all placeholder:text-gray-400 text-base"
          required
          autoFocus
         />

         <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full text-base font-bold hover:from-blue-600 hover:to-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
         >
          Continue
         </button>

         <button
          type="button"
          onClick={closeModal}
          className="w-full text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition-colors font-medium"
         >
          Cancel
         </button>
        </form>
       </>
      ) : (
       // Step 2: Pricing Details
       <>
        <div className="text-center mb-6">
         <div className="inline-flex items-baseline gap-2 mb-3">
          <span className="text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">$6.99</span>
          <span className="text-xl text-gray-500 font-bold">/month</span>
         </div>
         <p className="text-gray-600 text-base mb-3">One simple subscription</p>
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-green-700 font-bold text-sm">30-day money-back guarantee</span>
         </div>
        </div>

        <div className="space-y-3 mb-6 bg-gray-50 border border-gray-200 rounded-full p-5">
         {[
          'Unlimited door unlocks',
          '2-second response time',
          'Instant notifications',
          'Cancel anytime',
          'No setup fees'
         ].map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
           <svg className="w-5 h-5 text-[#5B8CFF] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
           </svg>
           <span className="text-gray-900 text-sm font-medium">{feature}</span>
          </div>
         ))}
        </div>

        <div className="space-y-3">
         <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full text-base font-bold hover:from-blue-600 hover:to-indigo-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
         >
          {isLoading ? (
           <>
            <div className="w-5 h-5 border border-white/30 border-t-white rounded-full animate-spin"></div>
            Loading...
           </>
          ) : (
           <>
            Continue to Payment
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
           </>
          )}
         </button>

         <button
          type="button"
          onClick={() => setModalStep(1)}
          className="w-full text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition-colors font-medium"
         >
          Back
         </button>
        </div>
       </>
      )}
     </div>
    </div>
   )}
  </div>
 );
}
