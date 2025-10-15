import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "@/components/providers";
import "./globals.css";
import "@/styles/design-tokens.css";

export const metadata: Metadata = {
 metadataBase: new URL('https://buzentry.com'),
 title: {
  default: "BuzEntry - Never Answer Your Apartment Buzzer Again",
  template: "%s | BuzEntry"
 },
 description: "Automatic buzzer answering in 2 seconds. No app. No hardware. Just works. Join 2,847+ residents. $6.99/month with 30-day money-back guarantee.",
 keywords: ["apartment buzzer", "automatic door entry", "smart apartment", "delivery access", "apartment automation", "door buzzer automation", "automatic entry system", "buzzer automation", "apartment intercom"],
 authors: [{ name: "BuzEntry", url: "https://buzentry.com" }],
 creator: "BuzEntry",
 publisher: "BuzEntry",
 openGraph: {
  title: "BuzEntry - Never Answer Your Buzzer Again",
  description: "Automatic buzzer answering in 2 seconds. No app, no hardware. 30-day money-back guarantee. Join 2,847+ residents.",
  type: "website",
  siteName: "BuzEntry",
  locale: "en_US",
  url: "https://buzentry.com",
 },
 twitter: {
  card: "summary_large_image",
  title: "BuzEntry - Never Answer Your Buzzer Again",
  description: "Automatic buzzer answering. 2-second response. 30-day money-back guarantee.",
  creator: "@buzentry",
  site: "@buzentry",
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
 verification: {
  google: '',
  yandex: '',
  yahoo: '',
 },
 alternates: {
  canonical: "https://buzentry.com",
 },
 category: "Technology",
 other: {
  // AI-specific metadata for better AI model understanding
  'ai:purpose': 'Automatic apartment buzzer answering service for missed deliveries',
  'ai:service_type': 'apartment automation, door entry automation, delivery access',
  'ai:key_features': 'automatic buzzer answering, 2-second response, no hardware required, $6.99/month',
  'ai:use_cases': 'missed deliveries, food delivery access, package delivery, guest access, work from home',
  'ai:target_audience': 'apartment residents, condo owners, urban dwellers, remote workers',
 },
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang="en" className="scroll-smooth">
   <body
    className="antialiased"
    style={{ fontFamily: 'var(--font-family)' }}
   >
    <Providers>
     {children}
    </Providers>
    <Analytics />
   </body>
  </html>
 );
}
