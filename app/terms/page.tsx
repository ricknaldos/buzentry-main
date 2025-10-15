import Link from 'next/link';
import MarketingHeader from '@/components/MarketingHeader';
import Footer from '@/components/Footer';

export default function Terms() {
 return (
  <div className="min-h-screen bg-white">
   {/* Header */}
   <MarketingHeader />

   {/* Content */}
   <main className="px-4 py-16 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8 tracking-tight">
     Terms of Service
    </h1>

    <div className="space-y-8 text-gray-600 leading-relaxed">
     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Agreement to Terms</h2>
      <p>
       By using BuzEntry, you agree to these terms of service. If you don&apos;t agree to these terms, please don&apos;t use our service.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Service Description</h2>
      <p>
       BuzEntry provides an automatic buzzer answering service for apartment buildings. When someone buzzes your unit, we answer the call within 2 seconds and automatically enter your unlock code to open the door.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Subscription and Billing</h2>
      <p className="mb-4">
       BuzEntry is a subscription service billed monthly at $6.99/month. By subscribing, you agree to:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>Automatic monthly billing to your payment method</li>
       <li>The subscription continues until you cancel</li>
       <li>No refunds for partial months after the 30-day money-back period</li>
       <li>We may change pricing with 30 days notice</li>
      </ul>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">30-Day Money-Back Guarantee</h2>
      <p>
       If you&apos;re not satisfied with BuzEntry for any reason within the first 30 days, we&apos;ll issue a full refund. No questions asked. After 30 days, refunds are at our discretion.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Cancellation</h2>
      <p>
       You can cancel your subscription at any time from your account dashboard. Cancellation takes effect at the end of your current billing period. You&apos;ll continue to have access until then.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Service Availability</h2>
      <p className="mb-4">
       While we strive for 99.9% uptime, we cannot guarantee uninterrupted service. We are not liable for:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>Service interruptions due to maintenance or technical issues</li>
       <li>Incompatibility with certain buzzer systems</li>
       <li>Phone network or carrier issues</li>
       <li>Building system changes that affect compatibility</li>
      </ul>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Your Responsibilities</h2>
      <p className="mb-4">You agree to:</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>Provide accurate account information</li>
       <li>Keep your unlock code and account details secure</li>
       <li>Notify us of any unauthorized use of your account</li>
       <li>Use the service only for your personal apartment unit</li>
       <li>Comply with your building&apos;s rules and regulations</li>
       <li>Not share your account with others</li>
      </ul>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Prohibited Uses</h2>
      <p className="mb-4">You may not:</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>Use the service for unauthorized access to buildings</li>
       <li>Violate any laws or regulations</li>
       <li>Interfere with or disrupt the service</li>
       <li>Attempt to reverse engineer or hack the service</li>
       <li>Resell or redistribute the service</li>
      </ul>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Liability Limitations</h2>
      <p>
       BuzEntry is provided &quot;as is&quot; without warranties. We are not liable for any damages arising from your use of the service, including but not limited to missed deliveries, unauthorized building access, or security issues.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Account Termination</h2>
      <p>
       We reserve the right to suspend or terminate your account if you violate these terms or misuse the service. In case of termination for cause, no refund will be provided.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Privacy</h2>
      <p>
       Your use of BuzEntry is also governed by our{' '}
       <Link href="/privacy" className="text-[#155dfb] hover:text-[#155dfb]/80 transition-colors font-medium">
        Privacy Policy
       </Link>
       . We never store call recordings and protect your data with bank-level encryption.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Changes to Terms</h2>
      <p>
       We may update these terms from time to time. We&apos;ll notify you of material changes by email. Continued use of the service after changes means you accept the new terms.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Governing Law</h2>
      <p>
       These terms are governed by the laws of the United States. Any disputes will be resolved in the courts of the jurisdiction where BuzEntry is registered.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Contact</h2>
      <p>
       Questions about these terms? Contact us at{' '}
       <a href="mailto:support@buzentry.com" className="text-[#155dfb] hover:text-[#155dfb]/80 transition-colors font-medium">
        support@buzentry.com
       </a>
      </p>
     </section>

     <section className="pt-8 text-sm text-gray-600">
      <p>Last updated: October 12, 2025</p>
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
