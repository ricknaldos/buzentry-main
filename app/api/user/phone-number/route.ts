import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail, updateUserProfile } from '@/lib/user-db';
import { kv } from '@vercel/kv';
import { assignPhoneNumberToUser } from '@/lib/signalwire';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Validate phone number format (E.164)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Use E.164 format (e.g., +12818928899)' },
        { status: 400 }
      );
    }

    // Check if phone number is already assigned to another user
    const existingUserId = await kv.get<string>(`phone:${phoneNumber}`);
    if (existingUserId && existingUserId !== user.userId) {
      return NextResponse.json(
        { error: 'Phone number already assigned to another user' },
        { status: 400 }
      );
    }

    // Remove old phone number mapping if exists
    if (user.signalwirePhoneNumber) {
      await kv.del(`phone:${user.signalwirePhoneNumber}`);
    }

    // Assign phone number to user
    await assignPhoneNumberToUser(user.userId, phoneNumber, session.user.email);

    // Update user profile
    const updatedProfile = await updateUserProfile(user.userId, {
      signalwirePhoneNumber: phoneNumber,
    });

    // Create phone number index
    await kv.set(`phone:${phoneNumber}`, user.userId);

    return NextResponse.json({
      success: true,
      phoneNumber,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Error setting phone number:', error);
    return NextResponse.json(
      { error: 'Failed to set phone number' },
      { status: 500 }
    );
  }
}
