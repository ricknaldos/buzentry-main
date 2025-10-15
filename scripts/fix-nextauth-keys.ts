import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function fixKeys() {
  const email = 'russell@rowship.com';
  const userId = email; // NextAuth uses email as userId
  
  console.log('\n🔧 Fixing NextAuth keys for:', email);
  
  // Delete conflicting keys that have wrong type
  const keysToDelete = [
    `user:email:${email}`,
    `email:${email}`,
    `user:${userId}`,
  ];
  
  for (const key of keysToDelete) {
    try {
      await kv.del(key);
      console.log(`✅ Deleted: ${key}`);
    } catch (error) {
      console.log(`⚠️  Could not delete ${key}:`, error);
    }
  }
  
  console.log('\n✅ Old NextAuth keys cleaned up!');
  console.log('   Now try logging in again - NextAuth will create fresh keys');
}

fixKeys();
