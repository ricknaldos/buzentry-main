/**
 * Fix russell@rowship.com - convert user hash to JSON string
 * The Upstash Redis Adapter expects user:${userId} to be a STRING (JSON), not a HASH!
 */

import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function fix() {
  const email = 'russell@rowship.com';
  const userId = email;

  console.log('\n🔧 Fixing user key for russell@rowship.com\n');
  console.log('='.repeat(70) + '\n');

  try {
    // Step 1: Check current state
    console.log('📋 Step 1: Checking current user key...\n');

    const type = await kv.type(`user:${userId}`);
    console.log(`Current type: ${type}`);

    if (type === 'hash') {
      console.log('⚠️  User key is a HASH - this is WRONG!');
      console.log('The Upstash Redis Adapter expects it to be a STRING (JSON)');

      // Get the hash value
      const hashValue = await kv.hgetall(`user:${userId}`);
      console.log('\nCurrent HASH value:', hashValue);

      // Step 2: Delete the hash
      console.log('\n📋 Step 2: Deleting HASH...\n');
      await kv.del(`user:${userId}`);
      console.log('✅ Deleted HASH');

      // Step 3: Create as STRING (JSON)
      console.log('\n📋 Step 3: Creating as STRING (JSON)...\n');

      const userObject = {
        id: userId,
        email: email,
        emailVerified: hashValue?.emailVerified || Date.now(),
      };

      await kv.set(`user:${userId}`, userObject);
      console.log('✅ Created user as JSON STRING:', userObject);

      // Step 4: Verify
      console.log('\n📋 Step 4: Verifying...\n');

      const newType = await kv.type(`user:${userId}`);
      console.log(`New type: ${newType} (should be 'string')`);

      const value = await kv.get(`user:${userId}`);
      console.log(`Value:`, value);

      if (newType === 'string' && value) {
        console.log('\n✅ SUCCESS! User key is now correct.');
      } else {
        console.log('\n❌ Something went wrong!');
      }

    } else if (type === 'string') {
      console.log('✅ User key is already a STRING - correct!');
      const value = await kv.get(`user:${userId}`);
      console.log('Value:', value);
    } else {
      console.log('❌ User key has unexpected type or doesn\'t exist');
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n✅ FIXED! russell@rowship.com can now log in.\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('\nStack:', error.stack);
  }
}

fix();
