'use client';

import Link from 'next/link';
import MarketingHeader from '@/components/MarketingHeader';

// Sample blog posts - in production, this would come from a CMS or database
const blogPosts = [
 {
  slug: 'never-miss-delivery-again',
  title: 'Never Miss a Delivery Again: The Future of Apartment Living',
  excerpt: 'How BuzEntry is solving the #1 frustration of apartment dwellers everywhere.',
  date: 'October 15, 2025',
  author: 'Ricardo',
  category: 'Product',
  readTime: '4 min read',
 },
 {
  slug: 'how-buzentry-works',
  title: 'Under the Hood: How BuzEntry Answers Your Door in 2 Seconds',
  excerpt: 'A technical deep-dive into the DTMF signaling and automation that powers BuzEntry.',
  date: 'October 10, 2025',
  author: 'Russell',
  category: 'Technical',
  readTime: '6 min read',
 },
 {
  slug: 'security-first-approach',
  title: 'Why Security Matters: Our Approach to Protecting Your Home',
  excerpt: 'Learn about optional PINs, rate limiting, and our no-audio-recording policy.',
  date: 'October 5, 2025',
  author: 'Ricardo',
  category: 'Security',
  readTime: '5 min read',
 },
];

export default function BlogPage() {
 return (
  <div className="min-h-screen bg-white">
   {/* Header */}
   <MarketingHeader />

   {/* Hero */}
   <section className="px-4 pt-16 pb-12 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
    <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">
     BuzEntry Blog
    </h1>
    <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
     Stories, updates, and insights about making apartment living better.
    </p>
   </section>

   {/* Blog Posts */}
   <section className="px-4 pb-20 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <div className="space-y-12">
     {blogPosts.map((post) => (
      <article
       key={post.slug}
       className="border-b border-gray-300 pb-12 last:border-b-0"
      >
       <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 bg-[#5B8CFF]/10 text-[#5B8CFF] text-xs font-bold rounded-full">
         {post.category}
        </span>
        <span className="text-sm text-[#64748B]">{post.date}</span>
        <span className="text-sm text-[#64748B]">•</span>
        <span className="text-sm text-[#64748B]">{post.readTime}</span>
       </div>

       <Link href={`/blog/${post.slug}`}>
        <h2 className="text-3xl font-black text-white mb-3 hover:text-[#5B8CFF] transition-colors">
         {post.title}
        </h2>
       </Link>

       <p className="text-[#94A3B8] text-lg mb-4 leading-relaxed">
        {post.excerpt}
       </p>

       <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
         <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-[#94A3B8]">
           {post.author[0]}
          </span>
         </div>
         <span className="text-sm font-medium text-white">{post.author}</span>
        </div>

        <Link
         href={`/blog/${post.slug}`}
         className="text-[#5B8CFF] hover:text-[#4A7AE8] font-bold text-sm transition-colors"
        >
         Read article →
        </Link>
       </div>
      </article>
     ))}
    </div>

    {/* Coming Soon Notice */}
    <div className="mt-16 text-center p-8 bg-gray-50 rounded-full border border-gray-300">
     <svg className="w-12 h-12 text-[#64748B] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
     </svg>
     <h3 className="text-lg font-bold text-white mb-2">More Articles Coming Soon</h3>
     <p className="text-[#94A3B8] mb-4">
      We're working on more helpful content about apartment living, smart home automation, and security best practices.
     </p>
     <Link
      href="/"
      className="inline-block text-[#5B8CFF] hover:text-[#4A7AE8] font-bold transition-colors"
     >
      Try BuzEntry Today →
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
