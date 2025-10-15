import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail, getUserAnalytics } from '@/lib/user-db';

export async function GET() {
  // DEV MODE: Return mock analytics
  if (process.env.DEV_MODE === 'true') {
    console.log('[DEV MODE] Returning mock analytics');
    return NextResponse.json({
      totalCalls: 42,
      successfulUnlocks: 38,
      forwardedCalls: 2,
      missedCalls: 1,
      pausedCalls: 1,
      deniedCalls: 0,
      callsByDay: [
        { date: '2025-10-07', count: 5 },
        { date: '2025-10-08', count: 8 },
        { date: '2025-10-09', count: 6 },
        { date: '2025-10-10', count: 7 },
        { date: '2025-10-11', count: 9 },
        { date: '2025-10-12', count: 4 },
        { date: '2025-10-13', count: 3 },
      ],
      recentCalls: [],
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

    const analytics = await getUserAnalytics(profile.userId);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
