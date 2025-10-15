/**
 * Script to fix friendly names for phone numbers that don't have proper email associations
 *
 * This script will:
 * 1. List all phone numbers in SignalWire
 * 2. For each number with just the phone number as friendly name, look up the user in Redis
 * 3. Update the friendly name to include the user's email
 *
 * Usage:
 * npx tsx scripts/fix-phone-friendly-names.ts
 */

import * as dotenv from 'dotenv';
// @ts-ignore - SignalWire types have export resolution issues
import { RestClient } from '@signalwire/compatibility-api';
import { kv } from '@vercel/kv';
import { getUserByEmail } from '../lib/user-db';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function fixPhoneFriendlyNames() {
  try {
    console.log('🔧 Fixing phone number friendly names...\n');

    // Initialize SignalWire client
    const projectId = process.env.SIGNALWIRE_PROJECT_ID;
    const authToken = process.env.SIGNALWIRE_API_TOKEN;
    const spaceUrl = process.env.SIGNALWIRE_SPACE_URL;

    if (!projectId || !authToken || !spaceUrl) {
      console.error('❌ SignalWire credentials not found in .env.local');
      console.error('Required: SIGNALWIRE_PROJECT_ID, SIGNALWIRE_API_TOKEN, SIGNALWIRE_SPACE_URL');
      process.exit(1);
    }

    const client = new RestClient(projectId, authToken, { signalwireSpaceUrl: spaceUrl });

    console.log('✅ SignalWire client initialized\n');

    // List all phone numbers
    const numbers = await client.incomingPhoneNumbers.list({
      limit: 100,
    });

    if (numbers.length === 0) {
      console.log('No phone numbers found in account.');
      process.exit(0);
    }

    console.log(`Found ${numbers.length} phone number(s)\n`);

    // Find numbers that need fixing (friendly name doesn't start with "BuzEntry")
    const numbersToFix = numbers.filter((n: any) => {
      const friendlyName = n.friendlyName || '';
      // Check if friendly name doesn't start with "BuzEntry"
      return !friendlyName.startsWith('BuzEntry');
    });

    if (numbersToFix.length === 0) {
      console.log('✅ All phone numbers already have proper friendly names!');
      process.exit(0);
    }

    console.log(`Found ${numbersToFix.length} number(s) that need fixing:\n`);

    for (const number of numbersToFix) {
      console.log(`📞 Processing ${number.phoneNumber}...`);

      // Look up user in Redis by phone number
      const userId = await kv.get<string>(`phone:${number.phoneNumber}`);

      if (!userId) {
        console.log(`   ⚠️  No user found for ${number.phoneNumber}, skipping`);
        continue;
      }

      console.log(`   Found user ID: ${userId}`);

      // Get user profile to find email
      const user = await getUserByEmail(userId);

      if (!user || !user.email) {
        console.log(`   ⚠️  Could not get email for user ${userId}, skipping`);
        continue;
      }

      console.log(`   Found email: ${user.email}`);

      // Update friendly name
      const newFriendlyName = `BuzEntry - ${user.email}`;

      try {
        await client.incomingPhoneNumbers(number.sid).update({
          friendlyName: newFriendlyName,
        });
        console.log(`   ✅ Updated friendly name to: ${newFriendlyName}\n`);
      } catch (error) {
        console.error(`   ❌ Error updating ${number.phoneNumber}:`, error);
        console.log('');
      }
    }

    console.log('\n🎉 Done! All phone numbers have been updated.');

  } catch (error) {
    console.error('❌ Error fixing phone numbers:', error);
    process.exit(1);
  }
}

// Run the script
fixPhoneFriendlyNames();
