# BuzEntry - Dev Mode Instructions

## Overview
Dev Mode allows you to test the complete BuzEntry application without requiring real Stripe, SignalWire, or email services. This is perfect for:
- Local development
- Testing deployment
- Demo environments
- QA testing

## Quick Start

### 1. Enable Dev Mode

Set these environment variables in `.env.local` or in Vercel:

```bash
DEV_MODE=true
NEXT_PUBLIC_DEV_MODE=true
```

### 2. Test Login Flow

1. Go to `/login`
2. Enter any email address (e.g., `test@example.com`)
3. Click "Send magic link"
4. You'll see a green button: **"[DEV] Skip Email - Login Now"**
5. Click it to login immediately (no email required)

### 3. Test Signup Flow

1. Go to homepage
2. Click "Get Started" or "Register"
3. Enter any email
4. The checkout will use mock Stripe (no real payment)
5. Account will be created with mock phone number
6. Automatically logged in

### 4. Test Complete Navigation

Once logged in with dev mode, you can:
- ✅ Access all dashboard pages
- ✅ View mock phone number
- ✅ Create guest passcodes
- ✅ View activity logs
- ✅ Access settings
- ✅ Test all UI components

## What Dev Mode Changes

### Authentication
- **Normal**: Sends magic link email via Resend
- **Dev Mode**: Skips email, allows instant login

### Signup/Checkout
- **Normal**: Creates real Stripe customer and subscription
- **Dev Mode**: Uses mock Stripe data (`dev_customer_...`, `dev_sub_...`)

### Phone Number Provisioning
- **Normal**: Provisions real SignalWire phone number
- **Dev Mode**: Generates mock phone number (`+15551234567`)

### Database (KV)
- **Normal**: Stores data in Vercel KV
- **Dev Mode**: Attempts KV operations but silently fails if not configured (uses in-memory fallback)

### Webhooks
- **Normal**: Stripe webhook creates account after payment
- **Dev Mode**: Account created immediately on checkout

## Deploying with Dev Mode on Vercel

### Option 1: Separate Preview Environment

1. Create a new Vercel project for testing
2. Set environment variables:
   ```
   DEV_MODE=true
   NEXT_PUBLIC_DEV_MODE=true
   AUTH_SECRET=<generate-new-secret>
   ```
3. Deploy
4. Test complete flow at your preview URL

### Option 2: Preview Branch

1. Create a branch `dev-mode`
2. In Vercel project settings → Environment Variables
3. Add Dev Mode variables to "Preview" environment only:
   ```
   DEV_MODE=true (Preview only)
   NEXT_PUBLIC_DEV_MODE=true (Preview only)
   ```
4. Push to branch
5. Vercel auto-deploys preview with dev mode enabled

### Option 3: Production with Dev Mode (NOT RECOMMENDED)

⚠️ **Warning**: Only use this temporarily for testing

1. In Vercel project → Settings → Environment Variables
2. Edit `DEV_MODE` and `NEXT_PUBLIC_DEV_MODE`
3. Set both to `true` in Production
4. Redeploy
5. **Remember to disable after testing!**

## Test Accounts

When in dev mode, you can use any email address:

```
test@example.com
demo@buzentry.com
qa@test.com
yourname@anything.com
```

All will work instantly without verification.

## Important Notes

### Security
- ⚠️ **Never enable Dev Mode in production with real users**
- Dev Mode bypasses authentication and payment verification
- Only use for testing and development

### Data Persistence
- If KV is not configured, data will not persist between restarts
- For persistent testing, configure a Vercel KV instance

### Limitations
- Cannot test real phone calls (SignalWire disabled)
- Cannot test real Stripe webhooks
- Email notifications not sent
- SMS notifications not sent

## Troubleshooting

### "Email already exists" error
- Dev mode creates accounts on-the-fly
- If you see this, try a different email or clear KV data

### Login button doesn't appear
- Check browser console for `NEXT_PUBLIC_DEV_MODE`
- Verify environment variable is set correctly
- Try hard refresh (Cmd/Ctrl + Shift + R)

### Dashboard shows no data
- This is normal - dev mode creates minimal profile
- All features work, just with mock data

## Disabling Dev Mode

To return to normal operation:

1. Remove or set to `false`:
   ```bash
   DEV_MODE=false
   NEXT_PUBLIC_DEV_MODE=false
   ```

2. Redeploy (Vercel) or restart dev server (local)

3. Configure real services:
   - Stripe keys
   - SignalWire credentials
   - Vercel KV
   - Resend API key

## Support

For issues with dev mode:
1. Check environment variables are set
2. Verify `NEXT_PUBLIC_DEV_MODE` is visible in browser
3. Check server logs for `[DEV MODE]` messages
4. Try clearing cookies and cache
