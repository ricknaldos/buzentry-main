import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function checkPhone() {
  const phone = '+12818928899';
  const phoneKey = `phone:${phone}`;
  const userId = await kv.get(phoneKey);
  console.log(`Phone key: ${phoneKey}`);
  console.log(`UserId: ${userId}`);
}

checkPhone();
