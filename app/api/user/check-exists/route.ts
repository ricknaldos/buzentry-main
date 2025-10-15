import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/user-db';

/**
 * Check if a user account exists by email
 * Used before sending magic link to provide better UX
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // DEV MODE: Always return that user exists for testing
    if (process.env.DEV_MODE === 'true') {
      console.log('[DEV MODE] Simulating user exists check for:', email);
      return NextResponse.json({
        exists: true,
        email,
      });
    }

    // Check if user profile exists
    const profile = await getUserByEmail(email);

    return NextResponse.json({
      exists: !!profile,
      email,
    });

  } catch (error) {
    console.error('Error checking user existence:', error);
    return NextResponse.json(
      { error: 'Failed to check user' },
      { status: 500 }
    );
  }
}
