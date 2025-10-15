/**
 * Script to configure SignalWire phone number webhooks programmatically
 *
 * Usage:
 * npx tsx scripts/configure-signalwire-phone.ts <phoneNumber> <appUrl>
 *
 * Example:
 * npx tsx scripts/configure-signalwire-phone.ts +12818928899 https://buzentry.com
 */

import * as dotenv from 'dotenv';
// @ts-ignore - SignalWire types have export resolution issues
import { RestClient } from '@signalwire/compatibility-api';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function configurePhoneNumber(phoneNumber: string, appUrl: string) {
  try {
    console.log(`🔧 Configuring SignalWire phone number: ${phoneNumber}`);
    console.log(`📡 Webhook URL: ${appUrl}/api/signalwire/voice`);

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

    console.log('✅ SignalWire client initialized');

    // Find the phone number
    console.log(`🔍 Looking for phone number: ${phoneNumber}`);
    const numbers = await client.incomingPhoneNumbers.list({
      phoneNumber,
    });

    if (numbers.length === 0) {
      console.error(`❌ Phone number ${phoneNumber} not found in SignalWire account`);
      console.error('Make sure the phone number exists in your SignalWire dashboard');
      process.exit(1);
    }

    const phoneNumberSid = numbers[0].sid;
    console.log(`✅ Found phone number SID: ${phoneNumberSid}`);

    // Update phone number configuration
    console.log('⚙️  Updating webhook configuration...');

    const updated = await client.incomingPhoneNumbers(phoneNumberSid).update({
      friendlyName: 'BuzEntry - russell@rowship.com',
      voiceUrl: `${appUrl}/api/signalwire/voice`,
      voiceMethod: 'POST',
      statusCallback: `${appUrl}/api/signalwire/status`,
      statusCallbackMethod: 'POST',
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    });

    console.log('\n✅ Phone number configured successfully!\n');
    console.log('📋 Configuration:');
    console.log(`   Friendly Name: ${updated.friendlyName}`);
    console.log(`   Voice URL: ${updated.voiceUrl}`);
    console.log(`   Voice Method: ${updated.voiceMethod}`);
    console.log(`   Status Callback: ${updated.statusCallback}`);
    console.log(`   Status Callback Method: ${updated.statusCallbackMethod}`);
    console.log('\n🎉 Done! Your phone number is ready to receive calls.');
    console.log('\n📞 Test by calling: ' + phoneNumber);
  } catch (error) {
    console.error('❌ Error configuring phone number:', error);
    process.exit(1);
  }
}

// Get command line arguments
const phoneNumber = process.argv[2];
const appUrl = process.argv[3] || process.env.NEXT_PUBLIC_APP_URL;

if (!phoneNumber) {
  console.error('Usage: npx tsx scripts/configure-signalwire-phone.ts <phoneNumber> [appUrl]');
  console.error('\nExamples:');
  console.error('  npx tsx scripts/configure-signalwire-phone.ts +12818928899 https://buzentry.com');
  console.error('  npx tsx scripts/configure-signalwire-phone.ts +12818928899');
  process.exit(1);
}

if (!appUrl) {
  console.error('❌ App URL not provided and NEXT_PUBLIC_APP_URL not set');
  console.error('Usage: npx tsx scripts/configure-signalwire-phone.ts <phoneNumber> <appUrl>');
  process.exit(1);
}

// Validate phone number format (E.164)
const phoneRegex = /^\+[1-9]\d{1,14}$/;
if (!phoneRegex.test(phoneNumber)) {
  console.error('❌ Invalid phone number format. Use E.164 format (e.g., +12818928899)');
  process.exit(1);
}

// Run the script
configurePhoneNumber(phoneNumber, appUrl);
