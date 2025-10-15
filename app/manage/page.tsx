'use client';

import { useState } from 'react';
import Link from 'next/link';
import MarketingHeader from '@/components/MarketingHeader';
import Footer from '@/components/Footer';

export default function ManagePage() {
 const [email, setEmail] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState('');

 const handleManageSubscription = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
   // First, get the customer ID from their email
   const customerResponse = await fetch('/api/get-customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
   });

   const customerData = await customerResponse.json();

   if (!customerResponse.ok || !customerData.customerId) {
    setError('No subscription found for this email. Please check your email or contact support.');
    setIsLoading(false);
    return;
   }

   // Create portal session
   const portalResponse = await fetch('/api/create-portal-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId: customerData.customerId }),
   });

   const portalData = await portalResponse.json();

   if (portalData.url) {
    // Redirect to Stripe Customer Portal
    window.location.href = portalData.url;
   } else {
    setError('Unable to access subscription management. Please try again.');
    setIsLoading(false);
   }
  } catch (err) {
   console.error('Error:', err);
   setError('Something went wrong. Please try again or contact support.');
   setIsLoading(false);
  }
 };

 return (
  <div className="min-h-screen bg-white">
   {/* Header */}
   <MarketingHeader />

   {/* Main Content */}
   <div className="max-w-md mx-auto px-4 py-16">
    <div className="bg-gray-50 border-2 border-gray-300 rounded-2xl p-10 transition-all">
     {/* Icon Badge */}
     <div className="w-20 h-20 bg-[#155dfb] rounded-full flex items-center justify-center mb-6">
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
       <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
     </div>

     <h1 className="text-4xl font-black text-gray-900 mb-4">
      Manage Subscription
     </h1>
     <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
      Enter your email to manage your subscription, update payment method, or cancel.
     </p>

     <form onSubmit={handleManageSubscription}>
      <div className="mb-6">
       <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-3">
        Email Address
       </label>
       <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full px-5 py-4 border-2 border-gray-300 bg-white text-gray-900 rounded-full focus:border-[#155dfb] focus:ring-2 focus:ring-[#155dfb]/20 focus:outline-none text-lg transition-all placeholder:text-gray-400"
        required
        autoFocus
       />
      </div>

      {error && (
       <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-full animate-slide-up">
        <div className="flex items-start gap-3">
         <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
         </svg>
         <p className="text-sm text-red-300 font-medium">{error}</p>
        </div>
       </div>
      )}

      <button
       type="submit"
       disabled={isLoading}
       className="w-full bg-[#155dfb] text-white px-8 py-3.5 rounded-full text-lg font-black hover:bg-[#155dfb]/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 h-14"
      >
       {isLoading ? (
        <span className="flex items-center justify-center gap-3">
         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
         </svg>
         <span>Loading...</span>
        </span>
       ) : (
        'Manage Subscription'
       )}
      </button>
     </form>

     <div className="mt-8 pt-6 border-t-2 border-gray-300">
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
       <svg className="w-5 h-5 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
       </svg>
       <span className="font-medium">
        Need help?{' '}
        <a href="mailto:support@buzentry.com" className="text-[#155dfb] hover:text-[#155dfb]/80 font-bold hover:underline transition-colors">
         Contact Support
        </a>
       </span>
      </div>
     </div>
    </div>

    {/* Trust Badge */}
    <div className="mt-8 text-center">
     <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50/80 backdrop-blur-sm border border-gray-300 rounded-full text-sm text-gray-600">
      <svg className="w-4 h-4 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="font-medium">Secure payment processing</span>
     </div>
    </div>
   </div>

   <Footer />
  </div>
 );
}
