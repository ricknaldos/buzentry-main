'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import MarketingHeader from '@/components/MarketingHeader';

// Sample blog posts data - in production, this would come from a CMS or database
const blogPosts: Record<string, {
 title: string;
 date: string;
 author: string;
 category: string;
 readTime: string;
 content: string;
}> = {
 'never-miss-delivery-again': {
  title: 'Never Miss a Delivery Again: The Future of Apartment Living',
  date: 'October 15, 2025',
  author: 'Ricardo',
  category: 'Product',
  readTime: '4 min read',
  content: `
   <p>If you've ever lived in an apartment building, you know the frustration: you're home, waiting for a package, but somehow you miss the buzzer. Maybe you were in the shower, on a Zoom call, or your phone was on silent. By the time you check, there's a delivery notice on your door and your package is gone.</p>

   <p>This happens millions of times every day across apartment buildings in major cities. It's not just an inconvenience—it's a design flaw in how apartment intercoms work.</p>

   <h2>The Problem with Traditional Intercoms</h2>

   <p>Traditional apartment intercoms were designed in an era when people were always home. The system is simple: someone buzzes your unit, your phone rings, you press a button to unlock. Easy, right?</p>

   <p>But in 2025, we live very different lives. We work from home with headphones on. We go to the gym. We're in meetings. We have our phones on Do Not Disturb. The traditional intercom system hasn't adapted to how we actually live today.</p>

   <h2>The Solution: Automated Door Unlocking</h2>

   <p>That's why we built BuzEntry. The concept is simple: when someone buzzes your apartment, BuzEntry answers the call in under 2 seconds and automatically sends the unlock code to open the door. No phone calls, no scrambling to find your device, no missed deliveries.</p>

   <p>Here's how it works:</p>

   <ol>
    <li>Sign up and get your dedicated phone number</li>
    <li>Give that number to your building manager to program into the intercom directory</li>
    <li>Configure your door code (usually just "9" or "1")</li>
    <li>That's it—you're done</li>
   </ol>

   <h2>But What About Security?</h2>

   <p>The most common question we get: "Won't this let anyone into my building?"</p>

   <p>Fair concern. That's why BuzEntry includes optional security features:</p>

   <ul>
    <li><strong>4-Digit PIN:</strong> Visitors must enter a PIN code before the door unlocks</li>
    <li><strong>Rate Limiting:</strong> After 5 wrong attempts, the caller is blocked for 15 minutes</li>
    <li><strong>Activity Logs:</strong> See exactly who unlocked your door and when</li>
    <li><strong>Quick Pause:</strong> Need to screen a visitor? Pause auto-unlock with one tap</li>
   </ul>

   <h2>Real Results</h2>

   <p>Since launching, BuzEntry users have unlocked their doors over 10,000 times—every single one of them without having to drop what they were doing to answer a buzzer. The average response time? 1.8 seconds.</p>

   <p>One user told us: "I used to miss 2-3 deliveries a week. Now I get everything on the first try. It's like having a doorman without paying doorman prices."</p>

   <h2>Try It Risk-Free</h2>

   <p>We offer a 30-day money-back guarantee—no questions asked. If BuzEntry doesn't work with your building's intercom (rare, but it happens) or you're not satisfied for any reason, we'll refund you immediately.</p>

   <p>Ready to never miss another delivery? <a href="/" class="text-[#A26BFF] hover:text-[#8E56EF] font-bold">Get started with BuzEntry</a>.</p>
  `,
 },
 'how-buzentry-works': {
  title: 'Under the Hood: How BuzEntry Answers Your Door in 2 Seconds',
  date: 'October 10, 2025',
  author: 'Russell',
  category: 'Technical',
  readTime: '6 min read',
  content: `
   <p>Ever wondered how BuzEntry can answer your intercom and unlock your door faster than you can pick up your phone? Let's dive into the technical architecture that makes this possible.</p>

   <h2>The Challenge</h2>

   <p>Building intercoms use DTMF (Dual-Tone Multi-Frequency) signaling—the same technology behind touch-tone phones. When you press "9" on an intercom, it sends two specific audio frequencies down the phone line that tell the lock mechanism to disengage.</p>

   <p>Our challenge: intercept the incoming call, process it, and send the unlock signal—all in under 2 seconds. Here's how we do it.</p>

   <h2>Architecture Overview</h2>

   <p>When someone buzzes your unit, here's what happens behind the scenes:</p>

   <ol>
    <li><strong>Call Detection:</strong> Your building's intercom calls your BuzEntry phone number</li>
    <li><strong>Instant Answer:</strong> Our telephony system answers within 500ms</li>
    <li><strong>User Lookup:</strong> We identify which user owns this number and fetch their settings</li>
    <li><strong>Security Check:</strong> If you have a PIN enabled, we prompt the caller to enter it</li>
    <li><strong>DTMF Transmission:</strong> We send your configured door code (e.g., "9")</li>
    <li><strong>Confirmation:</strong> The door unlocks and we log the event</li>
   </ol>

   <h2>The Technology Stack</h2>

   <p>BuzEntry is built on modern cloud infrastructure for reliability and speed:</p>

   <ul>
    <li><strong>Telephony:</strong> SignalWire for PSTN connectivity and DTMF handling</li>
    <li><strong>Backend:</strong> Next.js API routes hosted on Vercel Edge Functions (sub-50ms response times)</li>
    <li><strong>Database:</strong> Vercel KV (Redis) for lightning-fast user lookups</li>
    <li><strong>Authentication:</strong> NextAuth.js with secure session management</li>
    <li><strong>Payments:</strong> Stripe for subscription billing</li>
   </ul>

   <h2>Handling Edge Cases</h2>

   <p>Building a reliable telephony system means accounting for dozens of edge cases:</p>

   <h3>1. Network Latency</h3>
   <p>We use edge functions deployed globally to minimize latency. Most users are served from data centers within 20ms of their location.</p>

   <h3>2. Failed PIN Attempts</h3>
   <p>After 3 wrong PIN attempts, we give helpful feedback: "Incorrect PIN. 2 attempts remaining." After 5 attempts, we block the caller for 15 minutes and send you a security alert.</p>

   <h3>3. Intercom Compatibility</h3>
   <p>Different intercom systems expect different DTMF duration and pause lengths. We've tested with 50+ systems and auto-detect the optimal settings.</p>

   <h2>Security Considerations</h2>

   <p>We take security seriously:</p>

   <ul>
    <li><strong>No Audio Recording:</strong> We never record or store call audio—only metadata</li>
    <li><strong>Encrypted Storage:</strong> Door codes and PINs are encrypted at rest using AES-256</li>
    <li><strong>Rate Limiting:</strong> Built-in protection against brute force attacks</li>
    <li><strong>Audit Logs:</strong> Every unlock attempt is logged with timestamp and outcome</li>
   </ul>

   <h2>Future Enhancements</h2>

   <p>We're constantly improving. On our roadmap:</p>

   <ul>
    <li>ML-based anomaly detection for suspicious activity</li>
    <li>Video intercom support</li>
    <li>Smart home integrations (e.g., auto-disable when you're away)</li>
    <li>Multi-tenant buildings support</li>
   </ul>

   <p>Want to see it in action? <a href="/" class="text-[#A26BFF] hover:text-[#8E56EF] font-bold">Try BuzEntry free for 30 days</a>.</p>
  `,
 },
 'security-first-approach': {
  title: 'Why Security Matters: Our Approach to Protecting Your Home',
  date: 'October 5, 2025',
  author: 'Ricardo',
  category: 'Security',
  readTime: '5 min read',
  content: `
   <p>Automating your door unlock might sound convenient, but the first question most people ask is: "Is this safe?"</p>

   <p>It's a valid concern. You're giving software control over physical access to your building. That's a big deal. Here's our comprehensive approach to security.</p>

   <h2>Layer 1: Optional PIN Protection</h2>

   <p>BuzEntry supports an optional 4-digit PIN that visitors must enter before your door unlocks. This means:</p>

   <ul>
    <li>Only people with your PIN can enter</li>
    <li>You can share different PINs with different people (delivery drivers, guests, cleaners)</li>
    <li>You can change your PIN anytime</li>
    <li>You get alerts for wrong PIN attempts</li>
   </ul>

   <p>Many users don't enable a PIN—they prefer the convenience of automatic unlock for all visitors. Others use it religiously. The choice is yours.</p>

   <h2>Layer 2: Rate Limiting</h2>

   <p>Even without a PIN, BuzEntry has built-in protection against brute force attacks:</p>

   <ul>
    <li>Maximum 5 unlock attempts per phone number per 15-minute window</li>
    <li>After 5 attempts, the caller is blocked temporarily</li>
    <li>You receive an immediate security alert</li>
    <li>Suspicious patterns are flagged in your activity log</li>
   </ul>

   <h2>Layer 3: Activity Logging</h2>

   <p>Full transparency: every unlock attempt is logged with:</p>

   <ul>
    <li>Timestamp (exact time the buzzer was pressed)</li>
    <li>Outcome (successful unlock, wrong PIN, denied, etc.)</li>
    <li>Number of retry attempts</li>
    <li>Which passcode was used (if you have guest codes)</li>
   </ul>

   <p>You can review your activity history anytime from your dashboard. This creates an audit trail if anything suspicious happens.</p>

   <h2>Layer 4: Quick Pause</h2>

   <p>Need to screen an unexpected visitor? You can pause BuzEntry with one tap from your dashboard:</p>

   <ul>
    <li>Instant toggle—takes effect immediately</li>
    <li>Option to forward calls to your phone instead</li>
    <li>Resume anytime</li>
   </ul>

   <p>Perfect for when you want full control over who enters.</p>

   <h2>What We DON'T Do</h2>

   <p>Just as important as what security we provide is what we explicitly <em>don't</em> do:</p>

   <ul>
    <li><strong>We never record audio.</strong> BuzEntry only handles DTMF signaling (button tones). We never capture, store, or process voice conversations.</li>
    <li><strong>We don't track your location.</strong> We have no idea when you're home or away (unless you tell us via the pause feature).</li>
    <li><strong>We don't sell your data.</strong> Your unlock history is yours and yours alone. We never share it with third parties.</li>
   </ul>

   <h2>Data Protection</h2>

   <p>All data is encrypted both in transit (TLS 1.3) and at rest (AES-256). Your door codes and PINs are never stored in plain text. Even if our database were compromised, attackers wouldn't be able to read your sensitive settings.</p>

   <h2>Responsible Disclosure</h2>

   <p>If you discover a security vulnerability, we want to know about it. Email us at security@buzentry.com and we'll respond within 24 hours. We offer rewards for valid security reports.</p>

   <h2>The Bottom Line</h2>

   <p>No system is perfectly secure. But BuzEntry is designed with multiple layers of protection, full transparency, and user control at every step. We believe security and convenience don't have to be trade-offs.</p>

   <p>Want to learn more? Check out our <a href="/security" class="text-[#A26BFF] hover:text-[#8E56EF] font-bold">detailed security documentation</a>.</p>
  `,
 },
};

export default function BlogPost() {
 const params = useParams();
 const slug = params.slug as string;
 const post = blogPosts[slug];

 if (!post) {
  return (
   <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
     <h1 className="text-4xl font-black text-white mb-4">Post Not Found</h1>
     <p className="text-[#94A3B8] mb-6">This blog post doesn't exist yet.</p>
     <Link href="/blog" className="text-[#5B8CFF] hover:text-[#4A7AE8] font-bold">
      ← Back to Blog
     </Link>
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-white">
   {/* Header */}
   <MarketingHeader />

   {/* Article */}
   <article className="px-4 py-16 sm:px-6 lg:px-8 max-w-3xl mx-auto">
    {/* Back to Blog */}
    <Link href="/blog" className="inline-flex items-center text-[#5B8CFF] hover:text-[#4A7AE8] font-bold mb-8 transition-colors">
     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
     </svg>
     Back to Blog
    </Link>

    {/* Meta */}
    <div className="flex items-center gap-3 mb-6">
     <span className="px-3 py-1 bg-[#5B8CFF]/10 text-[#5B8CFF] text-xs font-semibold rounded-full">
      {post.category}
     </span>
     <span className="text-sm text-[#64748B]">{post.date}</span>
     <span className="text-sm text-[#64748B]">•</span>
     <span className="text-sm text-[#64748B]">{post.readTime}</span>
    </div>

    {/* Title */}
    <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
     {post.title}
    </h1>

    {/* Author */}
    <div className="flex items-center gap-3 mb-12 pb-8 border-b border-gray-300">
     <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
      <span className="text-lg font-bold text-[#94A3B8]">
       {post.author[0]}
      </span>
     </div>
     <div>
      <p className="font-bold text-white">{post.author}</p>
      <p className="text-sm text-[#64748B]">Co-founder @ BuzEntry</p>
     </div>
    </div>

    {/* Content */}
    <div
     className="prose prose-lg prose-gray max-w-none"
     dangerouslySetInnerHTML={{ __html: post.content }}
     style={{
      lineHeight: '1.8',
     }}
    />

    {/* CTA */}
    <div className="mt-16 pt-8 border-t border-gray-300">
     <div className="bg-gradient-to-r from-[#5B8CFF]/10 to-indigo-500/10 rounded-full border-2 border-[#5B8CFF]/20 p-8 text-center">
      <h3 className="text-2xl font-black text-white mb-3">
       Ready to Try BuzEntry?
      </h3>
      <p className="text-[#94A3B8] mb-6">
       Get started today with our 30-day money-back guarantee. Risk-free.
      </p>
      <Link
       href="/"
       className="inline-block bg-[#5B8CFF] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#4A7AE8] hover:scale-105 active:scale-95 transition-all"
      >
       Get Started Now
      </Link>
     </div>
    </div>
   </article>

   {/* Footer */}
   <footer className="border-t border-gray-300 py-12 mt-20">
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

   <style jsx global>{`
    .prose h2 {
     font-size: 1.875rem;
     font-weight: 700;
     color: #FFFFFF;
     margin-top: 3rem;
     margin-bottom: 1.5rem;
    }
    .prose h3 {
     font-size: 1.5rem;
     font-weight: 600;
     color: #FFFFFF;
     margin-top: 2rem;
     margin-bottom: 1rem;
    }
    .prose p {
     color: #94A3B8;
     margin-bottom: 1.5rem;
    }
    .prose ul, .prose ol {
     color: #94A3B8;
     margin-bottom: 1.5rem;
     padding-left: 1.5rem;
    }
    .prose li {
     margin-bottom: 0.5rem;
    }
    .prose a {
     color: #5B8CFF;
     text-decoration: underline;
    }
    .prose a:hover {
     color: #4A7AE8;
    }
    .prose strong {
     color: #FFFFFF;
     font-weight: 600;
    }
    .prose em {
     font-style: italic;
    }
   `}</style>
  </div>
 );
}
