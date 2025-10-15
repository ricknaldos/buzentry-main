import Link from 'next/link';

export default function Support() {
 return (
  <div className="min-h-screen bg-white">
   {/* Header */}
   <header className="px-4 py-8 sm:px-6 lg:px-8 border-b border-gray-300">
    <div className="max-w-4xl mx-auto">
     <Link href="/" className="inline-block">
      <h1 className="text-3xl font-black tracking-tighter">
       <span className="text-gray-900">Buz</span>
       <span className="text-[#5B8CFF]">Entry</span>
      </h1>
     </Link>
    </div>
   </header>

   {/* Content */}
   <main className="px-4 py-16 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8 tracking-tight">
     Support
    </h1>

    <div className="space-y-8 text-[#94A3B8] leading-relaxed">
     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">We&apos;re Here to Help</h2>
      <p>
       Have a question, issue, or feedback? Our support team is here to help you get the most out of BuzEntry. We typically respond within 24 hours, and often much faster.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Contact Us</h2>
      <div className="bg-[#5B8CFF]/10 border-2 border-[#5B8CFF]/20 rounded-2xl p-6">
       <p className="text-[#94A3B8] mb-3">
        For all support inquiries, please email us at:
       </p>
       <a
        href="mailto:support@buzentry.com"
        className="text-2xl font-bold text-[#5B8CFF] hover:text-[#4A7AEF] transition-colors"
       >
        support@buzentry.com
       </a>
       <p className="text-sm text-[#64748B] mt-4">
        Average response time: Under 24 hours
       </p>
      </div>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">What to Include in Your Email</h2>
      <p className="mb-4">
       To help us assist you quickly, please include:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>Your account email address</li>
       <li>A detailed description of your issue or question</li>
       <li>Any error messages you&apos;ve received</li>
       <li>Screenshots if applicable</li>
       <li>The best time to reach you if we need to follow up</li>
      </ul>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Common Support Topics</h2>
      <div className="space-y-4">
       <div className="bg-gray-50 border border-gray-300 rounded-full p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Setup & Configuration</h3>
        <p className="text-sm text-[#94A3B8]">
         Having trouble setting up your account or configuring your unlock code? We&apos;ll walk you through the process step by step.
        </p>
       </div>

       <div className="bg-gray-50 border border-gray-300 rounded-full p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Billing & Subscription</h3>
        <p className="text-sm text-[#94A3B8]">
         Questions about your subscription, billing, refunds, or cancellation? We&apos;ll help you manage your account and answer any payment-related questions.
        </p>
       </div>

       <div className="bg-gray-50 border border-gray-300 rounded-full p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Technical Issues</h3>
        <p className="text-sm text-[#94A3B8]">
         BuzEntry not working as expected? Calls not being answered? Let us know and we&apos;ll troubleshoot the issue right away.
        </p>
       </div>

       <div className="bg-gray-50 border border-gray-300 rounded-full p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Compatibility</h3>
        <p className="text-sm text-[#94A3B8]">
         Not sure if BuzEntry works with your building&apos;s buzzer system? We can help you determine compatibility and suggest alternatives if needed.
        </p>
       </div>

       <div className="bg-gray-50 border border-gray-300 rounded-full p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Account Management</h3>
        <p className="text-sm text-[#94A3B8]">
         Need to update your settings, change your unlock code, or modify your account details? We&apos;ll guide you through making changes.
        </p>
       </div>
      </div>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Quick Links</h2>
      <div className="space-y-3">
       <div>
        <Link href="/privacy" className="text-[#5B8CFF] hover:text-[#4A7AEF] transition-colors font-medium">
         Privacy Policy →
        </Link>
        <p className="text-sm text-[#94A3B8] mt-1">Learn how we protect your data</p>
       </div>

       <div>
        <Link href="/terms" className="text-[#5B8CFF] hover:text-[#4A7AEF] transition-colors font-medium">
         Terms of Service →
        </Link>
        <p className="text-sm text-[#94A3B8] mt-1">Read our terms and conditions</p>
       </div>

       <div>
        <Link href="/refund" className="text-[#5B8CFF] hover:text-[#4A7AEF] transition-colors font-medium">
         Refund Policy →
        </Link>
        <p className="text-sm text-[#94A3B8] mt-1">30-day money-back guarantee details</p>
       </div>

       <div>
        <Link href="/manage" className="text-[#5B8CFF] hover:text-[#4A7AEF] transition-colors font-medium">
         Manage Subscription →
        </Link>
        <p className="text-sm text-[#94A3B8] mt-1">Update or cancel your subscription</p>
       </div>
      </div>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
      <div className="space-y-4">
       <div>
        <h3 className="font-bold text-gray-900 mb-2">How quickly does BuzEntry answer calls?</h3>
        <p className="text-[#94A3B8]">BuzEntry answers buzzer calls within 2 seconds on average, faster than most people can reach their phone.</p>
       </div>

       <div>
        <h3 className="font-bold text-gray-900 mb-2">Can I pause the service temporarily?</h3>
        <p className="text-[#94A3B8]">Yes! Contact us at support@buzentry.com and we can temporarily pause your service while maintaining your account.</p>
       </div>

       <div>
        <h3 className="font-bold text-gray-900 mb-2">What if BuzEntry doesn&apos;t work with my building?</h3>
        <p className="text-[#94A3B8]">We offer a 30-day money-back guarantee. If BuzEntry doesn&apos;t work with your building&apos;s system, you&apos;ll get a full refund—no questions asked.</p>
       </div>

       <div>
        <h3 className="font-bold text-gray-900 mb-2">How do I change my unlock code?</h3>
        <p className="text-[#94A3B8]">You can update your unlock code anytime from your account dashboard. If you need help, email us at support@buzentry.com.</p>
       </div>
      </div>
     </section>

     <section className="bg-gray-50 border border-gray-300 rounded-2xl p-8">
      <h2 className="text-2xl font-black text-gray-900 mb-4">Still Have Questions?</h2>
      <p className="mb-4">
       Don&apos;t hesitate to reach out! Whether it&apos;s a technical issue, billing question, or general inquiry, we&apos;re here to help make your BuzEntry experience as smooth as possible.
      </p>
      <a
       href="mailto:support@buzentry.com"
       className="inline-block bg-[#5B8CFF] text-white px-5 py-2.5 rounded-full text-base font-bold hover:bg-[#4A7AEF] hover:scale-105 active:scale-95 transition-colors h-10"
      >
       Email Support
      </a>
     </section>
    </div>

    <div className="mt-16 pt-8 border-t border-gray-300">
     <Link
      href="/"
      className="inline-block text-[#5B8CFF] hover:text-[#4A7AEF] transition-colors font-semibold"
     >
      ← Back to home
     </Link>
    </div>
   </main>

   {/* Footer */}
   <footer className="px-4 py-12 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-300 text-[#94A3B8]">
    <div className="max-w-6xl mx-auto text-center text-sm">
     <p>&copy; 2025 BuzEntry. All rights reserved.</p>
    </div>
   </footer>
  </div>
 );
}
