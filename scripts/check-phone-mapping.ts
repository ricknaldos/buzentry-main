import * as dotenv from 'dotenv';
import { kv } from '@vercel/kv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function checkPhoneMapping() {
  const phone = '+12818928899';

  console.log(`\nChecking Redis mapping for: ${phone}`);
  console.log('=' .repeat(60));

  // Check if phone mapping exists
  const userId = await kv.get<string>(`phone:${phone}`);

  if (!userId) {
    console.log(`❌ No Redis mapping found for phone:${phone}`);
    console.log('\nSearching for user with this phone number...');

    // Try to find any user with this phone number
    const keys = await kv.keys('user:*');
    console.log(`Found ${keys.length} user keys in Redis`);

    for (const key of keys) {
      if (key.includes('@')) { // Skip email index keys
        const userData = await kv.get(key);
        console.log(`\nChecking ${key}:`, userData);
      }
    }
  } else {
    console.log(`✅ Found mapping: phone:${phone} -> ${userId}`);

    // Check if user exists
    const userProfile = await kv.get(`user:${userId}`);
    console.log(`\nUser profile:`, userProfile);
  }
}

checkPhoneMapping()
  .then(() => {
    console.log('\n✅ Check complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
