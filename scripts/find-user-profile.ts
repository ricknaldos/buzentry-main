import * as dotenv from 'dotenv';
import { kv } from '@vercel/kv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function findUserProfile() {
  const userId = 'user_1760372935734_puwe7h';
  const phone = '+12818928899';

  console.log(`\nSearching for user profile...`);
  console.log('=' .repeat(60));

  // Try different key formats
  const keys = [
    `user:${userId}`,
    `profile:${userId}`,
    userId,
    `app:user:${userId}`,
  ];

  for (const key of keys) {
    console.log(`\nChecking: ${key}`);
    const data = await kv.get(key);
    if (data) {
      console.log(`✅ Found data:`, JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ Not found`);
    }
  }

  // Check if this phone has a profile in the user-db format
  console.log(`\nChecking for profile with phone number...`);
  const allKeys = await kv.keys('*');
  console.log(`Total Redis keys: ${allKeys.length}`);

  // Filter for user-related keys
  const userKeys = allKeys.filter(k => k.includes('user') || k.includes('profile'));
  console.log(`\nUser-related keys (first 20):`);
  for (const key of userKeys.slice(0, 20)) {
    console.log(`  - ${key}`);
  }
}

findUserProfile()
  .then(() => {
    console.log('\n✅ Check complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
