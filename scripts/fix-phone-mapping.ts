import * as dotenv from 'dotenv';
import { kv } from '@vercel/kv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function fixPhoneMapping() {
  const phone = '+12818928899';
  const correctUserId = 'russell@rowship.com';

  console.log(`\nFixing phone mapping for ${phone}...`);
  console.log('=' .repeat(60));

  // Check current mapping
  const currentUserId = await kv.get<string>(`phone:${phone}`);
  console.log(`Current mapping: phone:${phone} -> ${currentUserId}`);

  // Update to correct userId
  await kv.set(`phone:${phone}`, correctUserId);
  console.log(`✅ Updated mapping: phone:${phone} -> ${correctUserId}`);

  // Verify
  const newUserId = await kv.get<string>(`phone:${phone}`);
  console.log(`\nVerification: phone:${phone} -> ${newUserId}`);

  // Check that profile exists
  const profile = await kv.get(`profile:${correctUserId}`);
  if (profile) {
    console.log(`✅ Profile exists for ${correctUserId}`);
    console.log(`   Phone in profile: ${(profile as any).signalwirePhoneNumber}`);
    console.log(`   Door code: ${(profile as any).doorCode || 'NOT SET'}`);
  } else {
    console.log(`❌ Profile NOT found for ${correctUserId}`);
  }
}

fixPhoneMapping()
  .then(() => {
    console.log('\n🎉 Fixed! Try calling the number now.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
