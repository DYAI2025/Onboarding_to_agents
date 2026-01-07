# Stripe Payment Integration - Setup Guide

This document explains the Stripe payment integration for AI Astro Agents, including token purchases, daily passes, and premium subscriptions.

## 🎯 Overview

The application now supports three payment models:

1. **Token Packages** - One-time purchases of AI tokens
2. **Daily Pass** - 24-hour access with tokens
3. **Premium Subscriptions** - Monthly or yearly recurring subscriptions

## 📦 What's Included

### New Files

- `types.ts` - Extended with payment & subscription types
- `config/pricing.ts` - Pricing configuration for all packages and plans
- `services/paymentService.ts` - Stripe integration service
- `components/PricingView.tsx` - Pricing page UI
- `components/BillingView.tsx` - Billing & subscription management UI
- Updated `components/Sidebar.tsx` - Added pricing and billing navigation
- Updated `App.tsx` - Integrated payment views and subscription state

### Dependencies Installed

```bash
@stripe/stripe-js     # Stripe.js for client-side
@stripe/react-stripe-js # React components for Stripe
stripe                # Stripe Node.js SDK (for backend)
```

## 🚀 Quick Start (Development)

The integration is ready to use in **development mode** with mock payments:

1. Navigate to the **Upgrade** (💎) page in the sidebar
2. Browse token packages and subscription plans
3. Click "Buy" or "Subscribe" - payments are simulated
4. Check the **Billing** (💳) page to see your subscription status

## 🔧 Production Setup

To enable real Stripe payments in production:

### Step 1: Create a Stripe Account

1. Sign up at [stripe.com](https://stripe.com)
2. Complete your business profile
3. Activate your account

### Step 2: Get API Keys

1. Go to **Developers → API Keys** in Stripe Dashboard
2. Copy your **Publishable key** (starts with `pk_`)
3. Copy your **Secret key** (starts with `sk_`)

### Step 3: Create Products & Prices

In the Stripe Dashboard:

#### Token Packages (One-time Payments)
Create products for each token package:
- **Starter Pack**: €4.99 for 100 tokens
- **Power Pack**: €19.99 for 500 tokens (+50 bonus)
- **Elite Pack**: €34.99 for 1000 tokens (+150 bonus)
- **Master Pack**: €79.99 for 2500 tokens (+500 bonus)

#### Subscription Plans
Create recurring price IDs for:
- **Daily Pass**: €2.99/day with 150 tokens
- **Premium Monthly**: €19.99/month with 2000 tokens
- **Premium Yearly**: €199.99/year with 25000 tokens

### Step 4: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Stripe Public Key (safe for client-side)
VITE_STRIPE_PUBLIC_KEY=pk_live_your_publishable_key_here

# Stripe Secret Key (BACKEND ONLY - never expose in client)
STRIPE_SECRET_KEY=sk_live_your_secret_key_here

# Stripe Price IDs
STRIPE_MONTHLY_PRICE_ID=price_monthly_id_here
STRIPE_YEARLY_PRICE_ID=price_yearly_id_here
```

**⚠️ IMPORTANT**: Never commit `.env` to git! Add it to `.gitignore`.

### Step 5: Create Backend API Endpoints

The current implementation uses mock functions. You need to create a backend server with these endpoints:

#### POST `/api/payment/create-token-intent`
Creates a PaymentIntent for token purchases.

```typescript
// Request
{
  tokenPackageId: string;
  userId: string;
}

// Response
{
  clientSecret: string;
  paymentIntentId: string;
}
```

#### POST `/api/payment/create-checkout-session`
Creates a Stripe Checkout Session for subscriptions.

```typescript
// Request
{
  planId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}

// Response
{
  sessionId: string;
  url: string; // Stripe Checkout URL
}
```

#### POST `/api/subscription/cancel`
Cancels a user's subscription.

```typescript
// Request
{
  subscriptionId: string;
}

// Response
{
  success: boolean;
  message: string;
}
```

#### GET `/api/transactions`
Retrieves user's transaction history.

```typescript
// Query Params
userId: string;
limit?: number;

// Response
{
  transactions: Transaction[];
}
```

### Step 6: Implement Webhook Handler

Create an endpoint to handle Stripe webhooks for real-time updates:

#### POST `/api/webhooks/stripe`

Handle these events:
- `checkout.session.completed` - Subscription created
- `invoice.payment_succeeded` - Recurring payment success
- `invoice.payment_failed` - Payment failed
- `customer.subscription.deleted` - Subscription cancelled
- `payment_intent.succeeded` - Token purchase completed

Example backend webhook handler:

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Update user subscription in database
      await activateSubscription(session);
      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Add tokens to user account
      await addTokensToUser(paymentIntent);
      break;

    // Handle other events...
  }

  res.json({ received: true });
}
```

Configure webhook endpoint in Stripe Dashboard → **Developers → Webhooks**.

### Step 7: Update Frontend Service

Replace mock implementations in `services/paymentService.ts` with real API calls:

```typescript
export const createTokenPurchaseIntent = async (
  tokenPackage: TokenPackage,
  userId: string
): Promise<PaymentIntent> => {
  const response = await fetch('/api/payment/create-token-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenPackageId: tokenPackage.id, userId }),
  });

  return response.json();
};
```

## 🏗️ Architecture

### Frontend (React)
- **PricingView**: Displays packages and plans, handles purchase clicks
- **BillingView**: Shows subscription status, token balance, transactions
- **paymentService**: Communicates with backend APIs
- **Stripe Elements**: (Future) For custom payment forms

### Backend (To be implemented)
- **API Endpoints**: Handle payment creation and management
- **Database**: Store user subscriptions, tokens, transactions
- **Webhook Handler**: Process Stripe events
- **Authentication**: Verify user identity for all payment operations

### Stripe
- **Checkout Sessions**: Hosted payment page for subscriptions
- **Payment Intents**: For one-time token purchases
- **Customer Portal**: Let users manage subscriptions (future)
- **Webhooks**: Real-time payment notifications

## 💡 Token Usage System

Configure token costs in `config/pricing.ts`:

```typescript
export const TOKEN_COSTS = {
  ASTRO_ANALYSIS: 5,          // Birth chart analysis
  SYMBOL_GENERATION: 10,      // AI-generated symbol
  AGENT_CONVERSATION_MESSAGE: 2, // Each AI agent message
  TRANSIT_ANALYSIS: 3,        // Planetary transit reading
  QUIZ_GENERATION: 1,         // Generate quiz questions
  CHARACTER_DASHBOARD_LOAD: 2, // Load character profile
};
```

Deduct tokens when users consume AI features:

```typescript
// Example: Before running astro analysis
if (userSubscription.tokensRemaining < TOKEN_COSTS.ASTRO_ANALYSIS) {
  alert('Not enough tokens! Please purchase more.');
  navigate('/pricing');
  return;
}

// Run the analysis
await runFusionAnalysis(data);

// Deduct tokens
setUserSubscription(prev => ({
  ...prev,
  tokensRemaining: prev.tokensRemaining - TOKEN_COSTS.ASTRO_ANALYSIS,
}));

// Update backend
await updateUserTokens(userId, -TOKEN_COSTS.ASTRO_ANALYSIS);
```

## 🔒 Security Best Practices

### ✅ DO:
- Keep secret keys on backend only
- Validate all payments server-side
- Use webhook signatures to verify authenticity
- Implement rate limiting on payment endpoints
- Store sensitive data encrypted
- Use HTTPS in production
- Validate user authentication before processing payments
- Log all payment events for audit trails

### ❌ DON'T:
- Never expose secret keys in frontend code
- Don't trust client-side payment confirmations alone
- Don't skip webhook signature verification
- Don't store card details (let Stripe handle it)
- Don't allow payments without authentication

## 🧪 Testing

### Test Mode
1. Use Stripe test keys (start with `pk_test_` and `sk_test_`)
2. Use test card numbers from [Stripe docs](https://stripe.com/docs/testing):
   - Success: `4242 4242 4242 4242`
   - Declined: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`

### Test Webhooks Locally
Use Stripe CLI to forward webhooks to localhost:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 📊 Monitoring

Monitor in Stripe Dashboard:
- **Payments**: Track successful/failed transactions
- **Subscriptions**: Active/churned subscriber metrics
- **Balance**: Available funds and payouts
- **Logs**: Debug webhook and API events

## 🎨 Customization

### Update Pricing
Edit `config/pricing.ts`:
- Modify `TOKEN_PACKAGES` array
- Modify `SUBSCRIPTION_PLANS` array
- Update feature lists and prices

### Customize UI
- `components/PricingView.tsx` - Pricing page design
- `components/BillingView.tsx` - Billing dashboard design
- Tailwind classes follow existing "astro" theme

### Add Features to Plans
Update `features` array in subscription plans:

```typescript
features: [
  '2000 Tokens pro Monat',
  'Alle Agenten freigeschaltet',
  'Prioritäts-Support',
  // Add your new feature here
],
```

## 🌍 Multi-Currency Support

To support multiple currencies:

1. Create separate price IDs in Stripe for each currency
2. Detect user's location with geolocation
3. Update `config/pricing.ts` to include currency variants
4. Display prices in user's local currency

## 📱 Mobile Considerations

- Stripe Checkout is mobile-optimized
- Payment UI is responsive with Tailwind
- Test on real devices before production launch

## 🚨 Common Issues

### Issue: "Stripe not initialized"
**Solution**: Check that `VITE_STRIPE_PUBLIC_KEY` is set in `.env`

### Issue: Webhooks not received
**Solution**:
- Verify webhook URL is publicly accessible
- Check webhook signature is correct
- Use Stripe CLI for local testing

### Issue: Payments succeed but user doesn't get tokens
**Solution**: Check webhook handler is processing events and updating database

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Webhooks Best Practices](https://stripe.com/docs/webhooks/best-practices)

## 🆘 Support

For Stripe-specific issues, contact Stripe Support or check their [Developer Forum](https://support.stripe.com/).

For integration questions, reach out to your development team.

---

**Status**: ✅ Frontend complete | 🚧 Backend pending | 🔄 Ready for production setup

Last updated: 2026-01-07
