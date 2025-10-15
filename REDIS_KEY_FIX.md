# Redis Key Issue Fix Documentation

## Problem Summary

Users were experiencing multiple authentication issues:
1. **Sign out button not working** - caused by authentication errors
2. **Magic link errors** - Redis WRONGTYPE errors when trying to authenticate
3. **New accounts broken** - userId mismatch between NextAuth and app profile
4. **No redirect to dashboard** - After clicking magic link, users weren't redirected properly

## Root Cause

The issues were caused by multiple bugs:

### Bug 1: WRONGTYPE Redis Errors
- The key `profile:email:${email}` had the wrong data type (was a SET or incompatible type instead of STRING)
- This caused "WRONGTYPE Operation against a key holding the wrong kind of value" errors

### Bug 2: UserId Mismatch in create-session API (CRITICAL)
- In `/app/api/auth/create-session/route.ts`, line 40 created userId as `user_${timestamp}_${random}`
- But line 75 used `email` as userId for NextAuth
- This meant:
  - App profile existed at `profile:user_1234_abc`
  - But `profile:email:${email}` pointed to wrong userId
  - NextAuth expected `user:${email}` but profile was elsewhere
- **This broke ALL new signups**

### Bug 3: User Key Type Mismatch (THE REAL ROOT CAUSE!)
- **CRITICAL**: The Upstash Redis Adapter expects `user:${userId}` to be a **STRING (JSON)**, not a **HASH**!
- Our fix scripts were using `kv.hset()` which creates a HASH
- But the adapter uses `client.get()` which expects a STRING
- This caused "WRONGTYPE Operation against a key holding the wrong kind of value" errors
- **This was the actual cause of all magic link failures!**

### Bug 4: Missing redirect Callback
- NextAuth had no `redirect` callback to handle the `callbackUrl` parameter
- After clicking magic link, users weren't redirected to dashboard
- They stayed on the default NextAuth page

## Key Structure

The correct Redis key structure should be:

```
NextAuth Keys (used for authentication):
- user:${userId} [STRING/JSON] - MUST be STRING! Contains { id, email, emailVerified }
- user:email:${email} [STRING] - Maps email → userId

Application Profile Keys:
- profile:${userId} [STRING/JSON] - Contains full user profile
- profile:email:${email} [STRING] - Maps email → userId
```

**⚠️ CRITICAL**: The `user:${userId}` key MUST be a STRING (JSON), NOT a HASH!
- Use `kv.set(key, object)` - creates STRING ✅
- Do NOT use `kv.hset(key, object)` - creates HASH ❌

**IMPORTANT**: Both `user:email:${email}` and `profile:email:${email}` should point to the SAME userId!

## Solutions Implemented

### Fix 1: Fixed Existing Broken Accounts (Russell, etc.)
1. Created script `/scripts/comprehensive-russell-fix.ts` that:
   - Locates profile data wherever it is (handles old structures)
   - Deletes ALL conflicting keys
   - Rebuilds clean structure with email as userId
   - Verifies everything works
2. Updated `/app/api/admin/fix-keys/route.ts` with comprehensive fix logic
3. Successfully fixed Russell's account and any other broken accounts

### Fix 2: Fixed create-session API (Prevents Future Issues)
**File**: `/app/api/auth/create-session/route.ts`
- Moved `const userId = email` to line 36 (BEFORE creating profile)
- This ensures both app profile and NextAuth use the SAME userId
- **This fixes all future signups**

### Fix 3: Fixed User Key Type (THE CRITICAL FIX!)
**Files**: All scripts and APIs
- Changed from `kv.hset()` to `kv.set()` for creating user keys
- This creates STRING (JSON) instead of HASH
- **This was the root cause of all WRONGTYPE errors!**
- Updated files:
  - `/app/api/auth/create-session/route.ts` (lines 77-89)
  - `/app/api/admin/fix-keys/route.ts` (lines 105-112)
  - All fix scripts in `/scripts/`

### Fix 4: Added redirect Callback
**File**: `/auth.ts`
- Added `redirect` callback (lines 34-52) to handle `callbackUrl` parameter
- Extracts callbackUrl from query params
- Validates it's safe (same origin or relative)
- Defaults to `/dashboard` for successful sign ins
- Also added `newUser: "/dashboard"` to pages config

These four fixes completely resolve the authentication issues.

## How to Fix Similar Issues in the Future

### Option 1: Use the Admin API (Recommended for Production)

```bash
# Replace YOUR_SECRET with the value from ADMIN_SECRET env var
curl -X POST "https://buzentry.com/api/admin/fix-keys?email=user@example.com&secret=YOUR_SECRET"
```

The API will:
- Automatically locate the user's profile data
- Delete all conflicting keys
- Rebuild the correct structure
- Verify everything works
- Return a detailed report

### Option 2: Run the Script Locally (For Development)

```bash
# Make sure you have .env.local with KV credentials
npx tsx scripts/comprehensive-russell-fix.ts
```

## Prevention

To prevent this issue in the future:

1. **Always use email as userId** for new signups (already implemented)
2. **Don't manually create or modify Redis keys** without understanding the structure
3. **Use the user-db.ts functions** instead of direct kv calls
4. **Check for key existence and type** before operations that expect specific types

## Testing

After fixing, verify:

1. User can log in with magic link
2. Dashboard loads correctly
3. Sign out button works
4. All user features work (settings, passcodes, etc.)

## Files Modified

### Fixed Authentication Issues:
- `/app/api/auth/create-session/route.ts` - Fixed userId mismatch bug (CRITICAL FIX)
- `/auth.ts` - Added redirect callback and newUser page config
- `/app/api/admin/fix-keys/route.ts` - Enhanced with comprehensive fix logic for existing broken accounts

### Scripts Created:
- `/scripts/comprehensive-russell-fix.ts` - Comprehensive fix for broken accounts
- `/scripts/find-russell-profile.ts` - Helper to locate profile data
- `/scripts/fix-russell-keys.ts` - Initial diagnostic script
- `/scripts/check-old-user-key.ts` - Check key types

### Documentation:
- `/REDIS_KEY_FIX.md` - This file

## Related Git Commits

- `e8d65a5` - Add sign up modal to login page
- `0714416` - Add user existence check before sending magic link
- `1b53764` - Add script to fix production Redis keys directly
- `b9f5045` - Add admin API to fix Redis keys in production
- `1200bd7` - Fix Redis key namespace collision causing magic link failures

## Admin Secret

The admin API is protected by the `ADMIN_SECRET` environment variable. This should be:
- Set in production environment variables
- Never committed to git
- Only shared with authorized admins
