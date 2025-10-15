import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail, updateUserProfile } from '@/lib/user-db';

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { doorCode } = await req.json();

    if (!doorCode || typeof doorCode !== 'string') {
      return NextResponse.json({ error: 'Invalid door code' }, { status: 400 });
    }

    const profile = await getUserByEmail(session.user.email);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const updatedProfile = await updateUserProfile(profile.userId, { doorCode });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
