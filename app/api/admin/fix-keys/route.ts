import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

/**
 * ADMIN ONLY: Comprehensively fix Redis key conflicts for a specific user
 * Handles WRONGTYPE errors and mismatched userId issues
 * Call with: POST /api/admin/fix-keys?email=user@example.com&secret=YOUR_SECRET
 */
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const secret = searchParams.get('secret');

  // Simple security check
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  try {
    const results: any = {
      email,
      steps: [],
    };

    // Step 1: Find existing profile data
    results.steps.push('Step 1: Locating profile data...');

    let profileData: any = null;
    let oldUserId: string | null = null;

    // Try to find profile via email index
    const profileUserIdFromIndex = await kv.get<string>(`profile:email:${email}`);
    if (profileUserIdFromIndex) {
      profileData = await kv.get(`profile:${profileUserIdFromIndex}`);
      if (profileData) {
        oldUserId = profileUserIdFromIndex;
        results.steps.push(`✅ Found profile at profile:${oldUserId}`);
      }
    }

    // Try email as userId (common pattern)
    if (!profileData) {
      profileData = await kv.get(`profile:${email}`);
      if (profileData) {
        oldUserId = email;
        results.steps.push(`✅ Found profile at profile:${email}`);
      }
    }

    // Try old broken structure where profile was stored under user:userId
    if (!profileData) {
      // Check if there's a string value at user:email (old structure)
      const possibleUserId = await kv.get(`user:${email}`);
      if (possibleUserId && typeof possibleUserId === 'object') {
        profileData = possibleUserId;
        oldUserId = email;
        results.steps.push(`✅ Found profile at user:${email} (old broken structure)`);
      }
    }

    if (!profileData) {
      results.steps.push('❌ No profile data found! Cannot fix keys without profile.');
      results.success = false;
      return NextResponse.json(results, { status: 404 });
    }

    results.steps.push(`Profile: ${profileData.email}, Phone: ${profileData.signalwirePhoneNumber}`);

    // Step 2: Delete ALL potentially conflicting keys
    results.steps.push('\nStep 2: Deleting all conflicting keys...');

    const keysToDelete = [
      `user:${email}`,
      `user:email:${email}`,
      `profile:${email}`,
      `profile:email:${email}`,
      `email:${email}`,
    ];

    // Also delete old userId keys if different from email
    if (oldUserId && oldUserId !== email) {
      keysToDelete.push(`user:${oldUserId}`);
      keysToDelete.push(`profile:${oldUserId}`);
    }

    for (const key of keysToDelete) {
      try {
        const deleted = await kv.del(key);
        if (deleted > 0) {
          results.steps.push(`✅ Deleted: ${key}`);
        }
      } catch (error: any) {
        results.steps.push(`⚠️  Error deleting ${key}: ${error.message}`);
      }
    }

    // Step 3: Create clean structure with email as userId
    results.steps.push('\nStep 3: Creating clean structure...');
    const userId = email; // Use email as userId for consistency

    // Create NextAuth user record (STRING with JSON - required by Upstash Redis Adapter!)
    const userObject = {
      id: userId,
      email: email,
      emailVerified: Date.now(),
    };
    await kv.set(`user:${userId}`, userObject);
    results.steps.push(`✅ Created NextAuth user (JSON STRING): user:${userId}`);

    // Create NextAuth email lookup (STRING)
    await kv.set(`user:email:${email}`, userId);
    results.steps.push(`✅ Created NextAuth email lookup`);

    // Update and save profile with correct userId
    const updatedProfile = {
      ...profileData,
      userId: userId,
      updatedAt: Date.now(),
    };

    await kv.set(`profile:${userId}`, updatedProfile);
    results.steps.push(`✅ Created profile: profile:${userId}`);

    // Create profile email lookup (STRING)
    await kv.set(`profile:email:${email}`, userId);
    results.steps.push(`✅ Created profile email lookup`);

    // Step 4: Verify everything
    results.steps.push('\nStep 4: Verifying...');

    const nextAuthUserId = await kv.get(`user:email:${email}`);
    const profileUserId = await kv.get(`profile:email:${email}`);

    if (nextAuthUserId === profileUserId && nextAuthUserId === userId) {
      results.steps.push(`✅ All userIds match: ${userId}`);
      results.success = true;
    } else {
      results.steps.push(`❌ UserId mismatch! NextAuth: ${nextAuthUserId}, Profile: ${profileUserId}`);
      results.success = false;
    }

    // Test getUserByEmail flow
    const testUserId = await kv.get<string>(`profile:email:${email}`);
    if (testUserId) {
      const testProfile = await kv.get(`profile:${testUserId}`);
      if (testProfile) {
        results.steps.push('✅ getUserByEmail flow works');
      } else {
        results.steps.push('❌ getUserByEmail flow broken: profile not found');
        results.success = false;
      }
    }

    results.userId = userId;
    results.profile = updatedProfile;
    results.message = results.success ? 'Keys fixed! User can now log in, use magic links, and sign out.' : 'Fix attempted but verification failed';

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('Error fixing keys:', error);
    return NextResponse.json(
      { error: 'Failed to fix keys', details: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
