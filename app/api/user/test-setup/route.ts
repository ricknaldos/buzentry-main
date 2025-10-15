import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail } from '@/lib/user-db';

export async function POST() {
  // DEV MODE: Always return success
  if (process.env.DEV_MODE === 'true') {
    console.log('[DEV MODE] Test setup - simulating success');
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return NextResponse.json({ success: true, message: 'Test successful (dev mode)' });
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

    if (!profile.doorCode) {
      return NextResponse.json({ error: 'Door code not set' }, { status: 400 });
    }

    if (!profile.signalwirePhoneNumber) {
      return NextResponse.json({ error: 'Phone number not assigned' }, { status: 400 });
    }

    // In production, this would initiate a test call via SignalWire
    // For now, we'll simulate a successful test
    // TODO: Implement actual SignalWire test call logic

    return NextResponse.json({
      success: true,
      message: 'Test setup validated',
      doorCode: profile.doorCode,
      phoneNumber: profile.signalwirePhoneNumber
    });
  } catch (error) {
    console.error('Error testing setup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
