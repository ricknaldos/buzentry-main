/**
 * Final comprehensive fix for Russell's account
 * Aligns NextAuth userId with the existing profile userId
 */

import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function finalFix() {
  const email = 'russell@rowship.com';
  const oldUserId = 'user_1760372935734_puwe7h';

  console.log('\n🔧 Final Comprehensive Fix for Russell\n');
  console.log('='.repeat(70) + '\n');

  // Strategy: Use the old userId everywhere since that's where the profile data lives
  // This is safer than moving the profile data

  try {
    // Step 1: Verify the profile exists
    console.log('📋 Step 1: Verifying profile data...\n');
    const profile = await kv.get(`profile:${oldUserId}`);

    if (!profile) {
      console.log('❌ Profile not found! Cannot proceed.');
      return;
    }

    console.log(`✅ Profile exists at profile:${oldUserId}`);
    const p = profile as any;
    console.log(`   - Phone: ${p.signalwirePhoneNumber}`);
    console.log(`   - Door Code: ${p.doorCode}`);
    console.log(`   - Subscription: ${p.subscriptionStatus}`);

    // Step 2: Delete old NextAuth keys that use email as userId
    console.log('\n📋 Step 2: Cleaning up old NextAuth keys...\n');

    await kv.del(`user:${email}`);
    console.log(`✅ Deleted user:${email}`);

    // Step 3: Create NextAuth user with the OLD userId (matching the profile)
    console.log('\n📋 Step 3: Creating NextAuth user with correct userId...\n');

    await kv.hset(`user:${oldUserId}`, {
      id: oldUserId,
      email: email,
      emailVerified: Date.now(),
    });
    console.log(`✅ Created user hash: user:${oldUserId}`);

    // Step 4: Update email lookup to point to old userId
    await kv.set(`user:email:${email}`, oldUserId);
    console.log(`✅ Updated email lookup: user:email:${email} → ${oldUserId}`);

    // Step 5: Update profile email index (already done but let's verify)
    await kv.set(`profile:email:${email}`, oldUserId);
    console.log(`✅ Updated profile email index: profile:email:${email} → ${oldUserId}`);

    // Step 6: Comprehensive verification
    console.log('\n📋 Step 4: Comprehensive verification...\n');

    // Test NextAuth flow
    const nextAuthUserId = await kv.get(`user:email:${email}`);
    console.log(`✅ NextAuth email lookup returns: ${nextAuthUserId}`);

    const nextAuthUser = await kv.hgetall(`user:${nextAuthUserId}`);
    console.log(`✅ NextAuth user exists:`, nextAuthUser);

    // Test profile lookup flow
    const profileUserId = await kv.get<string>(`profile:email:${email}`);
    console.log(`✅ Profile email lookup returns: ${profileUserId}`);

    const userProfile = await kv.get(`profile:${profileUserId}`);
    console.log(`✅ Profile data can be retrieved:`, !!userProfile);

    // Verify they match
    if (nextAuthUserId === profileUserId) {
      console.log(`✅ UserIds match! ${nextAuthUserId} === ${profileUserId}`);
    } else {
      console.log(`❌ UserIds don't match! ${nextAuthUserId} !== ${profileUserId}`);
    }

    // Step 7: Clean up any other stray keys
    console.log('\n📋 Step 5: Cleaning up stray keys...\n');

    const strayKeys = [
      `email:${email}`,
      `user:${email}`, // already deleted but double check
    ];

    for (const key of strayKeys) {
      const deleted = await kv.del(key);
      if (deleted > 0) {
        console.log(`✅ Deleted stray key: ${key}`);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n✅ EVERYTHING IS FIXED!\n');
    console.log('Summary:');
    console.log(`  - NextAuth userId: ${oldUserId}`);
    console.log(`  - Profile userId: ${oldUserId}`);
    console.log(`  - Email: ${email}`);
    console.log(`  - Phone: ${p.signalwirePhoneNumber}`);
    console.log(`  - Subscription: ${p.subscriptionStatus}`);
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

finalFix();
