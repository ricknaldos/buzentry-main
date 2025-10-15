import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function testLoginFlow() {
  const email = 'russell@rowship.com';
  
  console.log('\n🔍 Testing complete login flow:\n');
  
  // Step 1: Check NextAuth user
  console.log('1. Checking NextAuth user record...');
  try {
    const userHash = await kv.hgetall(`user:${email}`);
    console.log('   ✅ User hash exists:', userHash);
  } catch (error: any) {
    console.log('   ❌ Error:', error.message);
  }
  
  // Step 2: Check email lookup
  console.log('\n2. Checking email lookup...');
  try {
    const userId = await kv.get(`user:email:${email}`);
    console.log('   ✅ Email lookup:', userId);
  } catch (error: any) {
    console.log('   ❌ Error:', error.message);
  }
  
  // Step 3: Check app profile
  console.log('\n3. Checking app profile...');
  try {
    const appUserId = await kv.get(`profile:email:${email}`);
    console.log('   ✅ Profile email lookup:', appUserId);
    
    if (appUserId) {
      const profile = await kv.get(`profile:${appUserId}`);
      console.log('   ✅ Profile data exists:', !!profile);
    }
  } catch (error: any) {
    console.log('   ❌ Error:', error.message);
  }
  
  // Step 4: Check for any remaining conflicts
  console.log('\n4. Checking for conflicts...');
  try {
    const oldUser = await kv.get(`user:${email}`);
    if (oldUser) {
      console.log('   ⚠️  OLD KEY STILL EXISTS: user:' + email);
      console.log('   This needs to be deleted!');
    } else {
      console.log('   ✅ No conflicting string keys');
    }
  } catch (error: any) {
    console.log('   Checking conflicts...');
  }
}

testLoginFlow();
