/**
 * Script to create a test passcode for a user
 *
 * Usage:
 * npx tsx scripts/create-test-passcode.ts <email>
 *
 * Example:
 * npx tsx scripts/create-test-passcode.ts russell@rowship.com
 */

import * as dotenv from 'dotenv';
import { kv } from '@vercel/kv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function createTestPasscode(email: string) {
  try {
    console.log(`\n🔐 Creating test passcode for: ${email}\n`);

    // Get user ID from email
    const userId = await kv.get<string>(`email:${email}`);

    if (!userId) {
      console.error(`❌ User not found with email: ${email}`);
      process.exit(1);
    }

    console.log(`✅ Found user ID: ${userId}`);

    // Get user profile
    const userProfile = await kv.get<any>(`user:${userId}`);

    if (!userProfile) {
      console.error(`❌ User profile not found for ID: ${userId}`);
      process.exit(1);
    }

    // Generate test passcode
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const now = Date.now();

    const testPasscode = {
      id: `passcode_${now}_test`,
      code,
      label: 'Test Guest Access',
      createdAt: now,
      expiresAt: now + (24 * 60 * 60 * 1000), // Expires in 24 hours
      usageCount: 0,
      maxUsages: 5, // Max 5 uses
      lastUsedAt: null,
      isActive: true,
    };

    // Add to user's passcodes
    const existingPasscodes = userProfile.passcodes || [];
    const updatedProfile = {
      ...userProfile,
      passcodes: [...existingPasscodes, testPasscode],
      updatedAt: Date.now(),
    };

    await kv.set(`user:${userId}`, updatedProfile);

    console.log(`✅ Test passcode created!\n`);
    console.log(`📋 Passcode Details:`);
    console.log(`   Code: ${code}`);
    console.log(`   Label: ${testPasscode.label}`);
    console.log(`   Expires: ${new Date(testPasscode.expiresAt).toLocaleString()}`);
    console.log(`   Max Uses: ${testPasscode.maxUsages}`);
    console.log(`   Current Uses: ${testPasscode.usageCount}`);

    console.log(`\n📞 Test Instructions:`);
    console.log(`   1. Call: ${userProfile.signalwirePhoneNumber}`);
    console.log(`   2. When prompted, enter: ${code}`);
    console.log(`   3. Door should unlock!`);
    console.log(`\n⚠️  Note: Make sure you have a door code set in the dashboard first!\n`);
  } catch (error) {
    console.error('❌ Error creating test passcode:', error);
    process.exit(1);
  }
}

// Get command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: npx tsx scripts/create-test-passcode.ts <email>');
  console.error('Example: npx tsx scripts/create-test-passcode.ts russell@rowship.com');
  process.exit(1);
}

// Run the script
createTestPasscode(email);
