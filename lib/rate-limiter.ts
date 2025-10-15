import { kv } from '@vercel/kv';

interface RateLimitConfig {
  maxAttempts: number;
  windowMinutes: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowMinutes: 15,
};

/**
 * Check if a phone number has exceeded the rate limit
 * @param phoneNumber - The caller's phone number
 * @param config - Rate limit configuration
 * @returns Object with isLimited boolean and remaining attempts
 */
export async function checkRateLimit(
  phoneNumber: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): Promise<{ isLimited: boolean; attemptsRemaining: number; resetAt: Date }> {
  try {
    const key = `rate_limit:${phoneNumber}`;
    const now = Date.now();
    const windowMs = config.windowMinutes * 60 * 1000;

    // Get current attempts from KV
    const attemptsData = await kv.get<{ count: number; firstAttempt: number }>(key);

    if (!attemptsData) {
      // First attempt - create new entry
      await kv.set(key, {
        count: 1,
        firstAttempt: now,
      }, {
        ex: config.windowMinutes * 60, // Expire after window
      });

      return {
        isLimited: false,
        attemptsRemaining: config.maxAttempts - 1,
        resetAt: new Date(now + windowMs),
      };
    }

    // Check if window has expired
    if (now - attemptsData.firstAttempt > windowMs) {
      // Window expired, reset counter
      await kv.set(key, {
        count: 1,
        firstAttempt: now,
      }, {
        ex: config.windowMinutes * 60,
      });

      return {
        isLimited: false,
        attemptsRemaining: config.maxAttempts - 1,
        resetAt: new Date(now + windowMs),
      };
    }

    // Increment counter
    const newCount = attemptsData.count + 1;
    await kv.set(key, {
      count: newCount,
      firstAttempt: attemptsData.firstAttempt,
    }, {
      ex: config.windowMinutes * 60,
    });

    const resetAt = new Date(attemptsData.firstAttempt + windowMs);

    if (newCount > config.maxAttempts) {
      return {
        isLimited: true,
        attemptsRemaining: 0,
        resetAt,
      };
    }

    return {
      isLimited: false,
      attemptsRemaining: config.maxAttempts - newCount,
      resetAt,
    };
  } catch (error) {
    // If KV fails (e.g., in dev mode), allow the request
    if (process.env.DEV_MODE === 'true') {
      console.log('[DEV MODE] Rate limiter bypassed');
      return {
        isLimited: false,
        attemptsRemaining: 99,
        resetAt: new Date(Date.now() + 15 * 60 * 1000),
      };
    }
    console.error('Rate limiter error:', error);
    // Fail open - allow request if rate limiter fails
    return {
      isLimited: false,
      attemptsRemaining: 99,
      resetAt: new Date(Date.now() + 15 * 60 * 1000),
    };
  }
}

/**
 * Reset rate limit for a phone number (used when correct passcode is entered)
 */
export async function resetRateLimit(phoneNumber: string): Promise<void> {
  try {
    const key = `rate_limit:${phoneNumber}`;
    await kv.del(key);
  } catch (error) {
    console.error('Error resetting rate limit:', error);
  }
}

/**
 * Get current rate limit status without incrementing
 */
export async function getRateLimitStatus(
  phoneNumber: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): Promise<{ attempts: number; isLimited: boolean; resetAt: Date }> {
  try {
    const key = `rate_limit:${phoneNumber}`;
    const now = Date.now();
    const windowMs = config.windowMinutes * 60 * 1000;

    const attemptsData = await kv.get<{ count: number; firstAttempt: number }>(key);

    if (!attemptsData) {
      return {
        attempts: 0,
        isLimited: false,
        resetAt: new Date(now + windowMs),
      };
    }

    // Check if window has expired
    if (now - attemptsData.firstAttempt > windowMs) {
      return {
        attempts: 0,
        isLimited: false,
        resetAt: new Date(now + windowMs),
      };
    }

    const resetAt = new Date(attemptsData.firstAttempt + windowMs);

    return {
      attempts: attemptsData.count,
      isLimited: attemptsData.count >= config.maxAttempts,
      resetAt,
    };
  } catch (error) {
    console.error('Error getting rate limit status:', error);
    return {
      attempts: 0,
      isLimited: false,
      resetAt: new Date(Date.now() + config.windowMinutes * 60 * 1000),
    };
  }
}
