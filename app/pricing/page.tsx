'use client';

import Link from 'next/link';
import { useState } from 'react';
import MarketingHeader from '@/components/MarketingHeader';
import Footer from '@/components/Footer';

export default function PricingPage() {
 const [openFaq, setOpenFaq] = useState<number | null>(null);

 const toggleFaq = (index: number) => {
  setOpenFaq(openFaq === index ? null : index);
 };

 const faqs = [
  {
   question: "How does the 30-day money-back guarantee work?",
   answer: "Subscribe and start using BuzEntry immediately. If you're not satisfied for any reason within 30 days, contact us for a full refund—no questions asked."
  },
  {
   question: "Are there any hidden fees or extra charges?",
   answer: "No. The price you see is what you pay. No setup fees, no per-unlock charges, no extra costs for features. Everything is included."
  },
  {
   question: "What if BuzEntry doesn't work with my building?",
   answer: "We offer a 100% money-back guarantee. If BuzEntry doesn't work with your intercom system for any reason, we'll refund you immediately."
  },
  {
   question: "Do you offer discounts for multiple units?",
   answer: "Yes! If you need BuzEntry for multiple apartments or a building-wide solution, contact us at hello@buzentry.com for custom pricing."
  }
 ];

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 relative overflow-hidden">
   {/* Decorative Background */}
   <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
   <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-100/10 rounded-full blur-3xl"></div>

   {/* Header */}
   <MarketingHeader />

   {/* Hero */}
   <section className="px-4 pt-16 pb-12 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center relative z-10">
    {/* Badge */}
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/50 border border-blue-100 mb-6 animate-fade-in">
     <span className="text-sm font-bold text-blue-600">Simple Pricing</span>
    </div>

    <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6 tracking-tight">
     Pricing
    </h1>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
     $6.99/month, paid up front. 30-day refund (no questions asked). Keep your number when you move.
    </p>
   </section>

   {/* Pricing Card */}
   <section className="px-4 pb-20 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
    <div className="max-w-md mx-auto">
     <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-blue-200 p-8 transition-all shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-2 duration-300">
      <div className="text-center mb-8">
       <h3 className="text-2xl font-black text-gray-900 mb-2">BuzEntry Pro</h3>
       <p className="text-gray-600 mb-6 font-medium">Everything you need to automate your door</p>

       <div className="mb-6">
        <div className="flex items-baseline justify-center gap-2">
         <span className="text-5xl font-black text-gray-900">$6.99</span>
         <span className="text-gray-600 font-medium">/month</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">Paid monthly</p>
       </div>

       <Link
        href="/"
        className="block w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3.5 rounded-full text-lg font-bold hover:from-blue-600 hover:to-indigo-700 transition-all hover:scale-105 active:scale-95 mb-4 h-14 shadow-lg shadow-blue-500/30"
       >
        Get Started Now
       </Link>
       <p className="text-sm text-gray-600 font-medium">30-day money-back guarantee</p>
      </div>

      {/* Features List */}
      <div className="border-t-2 border-blue-100 pt-8">
       <h4 className="font-black text-gray-900 mb-4">Everything included:</h4>
       <ul className="space-y-3">
        <li className="flex items-start gap-3">
         <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
         </svg>
         <span className="text-gray-900"><strong>Dedicated phone number</strong> for your intercom</span>
        </li>
        <li className="flex items-start gap-3">
         <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
         </svg>
         <span className="text-gray-900"><strong>Automatic door unlock</strong> in under 2 seconds</span>
        </li>
        <li className="flex items-start gap-3">
         <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
         </svg>
         <span className="text-gray-900"><strong>Optional 4-digit PIN</strong> for extra security</span>
        </li>
        <li className="flex items-start gap-3">
         <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
         </svg>
         <span className="text-gray-900"><strong>Unlimited guest passcodes</strong> with expiration dates</span>
        </li>
        <li className="flex items-start gap-3">
         <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
         </svg>
         <span className="text-gray-900"><strong>Complete activity logs</strong> with timestamps</span>
        </li>
        <li className="flex items-start gap-3">
         <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
         </svg>
         <span className="text-gray-900"><strong>Email & SMS notifications</strong> for unlocks</span>
        </li>
        <li className="flex items-start gap-3">
         <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
         </svg>
         <span className="text-gray-900"><strong>Quick pause/resume</strong> when you need control</span>
        </li>
        <li className="flex items-start gap-3">
         <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
         </svg>
         <span className="text-gray-900"><strong>Quiet hours mode</strong> (coming soon)</span>
        </li>
        <li className="flex items-start gap-3">
         <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
         </svg>
         <span className="text-gray-900"><strong>24/7 email support</strong></span>
        </li>
       </ul>
      </div>
     </div>
    </div>
   </section>

   {/* Guarantees */}
   <section className="px-4 py-16 sm:px-6 lg:px-8 relative z-10">
    <div className="max-w-4xl mx-auto">
     {/* Badge */}
     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/50 border border-blue-100 mb-6 mx-auto block w-fit">
      <span className="text-sm font-bold text-blue-600">Risk-Free Promise</span>
     </div>

     <h2 className="text-4xl font-black text-gray-900 text-center mb-12 tracking-tight">
      Try It Risk-Free
     </h2>
     <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-gray-200 p-6 text-center transition-all shadow-lg shadow-blue-500/5 hover:shadow-blue-500/20 hover:-translate-y-2 duration-300 hover:border-blue-500">
       <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
       </div>
       <h3 className="text-lg font-black text-gray-900 mb-2">30-Day Money-Back Guarantee</h3>
       <p className="text-gray-600 text-sm">
        Try risk-free for 30 days. Full refund if not satisfied, no questions asked.
       </p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-gray-200 p-6 text-center transition-all shadow-lg shadow-blue-500/5 hover:shadow-blue-500/20 hover:-translate-y-2 duration-300 hover:border-blue-500">
       <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
       </div>
       <h3 className="text-lg font-black text-gray-900 mb-2">Money-Back Guarantee</h3>
       <p className="text-gray-600 text-sm">
        Not working with your building? Full refund, no questions asked.
       </p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-gray-200 p-6 text-center transition-all shadow-lg shadow-blue-500/5 hover:shadow-blue-500/20 hover:-translate-y-2 duration-300 hover:border-blue-500">
       <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
       </div>
       <h3 className="text-lg font-black text-gray-900 mb-2">Cancel Anytime</h3>
       <p className="text-gray-600 text-sm">
        No contracts. No commitments. Cancel with one click from your dashboard.
       </p>
      </div>
     </div>
    </div>
   </section>

   {/* FAQ */}
   <section className="px-4 py-32 sm:px-6 lg:px-8 bg-transparent relative z-10">
    <div className="max-w-4xl mx-auto">
     {/* Header */}
     <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#155dfb]/10 border border-[#155dfb]/20 rounded-full text-sm font-bold text-[#155dfb] mb-6">
       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
       </svg>
       <span>Got questions?</span>
      </div>
      <h3 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
       Pricing Questions
      </h3>
     </div>

     {/* FAQ Accordion */}
     <div className="space-y-4">
      {faqs.map((faq, index) => (
       <div key={index} className="bg-white border border-gray-300 rounded-[40px] overflow-hidden hover:border-[#155dfb]/30 transition-all">
        <button
         onClick={() => toggleFaq(index)}
         className="w-full px-6 py-5 text-left flex items-start gap-4 hover:bg-gray-50 transition-colors group"
        >
         <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${openFaq === index ? 'bg-[#155dfb] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#155dfb]/10 group-hover:text-[#155dfb]'}`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
         </div>
         <div className="flex-1 pr-4">
          <span className="font-bold text-gray-900 text-base">{faq.question}</span>
         </div>
         <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 transition-all group-hover:bg-[#155dfb]/10 group-hover:text-[#155dfb] ${openFaq === index ? 'rotate-180 bg-[#155dfb]/10 text-[#155dfb]' : ''}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
         </div>
        </button>
        {openFaq === index && (
         <div className="px-6 pb-6 pt-4 pl-[72px] pr-6 text-gray-600 leading-relaxed animate-slide-up">
          {faq.answer}
         </div>
        )}
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* CTA */}
   <section className="px-4 py-20 sm:px-6 lg:px-8 text-center relative z-10">
    <div className="max-w-3xl mx-auto">
     <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 tracking-tight">
      Ready to Never Miss Another Delivery?
     </h2>
     <p className="text-xl text-gray-600 mb-8 leading-relaxed">
      Get started today with our 30-day money-back guarantee. Risk-free.
     </p>
     <Link
      href="/"
      className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3.5 rounded-full text-lg font-bold hover:from-blue-600 hover:to-indigo-700 transition-all hover:scale-105 active:scale-95 h-14 shadow-lg shadow-blue-500/30"
     >
      Subscribe Now
     </Link>
    </div>
   </section>

   {/* Footer */}
   <Footer />
  </div>
 );
}
