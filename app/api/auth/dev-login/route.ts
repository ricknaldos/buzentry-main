import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { kv } from '@vercel/kv';

/**
 * DEV MODE ONLY: Direct login without magic link
 * Creates a session and sets the cookie
 */
export async function POST(req: NextRequest) {
  // Allow in dev mode OR if ALLOW_DEMO_LOGIN is enabled
  const isDemoAllowed = process.env.DEV_MODE === 'true' || process.env.ALLOW_DEMO_LOGIN === 'true';

  if (!isDemoAllowed) {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const userId = email;

    // Create NextAuth user record if doesn't exist
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
        emailVerified: new Date().toISOString(),
      };

      try {
        await kv.set(`user:${userId}`, userObject);
        await kv.set(`user:email:${email}`, userId);
        console.log(`[DEV MODE] Created NextAuth user for ${email}`);
      } catch (error) {
        console.log('[DEV MODE] Skipping KV set for user');
      }
    }

    // Also create app profile if doesn't exist (for complete dev experience)
    const { getUserByEmail, createUserProfile } = await import('@/lib/user-db');
    let appProfile = await getUserByEmail(email);

    if (!appProfile) {
      console.log(`[DEV MODE] Creating app profile for ${email}`);
      const mockPhone = '+1555' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');

      appProfile = await createUserProfile({
        email,
        userId,
        signalwirePhoneNumber: mockPhone,
        doorCode: null,
        accessCode: null,
        isPaused: false,
        pauseForwardingNumber: null,
        passcodes: [],
        stripeCustomerId: `dev_customer_${Date.now()}`,
        stripeSubscriptionId: `dev_sub_${Date.now()}`,
        subscriptionStatus: 'active',
      });

      console.log(`[DEV MODE] Created app profile with mock phone: ${mockPhone}`);
    }

    // Create session
    const sessionToken = nanoid(32);
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const sessionData = {
      sessionToken,
      userId,
      expires: expires.toISOString(),
    };

    const sessionKey = `user:session:${sessionToken}`;
    try {
      await kv.set(sessionKey, sessionData);
      await kv.set(`user:session:by-user-id:${userId}`, sessionKey);
    } catch (error) {
      console.log('[DEV MODE] Skipping KV set for session');
    }

    console.log(`[DEV MODE] Created session for ${email}`);

    // Set session cookie
    const cookieName = process.env.NODE_ENV === 'production'
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token';

    const isSecure = process.env.NODE_ENV === 'production';

    const response = NextResponse.json({ success: true, email });

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
    console.error('[DEV MODE] Login error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
