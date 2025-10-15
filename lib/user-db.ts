import { kv } from '@vercel/kv';
import { UserProfile, CallLog, UserAnalytics } from './types';

// User Profile Functions
// NOTE: Using 'profile:' prefix to avoid collision with NextAuth's 'user:' prefix
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    return await kv.get<UserProfile>(`profile:${userId}`);
  } catch (error) {
    if (process.env.DEV_MODE === 'true') {
      console.log('[DEV MODE] Skipping KV get for user profile');
      return null;
    }
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  try {
    const userId = await kv.get<string>(`profile:email:${email}`);
    if (!userId) return null;
    return await getUserProfile(userId);
  } catch (error) {
    if (process.env.DEV_MODE === 'true') {
      console.log('[DEV MODE] Skipping KV get for user by email');
      return null;
    }
    throw error;
  }
}

export async function createUserProfile(data: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
  const now = Date.now();
  const userProfile: UserProfile = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  try {
    // Save user profile
    await kv.set(`profile:${data.userId}`, userProfile);

    // Create email index
    await kv.set(`profile:email:${data.email}`, data.userId);
  } catch (error) {
    if (process.env.DEV_MODE === 'true') {
      console.log('[DEV MODE] Skipping KV set for user profile');
    } else {
      throw error;
    }
  }

  return userProfile;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'userId' | 'email' | 'createdAt'>>
): Promise<UserProfile | null> {
  const profile = await getUserProfile(userId);
  if (!profile) return null;

  const updatedProfile: UserProfile = {
    ...profile,
    ...updates,
    updatedAt: Date.now(),
  };

  await kv.set(`profile:${userId}`, updatedProfile);
  return updatedProfile;
}

// Call Log Functions
export async function logCall(callData: Omit<CallLog, 'id'>): Promise<CallLog> {
  const id = `${callData.userId}:${Date.now()}:${Math.random().toString(36).substring(7)}`;
  const callLog: CallLog = {
    ...callData,
    id,
  };

  // Save call log
  await kv.set(`call:${id}`, callLog);

  // Add to user's call list (sorted set by timestamp)
  await kv.zadd(`user:${callData.userId}:calls`, {
    score: callData.timestamp,
    member: id,
  });

  return callLog;
}

export async function getUserCalls(
  userId: string,
  limit: number = 100
): Promise<CallLog[]> {
  // Get recent call IDs from sorted set
  const callIds = await kv.zrange(`user:${userId}:calls`, 0, limit - 1, { rev: true });

  if (!callIds.length) return [];

  // Fetch all call logs
  const calls = await Promise.all(
    callIds.map(async (id) => {
      return await kv.get<CallLog>(`call:${id}`);
    })
  );

  return calls.filter((call): call is CallLog => call !== null);
}

// Analytics Functions
export async function getUserAnalytics(userId: string, days: number = 30): Promise<UserAnalytics> {
  const calls = await getUserCalls(userId, 1000); // Get more for analytics

  const now = Date.now();
  const daysAgo = now - (days * 24 * 60 * 60 * 1000);
  const recentCalls = calls.filter(call => call.timestamp > daysAgo);

  // Calculate stats
  const totalCalls = recentCalls.length;
  const successfulUnlocks = recentCalls.filter(c => c.status === 'answered').length;
  const forwardedCalls = recentCalls.filter(c => c.status === 'forwarded').length;
  const missedCalls = recentCalls.filter(c => c.status === 'missed').length;
  const pausedCalls = recentCalls.filter(c => c.status === 'paused').length;
  const deniedCalls = recentCalls.filter(c => c.status === 'denied').length;

  // Group calls by day
  const callsByDay = new Map<string, number>();
  recentCalls.forEach(call => {
    const date = new Date(call.timestamp).toISOString().split('T')[0];
    callsByDay.set(date, (callsByDay.get(date) || 0) + 1);
  });

  const callsByDayArray = Array.from(callsByDay.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalCalls,
    successfulUnlocks,
    forwardedCalls,
    missedCalls,
    pausedCalls,
    deniedCalls,
    callsByDay: callsByDayArray,
    recentCalls: calls.slice(0, 10), // Last 10 calls
  };
}
