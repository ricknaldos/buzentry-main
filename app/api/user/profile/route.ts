import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail } from '@/lib/user-db';

export async function GET() {
  // DEV MODE: Return mock profile
  if (process.env.DEV_MODE === 'true') {
    console.log('[DEV MODE] Returning mock profile');
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
      notifyEmail: false,
      notifySms: false,
      notifyPhoneNumber: null,
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await getUserByEmail(session.user.email);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
