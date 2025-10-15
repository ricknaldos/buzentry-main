import Link from 'next/link';
import MarketingHeader from '@/components/MarketingHeader';
import Footer from '@/components/Footer';

export default function Privacy() {
 return (
  <div className="min-h-screen bg-white">
   {/* Header */}
   <MarketingHeader />

   {/* Content */}
   <main className="px-4 py-16 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8 tracking-tight">
     Privacy Policy
    </h1>

    <div className="space-y-8 text-gray-600 leading-relaxed">
     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Overview</h2>
      <p>
       At BuzEntry, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our automatic buzzer answering service.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Information We Collect</h2>
      <p className="mb-4">We collect the following information to provide our service:</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>Your email address for account management and billing</li>
       <li>Your phone number for forwarding buzzer calls</li>
       <li>Your unlock code to automatically open your door</li>
       <li>Call metadata (time, duration) to ensure service quality</li>
       <li>Payment information processed securely through Stripe</li>
      </ul>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">How We Use Your Information</h2>
      <p className="mb-4">We use your information to:</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>Provide and maintain the BuzEntry service</li>
       <li>Process your subscription payments</li>
       <li>Send you service notifications and updates</li>
       <li>Respond to your support requests</li>
       <li>Improve and optimize our service</li>
      </ul>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Data Security</h2>
      <p>
       We implement bank-level encryption to protect your data. We never store call recordings. All payment information is processed securely through Stripe and never stored on our servers.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Data Sharing</h2>
      <p className="mb-4">
       We do not sell, rent, or share your personal information with third parties except:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>With service providers (Stripe for payments, Vercel for hosting)</li>
       <li>When required by law or legal process</li>
       <li>To protect our rights or the safety of our users</li>
      </ul>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Your Rights</h2>
      <p className="mb-4">You have the right to:</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>Access your personal data</li>
       <li>Request correction of inaccurate data</li>
       <li>Request deletion of your account and data</li>
       <li>Opt out of marketing communications</li>
       <li>Export your data</li>
      </ul>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Data Retention</h2>
      <p>
       We retain your information for as long as your account is active. If you cancel your subscription, we will delete your data within 30 days, except where required by law to retain certain information.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Cookies</h2>
      <p>
       We use essential cookies to maintain your session and provide our service. We also use analytics cookies to improve our service. You can disable non-essential cookies through your browser settings.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Changes to This Policy</h2>
      <p>
       We may update this privacy policy from time to time. We will notify you of any material changes by email or through our service.
      </p>
     </section>

     <section>
      <h2 className="text-2xl font-black text-gray-900 mb-4">Contact Us</h2>
      <p>
       If you have any questions about this privacy policy or your personal data, please contact us at{' '}
       <a href="mailto:support@buzentry.com" className="text-[#155dfb] hover:text-[#155dfb]/80 transition-colors">
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
