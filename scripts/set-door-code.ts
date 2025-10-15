/**
 * Script to set door code for a user
 *
 * Usage:
 * npx tsx scripts/set-door-code.ts <email> <doorCode> [accessCode]
 *
 * Examples:
 * npx tsx scripts/set-door-code.ts russell@rowship.com 4
 * npx tsx scripts/set-door-code.ts russell@rowship.com 4 1234
 */

import * as dotenv from 'dotenv';
import { kv } from '@vercel/kv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function setDoorCode(email: string, doorCode: string, accessCode?: string) {
  try {
    console.log(`\n⚙️  Setting door code for: ${email}\n`);

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

    // Update user profile with door code
    const updatedProfile = {
      ...userProfile,
      doorCode,
      accessCode: accessCode || userProfile.accessCode || null,
      updatedAt: Date.now(),
    };

    await kv.set(`user:${userId}`, updatedProfile);

    console.log(`✅ Door code set: ${doorCode}`);
    if (accessCode) {
      console.log(`✅ Access code set: ${accessCode}`);
    } else if (updatedProfile.accessCode) {
      console.log(`ℹ️  Access code unchanged: ${updatedProfile.accessCode}`);
    } else {
      console.log(`ℹ️  Access code: Not set (public access)`);
    }

    console.log(`\n📋 Updated Settings:`);
    console.log(`   Email: ${userProfile.email}`);
    console.log(`   Phone Number: ${userProfile.signalwirePhoneNumber}`);
    console.log(`   Door Code: ${doorCode}`);
    console.log(`   Access Code: ${updatedProfile.accessCode || 'Not set (public access)'}`);

    console.log(`\n🎉 Settings updated successfully!\n`);
    console.log(`📞 Test by calling: ${userProfile.signalwirePhoneNumber}`);

    if (updatedProfile.accessCode) {
      console.log(`   → Caller will be prompted for access code: ${updatedProfile.accessCode}`);
      console.log(`   → After entering correct code, door will unlock with code: ${doorCode}`);
    } else {
      console.log(`   → Door will unlock automatically with code: ${doorCode}`);
    }
  } catch (error) {
    console.error('❌ Error setting door code:', error);
    process.exit(1);
  }
}

// Get command line arguments
const email = process.argv[2];
const doorCode = process.argv[3];
const accessCode = process.argv[4];

if (!email || !doorCode) {
  console.error('Usage: npx tsx scripts/set-door-code.ts <email> <doorCode> [accessCode]');
  console.error('\nExamples:');
  console.error('  npx tsx scripts/set-door-code.ts russell@rowship.com 4');
  console.error('  npx tsx scripts/set-door-code.ts russell@rowship.com 4 1234');
  console.error('\nArguments:');
  console.error('  email       - User email address');
  console.error('  doorCode    - Button to press on callbox (e.g., 4, 6, 9)');
  console.error('  accessCode  - (Optional) 4-digit code callers must enter first');
  process.exit(1);
}

// Run the script
setDoorCode(email, doorCode, accessCode);
