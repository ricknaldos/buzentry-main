/**
 * Diagnose what's ACTUALLY in Redis for russell@rowship.com RIGHT NOW
 */

import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function diagnose() {
  const email = 'russell@rowship.com';

  console.log('\n🔍 DIAGNOSING russell@rowship.com RIGHT NOW\n');
  console.log('='.repeat(70) + '\n');

  const keysToCheck = [
    `user:${email}`,
    `user:email:${email}`,
    `profile:${email}`,
    `profile:email:${email}`,
  ];

  for (const key of keysToCheck) {
    console.log(`\n🔍 Checking: ${key}`);
    try {
      const type = await kv.type(key);
      console.log(`   Type: ${type}`);

      if (type === 'hash') {
        const value = await kv.hgetall(key);
        console.log(`   Value (HASH):`, JSON.stringify(value, null, 2));
      } else if (type === 'string') {
        const value = await kv.get(key);
        console.log(`   Value (STRING):`, JSON.stringify(value, null, 2));
      } else if (type === 'set') {
        console.log(`   ⚠️  THIS IS A SET - WRONG TYPE!`);
        console.log(`   This is causing the WRONGTYPE error!`);
      } else if (type === 'list') {
        console.log(`   ⚠️  THIS IS A LIST - WRONG TYPE!`);
      } else if (type === 'zset') {
        console.log(`   ⚠️  THIS IS A SORTED SET - WRONG TYPE!`);
      } else if (type !== 'none') {
        console.log(`   ⚠️  UNKNOWN TYPE: ${type}`);
      } else {
        console.log(`   (key does not exist)`);
      }
    } catch (error: any) {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(70) + '\n');
}

diagnose();
