# BuzEntry - Demo Account Access

## 🚀 Quick Access (3 Ways)

### Option 1: One-Click Demo Button (Easiest)

**On Homepage:**
1. Go to homepage with `DEV_MODE=true` enabled
2. Click the green button: **"🚀 Quick Demo (No Signup Required)"**
3. Instantly logged in as `demo@buzentry.com`
4. Full access to dashboard and all features

**On Login Page:**
1. Go to `/login` with `DEV_MODE=true` enabled
2. Click the blue button: **"🚀 Quick Demo Login"**
3. Instantly logged in
4. No email required

---

### Option 2: Custom Email (Flexible)

**On Login Page:**
1. Go to `/login`
2. Enter **ANY** email (e.g., `test@example.com`, `john@test.com`)
3. Click "Send magic link"
4. Click green button: **"[DEV] Skip Email - Login Now"**
5. Account created automatically + instant login

This works with any email you choose!

---

### Option 3: API Direct Login (For Testing/Scripts)

```bash
curl -X POST https://your-vercel-url.vercel.app/api/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@buzentry.com"}'
```

Returns session cookie, then navigate to `/dashboard`.

---

## 📋 Demo Account Features

Once logged in with `demo@buzentry.com` (or any email), you get:

✅ **Complete User Profile:**
- Mock phone number: `+15551234567`
- Active subscription status
- Mock Stripe customer ID
- All settings accessible

✅ **Full Dashboard Access:**
- `/dashboard` - Main overview
- `/overview` - Account summary
- `/settings` - Update door code, access code
- `/guest-access` - Create/manage passcodes
- `/billing` - View subscription (mock data)

✅ **All Features Work:**
- Create guest passcodes
- Set door code
- Enable/disable PIN access
- Pause/resume service
- View analytics (mock data)
- Manage subscription

---

## 🔐 Pre-Established Account

### Default Demo Account

**Email:** `demo@buzentry.com`

**Auto-Created With:**
- Phone: Randomly generated (e.g., `+15552348765`)
- Door Code: `null` (can be set)
- Access Code: `null` (can be set)
- Service: Active (not paused)
- Passcodes: Empty array (can create)
- Subscription: Active ($6.99/month mock)
- Customer ID: `dev_customer_[timestamp]`
- Subscription ID: `dev_sub_[timestamp]`

**Password:** Not needed (dev mode uses instant login)

---

## 🎯 Usage Scenarios

### Scenario 1: Quick Product Demo
```
1. Click "Quick Demo" button on homepage
2. Explore dashboard
3. Create a guest passcode
4. Toggle settings
5. View analytics
```

### Scenario 2: Testing Specific Feature
```
1. Go to /login
2. Enter custom email: testing@feature.com
3. Click dev login
4. Navigate to feature page
5. Test functionality
```

### Scenario 3: Multiple Test Accounts
```
1. Login with user1@test.com
2. Set up profile (door code, passcodes)
3. Logout
4. Login with user2@test.com
5. Verify data isolation
```

---

## ⚙️ Configuration

### Required Environment Variables

```env
DEV_MODE=true
NEXT_PUBLIC_DEV_MODE=true
AUTH_SECRET=<any-random-string>

# Stripe (required but not used in dev mode)
STRIPE_SECRET_KEY=sk_test_51XXX...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51XXX...
STRIPE_PRICE_ID=price_1XXX...
```

### Vercel Setup

1. Go to Project → Settings → Environment Variables
2. Add all variables above
3. Deploy or Redeploy
4. Demo buttons will appear automatically

---

## 🧪 Testing Checklist

- [ ] Homepage demo button appears (green)
- [ ] Clicking homepage demo → logs in → redirects to dashboard
- [ ] Login page demo button appears (blue)
- [ ] Clicking login demo → instant access
- [ ] Custom email login works (any email)
- [ ] Dashboard loads with mock data
- [ ] Can create/delete passcodes
- [ ] Can update settings (door code, access code)
- [ ] Can pause/resume service
- [ ] Analytics shows mock data
- [ ] Billing shows active subscription
- [ ] Logout works
- [ ] Can login again with different email

---

## 🔍 Troubleshooting

### Demo button doesn't appear
**Solution:**
- Verify `NEXT_PUBLIC_DEV_MODE=true` in environment
- Check browser console: `console.log(process.env.NEXT_PUBLIC_DEV_MODE)`
- Hard refresh (Cmd/Ctrl + Shift + R)
- Redeploy in Vercel

### "Unauthorized" error
**Solution:**
- Ensure `AUTH_SECRET` is set
- Check cookies are enabled
- Try incognito/private window

### Dashboard shows "No profile found"
**Solution:**
- Wait 2-3 seconds after login (profile creation is async)
- Refresh page
- Try logging in again
- Check server logs for errors

### Changes don't persist
**Solution:**
- This is expected without Vercel KV configured
- For persistent testing, add KV environment variables
- Changes work within same session

---

## 📊 What Gets Created

When you use demo login, the system auto-creates:

```typescript
{
  // NextAuth User
  user: {
    id: "demo@buzentry.com",
    email: "demo@buzentry.com",
    emailVerified: "2025-10-14T10:30:00.000Z"
  },

  // App Profile
  profile: {
    email: "demo@buzentry.com",
    userId: "demo@buzentry.com",
    signalwirePhoneNumber: "+15551234567", // random
    doorCode: null,
    accessCode: null,
    isPaused: false,
    pauseForwardingNumber: null,
    passcodes: [],
    stripeCustomerId: "dev_customer_1728901800000",
    stripeSubscriptionId: "dev_sub_1728901800000",
    subscriptionStatus: "active"
  },

  // Session
  session: {
    sessionToken: "abc123xyz...", // 32-char random
    userId: "demo@buzentry.com",
    expires: "2026-10-14T10:30:00.000Z" // 1 year
  }
}
```

---

## 🎬 Quick Start Commands

### Local Development
```bash
# 1. Set environment
export DEV_MODE=true
export NEXT_PUBLIC_DEV_MODE=true
export AUTH_SECRET=my-secret-key

# 2. Start dev server
npm run dev

# 3. Open browser
open http://localhost:3000

# 4. Click "Quick Demo" button
```

### Testing on Vercel
```bash
# 1. Push to GitHub
git push origin main

# 2. Vercel auto-deploys

# 3. Open your Vercel URL
# Example: https://buzentry-v2.vercel.app

# 4. Click "Quick Demo" button on homepage
```

---

## 💡 Tips

1. **Quick Access:** Bookmark `/login` with dev mode for instant testing
2. **Multiple Accounts:** Use different emails to test data isolation
3. **Reset State:** Logout and login with new email for fresh state
4. **Persistent Data:** Configure Vercel KV for data that persists
5. **Production Testing:** Use separate Vercel project for dev mode testing

---

**Demo Account Status:** ✅ Fully Configured

You can now access the full dashboard without any signup or configuration!
