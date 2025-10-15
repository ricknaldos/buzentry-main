/**
 * Fix russell@deephire.com account
 */

import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function fixDeephire() {
  const email = 'russell@deephire.com';

  console.log('\n🔧 Fixing russell@deephire.com\n');
  console.log('='.repeat(70) + '\n');

  try {
    // Use email as userId for consistency
    const userId = email;

    // Step 1: Find existing profile data
    console.log('📋 Step 1: Locating profile data...\n');

    let profileData: any = null;
    let oldUserId: string | null = null;

    // Try to find profile via email index
    const profileUserIdFromIndex = await kv.get<string>(`profile:email:${email}`);
    if (profileUserIdFromIndex) {
      profileData = await kv.get(`profile:${profileUserIdFromIndex}`);
      if (profileData) {
        oldUserId = profileUserIdFromIndex;
        console.log(`✅ Found profile at profile:${oldUserId}`);
      }
    }

    // Try email as userId (common pattern)
    if (!profileData) {
      profileData = await kv.get(`profile:${email}`);
      if (profileData) {
        oldUserId = email;
        console.log(`✅ Found profile at profile:${email}`);
      }
    }

    // Try old broken structure where profile was stored under user:userId
    if (!profileData) {
      const possibleUserId = await kv.get(`user:${email}`);
      if (possibleUserId && typeof possibleUserId === 'object') {
        profileData = possibleUserId;
        oldUserId = email;
        console.log(`✅ Found profile at user:${email} (old broken structure)`);
      }
    }

    if (!profileData) {
      console.log('❌ No profile data found! This account may not have completed signup.');
      console.log('If the user completed Stripe checkout, check Stripe dashboard for customer email.');
      return;
    }

    console.log('Profile data:', {
      email: profileData.email,
      phone: profileData.signalwirePhoneNumber,
      doorCode: profileData.doorCode,
      subscription: profileData.subscriptionStatus,
    });

    // Step 2: Delete ALL potentially conflicting keys
    console.log('\n📋 Step 2: Deleting all conflicting keys...\n');

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
          console.log(`✅ Deleted: ${key}`);
        }
      } catch (error: any) {
        console.log(`⚠️  Error deleting ${key}: ${error.message}`);
      }
    }

    // Step 3: Create clean structure with email as userId
    console.log('\n📋 Step 3: Creating clean structure...\n');

    // Create NextAuth user record (STRING with JSON - required by Upstash Redis Adapter!)
    const userObject = {
      id: userId,
      email: email,
      emailVerified: Date.now(),
    };
    await kv.set(`user:${userId}`, userObject);
    console.log(`✅ Created NextAuth user (JSON STRING): user:${userId}`);

    // Create NextAuth email lookup (STRING)
    await kv.set(`user:email:${email}`, userId);
    console.log(`✅ Created NextAuth email lookup`);

    // Update and save profile with correct userId
    const updatedProfile = {
      ...profileData,
      userId: userId,
      updatedAt: Date.now(),
    };

    await kv.set(`profile:${userId}`, updatedProfile);
    console.log(`✅ Created profile: profile:${userId}`);

    // Create profile email lookup (STRING)
    await kv.set(`profile:email:${email}`, userId);
    console.log(`✅ Created profile email lookup`);

    // Step 4: Verify everything
    console.log('\n📋 Step 4: Verifying...\n');

    const nextAuthUserId = await kv.get(`user:email:${email}`);
    const profileUserId = await kv.get(`profile:email:${email}`);

    console.log(`✅ NextAuth email lookup: ${nextAuthUserId}`);
    console.log(`✅ Profile email lookup: ${profileUserId}`);

    if (nextAuthUserId === profileUserId && nextAuthUserId === userId) {
      console.log(`✅ All userIds match: ${userId}`);
    } else {
      console.log(`❌ UserId mismatch! NextAuth: ${nextAuthUserId}, Profile: ${profileUserId}`);
      return;
    }

    // Test getUserByEmail flow
    const testUserId = await kv.get<string>(`profile:email:${email}`);
    if (testUserId) {
      const testProfile = await kv.get(`profile:${testUserId}`);
      if (testProfile) {
        console.log('✅ getUserByEmail flow works');
      } else {
        console.log('❌ getUserByEmail flow broken: profile not found');
        return;
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n✅ ACCOUNT FIXED!\n');
    console.log('Summary:');
    console.log(`  - Email: ${email}`);
    console.log(`  - UserId: ${userId}`);
    console.log(`  - Phone: ${updatedProfile.signalwirePhoneNumber}`);
    console.log(`  - Door Code: ${updatedProfile.doorCode || 'Not set'}`);
    console.log(`  - Subscription: ${updatedProfile.subscriptionStatus}`);
    console.log('\nUser can now:');
    console.log('  ✅ Log in with magic links');
    console.log('  ✅ Access the dashboard');
    console.log('  ✅ Sign out properly');
    console.log('  ✅ Use all app features\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('\nStack:', error.stack);
  }
}

fixDeephire();
