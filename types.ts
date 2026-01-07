export interface BirthData {
  date: string;
  time: string;
  location: string;
}

export interface WesternAnalysis {
  sunSign: string;
  moonSign: string; // Simulated
  ascendant: string; // Simulated
  element: string;
}

export interface EasternAnalysis {
  yearAnimal: string;
  yearElement: string;
  monthAnimal: string; // Simulated
  dayElement: string; // Simulated
}

export interface FusionResult {
  synthesisTitle: string;
  synthesisDescription: string;
  elementMatrix: string;
  western: WesternAnalysis;
  eastern: EasternAnalysis;
  prompt: string;
}

export interface Transit {
  body: string;
  sign: string;
  degree: number;
  isRetrograde: boolean;
  element: string;
}

export enum CalculationState {
  IDLE = 'IDLE',
  CALCULATING = 'CALCULATING',
  COMPLETE = 'COMPLETE',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR'
}

// --- Quiz Module Types ---

export interface User {
  username: string;
  email: string; // Simple mock auth
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface PersonalityResult {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  icon?: string; // SVG content
  stats?: { label: string; value: string }[];
  compatibility?: { ally: string; tension: string };
}

export interface QuestionOption {
  text: string;
  // For personality quizzes, maps result IDs (or traits) to weight values
  weights?: Record<string, number>; 
}

export interface Question {
  id: string;
  text: string;
  scenario?: string; // Context for personality questions
  options: string[] | QuestionOption[]; // Support both simple strings and complex weighted options
  correctAnswer?: number; // For Trivia
}

export type QuizType = 'TRIVIA' | 'PERSONALITY';

export interface Quiz {
  id: string;
  categoryId: string;
  type: QuizType;
  title: string;
  difficulty: string;
  questions: Question[];
  results?: PersonalityResult[]; // Possible outcomes for personality quizzes
}

export interface Score {
  id: string;
  quizId: string;
  quizTitle: string;
  username: string;
  points: number; // For Trivia
  resultTitle?: string; // For Personality
  totalQuestions: number;
  timestamp: number;
}

// --- Payment & Subscription Types ---

export type SubscriptionTier = 'FREE' | 'DAILY_PASS' | 'PREMIUM_MONTHLY' | 'PREMIUM_YEARLY';

export interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number; // in cents
  currency: string;
  popular?: boolean;
  bonus?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number; // in cents
  currency: string;
  interval: 'day' | 'month' | 'year';
  features: string[];
  tokensIncluded: number;
  popular?: boolean;
  stripePriceId?: string; // Stripe Price ID for production
}

export interface UserSubscription {
  userId: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  tokensRemaining: number;
  tokensTotal: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  autoRenew: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  type: 'token_purchase' | 'subscription';
  metadata?: {
    tokenPackageId?: string;
    subscriptionPlanId?: string;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'token_purchase' | 'subscription' | 'refund';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
  description: string;
  stripePaymentIntentId?: string;
}
