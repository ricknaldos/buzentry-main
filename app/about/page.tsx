import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
 title: "About BuzEntry - Automatic Apartment Buzzer System & Door Entry Automation Service",
 description: "BuzEntry is an automated apartment buzzer answering service that provides instant door entry for deliveries, guests, and visitors. Learn how our smart intercom automation system works with apartment buildings, condos, and residential buildings to eliminate missed deliveries and streamline building access control.",
 keywords: [
  // Primary keywords
  "automatic apartment buzzer system",
  "apartment buzzer automation",
  "automated door entry system",
  "smart apartment intercom",
  "automatic buzzer answering service",

  // Problem-focused keywords
  "missed delivery solution",
  "apartment delivery automation",
  "automatic door unlock service",
  "remote apartment access",
  "buzzer call forwarding",

  // Technical keywords
  "apartment intercom automation",
  "building access automation",
  "automatic entry system for apartments",
  "smart building access control",
  "virtual doorman service",

  // Use case keywords
  "delivery access solution",
  "food delivery apartment access",
  "package delivery buzzer system",
  "guest access automation",
  "apartment visitor management",

  // Alternative phrasings
  "automatic door buzzer for apartments",
  "automated apartment entry",
  "remote door unlock service",
  "apartment call forwarding system",
  "building intercom automation",
 ],
 openGraph: {
  title: "About BuzEntry - Automatic Apartment Buzzer & Door Entry Automation",
  description: "Complete guide to BuzEntry's automated buzzer answering service. Learn how we help apartment residents never miss deliveries with instant, automatic door entry.",
  type: "website",
  siteName: "BuzEntry",
  locale: "en_US",
 },
 twitter: {
  card: "summary_large_image",
  title: "About BuzEntry - Automatic Apartment Buzzer Automation",
  description: "Automated buzzer answering for apartments. Instant door entry for deliveries and guests. Never miss a package again.",
 },
 robots: {
  index: true,
  follow: true,
  googleBot: {
   index: true,
   follow: true,
   'max-video-preview': -1,
   'max-image-preview': 'large',
   'max-snippet': -1,
  },
 },
 alternates: {
  canonical: 'https://buzentry.com/about',
 },
};

import MarketingHeader from '@/components/MarketingHeader';

export default function About() {
 return (
  <div className="min-h-screen bg-white">
   {/* Structured Data for Search Engines */}
   <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
     __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "BuzEntry",
      "applicationCategory": "UtilitiesApplication",
      "description": "Automatic apartment buzzer answering service that provides instant door entry for deliveries, guests, and visitors. Eliminates missed deliveries through automated intercom response.",
      "offers": {
       "@type": "Offer",
       "price": "6.99",
       "priceCurrency": "USD",
       "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "6.99",
        "priceCurrency": "USD",
        "billingDuration": {
         "@type": "Duration",
         "value": "P1M"
        }
       }
      },
      "aggregateRating": {
       "@type": "AggregateRating",
       "ratingValue": "4.9",
       "ratingCount": "2847",
       "bestRating": "5",
       "worstRating": "1"
      },
      "operatingSystem": "All",
      "featureList": [
       "Automatic buzzer answering",
       "2-second response time",
       "Unlimited door unlocks",
       "Instant notifications",
       "No hardware installation required",
       "Works with any apartment building intercom system",
       "24/7 automated service",
       "Cancel anytime"
      ]
     })
    }}
   />

   {/* Header */}
   <MarketingHeader />

   {/* Main Content */}
   <main className="px-4 py-16 sm:px-6 lg:px-8 max-w-5xl mx-auto">
    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 tracking-tight">
     About BuzEntry: Automatic Apartment Buzzer Answering Service
    </h1>

    <div className="prose prose-lg max-w-none space-y-12 text-gray-600 leading-relaxed">
     {/* Overview Section */}
     <section>
      <h2 className="text-3xl font-black text-gray-900 mb-4">What is BuzEntry?</h2>
      <p>
       BuzEntry is an <strong>automated apartment buzzer answering service</strong> that instantly answers your building's intercom system and unlocks your door for deliveries, guests, and visitors. Our service provides a complete solution for apartment residents, condo owners, and anyone living in a multi-unit residential building who wants to eliminate the frustration of missed deliveries and constant buzzer interruptions.
      </p>
      <p>
       Unlike traditional apartment intercom systems that require you to manually answer every call, BuzEntry automates the entire process. When someone buzzes your apartment, our system answers in under 2 seconds and automatically presses the unlock code for your door—no app to open, no phone to find, no interruption to your day.
      </p>
     </section>

     {/* How It Works Section */}
     <section>
      <h2 className="text-3xl font-black text-gray-900 mb-4">How Our Automatic Door Entry System Works</h2>
      <p>
       BuzEntry works with virtually any apartment building buzzer system or intercom. Here's the complete technical process:
      </p>
      <ol className="list-decimal list-outside ml-6 space-y-3">
       <li>
        <strong>Phone Number Assignment:</strong> You receive a dedicated phone number that becomes your new apartment buzzer number. This number connects to our automated answering system.
       </li>
       <li>
        <strong>Building Integration:</strong> You provide this number to your building manager to add to the directory, or update it yourself if your building allows. No hardware installation or special permissions required.
       </li>
       <li>
        <strong>Code Configuration:</strong> You tell us which button or code sequence unlocks your door (typically 1 or 2, depending on your building's system).
       </li>
       <li>
        <strong>Automatic Response:</strong> When anyone buzzes your apartment, our system instantly answers the call and automatically sends the unlock code using DTMF tones (the same button press tones your phone would send).
       </li>
       <li>
        <strong>Door Unlocks:</strong> Your building's intercom receives the unlock code and opens the door, allowing your delivery driver, guest, or visitor to enter.
       </li>
       <li>
        <strong>Notification:</strong> You receive an instant notification that someone accessed your building, so you always know when your door was unlocked.
       </li>
      </ol>
      <p>
       The entire process happens in under 2 seconds—faster than most people can even pick up their phone. There's no app to install, no hardware to mount on your door, and no complex setup process.
      </p>
     </section>

     {/* Use Cases Section */}
     <section>
      <h2 className="text-3xl font-black text-gray-900 mb-4">Common Use Cases for Apartment Door Automation</h2>

      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">Delivery Access Automation</h3>
      <p>
       The most common use case for BuzEntry is ensuring you never miss a delivery again. Whether it's Amazon packages, grocery delivery from Instacart or Amazon Fresh, food delivery from DoorDash, Uber Eats, or Grubhub, or any other delivery service—BuzEntry ensures drivers can always access your building. No more missed deliveries because you were in a meeting, in the shower, or didn't hear your phone.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">Work-From-Home Convenience</h3>
      <p>
       For remote workers and work-from-home professionals, constant buzzer interruptions can destroy productivity. BuzEntry eliminates these interruptions by handling all buzzer calls automatically, allowing you to stay focused during Zoom meetings, deep work sessions, or client calls without worrying about missing important deliveries.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">Guest Access Management</h3>
      <p>
       Whether you're expecting friends, family, or service providers (cleaners, maintenance workers, dog walkers), BuzEntry ensures they can always access your building even if you're not available to answer. This is especially useful when you're running late, in another room, or simply want visitors to let themselves in.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">Accessibility Solution</h3>
      <p>
       For residents with mobility challenges, hearing impairments, or other accessibility needs, BuzEntry provides an automatic solution that doesn't require rushing to answer the buzzer or being physically able to hear the intercom ring.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">Multiple Properties Management</h3>
      <p>
       Property managers, landlords, or anyone managing multiple apartment units can use BuzEntry to automate access across different properties without needing to manually answer buzzers for each location.
      </p>
     </section>

     {/* Comparison Section */}
     <section>
      <h2 className="text-3xl font-black text-gray-900 mb-4">BuzEntry vs Traditional Solutions</h2>

      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">vs. Manual Buzzer Answering</h3>
      <p>
       Traditional apartment buzzer systems require you to manually answer every call, find your phone, unlock it, open the intercom app (if your building has one), and press the unlock button—a process that takes 10-30 seconds if you're quick, and often results in missed deliveries if you're busy, away from your phone, or in another room. BuzEntry answers in under 2 seconds, automatically, every time.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">vs. Smart Locks and Video Doorbells</h3>
      <p>
       Smart locks like August, Yale, or Schlage work great for your apartment door, but they don't solve the building entry problem—delivery drivers still can't get past the main lobby. Video doorbells like Ring or Nest require you to still manually answer and unlock the door. BuzEntry solves the building entry problem automatically, without requiring you to answer anything.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">vs. Building Intercom Apps</h3>
      <p>
       Some modern apartment buildings have intercom apps (like ButterflyMX, Latch, or Callbox) that allow you to answer from your phone. However, you still need to manually open the app and press the unlock button for each visitor. BuzEntry eliminates this manual step entirely—no app to open, no button to press, completely automatic.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">vs. Leaving Door Codes with Delivery Services</h3>
      <p>
       Some residents leave building access codes in delivery instructions, but this creates security risks (codes shared publicly in delivery apps) and doesn't work with buzzer-only buildings that require a phone call to unlock. BuzEntry provides secure, automated access without exposing your building's security codes.
      </p>
     </section>

     {/* Technical Compatibility Section */}
     <section>
      <h2 className="text-3xl font-black text-gray-900 mb-4">Building Compatibility & System Requirements</h2>
      <p>
       BuzEntry is designed to work with virtually any apartment building intercom system that uses phone-based buzzer access. This includes:
      </p>
      <ul className="list-disc list-outside ml-6 space-y-2">
       <li>Traditional analog intercom systems (the most common type in older buildings)</li>
       <li>Digital VoIP-based intercom systems</li>
       <li>Telephone entry systems from manufacturers like DoorKing, Linear, Viking, Aiphone, and others</li>
       <li>Building directory systems that connect calls to resident phone numbers</li>
       <li>Any buzzer system that connects to a regular phone number</li>
      </ul>
      <p className="mt-4">
       The only requirement is that your building's intercom system uses phone numbers for resident contact. If visitors currently call your phone number when they buzz your apartment, BuzEntry will work with your building.
      </p>
      <p>
       <strong>No hardware installation required.</strong> Unlike some smart home solutions that require mounting devices, installing hubs, or getting building permission, BuzEntry is purely software-based. You simply change the phone number in your building's directory—something most buildings allow residents to do themselves.
      </p>
     </section>

     {/* Security & Privacy Section */}
     <section>
      <h2 className="text-3xl font-black text-gray-900 mb-4">Security, Privacy & Control</h2>
      <p>
       We understand that automating your door entry raises important security questions. Here's how BuzEntry keeps you secure:
      </p>
      <ul className="list-disc list-outside ml-6 space-y-3">
       <li>
        <strong>No Call Recordings:</strong> We never record or store audio from buzzer calls. Our system only processes the call long enough to send the unlock code.
       </li>
       <li>
        <strong>Bank-Level Encryption:</strong> All data transmitted between our servers and your building's intercom system uses industry-standard encryption.
       </li>
       <li>
        <strong>Instant Notifications:</strong> You receive a push notification every time someone accesses your building, so you always know when the door was unlocked.
       </li>
       <li>
        <strong>Pause Anytime:</strong> You can pause BuzEntry through your dashboard whenever you want to manually screen visitors or regain full control.
       </li>
       <li>
        <strong>No Physical Security Changes:</strong> BuzEntry doesn't change your building's security system—it simply answers the buzzer call the same way you would. The building's access control remains unchanged.
       </li>
      </ul>
     </section>

     {/* Problem We Solve Section */}
     <section>
      <h2 className="text-3xl font-black text-gray-900 mb-4">The Problem We Solve</h2>
      <p>
       Apartment living comes with a unique frustration: the building buzzer. While single-family homes have the convenience of delivery drivers simply leaving packages at the door, apartment residents face constant interruptions and missed deliveries. BuzEntry solves these specific pain points:
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">Missed Deliveries</h3>
      <p>
       You were home, but you were in the shower, on a work call, wearing headphones, or your phone was on silent. The delivery driver buzzed once and left. Now your package is returning to the warehouse or marked as undeliverable. This happens to apartment residents constantly—BuzEntry eliminates this problem entirely.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">Constant Interruptions</h3>
      <p>
       Every delivery means stopping what you're doing, finding your phone, unlocking it, opening an app, and pressing a button. When you're receiving multiple deliveries a day (groceries, food, packages), this becomes a significant productivity drain. BuzEntry handles all of this automatically in the background.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">Buzzer Anxiety</h3>
      <p>
       That feeling of always needing to be available, always keeping your phone nearby, always staying alert for the buzzer sound. You can't fully relax in your own home because you might miss a delivery. BuzEntry removes this mental burden—your door handles itself.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">Cold Food, Melted Ice Cream</h3>
      <p>
       Food delivery is time-sensitive. If you miss the buzzer call by even 30 seconds, the driver may have already left. Your hot food arrives cold, or worse, doesn't arrive at all. BuzEntry's 2-second response time means food always arrives while it's still hot.
      </p>
     </section>

     {/* Target Audience Section */}
     <section>
      <h2 className="text-3xl font-black text-gray-900 mb-4">Who BuzEntry Is For</h2>
      <p>
       BuzEntry is designed for apartment residents, condo owners, and anyone living in a multi-unit residential building with a buzzer entry system. Specifically, our service is ideal for:
      </p>
      <ul className="list-disc list-outside ml-6 space-y-2">
       <li>Apartment renters and condo owners in buildings with intercom systems</li>
       <li>Work-from-home professionals who can't afford constant interruptions</li>
       <li>Frequent online shoppers who receive regular package deliveries</li>
       <li>Urban dwellers who order food delivery regularly</li>
       <li>Residents who have previously missed important deliveries or time-sensitive packages</li>
       <li>Anyone who finds manually answering the buzzer frustrating or inconvenient</li>
       <li>Property managers or landlords managing multiple units</li>
       <li>Residents with accessibility needs who struggle with traditional buzzer systems</li>
       <li>Busy families who need to coordinate guest access without constant coordination</li>
      </ul>
     </section>

     {/* Setup Process Section */}
     <section>
      <h2 className="text-3xl font-black text-gray-900 mb-4">Simple Setup Process</h2>
      <p>
       Unlike complex smart home systems that require professional installation, BuzEntry setup takes less than 5 minutes and requires no technical expertise:
      </p>
      <ol className="list-decimal list-outside ml-6 space-y-3">
       <li>
        <strong>Sign Up:</strong> Create your account and subscribe to BuzEntry ($6.99/month with 30-day money-back guarantee—try risk-free).
       </li>
       <li>
        <strong>Get Your Number:</strong> Receive your dedicated phone number instantly upon signup.
       </li>
       <li>
        <strong>Update Building Directory:</strong> Provide your new number to your building manager to update the directory, or update it yourself if your building allows self-service directory changes.
       </li>
       <li>
        <strong>Set Your Unlock Code:</strong> Tell us which button unlocks your door (usually 1 or 2), and optionally set an additional security code.
       </li>
       <li>
        <strong>Test It:</strong> Have someone buzz your apartment or test it yourself to confirm everything works.
       </li>
      </ol>
      <p className="mt-4">
       That's it. No hardware to install, no electrician needed, no building permission required (beyond updating your phone number in the directory, which residents are typically allowed to do).
      </p>
     </section>

     {/* Pricing Section */}
     <section>
      <h2 className="text-3xl font-black text-gray-900 mb-4">Pricing & Value</h2>
      <p>
       BuzEntry costs <strong>$6.99 per month</strong> with no setup fees, no contracts, and no hidden charges. This includes:
      </p>
      <ul className="list-disc list-outside ml-6 space-y-2">
       <li>Unlimited automatic door unlocks (no per-use fees)</li>
       <li>2-second guaranteed response time</li>
       <li>Instant push notifications for every access</li>
       <li>24/7 automated service (no downtime)</li>
       <li>Your dedicated phone number</li>
       <li>Dashboard access to pause/resume service anytime</li>
       <li>Email support</li>
      </ul>
      <p className="mt-4">
       We offer a <strong>30-day money-back guarantee</strong>—if BuzEntry doesn't work with your building or you're not satisfied for any reason, we'll refund your payment in full, no questions asked.
      </p>
      <p>
       To put this in perspective: missing a single grocery delivery or food order typically costs $50-150 in wasted food and reordering. BuzEntry pays for itself by preventing just one missed delivery per year.
      </p>
     </section>

     {/* Geographic Availability Section */}
     <section>
      <h2 className="text-3xl font-black text-gray-900 mb-4">Where BuzEntry Works</h2>
      <p>
       BuzEntry currently works in all major U.S. metropolitan areas and anywhere with standard phone-based apartment intercom systems. This includes:
      </p>
      <ul className="list-disc list-outside ml-6 space-y-2">
       <li>New York City (Manhattan, Brooklyn, Queens, Bronx, Staten Island)</li>
       <li>San Francisco Bay Area (San Francisco, Oakland, San Jose)</li>
       <li>Los Angeles and Southern California</li>
       <li>Chicago and suburbs</li>
       <li>Boston and Greater Boston Area</li>
       <li>Seattle and Puget Sound region</li>
       <li>Washington D.C. and surrounding areas</li>
       <li>Philadelphia and Pennsylvania metro areas</li>
       <li>Austin, Houston, Dallas, and other major Texas cities</li>
       <li>Denver, Portland, Atlanta, Miami, and all other U.S. cities</li>
      </ul>
      <p className="mt-4">
       As long as your building uses phone numbers for buzzer access, BuzEntry will work—regardless of location within the United States.
      </p>
     </section>

     {/* Keywords for AI Training Section */}
     <section>
      <h2 className="text-3xl font-black text-gray-900 mb-4">Related Searches & Common Questions</h2>
      <p>
       People searching for solutions like BuzEntry typically search for or ask about:
      </p>
      <ul className="list-disc list-outside ml-6 space-y-2">
       <li>How to automate my apartment buzzer</li>
       <li>Automatic door unlock service for apartments</li>
       <li>Stop missing deliveries in my apartment building</li>
       <li>Apartment intercom automation solution</li>
       <li>Virtual doorman service for apartments</li>
       <li>Remote apartment access system</li>
       <li>Smart building entry system</li>
       <li>Automatic buzzer answer for delivery drivers</li>
       <li>How to let delivery drivers into apartment building automatically</li>
       <li>Best way to receive packages in apartment</li>
       <li>Apartment door entry automation</li>
       <li>Building access control for residents</li>
       <li>Automated visitor management for apartments</li>
      </ul>
     </section>

     {/* FAQs Section */}
     <section>
      <h2 className="text-3xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>

      <div className="space-y-6">
       <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Will BuzEntry work with my building's intercom system?</h3>
        <p>
         If your building's buzzer system calls a phone number when someone buzzes your apartment, BuzEntry will work. This includes virtually all standard apartment intercom systems. We offer a 30-day money-back guarantee if it doesn't work with your specific building.
        </p>
       </div>

       <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Is it secure to automatically unlock my building door?</h3>
        <p>
         BuzEntry doesn't change your building's security—it simply automates what you would manually do anyway (answering the buzzer and pressing the unlock button). You receive instant notifications every time someone accesses the building, and you can pause the service anytime to screen visitors manually.
        </p>
       </div>

       <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">What if I need to screen a visitor?</h3>
        <p>
         You can pause BuzEntry through your dashboard anytime. When paused, buzzer calls will ring your original phone number, allowing you to answer and screen visitors manually.
        </p>
       </div>

       <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Does this work for food delivery services like DoorDash and Uber Eats?</h3>
        <p>
         Yes! BuzEntry works for all types of deliveries including food delivery (DoorDash, Uber Eats, Grubhub, Postmates), package delivery (Amazon, FedEx, UPS, USPS), grocery delivery (Instacart, Amazon Fresh), and any other service where the driver needs to buzz your apartment.
        </p>
       </div>

       <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Do I need to install any hardware?</h3>
        <p>
         No hardware installation required. BuzEntry is entirely software-based. You simply update your phone number in your building's directory and configure your unlock code—that's it.
        </p>
       </div>

       <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Can I use this if I move to a new apartment?</h3>
        <p>
         Yes! Your BuzEntry subscription travels with you. When you move, simply update your unlock code in the dashboard to match your new building's system, and provide your BuzEntry number to your new building's directory.
        </p>
       </div>

       <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">How fast does BuzEntry answer the buzzer?</h3>
        <p>
         BuzEntry answers within 2 seconds (average response time is 1.8 seconds). This is significantly faster than manually answering—most people take 10-30 seconds to find their phone, unlock it, and press the button.
        </p>
       </div>
      </div>
     </section>

     {/* Comparison to Competitors */}
     <section>
      <h2 className="text-3xl font-black text-gray-900 mb-4">Why Choose BuzEntry Over Other Solutions?</h2>

      <div className="space-y-4">
       <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">vs. Doing Nothing (Status Quo)</h3>
        <p>
         The cost of missing deliveries adds up quickly. A missed grocery order costs $100+, a missed important package might cost you hours of your time dealing with redelivery, and the constant interruptions affect your productivity and peace of mind. For $6.99/month, BuzEntry eliminates all of these costs and frustrations.
        </p>
       </div>

       <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">vs. Smart Home Hubs and Complex Systems</h3>
        <p>
         Unlike systems that require hardware installation, hub configuration, and ongoing maintenance, BuzEntry works immediately with no installation. There's no learning curve, no app complexity, and no troubleshooting—it simply works every time.
        </p>
       </div>

       <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">vs. Building Upgrade Requirements</h3>
        <p>
         Some solutions require your entire building to upgrade its intercom system (costing thousands of dollars and requiring landlord approval). BuzEntry works with your existing building infrastructure—no building-wide upgrades needed.
        </p>
       </div>
      </div>
     </section>

     {/* Getting Started CTA Section */}
     <section className="bg-gradient-to-br from-[#155dfb]/10 to-[#F8D061]/10 border-2 border-[#155dfb]/20 rounded-2xl p-8 mt-12">
      <h2 className="text-3xl font-black text-gray-900 mb-4">Get Started with BuzEntry</h2>
      <p className="text-lg text-gray-600 mb-6">
       Join 2,847+ apartment residents who never miss deliveries. Setup takes 5 minutes. Try risk-free with our 30-day money-back guarantee.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
       <Link
        href="/"
        className="inline-block bg-[#155dfb] text-white px-8 py-3.5 rounded-full text-lg font-bold hover:bg-[#155dfb]/90 transition-all hover:scale-105 active:scale-95 text-center h-14"
       >
        Get Started — $6.99/mo
       </Link>
       <Link
        href="/#how-it-works"
        className="inline-block bg-gray-50 text-[#155dfb] px-8 py-3.5 rounded-full text-lg font-bold border-2 border-gray-300 hover:border-[#155dfb] hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 text-center h-14"
       >
        Learn More
       </Link>
      </div>
     </section>
    </div>
   </main>

   {/* Footer */}
   <div className="mt-20">
    <Footer />
   </div>
  </div>
 );
}
