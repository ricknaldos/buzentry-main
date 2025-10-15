import { config } from 'dotenv';
import { kv } from '@vercel/kv';

config({ path: '.env.local' });

async function createUser() {
  const email = 'russell@rowship.com';
  const userId = email; // NextAuth uses email as userId by default
  
  console.log('\n🔧 Creating NextAuth user record for:', email);
  
  // NextAuth Upstash adapter expects these structures:
  // user:${id} = hash with fields: id, email, emailVerified, name?, image?
  // user:email:${email} = string with userId
  
  // Create user hash
  await kv.hset(`user:${userId}`, {
    id: userId,
    email: email,
    emailVerified: Date.now(),
  });
  console.log(`✅ Created user hash: user:${userId}`);
  
  // Create email lookup
  await kv.set(`user:email:${email}`, userId);
  console.log(`✅ Created email lookup: user:email:${email}`);
  
  console.log('\n✅ NextAuth user created! You should now be able to log in.');
}

createUser();
