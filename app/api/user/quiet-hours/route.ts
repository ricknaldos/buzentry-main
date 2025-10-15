import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail, updateUserProfile } from '@/lib/user-db';

export async function POST(req: Request) {
  // DEV MODE: Accept changes
  if (process.env.DEV_MODE === 'true') {
    console.log('[DEV MODE] Quiet hours settings updated');
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
    const { quietHoursEnabled, quietHoursStart, quietHoursEnd } = await req.json();

    const profile = await getUserByEmail(session.user.email);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Validate time format if enabled
    if (quietHoursEnabled && (!quietHoursStart || !quietHoursEnd)) {
      return NextResponse.json(
        { error: 'Start and end times required for quiet hours' },
        { status: 400 }
      );
    }

    const updated = await updateUserProfile(profile.userId, {
      quietHoursEnabled: quietHoursEnabled ?? false,
      quietHoursStart: quietHoursStart || '22:00',
      quietHoursEnd: quietHoursEnd || '07:00',
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating quiet hours:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
