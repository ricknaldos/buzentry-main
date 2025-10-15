import Link from 'next/link';
import MarketingHeader from '@/components/MarketingHeader';
import Footer from '@/components/Footer';

export default function Refund() {
 return (
  <div className="min-h-screen bg-white">
   {/* Header */}
   <MarketingHeader />

   {/* Content */}
   <main className="px-4 py-16 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8 tracking-tight">
     Refund Policy
    </h1>

    <div className="space-y-8 text-gray-600 leading-relaxed">
     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Our Commitment</h2>
      <p>
       At BuzEntry, we stand behind our service with a simple, transparent refund policy. We want you to be completely satisfied with your experience.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">30-Day Money-Back Guarantee</h2>
      <p className="mb-4">
       If you&apos;re not completely satisfied with BuzEntry within the first 30 days of your subscription, we&apos;ll issue a full refund—no questions asked.
      </p>
      <p className="mb-4">
       This applies to any reason, including:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>BuzEntry doesn&apos;t work with your building&apos;s buzzer system</li>
       <li>You&apos;re not satisfied with the service performance</li>
       <li>You changed your mind about needing the service</li>
       <li>Any other reason—we don&apos;t ask why</li>
      </ul>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">How to Request a Refund</h2>
      <p className="mb-4">
       Getting a refund is simple:
      </p>
      <ol className="list-decimal list-inside space-y-2 ml-4">
       <li>Email us at{' '}
        <a href="mailto:support@buzentry.com" className="text-[#155dfb] hover:text-[#155dfb]/80 transition-colors">
         support@buzentry.com
        </a>
       </li>
       <li>Include your account email address in the message</li>
       <li>We&apos;ll process your refund within 2-3 business days</li>
       <li>The refund will appear on your original payment method within 5-10 business days</li>
      </ol>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">After the 30-Day Period</h2>
      <p className="mb-4">
       After the first 30 days, refunds are handled on a case-by-case basis at our discretion. We may offer refunds for:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>Extended service outages caused by BuzEntry</li>
       <li>Billing errors or double charges</li>
       <li>Other exceptional circumstances</li>
      </ul>
      <p className="mt-4">
       Please note that we cannot offer refunds for partial months after the 30-day guarantee period.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Cancellation Without Refund</h2>
      <p>
       You can cancel your subscription at any time from your account dashboard. When you cancel:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
       <li>Your subscription will remain active until the end of your current billing period</li>
       <li>You won&apos;t be charged again</li>
       <li>You&apos;ll continue to have access to BuzEntry until the period ends</li>
       <li>No refund is provided for the remaining days in your billing cycle</li>
      </ul>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Billing Issues</h2>
      <p>
       If you notice any billing errors, unauthorized charges, or have been charged after canceling, please contact us immediately at{' '}
       <a href="mailto:support@buzentry.com" className="text-[#155dfb] hover:text-[#155dfb]/80 transition-colors">
        support@buzentry.com
       </a>
       . We&apos;ll investigate and resolve the issue promptly.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Service Credits</h2>
      <p>
       In some cases, instead of a refund, we may offer service credits for future months. This is typically offered when:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
       <li>There was a temporary service disruption</li>
       <li>You experienced technical issues that we&apos;ve now resolved</li>
       <li>You&apos;d prefer to continue using BuzEntry with compensation</li>
      </ul>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Questions About Refunds?</h2>
      <p>
       If you have any questions about our refund policy or need to request a refund, please don&apos;t hesitate to contact us at{' '}
       <a href="mailto:support@buzentry.com" className="text-[#155dfb] hover:text-[#155dfb]/80 transition-colors">
        support@buzentry.com
       </a>
       . Our support team is here to help.
      </p>
     </section>

     <section className="pt-8 text-sm text-gray-600">
      <p>Last updated: October 13, 2025</p>
     </section>
    </div>

    <div className="mt-16 pt-8 border-t border-gray-300">
     <Link
      href="/"
      className="inline-block text-[#155dfb] hover:text-[#155dfb]/80 transition-colors font-bold"
     >
      ← Back to home
     </Link>
    </div>
   </main>

   {/* Footer */}
   <Footer />
  </div>
 );
}
