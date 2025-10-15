# AutoEntry - Apartment Door Automation Landing Page

A high-converting Next.js landing page for AutoEntry, an app that automates apartment buzzer systems.

## Features

### Landing Page
- ✅ Hero section with clear value proposition
- ✅ Problem-solution-benefits structure
- ✅ Interactive FAQ section
- ✅ Pricing section with money-back guarantee
- ✅ Multiple CTAs optimized for conversions
- ✅ Social proof and trust badges
- ✅ Fully responsive design

### Payment Integration
- ✅ Stripe Checkout integration
- ✅ Subscription billing ($6.99/month)
- ✅ Demo mode (works without Stripe keys)

### Onboarding Experience
- ✅ 3-step setup wizard
- ✅ Automatic phone number assignment
- ✅ Door code configuration
- ✅ Clear next steps instructions
- ✅ Copy-to-clipboard functionality

### Analytics
- ✅ Vercel Analytics integrated

## Getting Started

### 1. Development (Demo Mode)

The app works out of the box in demo mode without Stripe keys:

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3001](http://localhost:3001) to view the landing page.

### 2. Production Setup with Real Stripe Integration

#### Get Stripe Keys

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Go to [Developers → API Keys](https://dashboard.stripe.com/apikeys)
3. Copy your Publishable key and Secret key

#### Create a Stripe Price

1. Go to [Products](https://dashboard.stripe.com/products) in Stripe Dashboard
2. Click "Add Product"
3. Set:
   - Name: "AutoEntry Monthly Subscription"
   - Price: $6.99
   - Billing period: Monthly
   - Click "Save product"
4. Copy the Price ID (starts with \`price_...\`)

#### Configure Environment Variables

Update \`.env.local\` with your actual Stripe keys:

\`\`\`env
# Replace with your actual keys from Stripe Dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_key
STRIPE_SECRET_KEY=sk_live_your_actual_key

# Replace with your Price ID from Stripe
STRIPE_PRICE_ID=price_your_actual_price_id

# Update for production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
\`\`\`

#### Restart the Development Server

\`\`\`bash
npm run dev
\`\`\`

## How It Works

### Payment Flow

1. User clicks "Get Started" button on landing page
2. App calls \`/api/create-checkout-session\`
3. In demo mode: Redirects directly to onboarding
4. In production: Redirects to Stripe Checkout
5. After successful payment: Redirects to \`/onboarding\`

### Onboarding Flow

1. **Step 1**: Payment success confirmation
2. **Step 2**: Phone number assignment + door code setup
3. **Step 3**: Instructions for updating building directory

## Project Structure

\`\`\`
app/
├── page.tsx                           # Landing page
├── onboarding/
│   └── page.tsx                       # Onboarding wizard
├── api/
│   └── create-checkout-session/
│       └── route.ts                   # Stripe checkout API
├── layout.tsx                         # Root layout with Analytics
└── globals.css                        # Global styles

.env.local                             # Environment variables
.env.local.example                     # Example env file
\`\`\`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard:
   - \`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY\`
   - \`STRIPE_SECRET_KEY\`
   - \`STRIPE_PRICE_ID\`
   - \`NEXT_PUBLIC_APP_URL\`
4. Deploy!

### Stripe Webhook (for production)

To handle subscription events (cancellations, renewals, etc.), set up a webhook:

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. URL: \`https://yourdomain.com/api/webhooks/stripe\`
4. Select events: \`checkout.session.completed\`, \`customer.subscription.deleted\`, etc.
5. Add webhook secret to \`.env.local\` as \`STRIPE_WEBHOOK_SECRET\`

## Conversion Optimization Features

- **Clear Value Proposition**: "Never Miss a Delivery Again"
- **Social Proof**: 4.9/5 star rating with user count
- **Risk Reversal**: 100% money-back guarantee prominently displayed
- **Pricing Transparency**: $6.99/month clearly shown throughout
- **Multiple CTAs**: 3 "Get Started" buttons at strategic points
- **Problem-First Approach**: Highlights pain points users relate to
- **3-Step Simplicity**: "Get Number → Set Code → Relax"
- **Trust Signals**: Bank-level encryption, no recordings, cancel anytime
- **FAQ Section**: Addresses common objections
- **Scarcity/Value**: "Less than a single missed delivery"

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Payments**: Stripe
- **Analytics**: Vercel Analytics
- **Language**: TypeScript

## Features to Add (Future)

- [ ] Actual dashboard with entry logs
- [ ] SMS notifications when door is unlocked
- [ ] Account management (pause/resume service)
- [ ] Phone number verification
- [ ] Multi-apartment support
- [ ] Email confirmations
- [ ] Customer portal (Stripe)

## Support

For questions or issues:
- Email: support@autoentry.com
- Text: (415) 555-1234

## License

Proprietary - All rights reserved
