/**
 * Comprehensive fix for Russell's Redis keys
 * Handles the WRONGTYPE error by properly cleaning up and recreating all keys
 */

import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function fixRussellKeys() {
  const email = 'russell@rowship.com';
  const userId = email;

  console.log('\n🔧 Comprehensive Redis Key Fix for:', email);
  console.log('Database:', process.env.KV_REST_API_URL);
  console.log('\n' + '='.repeat(70) + '\n');

  try {
    // Step 1: Diagnose the issue
    console.log('📋 Step 1: Diagnosing current state...\n');

    const keysToCheck = [
      `user:${userId}`,
      `user:email:${email}`,
      `profile:${userId}`,
      `profile:email:${email}`,
    ];

    for (const key of keysToCheck) {
      try {
        const type = await kv.type(key);
        console.log(`   🔍 ${key}`);
        console.log(`      Type: ${type}`);

        if (type === 'string') {
          const value = await kv.get(key);
          console.log(`      Value: ${value}`);
        } else if (type === 'hash') {
          const value = await kv.hgetall(key);
          console.log(`      Value:`, value);
        } else if (type === 'set') {
          console.log(`      ⚠️  WRONG TYPE: This is a SET, expected STRING or HASH`);
        } else if (type !== 'none') {
          console.log(`      ⚠️  WRONG TYPE: ${type}`);
        }
      } catch (error: any) {
        console.log(`   ❌ Error checking ${key}: ${error.message}`);
      }
    }

    // Step 2: Delete ALL potentially conflicting keys
    console.log('\n📋 Step 2: Deleting ALL potentially conflicting keys...\n');

    const keysToDelete = [
      `user:${userId}`,
      `user:email:${email}`,
      `email:${email}`,
      `profile:email:${email}`, // This is the one causing WRONGTYPE!
    ];

    for (const key of keysToDelete) {
      try {
        const deleted = await kv.del(key);
        if (deleted > 0) {
          console.log(`   ✅ Deleted: ${key}`);
        } else {
          console.log(`   ⚪ Not found: ${key}`);
        }
      } catch (error: any) {
        console.log(`   ⚠️  Could not delete ${key}: ${error.message}`);
      }
    }

    // Step 3: Get the actual profile data
    console.log('\n📋 Step 3: Checking profile data...\n');

    const profile = await kv.get(`profile:${userId}`);

    if (profile) {
      console.log(`   ✅ Profile data exists at profile:${userId}`);
      const p = profile as any;
      console.log(`      - Email: ${p.email}`);
      console.log(`      - Phone: ${p.signalwirePhoneNumber}`);
      console.log(`      - Door Code: ${p.doorCode}`);
      console.log(`      - Subscription: ${p.subscriptionStatus}`);
      console.log(`      - Stripe ID: ${p.stripeCustomerId}`);
    } else {
      console.log(`   ⚠️  No profile data found at profile:${userId}`);
    }

    // Step 4: Create proper NextAuth user record
    console.log('\n📋 Step 4: Creating proper NextAuth user record...\n');

    await kv.hset(`user:${userId}`, {
      id: userId,
      email: email,
      emailVerified: Date.now(),
    });
    console.log(`   ✅ Created user hash: user:${userId}`);

    await kv.set(`user:email:${email}`, userId);
    console.log(`   ✅ Created email lookup: user:email:${email}`);

    // Step 5: Create proper profile email index (as STRING, not SET!)
    console.log('\n📋 Step 5: Creating proper profile email index...\n');

    await kv.set(`profile:email:${email}`, userId);
    console.log(`   ✅ Created profile email index: profile:email:${email}`);

    // Step 6: Verify everything works
    console.log('\n📋 Step 6: Verifying all keys are correct...\n');

    // Test NextAuth lookup
    const nextAuthUser = await kv.hgetall(`user:${userId}`);
    console.log(`   ✅ NextAuth user:`, nextAuthUser);

    const emailLookup = await kv.get(`user:email:${email}`);
    console.log(`   ✅ Email lookup:`, emailLookup);

    const profileEmailLookup = await kv.get(`profile:email:${email}`);
    console.log(`   ✅ Profile email index:`, profileEmailLookup);

    const profileType = await kv.type(`profile:email:${email}`);
    console.log(`   ✅ Profile email index type:`, profileType);

    // Test getUserByEmail flow
    console.log('\n📋 Step 7: Testing getUserByEmail flow...\n');

    const userIdFromEmail = await kv.get<string>(`profile:email:${email}`);
    if (userIdFromEmail) {
      console.log(`   ✅ Got userId from email: ${userIdFromEmail}`);
      const userProfile = await kv.get(`profile:${userIdFromEmail}`);
      if (userProfile) {
        console.log(`   ✅ Successfully retrieved profile!`);
      } else {
        console.log(`   ⚠️  Could not retrieve profile for userId: ${userIdFromEmail}`);
      }
    } else {
      console.log(`   ❌ Could not lookup userId from email`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n✅ ALL KEYS FIXED!\n');
    console.log('Russell can now:');
    console.log('  1. Log in at https://buzentry.com/login');
    console.log('  2. Use magic links');
    console.log('  3. Sign out properly');
    console.log('\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error);
    console.error('\nStack:', error.stack);
  }
}

// Run it
fixRussellKeys();
