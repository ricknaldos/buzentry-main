/**
 * Script to manually link a phone number to a user account
 *
 * Usage:
 * npx tsx scripts/link-phone-number.ts <email> <phoneNumber>
 *
 * Example:
 * npx tsx scripts/link-phone-number.ts russell@rowship.com +12818928899
 */

import * as dotenv from 'dotenv';
import { kv } from '@vercel/kv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function linkPhoneNumber(email: string, phoneNumber: string) {
  try {
    console.log(`Looking up user with email: ${email}`);

    // Get user ID from email (using correct Redis key format)
    const userId = await kv.get<string>(`user:email:${email}`);

    if (!userId) {
      console.error(`❌ User not found with email: ${email}`);
      process.exit(1);
    }

    console.log(`✅ Found user ID: ${userId}`);

    // Get user profile
    const userProfile = await kv.get(`user:${userId}`);

    if (!userProfile) {
      console.error(`❌ User profile not found for ID: ${userId}`);
      process.exit(1);
    }

    console.log(`✅ Found user profile`);

    // Check if phone number is already assigned to another user
    const existingUserId = await kv.get<string>(`phone:${phoneNumber}`);

    if (existingUserId && existingUserId !== userId) {
      console.error(`❌ Phone number ${phoneNumber} is already assigned to user: ${existingUserId}`);
      process.exit(1);
    }

    // Remove old phone number mapping if exists
    const oldPhoneNumber = (userProfile as any).signalwirePhoneNumber;
    if (oldPhoneNumber) {
      await kv.del(`phone:${oldPhoneNumber}`);
      console.log(`✅ Removed old phone number mapping: ${oldPhoneNumber}`);
    }

    // Update user profile with new phone number
    const updatedProfile = {
      ...userProfile,
      signalwirePhoneNumber: phoneNumber,
      updatedAt: Date.now(),
    };

    await kv.set(`user:${userId}`, updatedProfile);
    console.log(`✅ Updated user profile with phone number: ${phoneNumber}`);

    // Create phone number index
    await kv.set(`phone:${phoneNumber}`, userId);
    console.log(`✅ Created phone number index: ${phoneNumber} → ${userId}`);

    console.log(`\n🎉 Successfully linked phone number ${phoneNumber} to ${email} (${userId})`);
  } catch (error) {
    console.error('❌ Error linking phone number:', error);
    process.exit(1);
  }
}

// Get command line arguments
const email = process.argv[2];
const phoneNumber = process.argv[3];

if (!email || !phoneNumber) {
  console.error('Usage: npx tsx scripts/link-phone-number.ts <email> <phoneNumber>');
  console.error('Example: npx tsx scripts/link-phone-number.ts russell@rowship.com +12818928899');
  process.exit(1);
}

// Validate phone number format (E.164)
const phoneRegex = /^\+[1-9]\d{1,14}$/;
if (!phoneRegex.test(phoneNumber)) {
  console.error('❌ Invalid phone number format. Use E.164 format (e.g., +12818928899)');
  process.exit(1);
}

// Run the script
linkPhoneNumber(email, phoneNumber);
