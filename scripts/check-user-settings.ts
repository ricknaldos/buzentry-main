/**
 * Script to check user settings in KV database
 *
 * Usage:
 * npx tsx scripts/check-user-settings.ts <email>
 *
 * Example:
 * npx tsx scripts/check-user-settings.ts russell@rowship.com
 */

import * as dotenv from 'dotenv';
import { kv } from '@vercel/kv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function checkUserSettings(email: string) {
  try {
    console.log(`\n🔍 Checking settings for: ${email}\n`);

    // Get user ID from email
    const userId = await kv.get<string>(`email:${email}`);

    if (!userId) {
      console.error(`❌ User not found with email: ${email}`);
      process.exit(1);
    }

    console.log(`✅ User ID: ${userId}`);

    // Get user profile
    const userProfile = await kv.get<any>(`user:${userId}`);

    if (!userProfile) {
      console.error(`❌ User profile not found for ID: ${userId}`);
      process.exit(1);
    }

    console.log(`\n📋 User Profile:`);
    console.log(`   Email: ${userProfile.email}`);
    console.log(`   User ID: ${userProfile.userId}`);
    console.log(`   Phone Number: ${userProfile.signalwirePhoneNumber || 'Not set'}`);
    console.log(`   Door Code: ${userProfile.doorCode || 'Not set'}`);
    console.log(`   Access Code: ${userProfile.accessCode || 'Not set (public access)'}`);
    console.log(`   Is Paused: ${userProfile.isPaused ? 'Yes' : 'No'}`);
    console.log(`   Forwarding Enabled: ${userProfile.forwardingEnabled ? 'Yes' : 'No'}`);
    console.log(`   Forwarding Numbers: ${userProfile.forwardingNumbers?.length ? userProfile.forwardingNumbers.join(', ') : 'None'}`);
    console.log(`   Passcodes: ${userProfile.passcodes?.length || 0} active`);
    console.log(`   Subscription Status: ${userProfile.subscriptionStatus || 'Unknown'}`);
    console.log(`   Created At: ${new Date(userProfile.createdAt).toLocaleString()}`);
    console.log(`   Updated At: ${new Date(userProfile.updatedAt).toLocaleString()}`);

    // Check phone number index
    if (userProfile.signalwirePhoneNumber) {
      const phoneUserId = await kv.get<string>(`phone:${userProfile.signalwirePhoneNumber}`);
      console.log(`\n📞 Phone Number Index:`);
      console.log(`   phone:${userProfile.signalwirePhoneNumber} → ${phoneUserId}`);
      if (phoneUserId === userId) {
        console.log(`   ✅ Phone number correctly linked to user`);
      } else {
        console.log(`   ❌ Phone number index mismatch! Expected: ${userId}, Got: ${phoneUserId}`);
      }
    }

    console.log(`\n🎉 User settings check complete!\n`);
  } catch (error) {
    console.error('❌ Error checking user settings:', error);
    process.exit(1);
  }
}

// Get command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: npx tsx scripts/check-user-settings.ts <email>');
  console.error('Example: npx tsx scripts/check-user-settings.ts russell@rowship.com');
  process.exit(1);
}

// Run the script
checkUserSettings(email);
