import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail, updateUserProfile } from '@/lib/user-db';

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { accessCode } = await req.json();

    // Access code should be 4 digits or null (to disable)
    if (accessCode !== null && (typeof accessCode !== 'string' || !/^\d{4}$/.test(accessCode))) {
      return NextResponse.json(
        { error: 'Access code must be exactly 4 digits' },
        { status: 400 }
      );
    }

    const profile = await getUserByEmail(session.user.email);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const updatedProfile = await updateUserProfile(profile.userId, { accessCode });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating access code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
