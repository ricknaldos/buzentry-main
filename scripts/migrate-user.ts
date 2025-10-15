/**
 * Migrate specific user from old key structure to new key structure
 * Run with: npx tsx scripts/migrate-user.ts russell@rowship.com
 */

import { config } from 'dotenv';
import { kv } from '@vercel/kv';

// Load environment variables
config({ path: '.env.local' });

async function migrateUser(email: string) {
  console.log(`\n🔄 Migrating user: ${email}\n`);

  try {
    // Step 1: Get userId from old email index
    const oldEmailKey = `email:${email}`;
    const userId = await kv.get<string>(oldEmailKey);

    if (!userId) {
      console.log(`❌ No user found with email: ${email}`);
      console.log(`   Checked key: ${oldEmailKey}`);
      return;
    }

    console.log(`✅ Found userId: ${userId}`);

    // Step 2: Get user profile from old key
    const oldUserKey = `user:${userId}`;
    const userProfile = await kv.get(oldUserKey);

    if (!userProfile) {
      console.log(`❌ No profile found for userId: ${userId}`);
      console.log(`   Checked key: ${oldUserKey}`);
      return;
    }

    console.log(`✅ Found user profile:`, userProfile);

    // Step 3: Copy to new keys
    const newUserKey = `profile:${userId}`;
    const newEmailKey = `profile:email:${email}`;

    await kv.set(newUserKey, userProfile);
    console.log(`✅ Copied profile to: ${newUserKey}`);

    await kv.set(newEmailKey, userId);
    console.log(`✅ Copied email index to: ${newEmailKey}`);

    // Step 4: Verify migration
    const verifyProfile = await kv.get(newUserKey);
    const verifyUserId = await kv.get(newEmailKey);

    if (verifyProfile && verifyUserId === userId) {
      console.log(`\n✅ Migration successful!`);
      console.log(`   Profile accessible at: ${newUserKey}`);
      console.log(`   Email lookup at: ${newEmailKey}`);
      console.log(`\n💡 You can now delete old keys if desired:`);
      console.log(`   - ${oldUserKey}`);
      console.log(`   - ${oldEmailKey}`);
    } else {
      console.log(`\n❌ Migration verification failed`);
    }

  } catch (error) {
    console.error(`\n❌ Migration failed:`, error);
  }
}

// Get email from command line args
const email = process.argv[2];

if (!email) {
  console.error('Usage: npx tsx scripts/migrate-user.ts <email>');
  process.exit(1);
}

migrateUser(email);
