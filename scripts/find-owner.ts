import * as dotenv from 'dotenv';
import { kv } from '@vercel/kv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function findOwner() {
  const phone = '+12818928899';

  console.log(`\nFinding owner of ${phone}...`);
  console.log('=' .repeat(60));

  // Check all profile keys
  const profileKeys = [
    'profile:russell@deephire.com',
    'profile:russell@rowship.com',
  ];

  for (const key of profileKeys) {
    const profile = await kv.get(key);
    console.log(`\n${key}:`);
    console.log(JSON.stringify(profile, null, 2));
  }
}

findOwner()
  .then(() => {
    console.log('\n✅ Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
