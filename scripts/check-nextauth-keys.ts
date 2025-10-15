import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function checkKeys() {
  const email = 'russell@rowship.com';
  
  console.log('\n🔍 Checking NextAuth keys for:', email);
  
  // NextAuth Upstash adapter uses these key patterns:
  const patterns = [
    `user:email:${email}`,           // NextAuth email → userId lookup
    `user:russell@rowship.com`,      // Might try this directly
    `email:${email}`,                // Old pattern
  ];
  
  for (const key of patterns) {
    const value = await kv.get(key);
    console.log(`\n${key}:`);
    console.log('  Type:', typeof value);
    console.log('  Value:', value);
  }
}

checkKeys();
