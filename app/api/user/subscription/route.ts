import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail, updateUserProfile } from '@/lib/user-db';
import Stripe from 'stripe';
import { kv } from '@vercel/kv';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function GET() {
  // DEV MODE: Return mock subscription
  if (process.env.DEV_MODE === 'true') {
    console.log('[DEV MODE] Returning mock subscription');
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return NextResponse.json({
      status: 'active',
      currentPeriodEnd: nextMonth.getTime(),
      cancelAtPeriodEnd: false,
    });
  }

  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await getUserByEmail(session.user.email);

    if (!profile || !profile.stripeCustomerId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    // Query Stripe directly for latest subscription status
    let customer;
    try {
      customer = await stripe.customers.retrieve(profile.stripeCustomerId, {
        expand: ['subscriptions'],
      });
    } catch (stripeError: any) {
      // If customer doesn't exist in Stripe, clear the invalid customer ID from profile
      if (stripeError.code === 'resource_missing') {
        console.error(`Invalid Stripe customer ID ${profile.stripeCustomerId} for user ${session.user.email}. Clearing from profile.`);
        await updateUserProfile(profile.userId, {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          subscriptionStatus: 'canceled',
        });
        return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
      }
      throw stripeError;
    }

    if (!customer || customer.deleted) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const subscription = (customer as Stripe.Customer).subscriptions?.data[0];

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 404 });
    }

    const subscriptionData = {
      status: subscription.status,
      currentPeriodEnd: (subscription as any).current_period_end * 1000,
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
    };

    // Store subscription status in DB so it's always available
    await updateUserProfile(profile.userId, {
      subscriptionStatus: subscription.status as any,
    });

    return NextResponse.json(subscriptionData);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
