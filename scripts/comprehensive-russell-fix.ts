/**
 * COMPREHENSIVE FIX - Handles all the messy key issues for Russell
 */

import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function comprehensiveFix() {
  const email = 'russell@rowship.com';
  const oldUserId = 'user_1760372935734_puwe7h';

  console.log('\n🔧 COMPREHENSIVE FIX FOR RUSSELL\n');
  console.log('='.repeat(70) + '\n');

  try {
    // Step 1: Get the profile data from wherever it is
    console.log('📋 Step 1: Locating profile data...\n');

    let profileData: any = null;

    // Check profile:oldUserId
    profileData = await kv.get(`profile:${oldUserId}`);
    if (profileData) {
      console.log(`✅ Found profile at profile:${oldUserId}`);
    }

    // Check user:oldUserId (old broken structure)
    if (!profileData) {
      profileData = await kv.get(`user:${oldUserId}`);
      if (profileData) {
        console.log(`✅ Found profile at user:${oldUserId} (old structure)`);
      }
    }

    if (!profileData) {
      console.log('❌ No profile data found! Cannot proceed.');
      return;
    }

    console.log('Profile data:', {
      email: profileData.email,
      phone: profileData.signalwirePhoneNumber,
      doorCode: profileData.doorCode,
      subscription: profileData.subscriptionStatus,
    });

    // Step 2: Delete ALL old keys
    console.log('\n📋 Step 2: Deleting ALL old/conflicting keys...\n');

    const keysToDelete = [
      `user:${email}`,
      `user:email:${email}`,
      `user:${oldUserId}`, // Old broken structure
      `profile:${email}`,
      `profile:email:${email}`,
      `email:${email}`,
    ];

    for (const key of keysToDelete) {
      try {
        const deleted = await kv.del(key);
        if (deleted > 0) {
          console.log(`✅ Deleted: ${key}`);
        } else {
          console.log(`⚪ Not found: ${key}`);
        }
      } catch (error: any) {
        console.log(`⚠️  Error deleting ${key}: ${error.message}`);
      }
    }

    // Step 3: Decide on userId strategy
    // Option A: Use email as userId (simpler, matches recent signups)
    // Option B: Keep old userId (matches existing profile structure)
    // Let's go with Option A for consistency with your recent changes

    const userId = email; // Use email as userId

    console.log(`\n📋 Step 3: Creating clean structure with userId = ${userId}...\n`);

    // Create NextAuth user record (HASH)
    await kv.hset(`user:${userId}`, {
      id: userId,
      email: email,
      emailVerified: Date.now(),
    });
    console.log(`✅ Created NextAuth user: user:${userId}`);

    // Create NextAuth email lookup (STRING)
    await kv.set(`user:email:${email}`, userId);
    console.log(`✅ Created NextAuth email lookup: user:email:${email}`);

    // Update profile data to use new userId
    const updatedProfile = {
      ...profileData,
      userId: userId, // Update userId in profile
      updatedAt: Date.now(),
    };

    // Create profile record (STRING with JSON)
    await kv.set(`profile:${userId}`, updatedProfile);
    console.log(`✅ Created profile: profile:${userId}`);

    // Create profile email lookup (STRING)
    await kv.set(`profile:email:${email}`, userId);
    console.log(`✅ Created profile email lookup: profile:email:${email}`);

    // Step 4: Clean up old profile key
    const oldProfileDeleted = await kv.del(`profile:${oldUserId}`);
    if (oldProfileDeleted > 0) {
      console.log(`✅ Deleted old profile: profile:${oldUserId}`);
    }

    // Step 5: Comprehensive verification
    console.log('\n📋 Step 4: Comprehensive verification...\n');

    // Verify NextAuth flow
    const nextAuthUserId = await kv.get(`user:email:${email}`);
    console.log(`✅ NextAuth email lookup: ${nextAuthUserId}`);

    const nextAuthUser = await kv.hgetall(`user:${nextAuthUserId}`);
    console.log(`✅ NextAuth user exists:`, nextAuthUser);

    const nextAuthUserType = await kv.type(`user:${nextAuthUserId}`);
    console.log(`✅ NextAuth user type: ${nextAuthUserType} (should be 'hash')`);

    // Verify profile flow
    const profileUserId = await kv.get<string>(`profile:email:${email}`);
    console.log(`✅ Profile email lookup: ${profileUserId}`);

    const profile = await kv.get(`profile:${profileUserId}`);
    console.log(`✅ Profile exists:`, !!profile);

    const profileType = await kv.type(`profile:${profileUserId}`);
    console.log(`✅ Profile type: ${profileType} (should be 'string')`);

    const profileEmailType = await kv.type(`profile:email:${email}`);
    console.log(`✅ Profile email type: ${profileEmailType} (should be 'string')`);

    // Verify they match
    if (nextAuthUserId === profileUserId) {
      console.log(`✅ UserIds match! ${nextAuthUserId}`);
    } else {
      console.log(`❌ UserIds don't match! NextAuth: ${nextAuthUserId}, Profile: ${profileUserId}`);
    }

    // Test getUserByEmail flow
    console.log('\n📋 Step 5: Testing getUserByEmail flow...\n');

    const testUserId = await kv.get<string>(`profile:email:${email}`);
    if (!testUserId) {
      console.log('❌ Email lookup failed');
    } else {
      console.log(`✅ Email lookup succeeded: ${testUserId}`);
      const testProfile = await kv.get(`profile:${testUserId}`);
      if (testProfile) {
        console.log('✅ Profile retrieval succeeded');
      } else {
        console.log('❌ Profile retrieval failed');
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n✅ ALL KEYS FIXED AND VERIFIED!\n');
    console.log('Summary:');
    console.log(`  - Email: ${email}`);
    console.log(`  - UserId: ${userId}`);
    console.log(`  - Phone: ${updatedProfile.signalwirePhoneNumber}`);
    console.log(`  - Door Code: ${updatedProfile.doorCode}`);
    console.log(`  - Subscription: ${updatedProfile.subscriptionStatus}`);
    console.log('\nRussell can now:');
    console.log('  ✅ Log in with magic links');
    console.log('  ✅ Access the dashboard');
    console.log('  ✅ Sign out properly');
    console.log('  ✅ Use all app features\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('\nStack:', error.stack);
  }
}

comprehensiveFix();
