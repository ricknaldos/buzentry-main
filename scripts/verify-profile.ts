import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function verify() {
  const email = 'russell@rowship.com';
  
  console.log('\n✅ Verifying profile keys are intact:\n');
  
  // Check profile keys
  const userId = await kv.get(`profile:email:${email}`);
  console.log(`profile:email:${email} →`, userId);
  
  if (userId) {
    const profile = await kv.get(`profile:${userId}`);
    console.log(`\nprofile:${userId}:`);
    console.log(JSON.stringify(profile, null, 2));
  }
}

verify();
