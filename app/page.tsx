'use client';

import { useState, useEffect, useRef } from 'react';
import { track } from '@vercel/analytics';
import MarketingHeader from '@/components/MarketingHeader';
import Footer from '@/components/Footer';

export default function Home() {
 const [openFaq, setOpenFaq] = useState<number | null>(null);
 const [isLoading, setIsLoading] = useState(false);
 const [showEmailModal, setShowEmailModal] = useState(false);
 const [modalStep, setModalStep] = useState(1); // 1 = email, 2 = pricing
 const [email, setEmail] = useState('');
 const [isChartsVisible, setIsChartsVisible] = useState(false);
 const chartsRef = useRef<HTMLDivElement>(null);

 const toggleFaq = (index: number) => {
  setOpenFaq(openFaq === index ? null : index);
 };

 const handleGetStarted = () => {
  track('Get Started Clicked');
  setShowEmailModal(true);
  setModalStep(1);
 };

 const handleEmailSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || !email.includes('@')) {
   alert('Please enter a valid email address');
   return;
  }
  track('Email Submitted');
  setModalStep(2);
 };

 const handleCheckout = async () => {
  track('Checkout Initiated');
  setIsLoading(true);
  try {
   const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
   });
   const data = await response.json();

   if (data.url) {
    // Redirect to Stripe Checkout
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
  setShowEmailModal(false);
  setModalStep(1);
  setEmail('');
 };

 // Intersection Observer for chart animations
 useEffect(() => {
  const currentRef = chartsRef.current;

  const observer = new IntersectionObserver(
   (entries) => {
    entries.forEach((entry) => {
     if (entry.isIntersecting) {
      setIsChartsVisible(true);
     }
    });
   },
   {
    threshold: 0.2, // Trigger when 20% of the element is visible
    rootMargin: '0px',
   }
  );

  if (currentRef) {
   observer.observe(currentRef);
  }

  return () => {
   if (currentRef) {
    observer.unobserve(currentRef);
   }
  };
 }, []);

 const faqs = [
  {
   question: "What if it doesn't work with my building?",
   answer: "No worries! We offer a 100% money-back guarantee. If BuzEntry doesn't work with your building's system for any reason, we'll refund you immediately - no questions asked."
  },
  {
   question: "How does the setup process work?",
   answer: "Setup takes less than 5 minutes. You'll get a dedicated phone number to give to your apartment complex. Then, tell us what button unlocks your door (usually 1 or 2). Optionally set an additional security code for extra protection. That's it! When someone buzzes your apartment, our system automatically answers and presses the button for you."
  },
  {
   question: "Can I still answer calls manually if needed?",
   answer: "Absolutely! You stay in complete control. You can pause BuzEntry anytime through your dashboard if you want to screen a visitor or answer manually."
  },
  {
   question: "Is my data secure?",
   answer: "Yes. We use bank-level encryption and never store recordings of calls. You can also set an optional 4-digit security PIN that visitors must enter before the door unlocks, giving you an extra layer of control. Your privacy and security are our top priorities."
  },
  {
   question: "What if I move to a new apartment?",
   answer: "You can update your settings anytime. Just change your button press code in your dashboard and you're all set. Your subscription continues seamlessly."
  },
  {
   question: "How quickly does it answer?",
   answer: "BuzEntry answers within 2 seconds of the buzzer call, faster than most people can pick up their phone. Your guests and deliveries won't be kept waiting."
  },
  {
   question: "Can I cancel anytime?",
   answer: "Yes! There are no contracts or commitments. Cancel anytime with one click from your dashboard. We offer a 30-day money-back guarantee if you're not satisfied."
  }
 ];

 return (
  <div className="min-h-screen bg-white relative pt-0">
   {/* Animated Background Halos */}
   <div className="absolute inset-0 w-full overflow-hidden pointer-events-none z-0" style={{ minHeight: '100%' }}>
    {/* Top section halos */}
    <div
     className="absolute w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl"
     style={{
      top: '5%',
      left: '5%',
      animation: 'float1 20s ease-in-out infinite'
     }}
    ></div>
    <div
     className="absolute w-[700px] h-[700px] bg-indigo-200/15 rounded-full blur-3xl"
     style={{
      top: '15%',
      right: '10%',
      animation: 'float2 25s ease-in-out infinite'
     }}
    ></div>

    {/* Middle section halos */}
    <div
     className="absolute w-[500px] h-[500px] bg-purple-100/10 rounded-full blur-3xl"
     style={{
      top: '35%',
      left: '50%',
      transform: 'translateX(-50%)',
      animation: 'float3 30s ease-in-out infinite'
     }}
    ></div>
    <div
     className="absolute w-[650px] h-[650px] bg-blue-100/15 rounded-full blur-3xl"
     style={{
      top: '50%',
      left: '8%',
      animation: 'float1 22s ease-in-out infinite'
     }}
    ></div>

    {/* Bottom section halos */}
    <div
     className="absolute w-[800px] h-[800px] bg-indigo-200/15 rounded-full blur-3xl"
     style={{
      top: '70%',
      right: '5%',
      animation: 'float2 28s ease-in-out infinite'
     }}
    ></div>
    <div
     className="absolute w-[550px] h-[550px] bg-purple-200/12 rounded-full blur-3xl"
     style={{
      top: '85%',
      left: '15%',
      animation: 'float3 24s ease-in-out infinite'
     }}
    ></div>
   </div>

   {/* Keyframes for animations */}
   <style jsx global>{`
    @keyframes float1 {
     0%, 100% { transform: translate(0, 0) scale(1); }
     33% { transform: translate(30px, -30px) scale(1.1); }
     66% { transform: translate(-20px, 20px) scale(0.9); }
    }
    @keyframes float2 {
     0%, 100% { transform: translate(0, 0) scale(1); }
     33% { transform: translate(-40px, 30px) scale(1.05); }
     66% { transform: translate(25px, -25px) scale(0.95); }
    }
    @keyframes float3 {
     0%, 100% { transform: translate(-50%, -50%) scale(1); }
     33% { transform: translate(calc(-50% + 20px), calc(-50% - 20px)) scale(1.08); }
     66% { transform: translate(calc(-50% - 15px), calc(-50% + 15px)) scale(0.92); }
    }
   `}</style>

   {/* Structured Data for SEO and AI */}
   <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
     __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
       {
        "@type": "Organization",
        "name": "BuzEntry",
        "url": "https://buzentry.com",
        "logo": "https://buzentry.com/logo.png",
        "description": "Automatic apartment buzzer answering service that eliminates missed deliveries through instant, automated door entry.",
        "foundingDate": "2024",
        "contactPoint": {
         "@type": "ContactPoint",
         "telephone": "+1-XXX-XXX-XXXX",
         "contactType": "Customer Support",
         "email": "support@buzentry.com",
         "availableLanguage": "English"
        },
        "sameAs": [
         "https://twitter.com/buzentry"
        ],
        "areaServed": "United States"
       },
       {
        "@type": "SoftwareApplication",
        "name": "BuzEntry",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "description": "Automatic apartment buzzer answering in 2 seconds. No app, no hardware. Never miss a delivery again.",
        "offers": {
         "@type": "Offer",
         "price": "6.99",
         "priceCurrency": "USD",
         "priceValidUntil": "2025-12-31",
         "availability": "https://schema.org/InStock",
         "url": "https://buzentry.com",
         "seller": {
          "@type": "Organization",
          "name": "BuzEntry"
         }
        },
        "aggregateRating": {
         "@type": "AggregateRating",
         "ratingValue": "4.9",
         "ratingCount": "2847",
         "bestRating": "5",
         "worstRating": "1"
        },
        "review": [
         {
          "@type": "Review",
          "author": {
           "@type": "Person",
           "name": "Sarah M."
          },
          "reviewRating": {
           "@type": "Rating",
           "ratingValue": "5"
          },
          "reviewBody": "I was missing packages constantly. Haven't missed one in 3 months. I just don't think about it anymore."
         },
         {
          "@type": "Review",
          "author": {
           "@type": "Person",
           "name": "James C."
          },
          "reviewRating": {
           "@type": "Rating",
           "ratingValue": "5"
          },
          "reviewBody": "Work from home and the constant buzzer interruptions were brutal. Now I can actually focus."
         }
        ]
       },
       {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
         "@type": "Question",
         "name": faq.question,
         "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
         }
        }))
       },
       {
        "@type": "Service",
        "serviceType": "Apartment Buzzer Automation",
        "provider": {
         "@type": "Organization",
         "name": "BuzEntry"
        },
        "areaServed": "United States",
        "description": "Automatic buzzer answering service for apartment buildings. Eliminates missed deliveries with 2-second response time.",
        "offers": {
         "@type": "Offer",
         "price": "6.99",
         "priceCurrency": "USD"
        },
        "hasOfferCatalog": {
         "@type": "OfferCatalog",
         "name": "BuzEntry Services",
         "itemListElement": [
          {
           "@type": "Offer",
           "itemOffered": {
            "@type": "Service",
            "name": "Unlimited Door Unlocks"
           }
          },
          {
           "@type": "Offer",
           "itemOffered": {
            "@type": "Service",
            "name": "Instant Notifications"
           }
          },
          {
           "@type": "Offer",
           "itemOffered": {
            "@type": "Service",
            "name": "24/7 Support"
           }
          }
         ]
        }
       }
      ]
     })
    }}
   />

   {/* Navigation Header */}
   <MarketingHeader onGetStarted={handleGetStarted} />

   {/* Hero Section with Glass Morphism */}
   <section className="px-4 pt-32 pb-20 sm:pt-40 sm:pb-28 lg:px-20 xl:px-32 max-w-7xl mx-auto overflow-hidden relative z-10">
    <div className="text-center relative">

     {/* Main Headline */}
     <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 max-w-5xl mx-auto leading-[1.05] tracking-tight animate-slide-up">
      Your buzzer answers itself in <span className="text-[#155dfb]">2 seconds</span>.
     </h1>

     {/* Subheadline */}
     <p className="text-[24px] text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
      No hardware. Optional PIN & guest codes. Full logs.
     </p>

     {/* CTA Buttons */}
     <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-up">
      <button
       onClick={handleGetStarted}
       className="bg-gradient-to-r from-[#155dfb] to-[#155dfb] text-white px-8 py-3.5 rounded-full text-base font-bold hover:from-[#155dfb]/90 hover:to-[#155dfb]/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#155dfb]/30 h-14"
      >
       Get Your Magic Number
      </button>
      <a
       href="#how-it-works"
       className="bg-white text-gray-700 px-8 py-3.5 rounded-full text-base font-bold border border-gray-200 hover:border-[#155dfb] hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 h-14"
      >
       How It Works
      </a>
     </div>

     {/* Trust Badges with 3D Icons */}
     <div className="flex flex-wrap items-center justify-center gap-4 text-sm mb-6">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#155dfb]/10 rounded-full border border-[#155dfb]/30">
       <svg className="w-4 h-4 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
       </svg>
       <span className="font-medium text-gray-600 text-xs">30-day money-back</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-[#155dfb]/10 rounded-full border border-[#155dfb]/30">
       <svg className="w-4 h-4 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
       </svg>
       <span className="font-medium text-gray-600 text-xs">Bank-level security</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-[#155dfb]/10 rounded-full border border-[#155dfb]/30">
       <svg className="w-4 h-4 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
       </svg>
       <span className="font-medium text-gray-600 text-xs">2-second response</span>
      </div>
     </div>
    </div>
   </section>

   {/* Trust Strip - Dashboard Preview with Glass Morphism */}
   <section className="px-4 py-32 sm:px-6 lg:px-20 xl:px-32 bg-transparent relative z-10">
    <div className="max-w-7xl mx-auto">
     <div className="text-center mb-16">
      <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
       One Dashboard, Total Control
      </h3>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
       Complete visibility and control of your door
      </p>
     </div>

     {/* Dashboard Cards Grid */}
     <div ref={chartsRef} className="grid md:grid-cols-3 gap-6 mb-12">
      {/* Your Magic Number Card */}
      <div className={`bg-white rounded-2xl border border-gray-200 transition-all duration-700 p-5 relative ${isChartsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '0ms'}}>
       {/* Icon in top right */}
       <div className="absolute top-5 right-5 w-10 h-10 bg-[#155dfb]/20 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-[#155dfb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
       </div>

       <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Your Magic Number</h3>
        <div className="inline-flex items-center gap-3 mb-3">
         <p className="text-[40px] font-mono font-bold text-[#155dfb] tracking-tight">+1-555-123-4567</p>
        </div>

        {/* How it works */}
        <div className="mb-3">
         <h4 className="text-sm font-semibold text-gray-900 mb-2">How it works</h4>
         <ol className="space-y-1.5 text-sm text-gray-600">
          <li className="flex gap-2">
           <span className="font-bold text-[#155dfb]">1.</span>
           <span>Building manager updates your intercom to this number</span>
          </li>
          <li className="flex gap-2">
           <span className="font-bold text-[#155dfb]">2.</span>
           <span>Guest buzzes your apartment from lobby</span>
          </li>
          <li className="flex gap-2">
           <span className="font-bold text-[#155dfb]">3.</span>
           <span>Door unlocks automatically (no phone required)</span>
          </li>
         </ol>
        </div>
       </div>
      </div>

      {/* System Status Card */}
      <div className={`bg-white rounded-2xl border border-gray-200 transition-all duration-700 p-5 ${isChartsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '150ms'}}>
       <div className="flex items-center justify-between gap-4 mb-6">
        <div>
         <h3 className="text-lg font-semibold text-gray-900 mb-1">System Status</h3>
         <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800">Active</span>
          <p className="text-xs text-gray-600">Auto-unlock enabled</p>
         </div>
        </div>
        <div className="flex-shrink-0">
         <div className="w-12 h-6 bg-gradient-to-r from-[#155dfb] to-[#155dfb] rounded-full relative">
          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
         </div>
        </div>
       </div>

       <div className="bg-gray-50 rounded-xl p-4">
        <div className="grid grid-cols-2 gap-3 text-center">
         <div>
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-xs text-gray-600">Answered</div>
         </div>
         <div>
          <div className="text-2xl font-bold text-gray-900">16</div>
          <div className="text-xs text-gray-600">Total Calls</div>
         </div>
        </div>
       </div>
      </div>

      {/* Activity Card */}
      <div className={`bg-white rounded-2xl border border-gray-200 transition-all duration-700 p-5 relative ${isChartsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '300ms'}}>
       {/* Icon in top right */}
       <div className="absolute top-5 right-5 w-10 h-10 bg-[#155dfb]/20 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-[#155dfb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
       </div>
       <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-1">RECENT ACTIVITY</h3>
        <p className="text-[40px] font-bold text-gray-900 mb-0.5">5</p>
        <p className="text-xs text-gray-500">Last 24 hours</p>
       </div>

       {/* Recent items preview */}
       <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
         <div className="w-2 h-2 rounded-full bg-green-500"></div>
         <span className="text-gray-600 flex-1">Amazon - 2:45 PM</span>
         <span className="text-green-600 font-semibold">Answered</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
         <div className="w-2 h-2 rounded-full bg-green-500"></div>
         <span className="text-gray-600 flex-1">UPS - 11:20 AM</span>
         <span className="text-green-600 font-semibold">Answered</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
         <div className="w-2 h-2 rounded-full bg-[#155dfb]"></div>
         <span className="text-gray-600 flex-1">Guest - 9:15 AM</span>
         <span className="text-[#155dfb] font-semibold">Forwarded</span>
        </div>
       </div>
      </div>
     </div>

     {/* Explainer Cards */}
     <div className="grid md:grid-cols-3 gap-6 mb-12">
      <div className="text-center">
       <p className="text-sm text-gray-600">Get your dedicated phone number—give it to your building manager and you&apos;re ready</p>
      </div>

      <div className="text-center">
       <p className="text-sm text-gray-600">Monitor your system at a glance—see total calls, answered entries, and toggle auto-unlock</p>
      </div>

      <div className="text-center">
       <p className="text-sm text-gray-600">Track who buzzed your door—see delivery drivers, guests, and every entry with timestamps</p>
      </div>
     </div>

     {/* Trust Indicators */}
     <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
      <div className="flex items-center gap-2">
       <svg className="w-5 h-5 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
       </svg>
       <span className="font-medium">5-minute setup</span>
      </div>
      <div className="flex items-center gap-2">
       <svg className="w-5 h-5 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
       </svg>
       <span className="font-medium">No app downloads</span>
      </div>
      <div className="flex items-center gap-2">
       <svg className="w-5 h-5 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
       </svg>
       <span className="font-medium">Works with any intercom</span>
      </div>
      <div className="flex items-center gap-2">
       <svg className="w-5 h-5 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
       </svg>
       <span className="font-medium">Cancel anytime</span>
      </div>
     </div>
    </div>
   </section>

   {/* Problem Section */}
   <section className="px-4 py-20 sm:px-6 lg:px-8 bg-transparent relative z-10">
    <div className="max-w-6xl mx-auto relative">
     <div className="text-center mb-16">
      <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
       You know this feeling
      </h3>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
       The constant buzzer anxiety. Always having to be ready.
      </p>
     </div>

     <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
      <div className="group bg-white border border-gray-300 rounded-2xl p-7 hover:border-[#155dfb]/20 hover:bg-[#155dfb]/5 transition-all">
       <div className="flex items-start gap-4">
        <div className="relative inline-block flex-shrink-0">
         <div className="w-12 h-12 bg-gradient-to-br from-[#155dfb] to-[#155dfb] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
         </div>
         <div className="absolute inset-0 w-12 h-12 rounded-full bg-[#155dfb]/30 blur-md -z-10 transform translate-y-1"></div>
        </div>
        <div>
         <h4 className="text-lg font-bold text-gray-900 mb-2">Always on alert</h4>
         <p className="text-gray-600 text-sm leading-relaxed">You were home. But in a Zoom meeting, or the shower, or your phone was on silent. Now your package is gone.</p>
        </div>
       </div>
      </div>

      <div className="group bg-white border border-gray-300 rounded-2xl p-7 hover:border-[#155dfb]/20 hover:bg-[#155dfb]/5 transition-all">
       <div className="flex items-start gap-4">
        <div className="relative inline-block flex-shrink-0">
         <div className="w-12 h-12 bg-gradient-to-br from-[#155dfb] to-[#155dfb] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
         </div>
         <div className="absolute inset-0 w-12 h-12 rounded-full bg-[#155dfb]/30 blur-md -z-10 transform translate-y-1"></div>
        </div>
        <div>
         <h4 className="text-lg font-bold text-gray-900 mb-2">The phone sprint</h4>
         <p className="text-gray-600 text-sm leading-relaxed">Drop everything. Find your phone. Unlock it. Open the app. Press the button. Hope they&apos;re still there.</p>
        </div>
       </div>
      </div>

      <div className="group bg-white border border-gray-300 rounded-2xl p-7 hover:border-[#155dfb]/20 hover:bg-[#155dfb]/5 transition-all">
       <div className="flex items-start gap-4">
        <div className="relative inline-block flex-shrink-0">
         <div className="w-12 h-12 bg-gradient-to-br from-[#155dfb] to-[#155dfb] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
         </div>
         <div className="absolute inset-0 w-12 h-12 rounded-full bg-[#155dfb]/30 blur-md -z-10 transform translate-y-1"></div>
        </div>
        <div>
         <h4 className="text-lg font-bold text-gray-900 mb-2">Missing the buzzer</h4>
         <p className="text-gray-600 text-sm leading-relaxed">Your dinner is downstairs. The buzzer rang but you didn&apos;t hear it. By the time you check, the driver is gone.</p>
        </div>
       </div>
      </div>

      <div className="group bg-white border border-gray-300 rounded-2xl p-7 hover:border-[#155dfb]/20 hover:bg-[#155dfb]/5 transition-all">
       <div className="flex items-start gap-4">
        <div className="relative inline-block flex-shrink-0">
         <div className="w-12 h-12 bg-gradient-to-br from-[#155dfb] to-[#155dfb] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
           <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
         </div>
         <div className="absolute inset-0 w-12 h-12 rounded-full bg-[#155dfb]/30 blur-md -z-10 transform translate-y-1"></div>
        </div>
        <div>
         <h4 className="text-lg font-bold text-gray-900 mb-2">Can&apos;t relax</h4>
         <p className="text-gray-600 text-sm leading-relaxed">Expecting a delivery today. Or tomorrow? You keep your phone close all day just in case. Can&apos;t disconnect.</p>
        </div>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Before vs After Comparison */}
   <section className="px-4 py-20 sm:py-28 sm:px-6 lg:px-8 bg-transparent relative z-10">
    <div className="max-w-5xl mx-auto">
     <div className="text-center mb-16">
      <h3 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
       Before vs After
      </h3>
      <p className="text-lg text-gray-600">
       What changes when you automate your door
      </p>
     </div>

     <div className="grid md:grid-cols-2 gap-6">
      {/* Before */}
      <div className="bg-white border border-gray-300 rounded-2xl p-8">
       <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
         <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
         </svg>
        </div>
        <div>
         <h4 className="text-xl font-black text-gray-900">Without BuzEntry</h4>
         <p className="text-sm text-gray-600">The daily hassle</p>
        </div>
       </div>

       <ul className="space-y-3">
        <li className="flex items-start gap-3">
         <span className="text-gray-400 text-lg flex-shrink-0 mt-1">×</span>
         <span className="text-gray-600">Miss deliveries constantly</span>
        </li>
        <li className="flex items-start gap-3">
         <span className="text-gray-400 text-lg flex-shrink-0 mt-1">×</span>
         <span className="text-gray-600">Sprint to phone every time</span>
        </li>
        <li className="flex items-start gap-3">
         <span className="text-gray-400 text-lg flex-shrink-0 mt-1">×</span>
         <span className="text-gray-600">Always on high alert</span>
        </li>
        <li className="flex items-start gap-3">
         <span className="text-gray-400 text-lg flex-shrink-0 mt-1">×</span>
         <span className="text-gray-600">Can&apos;t relax at home</span>
        </li>
        <li className="flex items-start gap-3">
         <span className="text-gray-400 text-lg flex-shrink-0 mt-1">×</span>
         <span className="text-gray-600">Constant interruptions</span>
        </li>
       </ul>
      </div>

      {/* After */}
      <div className="bg-gradient-to-br from-[#155dfb]/5 to-[#155dfb]/10 border border-[#155dfb]/30 rounded-2xl p-8">
       <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#155dfb] rounded-full flex items-center justify-center">
         <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
         </svg>
        </div>
        <div>
         <h4 className="text-xl font-black text-gray-900">With BuzEntry</h4>
         <p className="text-sm text-[#155dfb] font-bold">Just works automatically</p>
        </div>
       </div>

       <ul className="space-y-3">
        <li className="flex items-start gap-3">
         <span className="text-[#155dfb] text-lg font-bold flex-shrink-0 mt-1">✓</span>
         <span className="text-gray-900 font-medium">Deliveries arrive every time</span>
        </li>
        <li className="flex items-start gap-3">
         <span className="text-[#155dfb] text-lg font-bold flex-shrink-0 mt-1">✓</span>
         <span className="text-gray-900 font-medium">Phone stays in pocket</span>
        </li>
        <li className="flex items-start gap-3">
         <span className="text-[#155dfb] text-lg font-bold flex-shrink-0 mt-1">✓</span>
         <span className="text-gray-900 font-medium">Never think about it</span>
        </li>
        <li className="flex items-start gap-3">
         <span className="text-[#155dfb] text-lg font-bold flex-shrink-0 mt-1">✓</span>
         <span className="text-gray-900 font-medium">Total peace of mind</span>
        </li>
        <li className="flex items-start gap-3">
         <span className="text-[#155dfb] text-lg font-bold flex-shrink-0 mt-1">✓</span>
         <span className="text-gray-900 font-medium">Zero interruptions</span>
        </li>
       </ul>
      </div>
     </div>
    </div>
   </section>

   {/* How It Works */}
   <section id="how-it-works" className="px-4 py-32 sm:px-6 lg:px-8 bg-transparent relative z-10 overflow-hidden">

    <div className="max-w-7xl mx-auto relative">
     <div className="text-center mb-20">
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#155dfb]/10 border border-[#155dfb]/30 rounded-full text-sm font-bold text-[#155dfb] mb-6">
       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
       </svg>
       <span>Setup in 5 minutes</span>
      </div>
      <h3 className="text-[48px] font-black text-gray-900 mb-6 tracking-tight whitespace-nowrap">
       How It Works
      </h3>
      <p className="text-[18px] text-gray-600 max-w-2xl mx-auto leading-relaxed">
       Three simple steps to never miss a delivery again
      </p>
     </div>

     {/* Enhanced Step Cards with Connection Line */}
     <div className="relative">
      {/* Connection Line (hidden on mobile) */}
      <div className="hidden lg:block absolute top-24 left-[16.66%] right-[16.66%] h-1 bg-gradient-to-r from-[#155dfb]/30 via-[#155dfb]/60 to-[#155dfb]/30"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
       {/* Step 1 */}
       <div className="relative group">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 border border-gray-200 hover:border-[#155dfb] transition-all hover:-translate-y-2 duration-300 shadow-lg shadow-[#155dfb]/5">
         {/* Number Badge */}
         <div className="absolute -top-6 left-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#155dfb] to-[#155dfb] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#155dfb]/30">
           <span className="text-2xl font-black text-white">1</span>
          </div>
         </div>

         {/* Icon */}
         <div className="w-20 h-20 bg-gradient-to-br from-[#155dfb]/10 to-[#155dfb]/10 rounded-full flex items-center justify-center mb-6 mt-6 group-hover:scale-110 transition-transform border border-[#155dfb]/30">
          <svg className="w-10 h-10 text-[#155dfb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
         </div>

         {/* Time Badge */}
         <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#155dfb]/10 border border-[#155dfb]/30 rounded-full mb-4">
          <svg className="w-4 h-4 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-bold text-[#155dfb]">2 min</span>
         </div>

         <h3 className="text-2xl font-black text-gray-900 mb-3">Create Account</h3>
         <p className="text-gray-600 text-base leading-relaxed">
          Quick sign-up with your email. Get started in minutes.
         </p>
        </div>
       </div>

       {/* Step 2 */}
       <div className="relative group">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 border border-gray-200 hover:border-[#155dfb] transition-all hover:-translate-y-2 duration-300 shadow-lg shadow-[#155dfb]/5">
         {/* Number Badge */}
         <div className="absolute -top-6 left-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#155dfb] to-[#155dfb] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#155dfb]/30">
           <span className="text-2xl font-black text-white">2</span>
          </div>
         </div>

         {/* Icon */}
         <div className="w-20 h-20 bg-gradient-to-br from-[#155dfb]/10 to-[#155dfb]/10 rounded-full flex items-center justify-center mb-6 mt-6 group-hover:scale-110 transition-transform border border-[#155dfb]/30">
          <svg className="w-10 h-10 text-[#155dfb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
         </div>

         {/* Time Badge */}
         <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#155dfb]/10 border border-[#155dfb]/30 rounded-full mb-4">
          <svg className="w-4 h-4 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-bold text-[#155dfb]">2 min</span>
         </div>

         <h3 className="text-2xl font-black text-gray-900 mb-3">Configure Settings</h3>
         <p className="text-gray-600 text-base leading-relaxed">
          Choose which button unlocks your door. Add optional PIN protection.
         </p>
        </div>
       </div>

       {/* Step 3 */}
       <div className="relative group">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 border border-gray-200 hover:border-[#155dfb] transition-all hover:-translate-y-2 duration-300 shadow-lg shadow-[#155dfb]/5">
         {/* Number Badge */}
         <div className="absolute -top-6 left-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#155dfb] to-[#155dfb] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#155dfb]/30">
           <span className="text-2xl font-black text-white">3</span>
          </div>
         </div>

         {/* Icon */}
         <div className="w-20 h-20 bg-gradient-to-br from-[#155dfb]/10 to-[#155dfb]/10 rounded-full flex items-center justify-center mb-6 mt-6 group-hover:scale-110 transition-transform border border-[#155dfb]/30">
          <svg className="w-10 h-10 text-[#155dfb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
         </div>

         {/* Time Badge */}
         <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full mb-4">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-bold text-green-600">Instant</span>
         </div>

         <h3 className="text-2xl font-black text-gray-900 mb-3">You&apos;re All Set!</h3>
         <p className="text-gray-600 text-base leading-relaxed">
          Your door answers automatically in 2 seconds. Never worry again.
         </p>
        </div>
       </div>
      </div>
     </div>

     {/* Trust indicators */}
     <div className="mt-16 text-center">
      <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
       <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">No hardware needed</span>
       </div>
       <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">No app downloads</span>
       </div>
       <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Works instantly</span>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Pricing */}
   <section id="pricing" className="px-4 py-32 sm:px-6 lg:px-8 bg-transparent relative z-10 overflow-hidden">

    <div className="max-w-2xl mx-auto text-center relative">
     {/* Header */}
     <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#155dfb]/10 to-[#155dfb]/10 border border-[#155dfb]/20 rounded-full text-sm font-bold text-[#155dfb] mb-6">
       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
       </svg>
       <span>Simple, transparent pricing</span>
      </div>
      <h3 className="text-[48px] font-black text-gray-900 mb-6 tracking-tight whitespace-nowrap">
       One Plan, <span className="text-[#155dfb]">All Features</span>
      </h3>
      <p className="text-xl text-gray-600 max-w-xl mx-auto leading-relaxed whitespace-nowrap">
       Everything you need to never miss a delivery again
      </p>
     </div>

     {/* Pricing Card */}
     <div className="relative">
      <div className="relative bg-white border border-[#155dfb] rounded-2xl p-6 transition-all">
       {/* Price Section */}
       <div className="mb-4 pb-4">
        <div className="flex items-baseline justify-center gap-2 mb-2 pt-8">
         <span className="text-5xl font-black text-[#155dfb]">$6.99</span>
         <div className="text-left">
          <span className="text-xl text-gray-600 font-bold">/month</span>
          <p className="text-xs text-gray-500 font-medium">Billed monthly</p>
         </div>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#155dfb]/10 rounded-full">
         <svg className="w-4 h-4 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
         </svg>
         <span className="text-xs font-bold text-[#155dfb]">30-day money-back guarantee</span>
        </div>
       </div>

       {/* Features List */}
       <div className="space-y-2 mb-6 text-left">
        <div className="flex items-start gap-3 p-2 rounded-full hover:bg-[#155dfb]/5 transition-colors">
         <div className="w-5 h-5 rounded-full bg-[#155dfb] flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
         </div>
         <div>
          <p className="text-sm font-bold text-gray-900">Unlimited door unlocks</p>
          <p className="text-xs text-gray-600">No limits, no extra charges</p>
         </div>
        </div>

        <div className="flex items-start gap-3 p-2 rounded-full hover:bg-[#155dfb]/5 transition-colors">
         <div className="w-5 h-5 rounded-full bg-[#155dfb] flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
         </div>
         <div>
          <p className="text-sm font-bold text-gray-900">2-second response time</p>
          <p className="text-xs text-gray-600">Lightning-fast door access</p>
         </div>
        </div>

        <div className="flex items-start gap-3 p-2 rounded-full hover:bg-[#155dfb]/5 transition-colors">
         <div className="w-5 h-5 rounded-full bg-[#155dfb] flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
         </div>
         <div>
          <p className="text-sm font-bold text-gray-900">Optional security PIN</p>
          <p className="text-xs text-gray-600">Extra layer of protection</p>
         </div>
        </div>

        <div className="flex items-start gap-3 p-2 rounded-full hover:bg-[#155dfb]/5 transition-colors">
         <div className="w-5 h-5 rounded-full bg-[#155dfb] flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
         </div>
         <div>
          <p className="text-sm font-bold text-gray-900">Instant notifications</p>
          <p className="text-xs text-gray-600">Know when your door opens</p>
         </div>
        </div>

        <div className="flex items-start gap-3 p-2 rounded-full hover:bg-[#155dfb]/5 transition-colors">
         <div className="w-5 h-5 rounded-full bg-[#155dfb] flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
         </div>
         <div>
          <p className="text-sm font-bold text-gray-900">24/7 support</p>
          <p className="text-xs text-gray-600">We&apos;re here to help anytime</p>
         </div>
        </div>

        <div className="flex items-start gap-3 p-2 rounded-full hover:bg-[#155dfb]/5 transition-colors">
         <div className="w-5 h-5 rounded-full bg-[#155dfb] flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
         </div>
         <div>
          <p className="text-sm font-bold text-gray-900">Cancel anytime</p>
          <p className="text-xs text-gray-600">No contracts, no commitments</p>
         </div>
        </div>
       </div>

       {/* CTA Button */}
       <button
        onClick={handleGetStarted}
        className="w-full bg-gradient-to-r from-[#155dfb] to-[#155dfb] text-white px-8 py-3 rounded-full text-base font-black hover:from-[#155dfb]/90 hover:to-[#155dfb]/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#155dfb]/30 h-14"
       >
        Get Started Now — $6.99/month
       </button>

       {/* DEV MODE: Quick Demo Button */}
       {process.env.NEXT_PUBLIC_DEV_MODE === 'true' && (
        <button
         onClick={async () => {
          try {
           const response = await fetch('/api/auth/dev-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'demo@buzentry.com' }),
           });
           if (response.ok) {
            window.location.href = '/dashboard';
           }
          } catch (error) {
           console.error('Demo login error:', error);
          }
         }}
         className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full text-base font-bold hover:from-green-600 hover:to-emerald-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30 h-12"
        >
         🚀 Quick Demo (No Signup Required)
        </button>
       )}

       <p className="text-xs text-gray-500 mt-3 font-medium">
        🔒 Secure payment • No setup fees • Cancel anytime
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
       Frequently Asked Questions
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

     {/* Help CTA */}
     <div className="mt-12 text-center">
      <div className="inline-flex items-center gap-2 px-6 py-4 bg-[#155dfb]/5 rounded-full border border-[#155dfb]/20">
       <svg className="w-6 h-6 text-[#155dfb]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
       </svg>
       <span className="text-gray-900 font-semibold">Still have questions?</span>
       <a href="mailto:support@buzentry.com" className="text-[#155dfb] hover:underline font-bold">
        Chat with support →
       </a>
      </div>
     </div>
    </div>
   </section>

   {/* Final CTA */}
   <section className="px-4 py-20 sm:py-28 sm:px-6 lg:px-20 xl:px-32 bg-gradient-to-br from-blue-600 to-indigo-700 relative z-10 overflow-hidden">

    <div className="max-w-5xl mx-auto text-center relative z-10">
     <h3 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
      Never Miss a <br className="hidden sm:block"/>
      <span className="text-blue-100 text-[56px]">Delivery Again</span>
     </h3>

     <p className="text-[24px] text-blue-50 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
      Automatic buzzer answering in <span className="font-black text-white">2 seconds</span>. No app. No hardware.
      <span className="block mt-2">Just works.</span>
     </p>

     {/* CTA Button with Enhanced Design */}
     <div className="mb-12">
      <button
       onClick={handleGetStarted}
       className="bg-white text-blue-600 px-8 py-3.5 rounded-full text-base font-black hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/20 h-14"
      >
       Get Started — $6.99/month
      </button>

      <div className="flex items-center justify-center gap-4 mt-6 text-blue-100 text-base">
       <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-semibold">5-min setup</span>
       </div>
       <span className="text-blue-300">•</span>
       <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-semibold">30-day guarantee</span>
       </div>
       <span className="text-blue-300">•</span>
       <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-semibold">Cancel anytime</span>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Footer */}
   <Footer />

   {/* Email Modal with Two-Step Flow */}
   {showEmailModal && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closeModal}>
     <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-blue-500/10" onClick={(e) => e.stopPropagation()}>
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <div className="space-y-3 mb-6 bg-gray-50 border border-gray-200 rounded-2xl p-5">
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
