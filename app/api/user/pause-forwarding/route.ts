import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail, updateUserProfile } from '@/lib/user-db';

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { pauseForwardingNumber } = await req.json();

    // Validate phone number if provided (basic E.164 validation)
    if (pauseForwardingNumber) {
      const validPhoneRegex = /^\+?[1-9]\d{1,14}$/;
      const cleanNumber = pauseForwardingNumber.replace(/[\s()-]/g, '');

      if (!validPhoneRegex.test(cleanNumber)) {
        return NextResponse.json(
          { error: 'Invalid phone number format. Use E.164 format (e.g., +15551234567)' },
          { status: 400 }
        );
      }
    }

    const profile = await getUserByEmail(session.user.email);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const updatedProfile = await updateUserProfile(profile.userId, {
      pauseForwardingNumber: pauseForwardingNumber || null,
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating pause forwarding:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
