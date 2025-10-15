/**
 * Fix production Redis keys directly
 * This runs against the actual Vercel KV production database
 */

import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function fixProductionKeys() {
  const email = 'russell@rowship.com';
  const userId = email;

  console.log('\n🚀 Fixing PRODUCTION Redis keys for:', email);
  console.log('Database:', process.env.KV_REST_API_URL);
  console.log('\n' + '='.repeat(60) + '\n');

  try {
    // Step 1: Delete conflicting keys
    console.log('📋 Step 1: Deleting conflicting old keys...\n');

    const keysToDelete = [
      `user:email:${email}`,
      `email:${email}`,
      `user:${userId}`,
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

    // Step 2: Create proper NextAuth user hash
    console.log('\n📋 Step 2: Creating proper NextAuth user record...\n');

    await kv.hset(`user:${userId}`, {
      id: userId,
      email: email,
      emailVerified: Date.now(),
    });
    console.log(`   ✅ Created user hash: user:${userId}`);

    await kv.set(`user:email:${email}`, userId);
    console.log(`   ✅ Created email lookup: user:email:${email}`);

    // Step 3: Verify profile still exists
    console.log('\n📋 Step 3: Verifying profile data...\n');

    const profileUserId = await kv.get(`profile:email:${email}`);

    if (profileUserId) {
      console.log(`   ✅ Profile email index exists: profile:email:${email}`);
      console.log(`   → Points to: ${profileUserId}`);

      const profile = await kv.get(`profile:${profileUserId}`);
      if (profile) {
        console.log(`   ✅ Profile data exists and is intact`);
        const p = profile as any;
        console.log(`      - Phone: ${p.signalwirePhoneNumber}`);
        console.log(`      - Door Code: ${p.doorCode}`);
        console.log(`      - Subscription: ${p.subscriptionStatus}`);
      }
    } else {
      console.log(`   ⚠️  No profile found for ${email}`);
    }

    // Step 4: Verify NextAuth keys
    console.log('\n📋 Step 4: Verifying NextAuth keys...\n');

    const userHash = await kv.hgetall(`user:${userId}`);
    console.log(`   ✅ User hash exists:`, userHash);

    const emailLookup = await kv.get(`user:email:${email}`);
    console.log(`   ✅ Email lookup exists:`, emailLookup);

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ PRODUCTION KEYS FIXED!\n');
    console.log('You can now log in at https://buzentry.com/login');
    console.log('\n');

  } catch (error: any) {
    console.error('\n❌ Error fixing keys:', error);
    console.error('\nStack:', error.stack);
  }
}

// Run it
fixProductionKeys();
