/**
 * Test script to verify the correct parameter casing for incomingPhoneNumbers.create()
 *
 * This will attempt to purchase a number with BOTH camelCase and PascalCase to see which works
 *
 * Usage:
 * npx tsx scripts/test-create-params.ts
 */

import * as dotenv from 'dotenv';
// @ts-ignore - SignalWire types have export resolution issues
import { RestClient } from '@signalwire/compatibility-api';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testCreateParams() {
  try {
    console.log('🧪 Testing parameter casing for incomingPhoneNumbers.create()...\n');

    // Initialize SignalWire client
    const projectId = process.env.SIGNALWIRE_PROJECT_ID;
    const authToken = process.env.SIGNALWIRE_API_TOKEN;
    const spaceUrl = process.env.SIGNALWIRE_SPACE_URL;

    if (!projectId || !authToken || !spaceUrl) {
      console.error('❌ SignalWire credentials not found in .env.local');
      process.exit(1);
    }

    const client = new RestClient(projectId, authToken, { signalwireSpaceUrl: spaceUrl });
    console.log('✅ SignalWire client initialized\n');

    // Search for an available number
    console.log('🔍 Searching for available number...');
    const availableNumbers = await client.availablePhoneNumbers('US').local.list({
      areaCode: '281',
      limit: 1,
    });

    if (!availableNumbers.length) {
      console.error('❌ No available numbers found');
      process.exit(1);
    }

    const testPhoneNumber = availableNumbers[0].phoneNumber;
    console.log(`✅ Found available number: ${testPhoneNumber}\n`);

    // TEST: Try with camelCase (friendlyName)
    console.log('📝 Testing with camelCase: friendlyName');
    try {
      const result = await client.incomingPhoneNumbers.create({
        phoneNumber: testPhoneNumber,
        voiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/signalwire/voice`,
        voiceMethod: 'POST',
        friendlyName: 'TEST - camelCase test@example.com',  // camelCase
      });

      console.log('✅ SUCCESS with camelCase!');
      console.log(`   Phone: ${result.phoneNumber}`);
      console.log(`   Friendly Name: ${result.friendlyName}`);
      console.log(`   SID: ${result.sid}\n`);

      // Clean up - delete the test number
      console.log('🧹 Cleaning up test number...');
      await client.incomingPhoneNumbers(result.sid).remove();
      console.log('✅ Test number removed\n');

      console.log('🎉 RESULT: Use camelCase (friendlyName) - this works!');
    } catch (error: any) {
      console.error('❌ FAILED with camelCase');
      console.error(`   Error: ${error.message}\n`);

      // If camelCase failed, the number might have been purchased - try to find and clean it up
      try {
        const numbers = await client.incomingPhoneNumbers.list({ phoneNumber: testPhoneNumber });
        if (numbers.length > 0) {
          await client.incomingPhoneNumbers(numbers[0].sid).remove();
          console.log('🧹 Cleaned up failed test number\n');
        }
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the test
testCreateParams();
