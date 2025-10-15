import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail, updateUserProfile } from '@/lib/user-db';

export async function POST(req: Request) {
  // DEV MODE: Accept changes
  if (process.env.DEV_MODE === 'true') {
    console.log('[DEV MODE] Notification settings updated');
    const body = await req.json();
    return NextResponse.json({
      userId: 'dev@test.com',
      email: 'dev@test.com',
      signalwirePhoneNumber: '+1-555-123-4567',
      doorCode: '9',
      accessCode: '1234',
      isPaused: false,
      pauseForwardingNumber: null,
      passcodes: [],
      stripeCustomerId: 'cus_dev_123',
      stripeSubscriptionId: 'sub_dev_123',
      subscriptionStatus: 'active',
      ...body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { notifyEmail, notifySms, notifyPhoneNumber } = await req.json();

    const profile = await getUserByEmail(session.user.email);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Validate SMS phone number if SMS notifications are enabled
    if (notifySms && !notifyPhoneNumber) {
      return NextResponse.json(
        { error: 'Phone number required for SMS notifications' },
        { status: 400 }
      );
    }

    const updated = await updateUserProfile(profile.userId, {
      notifyEmail: notifyEmail ?? false,
      notifySms: notifySms ?? false,
      notifyPhoneNumber: notifyPhoneNumber || null,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
