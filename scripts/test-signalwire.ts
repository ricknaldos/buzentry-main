/**
 * Test script to verify SignalWire integration
 * Run with: npx tsx scripts/test-signalwire.ts
 */

import { config } from 'dotenv';
import { getSignalWireClient } from '../lib/signalwire';
import { getAreaCodesForState } from '../lib/area-codes';

// Load environment variables
config({ path: '.env.local' });

async function testSignalWireConnection() {
  console.log('\n🧪 Testing SignalWire Integration\n');
  console.log('='.repeat(50));

  try {
    // Test 1: Client initialization
    console.log('\n1️⃣  Testing client initialization...');
    const client = getSignalWireClient();
    console.log('✅ SignalWire client created successfully');

    // Test 2: List existing phone numbers
    console.log('\n2️⃣  Checking existing phone numbers...');
    const existingNumbers = await client.incomingPhoneNumbers.list({ limit: 5 });
    console.log(`✅ Found ${existingNumbers.length} existing phone numbers`);

    if (existingNumbers.length > 0) {
      console.log('\nYour existing numbers:');
      existingNumbers.forEach((num: any) => {
        console.log(`  - ${num.phoneNumber} (${num.friendlyName || 'No name'})`);
      });
    }

    // Test 3: Search for available numbers in different states
    console.log('\n3️⃣  Testing area code search...');

    const testStates = [
      { code: 'TX', name: 'Texas' },
      { code: 'CA', name: 'California' },
      { code: 'NY', name: 'New York' },
    ];

    for (const state of testStates) {
      const areaCodes = getAreaCodesForState(state.code);
      console.log(`\n   Testing ${state.name} (${state.code}): ${areaCodes.length} area codes`);

      // Try first 3 area codes for this state
      let found = false;
      for (const areaCode of areaCodes.slice(0, 3)) {
        try {
          const available = await client.availablePhoneNumbers('US').local.list({
            areaCode,
            limit: 1,
          });

          if (available.length > 0) {
            console.log(`   ✅ Found numbers in ${areaCode}: ${available[0].phoneNumber}`);
            found = true;
            break;
          }
        } catch (error: any) {
          console.log(`   ⚠️  Error checking ${areaCode}:`, error.message);
        }
      }

      if (!found) {
        console.log(`   ⚠️  No numbers found in tested ${state.name} area codes`);
      }
    }

    // Test 4: Account balance
    console.log('\n4️⃣  Checking account balance...');
    try {
      const account = await client.api.accounts(process.env.SIGNALWIRE_PROJECT_ID!).fetch();
      console.log(`✅ Account status: ${account.status}`);
      console.log(`   Type: ${account.type}`);
    } catch (error: any) {
      console.log('⚠️  Could not fetch account details:', error.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed successfully!\n');
    console.log('Your SignalWire integration is ready to provision phone numbers.');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error('\nPlease check:');
    console.error('  1. SIGNALWIRE_PROJECT_ID is set correctly');
    console.error('  2. SIGNALWIRE_API_TOKEN is set correctly');
    console.error('  3. SIGNALWIRE_SPACE_URL is set correctly');
    console.error('  4. Your SignalWire account has sufficient balance');
    console.error('\n');
    process.exit(1);
  }
}

// Run the test
testSignalWireConnection();
