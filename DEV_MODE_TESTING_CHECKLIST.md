# BuzEntry - Dev Mode Testing Checklist

Complete list of all user flows that work in DEV_MODE without requiring real services.

## ✅ Authentication & Onboarding

### Signup Flow
- [ ] Go to homepage
- [ ] Click "Get Started" or "Register"
- [ ] Enter any email (e.g., `test@example.com`)
- [ ] Mock checkout completes instantly
- [ ] Account created with mock phone number
- [ ] Redirected to `/onboarding`
- [ ] Can see welcome screen

### Login Flow
- [ ] Go to `/login`
- [ ] Enter any email
- [ ] Click "Send magic link"
- [ ] Green button appears: **"[DEV] Skip Email - Login Now"**
- [ ] Click to login instantly
- [ ] If account doesn't exist, it's created automatically
- [ ] Redirected to `/dashboard`

### Logout
- [ ] Click user menu in dashboard
- [ ] Click "Logout"
- [ ] Redirected to homepage

---

## ✅ Dashboard & Navigation

### Main Dashboard
- [ ] Access `/dashboard`
- [ ] See mock phone number displayed
- [ ] See activity stats (mock data)
- [ ] Navigation menu works

### Overview Page
- [ ] Go to `/overview`
- [ ] See account summary
- [ ] Mock phone number shown
- [ ] Subscription status: "Active"

---

## ✅ Settings & Configuration

### General Settings (`/settings`)
- [ ] View current phone number
- [ ] Update door code (any value)
- [ ] Change saves successfully
- [ ] Page updates to reflect change

### Access Code (PIN)
- [ ] Set 4-digit access code
- [ ] Update access code
- [ ] Remove access code (set to null)
- [ ] All operations save correctly

### Pause/Resume Service
- [ ] Toggle "Pause Service" switch
- [ ] Service pauses (isPaused: true)
- [ ] Toggle again to resume
- [ ] Status updates correctly

---

## ✅ Guest Access & Passcodes

### Create Passcode
- [ ] Go to `/guest-access`
- [ ] Click "Create New Passcode"
- [ ] Enter label (e.g., "Pizza Delivery")
- [ ] Set expiration (optional)
- [ ] Set max usages (optional)
- [ ] Passcode created with 4-digit code
- [ ] Displayed in list

### Manage Passcodes
- [ ] View all passcodes
- [ ] Toggle passcode active/inactive
- [ ] Delete passcode
- [ ] Passcode removed from list

---

## ✅ Billing & Subscription

### View Subscription
- [ ] Go to `/billing`
- [ ] See mock subscription details
- [ ] Status: "Active"
- [ ] Next billing: 30 days from now
- [ ] Mock price: $6.99/month

### Manage Subscription
- [ ] Click "Manage Subscription"
- [ ] Redirects to `/billing` (dev mode)
- [ ] In production: would go to Stripe portal
- [ ] No errors thrown

### Subscription API
- [ ] API returns mock subscription data
- [ ] currentPeriodEnd set to next month
- [ ] cancelAtPeriodEnd: false
- [ ] All fields populated correctly

---

## ✅ Analytics & Activity

### View Analytics
- [ ] Go to overview or analytics section
- [ ] See mock activity data:
  - Total calls: 42
  - Successful unlocks: 38
  - Forwarded calls: 2
  - Missed calls: 1
- [ ] Chart displays mock data by day
- [ ] No API errors

---

## ✅ Marketing Pages

### Public Pages (No Auth Required)
- [ ] Homepage (`/`)
- [ ] Pricing (`/pricing`)
- [ ] How It Works (section on homepage)
- [ ] Privacy Policy (`/privacy`)
- [ ] Terms of Service (`/terms`)
- [ ] Refund Policy (`/refund`)
- [ ] About (`/about`)
- [ ] All pages load correctly
- [ ] Footer consistent across all pages

---

## ✅ Edge Cases & Error Handling

### Multiple Accounts
- [ ] Login with `user1@test.com`
- [ ] Logout
- [ ] Login with `user2@test.com`
- [ ] Each gets separate profile
- [ ] Data doesn't mix between accounts

### Direct URL Access
- [ ] Try accessing `/dashboard` without login
- [ ] Redirected to `/login`
- [ ] Login and access dashboard
- [ ] All protected routes work correctly

### Session Persistence
- [ ] Login to account
- [ ] Refresh page
- [ ] Still logged in
- [ ] Session cookie persists

---

## 🚫 What DOESN'T Work in Dev Mode

These features are simulated or disabled:

### Phone Calls
- ❌ No real SignalWire phone calls
- ❌ Can't test actual door unlocking
- ❌ No real SMS/call notifications

### Real Payments
- ❌ No actual Stripe charges
- ❌ Can't test webhook flows
- ❌ No real subscription changes

### Email
- ❌ Magic links not sent
- ❌ Welcome emails not sent
- ❌ Notification emails not sent

### Data Persistence (If KV not configured)
- ❌ Data may not persist between restarts
- ❌ Multiple sessions may not share data

---

## 📝 Testing Script

Quick copy-paste testing sequence:

```bash
# 1. Ensure dev mode is enabled
echo "DEV_MODE=true"
echo "NEXT_PUBLIC_DEV_MODE=true"

# 2. Test signup
# → Go to homepage → Click Register → Use test@example.com

# 3. Test login
# → Go to /login → Enter any@email.com → Click dev login button

# 4. Test all features
# → Dashboard: view phone, stats
# → Settings: set door code, access code
# → Guest Access: create/delete passcodes
# → Billing: view subscription
# → Pause/Resume: toggle service

# 5. Test logout/login
# → Logout → Login again → Verify session works
```

---

## 🔧 Troubleshooting

### Issue: "No account found" error
**Solution**: Ensure `DEV_MODE=true` and `NEXT_PUBLIC_DEV_MODE=true` are set. Redeploy if on Vercel.

### Issue: Dev login button doesn't appear
**Solution**: Check browser console for `NEXT_PUBLIC_DEV_MODE`. Hard refresh (Cmd+Shift+R).

### Issue: Stripe error on billing
**Solution**: Add dummy Stripe keys to environment variables (even in dev mode).

### Issue: Data doesn't persist
**Solution**: Configure Vercel KV or accept in-memory storage for testing.

### Issue: 500 errors on API routes
**Solution**: Check server logs for `[DEV MODE]` messages. Ensure `AUTH_SECRET` is set.

---

## ✅ Final Checklist

Before considering dev mode complete, verify:

- [x] Can create account without real payment
- [x] Can login without email verification
- [x] All dashboard pages load without errors
- [x] Can modify all settings (door code, access code, pause)
- [x] Can create and manage guest passcodes
- [x] Analytics shows mock data
- [x] Billing page displays mock subscription
- [x] All marketing pages render correctly
- [x] Footer consistent across all pages
- [x] Session persists across page refreshes
- [x] Can logout and login with different accounts

---

**Dev Mode Status**: ✅ Fully Functional for Testing

All user-facing features can be tested without requiring Stripe, SignalWire, Resend, or Vercel KV.
