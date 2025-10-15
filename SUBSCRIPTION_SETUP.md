# Monthly Subscription Setup Guide

## ✅ What's Already Done

Your app is fully configured for **monthly recurring subscriptions** with Stripe! Here's what's working:

1. ✅ **Stripe Checkout** - Creates monthly subscriptions (not one-time payments)
2. ✅ **Customer Portal** - Customers can manage their own subscriptions
3. ✅ **Email-based Access** - Customers can access their subscription using just their email
4. ✅ **Cancel Anytime** - Full self-service cancellation through Stripe
5. ✅ **Test Keys** - Your test environment is ready

## 🎯 What You Need to Do

### Step 1: Create Monthly Subscription Product in Stripe

1. **Go to Stripe Dashboard** (Test Mode):
   - Direct link: https://dashboard.stripe.com/test/products
   - Or: Dashboard → Products → "+ Add product"

2. **Create Product**:
   ```
   Name: BuzEntry Monthly Subscription
   Description: Automatic apartment door entry service

   Pricing:
   - Model: Standard pricing
   - Price: $6.99 USD
   - Billing: Recurring → Monthly ✓
   - Currency: USD
   ```

3. **Save** and **copy the Price ID** (looks like `price_test_abc123...`)

4. **Update `.env.local`**:
   ```bash
   STRIPE_PRICE_ID="price_test_YOUR_COPIED_ID_HERE"
   ```

5. **Restart your dev server**:
   ```bash
   # Stop (Ctrl+C) and restart
   npm run dev
   ```

### Step 2: Enable Stripe Customer Portal

This lets customers manage their subscriptions themselves (cancel, update payment, etc.)

1. **Go to Customer Portal Settings** (Test Mode):
   - Direct link: https://dashboard.stripe.com/test/settings/billing/portal
   - Or: Dashboard → Settings → Billing → Customer portal

2. **Click "Activate test link"** (or if already active, click "Edit")

3. **Configure Features**:

   **Allow customers to:**
   - ✅ **Update payment method** (let them change their credit card)
   - ✅ **Cancel subscription** (enable "Cancel immediately")
   - ✅ **View invoices** (let them download receipts)
   - ✅ **Pause subscription** (optional - nice feature!)

   **Cancellation settings:**
   - **Allow cancellation**: Yes, immediately
   - **Collect cancellation reason**: Yes (helps you understand churn)
   - **Save their data after cancellation**: Yes (so they can reactivate easily)

4. **Save** your settings

## 🎨 UI Features (Already Built)

### For New Customers:
1. **Landing page** (`/`) - Click "Get Started"
2. **Email collection** - Two-step modal flow
3. **Stripe Checkout** - Redirects to Stripe's hosted checkout
4. **Success page** (`/success`) - Confirms subscription with "Manage Subscription" button

### For Existing Customers:
1. **Manage page** (`/manage`) - Enter email to access subscription
2. **Customer Portal** - Stripe's hosted portal for:
   - Canceling subscription
   - Updating payment method
   - Viewing invoices
   - Pausing subscription (if enabled)

### Footer Links:
- "Manage Subscription" link in footer → `/manage`
- Success page has "Manage Subscription" button

## 🧪 Testing the Complete Flow

### Test Subscription Creation:

1. **Visit**: `http://localhost:3001`
2. **Click**: "Get Started"
3. **Enter**: Any test email (e.g., `test@example.com`)
4. **Use Test Card**:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/34` (any future date)
   - CVC: `123` (any 3 digits)
   - ZIP: `12345` (any 5 digits)

### Test Subscription Management:

1. **Go to**: `http://localhost:3001/manage`
2. **Enter**: The same email you used for checkout
3. **Click**: "Manage Subscription"
4. **You should see** Stripe's Customer Portal with:
   - Subscription details
   - Cancel subscription button
   - Update payment method
   - Invoice history

### Verify in Stripe Dashboard:

1. **Customers**: https://dashboard.stripe.com/test/customers
   - Should see your test customer with email

2. **Subscriptions**: https://dashboard.stripe.com/test/subscriptions
   - Should see active monthly subscription at $6.99/mo

3. **Payments**: https://dashboard.stripe.com/test/payments
   - Should see the initial payment succeeded

### Test Cancellation:

1. From Customer Portal → **Cancel subscription**
2. Verify it shows as "Canceled" in Stripe Dashboard
3. The subscription will remain active until the end of the billing period

## 🚀 Going Live (Production Setup)

When you're ready to accept real payments:

### Step 1: Activate Your Stripe Account
- Complete business verification in Stripe Dashboard
- Add bank account for payouts
- Verify your identity/business details

### Step 2: Switch to Live Mode

1. **Toggle** to "Live mode" in Stripe Dashboard (top-right)

2. **Create Live Product**:
   - Go to https://dashboard.stripe.com/products (Live mode)
   - Create the **same product**: $6.99/month, recurring monthly
   - Copy the **live Price ID** (starts with `price_...` without `_test`)

3. **Get Live API Keys**:
   - Go to https://dashboard.stripe.com/apikeys (Live mode)
   - Copy **Publishable key** (starts with `pk_live_...`)
   - Copy **Secret key** (starts with `sk_live_...`)

4. **Activate Live Customer Portal**:
   - Go to https://dashboard.stripe.com/settings/billing/portal (Live mode)
   - Click "Activate" and configure the same settings as test mode

### Step 3: Update Environment Variables

**For production deployment**, update your hosting platform (Vercel/etc) with:

```bash
# Live Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_KEY_HERE"
STRIPE_SECRET_KEY="sk_live_YOUR_KEY_HERE"
STRIPE_PRICE_ID="price_YOUR_LIVE_PRICE_ID_HERE"

# Production URL
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Step 4: Test in Production

1. **Make a real purchase** (use your own card)
2. **Verify** it appears in Live Dashboard
3. **Test cancellation** through Customer Portal
4. **Cancel immediately** so you're not charged

## 📊 Monitoring Subscriptions

### Key Metrics to Watch:

**Stripe Dashboard** (https://dashboard.stripe.com):
- **MRR** (Monthly Recurring Revenue) - on main dashboard
- **Active Subscriptions** - Billing → Subscriptions
- **Churn Rate** - Customers who cancel
- **Failed Payments** - Billing → Payment failures

### Handling Failed Payments:

Stripe **automatically retries** failed payments using "Smart Retries":
- Day 0: Immediate retry
- Day 3: First retry
- Day 5: Second retry
- Day 7: Final retry
- If all fail → subscription is canceled

You can configure this at: https://dashboard.stripe.com/settings/billing/automatic

## 🔔 Optional: Webhooks (Advanced)

If you want to be notified of subscription events:

1. **Create webhook endpoint**: `/api/webhooks/stripe`
2. **Listen for events**:
   - `customer.subscription.created` - New subscription
   - `customer.subscription.deleted` - Canceled subscription
   - `invoice.payment_succeeded` - Successful payment
   - `invoice.payment_failed` - Failed payment
3. **Configure in Stripe**: https://dashboard.stripe.com/test/webhooks

## 🎯 Key Differences: Subscription vs One-Time

Your app is configured as **subscription**, which means:

✅ **Recurring billing** - Customer charged $6.99 every month automatically
✅ **Customer Portal** - Self-service management
✅ **Proration** - Automatic calculations if they upgrade/downgrade
✅ **Failed payment handling** - Automatic retries
✅ **Subscription lifecycle** - Active → Past Due → Canceled

vs. One-time payments which are single charges with no recurring billing.

## 📝 Files Created

1. **`/app/api/create-checkout-session/route.ts`** - Creates Stripe checkout (already existed)
2. **`/app/api/create-portal-session/route.ts`** - NEW: Creates customer portal session
3. **`/app/api/get-customer/route.ts`** - NEW: Retrieves customer by email
4. **`/app/manage/page.tsx`** - NEW: Subscription management page
5. **`/app/success/page.tsx`** - Updated with "Manage Subscription" button
6. **`/app/page.tsx`** - Updated footer with management link

## ✅ Checklist

### Test Mode:
- [ ] Create product in Stripe Dashboard
- [ ] Copy Price ID to `.env.local`
- [ ] Enable Customer Portal in Stripe
- [ ] Test full checkout flow with test card
- [ ] Test accessing `/manage` with email
- [ ] Test canceling subscription through portal
- [ ] Verify subscription shows in Stripe Dashboard

### Production (when ready):
- [ ] Complete Stripe account verification
- [ ] Create live product and price
- [ ] Get live API keys
- [ ] Enable live Customer Portal
- [ ] Update production environment variables
- [ ] Test with real payment (then cancel)
- [ ] Monitor dashboard for subscriptions

## 🆘 Need Help?

**Common Issues:**

1. **"No price ID found"** - You need to create the product in Stripe and add Price ID to `.env.local`
2. **"Customer not found"** - Make sure you completed checkout with that email first
3. **Portal not loading** - Customer Portal needs to be activated in Stripe settings
4. **Test payments failing** - Make sure you're using test card `4242 4242 4242 4242`

**Resources:**
- Stripe Dashboard: https://dashboard.stripe.com
- Test Cards: https://stripe.com/docs/testing#cards
- Customer Portal Docs: https://stripe.com/docs/billing/subscriptions/integrating-customer-portal
