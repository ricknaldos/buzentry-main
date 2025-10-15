'use client';

import Link from 'next/link';
import MarketingHeader from '@/components/MarketingHeader';

export default function DriversPage() {
 return (
  <div className="min-h-screen bg-white">
   {/* Header */}
   <MarketingHeader />

   {/* Hero */}
   <section className="px-4 pt-16 pb-12 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
    <div className="w-16 h-16 bg-[#5B8CFF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
     <svg className="w-10 h-10 text-[#5B8CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
     </svg>
    </div>

    {/* Badge */}
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5B8CFF]/10 border border-[#F8D061]/20 mb-6 animate-fade-in">
     <span className="text-sm font-bold text-white">Lightning Fast Deliveries</span>
    </div>

    <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 tracking-tight">
     For Delivery Drivers
    </h1>
    <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
     Faster deliveries. No waiting. No callbacks. Just buzz and go.
    </p>
   </section>

   {/* Main Benefits */}
   <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-6xl mx-auto">
    <div className="grid md:grid-cols-3 gap-8">
     <div className="text-center bg-gray-50 rounded-full border border-gray-300 p-8 transition-shadow">
      <div className="w-20 h-20 bg-[#5B8CFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
       <svg className="w-10 h-10 text-[#5B8CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
       </svg>
      </div>
      <h3 className="text-2xl font-black text-white mb-3">Instant Access</h3>
      <p className="text-[#94A3B8]">
       Buzz the unit and the door opens automatically. No waiting for residents to answer.
      </p>
     </div>

     <div className="text-center bg-gray-50 rounded-full border border-gray-300 p-8 transition-shadow">
      <div className="w-20 h-20 bg-[#5B8CFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
       <svg className="w-10 h-10 text-[#5B8CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
       </svg>
      </div>
      <h3 className="text-2xl font-black text-white mb-3">More Deliveries</h3>
      <p className="text-[#94A3B8]">
       Complete more stops per hour. No time wasted waiting or making callbacks.
      </p>
     </div>

     <div className="text-center bg-gray-50 rounded-full border border-gray-300 p-8 transition-shadow">
      <div className="w-20 h-20 bg-[#5B8CFF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
       <svg className="w-10 h-10 text-[#5B8CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
       </svg>
      </div>
      <h3 className="text-2xl font-black text-white mb-3">Better Ratings</h3>
      <p className="text-[#94A3B8]">
       Happy customers mean better ratings. Packages delivered on time, every time.
      </p>
     </div>
    </div>
   </section>

   {/* How It Works for Drivers */}
   <section className="px-4 py-32 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0B0D12] to-[#11141B]">
    <div className="max-w-4xl mx-auto">
     <h2 className="text-4xl font-black text-white text-center mb-12 tracking-tight">
      How It Works
     </h2>

     <div className="space-y-8">
      <div className="flex gap-6 items-start">
       <div className="flex-shrink-0 w-14 h-14 bg-[#5B8CFF] rounded-full flex items-center justify-center">
        <span className="text-2xl font-black text-white">1</span>
       </div>
       <div>
        <h3 className="text-2xl font-black text-white mb-2">Buzz the Unit</h3>
        <p className="text-[#94A3B8]">
         Press the unit number at the intercom, just like you normally would. Nothing different.
        </p>
       </div>
      </div>

      <div className="flex gap-6 items-start">
       <div className="flex-shrink-0 w-14 h-14 bg-[#5B8CFF] rounded-full flex items-center justify-center">
        <span className="text-2xl font-black text-white">2</span>
       </div>
       <div>
        <h3 className="text-2xl font-black text-white mb-2">Door Opens Automatically</h3>
        <p className="text-[#94A3B8]">
         BuzEntry answers in under 2 seconds and sends the unlock code. The door opens immediately.
        </p>
       </div>
      </div>

      <div className="flex gap-6 items-start">
       <div className="flex-shrink-0 w-14 h-14 bg-[#5B8CFF] rounded-full flex items-center justify-center">
        <span className="text-2xl font-black text-white">3</span>
       </div>
       <div>
        <h3 className="text-2xl font-black text-white mb-2">Walk In & Deliver</h3>
        <p className="text-[#94A3B8]">
         Enter the building and make your delivery. Move on to the next stop. That's it.
        </p>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Real Scenarios */}
   <section className="px-4 py-32 sm:px-6 lg:px-8">
    <div className="max-w-6xl mx-auto">
     <h2 className="text-4xl font-black text-white text-center mb-12 tracking-tight">
      Common Scenarios
     </h2>

     <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-gray-50 rounded-full border border-gray-300 p-8">
       <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
         <svg className="w-7 h-7 text-[#64748B]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
         </svg>
        </div>
        <div>
         <h3 className="text-xl font-black text-white mb-3">Without BuzEntry</h3>
         <ul className="space-y-2 text-[#94A3B8]">
          <li>• Buzz unit, wait 30-60 seconds</li>
          <li>• No answer? Try again</li>
          <li>• Still no answer? Leave slip, mark as attempted</li>
          <li>• Customer complains, calls for redelivery</li>
          <li>• Extra trip, wasted time</li>
         </ul>
        </div>
       </div>
      </div>

      <div className="bg-gradient-to-br from-[#5B8CFF]/5 to-[#5B8CFF]/10 rounded-full border-2 border-[#5B8CFF]/20 p-8">
       <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-[#5B8CFF] rounded-full flex items-center justify-center flex-shrink-0">
         <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
         </svg>
        </div>
        <div>
         <h3 className="text-xl font-black text-white mb-3">With BuzEntry</h3>
         <ul className="space-y-2 text-[#94A3B8]">
          <li>• Buzz unit once</li>
          <li>• Door opens in 2 seconds</li>
          <li>• Walk in, leave package</li>
          <li>• Customer gets notification</li>
          <li>• Move to next stop — done in under 60 seconds</li>
         </ul>
        </div>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* For Different Delivery Services */}
   <section className="px-4 py-32 sm:px-6 lg:px-8 bg-gradient-to-b from-[#11141B] to-[#0B0D12]">
    <div className="max-w-6xl mx-auto">
     <h2 className="text-4xl font-black text-white text-center mb-12 tracking-tight">
      Works With All Major Services
     </h2>

     <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gray-50 rounded-full border border-gray-300 p-8 text-center transition-shadow">
       <div className="w-16 h-16 bg-[#5B8CFF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-9 h-9 text-[#5B8CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
       </div>
       <h3 className="font-black text-white">Amazon</h3>
       <p className="text-sm text-[#64748B] mt-2">Prime & Flex deliveries</p>
      </div>

      <div className="bg-gray-50 rounded-full border border-gray-300 p-8 text-center transition-shadow">
       <div className="w-16 h-16 bg-[#5B8CFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-9 h-9 text-[#5B8CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
       </div>
       <h3 className="font-black text-white">UPS & FedEx</h3>
       <p className="text-sm text-[#64748B] mt-2">Standard & express</p>
      </div>

      <div className="bg-gray-50 rounded-full border border-gray-300 p-8 text-center transition-shadow">
       <div className="w-16 h-16 bg-[#5B8CFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-9 h-9 text-[#5B8CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
       </div>
       <h3 className="font-black text-white">DoorDash</h3>
       <p className="text-sm text-[#64748B] mt-2">Food & retail delivery</p>
      </div>

      <div className="bg-gray-50 rounded-full border border-gray-300 p-8 text-center transition-shadow">
       <div className="w-16 h-16 bg-[#5B8CFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-9 h-9 text-[#5B8CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
       </div>
       <h3 className="font-black text-white">Uber Eats</h3>
       <p className="text-sm text-[#64748B] mt-2">Restaurant deliveries</p>
      </div>
     </div>

     <p className="text-center text-[#94A3B8] mt-10 text-lg">
      And many more — if you buzz an intercom, BuzEntry works for you.
     </p>
    </div>
   </section>

   {/* FAQ */}
   <section className="px-4 py-32 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
     <h2 className="text-4xl font-black text-white text-center mb-12 tracking-tight">
      Driver FAQs
     </h2>

     <div className="space-y-6">
      <div className="border-b border-gray-300 pb-6">
       <h3 className="text-xl font-black text-white mb-2">
        Do I need to do anything different?
       </h3>
       <p className="text-[#94A3B8]">
        No! Just buzz the unit like normal. BuzEntry works in the background — you won't even know it's there until the door opens instantly.
       </p>
      </div>

      <div className="border-b border-gray-300 pb-6">
       <h3 className="text-xl font-black text-white mb-2">
        What if the resident has a PIN enabled?
       </h3>
       <p className="text-[#94A3B8]">
        You might hear an automated voice asking for a code. If you don't know the PIN, the resident probably wants to screen visitors. Try buzzing again or leave a delivery notice.
       </p>
      </div>

      <div className="border-b border-gray-300 pb-6">
       <h3 className="text-xl font-black text-white mb-2">
        How fast does it actually work?
       </h3>
       <p className="text-[#94A3B8]">
        Under 2 seconds from when you buzz. BuzEntry answers faster than most people can pick up their phone.
       </p>
      </div>

      <div className="pb-6">
       <h3 className="text-xl font-black text-white mb-2">
        Does this work at all apartment buildings?
       </h3>
       <p className="text-[#94A3B8]">
        BuzEntry works with any phone-based intercom system (DTMF). That covers most apartment buildings. If a building uses a video-only system or app-based entry, BuzEntry won't be active there.
       </p>
      </div>
     </div>
    </div>
   </section>

   {/* CTA */}
   <section className="px-4 py-32 sm:px-6 lg:px-8 bg-gradient-to-b from-[#11141B] to-[#0B0D12] text-center">
    <div className="max-w-3xl mx-auto">
     <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
      Want BuzEntry at Your Building?
     </h2>
     <p className="text-xl text-[#94A3B8] mb-8">
      Tell your apartment dwellers about BuzEntry. Faster deliveries mean happier customers and better ratings for you.
     </p>
     <Link
      href="/"
      className="inline-block bg-[#5B8CFF] text-white px-8 py-3.5 rounded-full text-lg font-black hover:bg-[#4A7AE8] transition-all hover:scale-105 h-14"
     >
      Learn More About BuzEntry
     </Link>
    </div>
   </section>

   {/* Footer */}
   <footer className="border-t border-gray-300 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-[#64748B] text-sm">© 2025 BuzEntry. All rights reserved.</p>
      <div className="flex gap-6 text-sm">
       <Link href="/terms" className="text-[#64748B] hover:text-[#94A3B8]">Terms</Link>
       <Link href="/privacy" className="text-[#64748B] hover:text-[#94A3B8]">Privacy</Link>
       <Link href="/security" className="text-[#64748B] hover:text-[#94A3B8]">Security</Link>
       <Link href="/how-it-works" className="text-[#64748B] hover:text-[#94A3B8]">How It Works</Link>
      </div>
     </div>
    </div>
   </footer>
  </div>
 );
}
