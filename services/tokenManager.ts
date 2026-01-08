import { TOKEN_COSTS } from '../config/pricing';
import { UserSubscription } from '../types';

/**
 * Token Manager Service
 * Handles token balance checks and deductions
 */

/**
 * Check if user has enough tokens for an action
 */
export const hasEnoughTokens = (
  subscription: UserSubscription,
  actionType: keyof typeof TOKEN_COSTS
): boolean => {
  const cost = TOKEN_COSTS[actionType];
  return subscription.tokensRemaining >= cost;
};

/**
 * Get token cost for an action
 */
export const getTokenCost = (actionType: keyof typeof TOKEN_COSTS): number => {
  return TOKEN_COSTS[actionType];
};

/**
 * Calculate tokens remaining after an action
 */
export const calculateTokensAfterAction = (
  currentTokens: number,
  actionType: keyof typeof TOKEN_COSTS
): number => {
  const cost = TOKEN_COSTS[actionType];
  return Math.max(0, currentTokens - cost);
};

/**
 * Deduct tokens from user subscription (client-side only)
 * In production, this should also call a backend API
 */
export const deductTokens = async (
  userId: string,
  actionType: keyof typeof TOKEN_COSTS
): Promise<{ success: boolean; remaining: number; error?: string }> => {
  const cost = TOKEN_COSTS[actionType];

  // TODO: Replace with actual backend API call
  // Example: POST /api/tokens/deduct
  // Body: { userId, actionType, cost }

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock response
    return {
      success: true,
      remaining: 0, // This would be returned by backend
    };
  } catch (error) {
    console.error('Failed to deduct tokens:', error);
    return {
      success: false,
      remaining: 0,
      error: error instanceof Error ? error.message : 'Failed to deduct tokens',
    };
  }
};

/**
 * Add tokens to user account (after purchase)
 * In production, this should be triggered by webhook from backend
 */
export const addTokens = async (
  userId: string,
  amount: number
): Promise<{ success: boolean; newBalance: number; error?: string }> => {
  // TODO: Replace with actual backend API call
  // Example: POST /api/tokens/add
  // Body: { userId, amount }

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock response
    return {
      success: true,
      newBalance: amount,
    };
  } catch (error) {
    console.error('Failed to add tokens:', error);
    return {
      success: false,
      newBalance: 0,
      error: error instanceof Error ? error.message : 'Failed to add tokens',
    };
  }
};

/**
 * Check if subscription is active and valid
 */
export const isSubscriptionActive = (subscription: UserSubscription): boolean => {
  if (subscription.status !== 'active') {
    return false;
  }

  // Check if current period has expired
  const now = new Date();
  const periodEnd = new Date(subscription.currentPeriodEnd);

  return now <= periodEnd;
};

/**
 * Get subscription status display text
 */
export const getSubscriptionStatusText = (subscription: UserSubscription): string => {
  if (!isSubscriptionActive(subscription)) {
    return 'Expired';
  }

  const daysRemaining = Math.ceil(
    (new Date(subscription.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (subscription.tier === 'DAILY_PASS') {
    const hoursRemaining = Math.ceil(
      (new Date(subscription.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60)
    );
    return `${hoursRemaining}h remaining`;
  }

  if (daysRemaining <= 7) {
    return `${daysRemaining} days remaining`;
  }

  return 'Active';
};

/**
 * Format token amount with commas
 */
export const formatTokenAmount = (tokens: number): string => {
  return tokens.toLocaleString();
};

/**
 * Calculate token usage percentage
 */
export const getTokenUsagePercentage = (subscription: UserSubscription): number => {
  if (subscription.tokensTotal === 0) return 0;
  return Math.round((subscription.tokensRemaining / subscription.tokensTotal) * 100);
};

/**
 * Check if user should be prompted to purchase more tokens
 */
export const shouldPromptTokenPurchase = (subscription: UserSubscription): boolean => {
  const usagePercentage = getTokenUsagePercentage(subscription);
  return usagePercentage < 10; // Prompt when less than 10% tokens remaining
};

/**
 * Get recommended token package based on usage
 */
export const getRecommendedTokenPackage = (subscription: UserSubscription): string => {
  const remaining = subscription.tokensRemaining;

  if (remaining < 50) {
    return 'tokens_500'; // Power Pack
  } else if (remaining < 200) {
    return 'tokens_100'; // Starter Pack
  } else {
    return 'tokens_1000'; // Elite Pack
  }
};
