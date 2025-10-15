# BuzEntry Setup Guide

This guide will help you set up the BuzEntry application with user authentication, email notifications, and the dashboard.

## Prerequisites

- Node.js 18+ installed
- Vercel account (for KV database)
- Stripe account
- Resend account (for emails)
- SignalWire account (for phone numbers)

## Environment Setup

1. **Copy the example environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Configure each service:**

### Stripe Configuration

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys from [API Keys page](https://dashboard.stripe.com/apikeys)
   - Copy `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy `Secret key` → `STRIPE_SECRET_KEY`

3. Create a product and price:
   - Go to Products → Create Product
   - Name: "BuzEntry Monthly Subscription"
   - Price: $6.99/month (recurring)
   - Copy the Price ID → `STRIPE_PRICE_ID`

4. Set up webhooks:
   - Go to [Webhooks](https://dashboard.stripe.com/webhooks)
   - Click "Add endpoint"
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### NextAuth Configuration

1. Generate an auth secret:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output → `AUTH_SECRET`

2. Set your app URL:
   - Development: `http://localhost:3001`
   - Production: `https://your-domain.com`

### Resend Email Service

1. Go to [Resend](https://resend.com)
2. Sign up and verify your account
3. Get your API key from [API Keys](https://resend.com/api-keys)
   - Copy the API key → `RESEND_API_KEY`

4. Configure your domain (for production):
   - Go to [Domains](https://resend.com/domains)
   - Add your domain (e.g., buzentry.com)
   - Add the DNS records to your domain provider
   - This enables sending from `noreply@buzentry.com` and `support@buzentry.com`

5. For development:
   - You can use Resend's testing domain
   - Emails will only be sent to verified addresses

### Vercel KV (Database)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage → Create Database → KV
3. Name it "buzentry-db"
4. Copy the environment variables:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

5. For local development:
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel env pull .env.local` to sync KV credentials

### SignalWire Configuration (TODO)

1. Go to [SignalWire](https://signalwire.com)
2. Sign up and create a project
3. Get your credentials:
   - Project ID
   - API Token
   - Space URL

4. Integrate the API in `app/api/webhooks/stripe/route.ts`:
   - Replace the `provisionSignalWireNumber()` function with actual SignalWire API calls
   - See the TODO comments in the file

### Optional: Telegram Notifications

For receiving notifications about new signups:

1. Create a Telegram bot:
   - Message [@BotFather](https://t.me/botfather)
   - Send `/newbot` and follow instructions
   - Copy the bot token → `TELEGRAM_BOT_TOKEN`

2. Get your chat ID:
   - Message your bot
   - Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your chat ID in the response → `TELEGRAM_CHAT_ID`

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3001](http://localhost:3001)

## Testing the Flow

### Test User Signup

1. Click "Get Started" on the homepage
2. Enter an email address
3. Click through to checkout (use Stripe test card: `4242 4242 4242 4242`)
4. After successful payment:
   - User account is created
   - SignalWire number is assigned (placeholder for now)
   - Welcome email is sent
   - User can sign in to dashboard

### Test Dashboard

1. Go to `/login`
2. Enter your email
3. Click the magic link sent to your email
4. You'll be redirected to the dashboard

### Dashboard Features

- **Phone Number Display**: Shows your assigned SignalWire number
- **Pause/Resume**: Toggle automatic call answering
- **Door Code**: Set which button unlocks your door
- **Call Forwarding**:
  - Enable/disable forwarding
  - Add single or multiple phone numbers
  - Calls will be forwarded instead of auto-answered
- **Analytics**:
  - Total calls received
  - Successful unlocks
  - Forwarded calls
  - Missed calls
  - Recent activity log

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel project settings
4. Deploy

### Update Stripe Webhook

After deployment, update your Stripe webhook URL:
- From: `http://localhost:3001/api/webhooks/stripe`
- To: `https://your-domain.com/api/webhooks/stripe`

### Configure Resend Domain

For production emails:
1. Add your domain in Resend
2. Update DNS records
3. Verify the domain
4. Update email sender in:
   - `auth.ts` (line 6)
   - `lib/email.ts` (line 13)
   - `emails/welcome.tsx` (if needed)

## Database Schema

The app uses Vercel KV (Redis) with the following structure:

### User Profile
```
Key: user:{userId}
Value: {
  email: string
  userId: string
  signalwirePhoneNumber: string | null
  doorCode: string | null
  isPaused: boolean
  forwardingEnabled: boolean
  forwardingNumbers: string[]
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'trialing' | null
  createdAt: number
  updatedAt: number
}
```

### Email Index
```
Key: email:{email}
Value: userId
```

### Call Logs
```
Key: call:{callId}
Value: {
  id: string
  userId: string
  phoneNumber: string
  timestamp: number
  status: 'answered' | 'forwarded' | 'missed' | 'paused'
  duration?: number
  forwardedTo?: string
}
```

### User Calls Index (Sorted Set)
```
Key: user:{userId}:calls
Value: Sorted set of call IDs by timestamp
```

## Next Steps

1. **Integrate SignalWire API**:
   - Update `app/api/webhooks/stripe/route.ts`
   - Implement phone number provisioning
   - Configure call handling

2. **Create SignalWire Webhook**:
   - Handle incoming calls
   - Implement auto-answer logic
   - Log call activity
   - Support forwarding

3. **Add Account Management**:
   - Subscription cancellation
   - Billing portal (use Stripe Customer Portal)
   - Account deletion

4. **Support Email**:
   - Configure support@buzentry.com
   - Set up email routing in Resend

## Troubleshooting

### Emails not sending
- Check Resend API key is correct
- Verify domain is configured (for production)
- Check console logs for error messages

### Database errors
- Verify KV credentials are correct
- Check Vercel KV dashboard for connection status
- Ensure you're not exceeding free tier limits

### Authentication issues
- Verify `AUTH_SECRET` is set
- Check `AUTH_URL` matches your current URL
- Clear browser cookies and try again

### Webhook not receiving events
- Verify webhook URL is correct in Stripe
- Check webhook signing secret matches
- Review Stripe webhook logs for errors

## Support

For issues or questions:
- Email: support@buzentry.com
- Check application logs
- Review Stripe/Resend/Vercel dashboards
