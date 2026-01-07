import { TokenPackage, SubscriptionPlan } from '../types';

/**
 * Token Packages Configuration
 * Users can purchase tokens to use AI agent features
 */
export const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: 'tokens_100',
    name: 'Starter Pack',
    tokens: 100,
    price: 499, // $4.99
    currency: 'EUR',
    bonus: undefined,
  },
  {
    id: 'tokens_500',
    name: 'Power Pack',
    tokens: 500,
    price: 1999, // $19.99
    currency: 'EUR',
    popular: true,
    bonus: '+50 Bonus Tokens',
  },
  {
    id: 'tokens_1000',
    name: 'Elite Pack',
    tokens: 1000,
    price: 3499, // $34.99
    currency: 'EUR',
    bonus: '+150 Bonus Tokens',
  },
  {
    id: 'tokens_2500',
    name: 'Master Pack',
    tokens: 2500,
    price: 7999, // $79.99
    currency: 'EUR',
    bonus: '+500 Bonus Tokens',
  },
];

/**
 * Subscription Plans Configuration
 * Daily Pass, Monthly Premium, and Yearly Premium
 */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'daily_pass',
    name: 'Daily Pass',
    tier: 'DAILY_PASS',
    price: 299, // $2.99
    currency: 'EUR',
    interval: 'day',
    tokensIncluded: 150,
    features: [
      '150 AI Agent Tokens',
      'Zugriff auf alle Agenten',
      'Astro-Analysen & Symbole',
      'Quiz & Tests',
      '24 Stunden Zugang',
    ],
    popular: false,
  },
  {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    tier: 'PREMIUM_MONTHLY',
    price: 1999, // $19.99
    currency: 'EUR',
    interval: 'month',
    tokensIncluded: 2000,
    features: [
      '2000 Tokens pro Monat',
      'Alle Agenten freigeschaltet',
      'Erweiterte Astro-Features',
      'Prioritäts-Support',
      'Exklusive Inhalte',
      'Unbegrenzte Analysen',
      'Export-Funktionen',
    ],
    popular: true,
    stripePriceId: process.env.STRIPE_MONTHLY_PRICE_ID, // Set in production
  },
  {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    tier: 'PREMIUM_YEARLY',
    price: 19999, // $199.99 (save ~17%)
    currency: 'EUR',
    interval: 'year',
    tokensIncluded: 25000,
    features: [
      '25.000 Tokens pro Jahr',
      'Spare 17% gegenüber Monatlich',
      'Alle Agenten freigeschaltet',
      'Erweiterte Astro-Features',
      'VIP Support',
      'Exklusive Inhalte',
      'Early Access zu neuen Features',
      'Unbegrenzte Analysen',
      'Export-Funktionen',
    ],
    popular: false,
    stripePriceId: process.env.STRIPE_YEARLY_PRICE_ID, // Set in production
  },
];

/**
 * Free Tier Configuration
 */
export const FREE_TIER_TOKENS = 10; // Free users get 10 tokens per month
export const FREE_TIER_FEATURES = [
  '10 kostenlose Tokens',
  'Zugriff auf Basic Agent',
  'Basis Astro-Analyse',
  'Zugriff auf Quizzes',
];

/**
 * Token Usage Costs
 * Define how many tokens different actions cost
 */
export const TOKEN_COSTS = {
  ASTRO_ANALYSIS: 5,
  SYMBOL_GENERATION: 10,
  AGENT_CONVERSATION_MESSAGE: 2,
  TRANSIT_ANALYSIS: 3,
  QUIZ_GENERATION: 1,
  CHARACTER_DASHBOARD_LOAD: 2,
};

/**
 * Stripe Configuration
 * Replace with your actual Stripe keys in production
 */
export const STRIPE_CONFIG = {
  publicKey: process.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_publishable_key_here',
  // Note: Secret key should ONLY be used on the backend/server
  // NEVER expose secret keys in client-side code
};
