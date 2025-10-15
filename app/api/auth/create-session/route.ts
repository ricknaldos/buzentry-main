import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import Stripe from 'stripe';
import { nanoid } from 'nanoid';
import { getUserByEmail, createUserProfile } from '@/lib/user-db';
import { provisionPhoneNumber } from '@/lib/signalwire';
import { sendWelcomeEmail } from '@/lib/email';
import { getPreferredAreaCodes } from '@/lib/geolocation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

async function handleSessionCreation(sessionId: string, req: NextRequest) {
  try {
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    let email: string;
    let customerId: string;
    let subscriptionId: string;

    // DEV MODE: Skip Stripe and use mock data
    if (process.env.DEV_MODE === 'true' && sessionId.startsWith('dev_session_')) {
      console.log('[DEV MODE] Creating dev session for:', sessionId);

      // Extract email from session ID (format: dev_session_TIMESTAMP_EMAIL)
      const parts = sessionId.split('_');
      if (parts.length >= 4) {
        email = decodeURIComponent(parts.slice(3).join('_'));
      } else {
        email = 'dev@test.com'; // Fallback for old format
      }

      customerId = 'dev_customer_' + Date.now();
      subscriptionId = 'dev_sub_' + Date.now();
      console.log(`[DEV MODE] Using mock data for ${email}`);
    } else {
      // PRODUCTION MODE: Use real Stripe
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
      email = stripeSession.customer_email || stripeSession.customer_details?.email || '';

      if (!email) {
        return NextResponse.json({ error: 'Email not found' }, { status: 400 });
      }

      customerId = stripeSession.customer as string;
      subscriptionId = stripeSession.subscription as string;
    }

    console.log(`Creating account for ${email} immediately...`);

    // Use email as userId for consistency (fixes userId mismatch bug)
    const userId = email;

    // Check if app profile already exists
    let appProfile = await getUserByEmail(email);

    if (!appProfile) {
      let signalwirePhoneNumber: string;

      // DEV MODE: Skip SignalWire provisioning
      if (process.env.DEV_MODE === 'true') {
        console.log('[DEV MODE] Skipping SignalWire provisioning');
        signalwirePhoneNumber = '+1555' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
        console.log(`[DEV MODE] Using mock phone: ${signalwirePhoneNumber}`);
      } else {
        // PRODUCTION MODE: Provision real phone number
        const preferredAreaCodes = await getPreferredAreaCodes(req);
        console.log(`[Provisioning] Using area codes for user location: ${preferredAreaCodes.slice(0, 5).join(', ')}...`);
        signalwirePhoneNumber = await provisionPhoneNumber(userId, preferredAreaCodes, email);
      }

      appProfile = await createUserProfile({
        email,
        userId,
        signalwirePhoneNumber,
        doorCode: null,
        accessCode: null,
        isPaused: false,
        pauseForwardingNumber: null,
        passcodes: [],
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: 'active',
      });

      // Create phone number index
      try {
        await kv.set(`phone:${signalwirePhoneNumber}`, userId);
      } catch (error) {
        console.log('[DEV MODE] Skipping KV set for phone number');
      }

      console.log(`Created app profile for ${email} with phone: ${signalwirePhoneNumber}`);

      // Send welcome email (skip in dev mode)
      if (signalwirePhoneNumber && process.env.DEV_MODE !== 'true') {
        await sendWelcomeEmail(email, signalwirePhoneNumber);
      } else {
        console.log('[DEV MODE] Skipping welcome email');
      }
    }

    // Create NextAuth user record if doesn't exist
    // IMPORTANT: Must be STRING (JSON), not HASH - required by Upstash Redis Adapter!
    let user;
    try {
      user = await kv.get(`user:${userId}`);
    } catch (error) {
      console.log('[DEV MODE] Skipping KV get for user');
      user = null;
    }

    if (!user) {
      const userObject = {
        id: userId,
        email,
        emailVerified: new Date().toISOString(), // ISO string for date hydration
      };

      try {
        await kv.set(`user:${userId}`, userObject);
        await kv.set(`user:email:${email}`, userId);
        console.log(`Created NextAuth user for ${email}`);
      } catch (error) {
        console.log('[DEV MODE] Skipping KV set for user');
      }
    }

    // Create session using the format expected by Upstash Redis Adapter
    const sessionToken = nanoid(32);
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    // Store session in the exact format the adapter expects
    const sessionData = {
      sessionToken,
      userId,
      expires: expires.toISOString(), // Store as ISO string, not timestamp
    };

    // Store with the correct key prefix that the adapter expects
    const sessionKey = `user:session:${sessionToken}`;
    try {
      await kv.set(sessionKey, sessionData);
      // Create reverse lookup: user ID -> session key (not just token!)
      await kv.set(`user:session:by-user-id:${userId}`, sessionKey);
    } catch (error) {
      console.log('[DEV MODE] Skipping KV set for session');
    }

    console.log(`Created session for ${email}, setting cookie and redirecting`);

    // Set session cookie and redirect to onboarding
    const cookieName = process.env.NODE_ENV === 'production'
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token';

    const isSecure = process.env.NODE_ENV === 'production';

    // Build the redirect URL
    const protocol = req.headers.get('x-forwarded-proto') || (isSecure ? 'https' : 'http');
    const host = req.headers.get('host') || 'localhost:3000';
    const redirectUrl = `${protocol}://${host}/onboarding`;

    // Create HTML response with meta redirect (most reliable for cross-origin)
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=${redirectUrl}">
  <title>Redirecting...</title>
</head>
<body>
  <p>Setting up your account...</p>
  <script>window.location.href = '${redirectUrl}';</script>
</body>
</html>`;

    const response = new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });

    // Set the session cookie
    response.cookies.set({
      name: cookieName,
      value: sessionToken,
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();
  return handleSessionCreation(sessionId, req);
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }
  return handleSessionCreation(sessionId, req);
}
