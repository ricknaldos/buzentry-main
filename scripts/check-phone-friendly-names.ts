/**
 * Script to check the friendly names of all phone numbers in SignalWire
 *
 * Usage:
 * npx tsx scripts/check-phone-friendly-names.ts
 */

import * as dotenv from 'dotenv';
// @ts-ignore - SignalWire types have export resolution issues
import { RestClient } from '@signalwire/compatibility-api';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function checkPhoneFriendlyNames() {
  try {
    console.log('🔍 Checking all phone numbers in SignalWire account...\n');

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

    console.log(`Found ${numbers.length} phone number(s):\n`);

    // Display each number with its friendly name
    numbers.forEach((number: any, index: number) => {
      console.log(`${index + 1}. Phone Number: ${number.phoneNumber}`);
      console.log(`   SID: ${number.sid}`);
      console.log(`   Friendly Name: ${number.friendlyName || '(not set)'}`);
      console.log(`   Voice URL: ${number.voiceUrl || '(not set)'}`);
      console.log(`   Status Callback: ${number.statusCallback || '(not set)'}`);
      console.log('');
    });

    // Check for missing friendly names
    const missingFriendlyName = numbers.filter((n: any) => !n.friendlyName || n.friendlyName === n.phoneNumber);

    if (missingFriendlyName.length > 0) {
      console.log(`⚠️  Warning: ${missingFriendlyName.length} number(s) without proper friendly names:`);
      missingFriendlyName.forEach((n: any) => {
        console.log(`   - ${n.phoneNumber} (SID: ${n.sid})`);
      });
    } else {
      console.log('✅ All phone numbers have friendly names set!');
    }

  } catch (error) {
    console.error('❌ Error checking phone numbers:', error);
    process.exit(1);
  }
}

// Run the script
checkPhoneFriendlyNames();
