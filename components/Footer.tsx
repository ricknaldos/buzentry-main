import Link from 'next/link';

export default function Footer() {
 return (
  <footer className="px-4 py-12 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-300 text-gray-600">
   <div className="max-w-6xl mx-auto">
    <div className="grid md:grid-cols-4 gap-8 mb-8">
     <div>
      <h4 className="text-gray-900 font-bold text-lg mb-4">BuzEntry</h4>
      <p className="text-sm">Making apartment living effortless, one automated door at a time.</p>
     </div>
     <div>
      <h5 className="text-gray-900 font-semibold mb-4">Product</h5>
      <ul className="space-y-2 text-sm">
       <li><Link href="/#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</Link></li>
       <li><Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link></li>
       <li><Link href="/#faq" className="hover:text-gray-900 transition-colors">FAQ</Link></li>
       <li><Link href="/about" className="hover:text-gray-900 transition-colors">About</Link></li>
      </ul>
     </div>
     <div>
      <h5 className="text-gray-900 font-semibold mb-4">Account</h5>
      <ul className="space-y-2 text-sm">
       <li><Link href="/manage" className="hover:text-gray-900 transition-colors">Manage Subscription</Link></li>
       <li><a href="mailto:support@buzentry.com" className="hover:text-gray-900 transition-colors">Contact</a></li>
      </ul>
     </div>
     <div>
      <h5 className="text-gray-900 font-semibold mb-4">Legal</h5>
      <ul className="space-y-2 text-sm">
       <li><Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
       <li><Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link></li>
       <li><Link href="/refund" className="hover:text-gray-900 transition-colors">Refund Policy</Link></li>
      </ul>
     </div>
    </div>
    <div className="pt-8 border-t border-gray-300 text-center text-sm">
     <p>&copy; 2025 BuzEntry. All rights reserved.</p>
    </div>
   </div>
  </footer>
 );
}
