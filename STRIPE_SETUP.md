# Stripe Setup Instructions

## Quick Start with Test Mode

Your `.env.local` file already contains test API keys. You just need to create a test price in Stripe Dashboard.

### Step 1: Create a Price in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products) (Test Mode)
2. Click **"+ Add Product"**
3. Fill in the product details:
   - **Name**: BuzEntry Monthly Subscription
   - **Description**: Automatic apartment door entry service
   - **Pricing Model**: Standard pricing
   - **Price**: $6.99 USD
   - **Billing Period**: Monthly
   - **Recurring**
4. Click **"Save product"**
5. Copy the **Price ID** (starts with `price_...`)

### Step 2: Update .env.local

Replace the placeholder in your `.env.local` file:

```env
STRIPE_PRICE_ID=price_YOUR_COPIED_PRICE_ID
```

### Step 3: Restart Dev Server

```bash
# Kill the current dev server (Ctrl+C) and restart
npm run dev
```

## Testing the Payment Flow

1. Visit http://localhost:3001
2. Click "Get Started"
3. Enter any test email
4. Use Stripe test card numbers:
   - **Successful payment**: `4242 4242 4242 4242`
   - **Requires authentication**: `4000 0025 0000 3155`
   - **Declined**: `4000 0000 0000 0002`
   - Use any future expiry date, any 3-digit CVC, any ZIP code

## Current Keys (Test Mode)

Your `.env.local` already has test keys configured:
- ✅ Publishable Key: `pk_test_51SHUry7x...`
- ✅ Secret Key: `sk_test_51SHUry7x...`
- ❌ Price ID: **Needs to be created**

## Moving to Production

When ready to go live:

1. Toggle to **Live Mode** in Stripe Dashboard
2. Create a new product with the same price
3. Update `.env.local` with **live keys**:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PRICE_ID=price_live_...
   ```
4. Update `NEXT_PUBLIC_APP_URL` to your production domain

## Resources

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Stripe API Keys](https://dashboard.stripe.com/apikeys)
- [Stripe Products](https://dashboard.stripe.com/products)
