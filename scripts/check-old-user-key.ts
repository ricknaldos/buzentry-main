/**
 * Check what's at the old user key
 */

import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function checkKey() {
  const oldUserId = 'user_1760372935734_puwe7h';
  const key = `user:${oldUserId}`;

  console.log(`\nChecking key: ${key}\n`);

  const type = await kv.type(key);
  console.log(`Type: ${type}`);

  if (type === 'hash') {
    const value = await kv.hgetall(key);
    console.log('Value:', value);
  } else if (type === 'string') {
    const value = await kv.get(key);
    console.log('Value:', value);
  } else if (type === 'set') {
    console.log('This is a SET - wrong type!');
    console.log('Deleting...');
    await kv.del(key);
    console.log('✅ Deleted');
  } else if (type !== 'none') {
    console.log(`Unknown type: ${type}`);
    console.log('Deleting...');
    await kv.del(key);
    console.log('✅ Deleted');
  } else {
    console.log('Key does not exist');
  }
}

checkKey();
