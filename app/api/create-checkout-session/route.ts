import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { kv } from '@vercel/kv';
import { sendOnboardingEmail } from '@/lib/email';

async function sendTelegramNotification(email: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram not configured');
    return;
  }

  try {
    const message = `🎉 New signup!\n\nEmail: ${email}\nTime: ${new Date().toLocaleString()}`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get the actual origin from the request
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const origin = `${protocol}://${host}`;

    // DEV MODE: Skip Stripe and redirect directly to success
    if (process.env.DEV_MODE === 'true') {
      console.log('[DEV MODE] Simulating checkout for:', email);

      // Simulate saving to KV
      console.log('[DEV MODE] Simulating KV save');

      // Encode email in the session ID so create-session can extract it
      const devSessionId = `dev_session_${Date.now()}_${encodeURIComponent(email)}`;

      return NextResponse.json({
        sessionId: devSessionId,
        url: `${origin}/success?session_id=${devSessionId}&dev=true`,
      });
    }

    // PRODUCTION MODE: Use real Stripe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-09-30.clover',
    });

    // Save email to KV
    try {
      await kv.set(`signup:${email}`, {
        email,
        timestamp: Date.now(),
        status: 'checkout_initiated',
      });
    } catch (error) {
      console.error('Error saving to KV:', error);
    }

    // Send onboarding email (don't block on this)
    sendOnboardingEmail(email).catch((error) => {
      console.error('Failed to send onboarding email:', error);
    });

    // Send Telegram notification
    await sendTelegramNotification(email);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        email,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    console.error('Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'An error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
