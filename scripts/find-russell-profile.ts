/**
 * Find Russell's actual profile data in Redis
 */

import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function findProfile() {
  const email = 'russell@rowship.com';
  const oldUserId = 'user_1760372935734_puwe7h';

  console.log('\n🔍 Looking for Russell\'s profile data...\n');

  // Check the old userId
  console.log(`Checking profile:${oldUserId}...`);
  const profile = await kv.get(`profile:${oldUserId}`);

  if (profile) {
    console.log('\n✅ FOUND PROFILE!\n');
    console.log(JSON.stringify(profile, null, 2));

    // Now we need to either:
    // 1. Move this profile to profile:russell@rowship.com, OR
    // 2. Update profile:email:russell@rowship.com to point to the old userId

    console.log('\n📋 Options to fix:\n');
    console.log('1. Move profile to match userId (profile:russell@rowship.com)');
    console.log('2. Update profile:email index to point to old userId');
    console.log('\nChoosing option 2 (safer - keeps existing data structure)...\n');

    await kv.set(`profile:email:${email}`, oldUserId);
    console.log(`✅ Updated profile:email:${email} → ${oldUserId}`);

    // Verify
    const lookup = await kv.get(`profile:email:${email}`);
    console.log(`✅ Verified: profile:email:${email} = ${lookup}`);

    const retrievedProfile = await kv.get(`profile:${lookup}`);
    console.log(`✅ Can retrieve profile:`, !!retrievedProfile);

  } else {
    console.log('❌ Profile not found at old location either!');
    console.log('\nLet\'s search for any profile with this email...');

    // Try scanning for keys (note: this is expensive on large datasets)
    // We'll check a few common patterns
    const checkKeys = [
      `profile:${email}`,
      `profile:user_*`,
    ];

    for (const pattern of checkKeys) {
      const type = await kv.type(pattern);
      console.log(`${pattern}: ${type}`);
    }
  }
}

findProfile();
