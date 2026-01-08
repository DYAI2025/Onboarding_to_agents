export interface CheckoutItem {
  priceId: string;
  quantity: number;
}

export interface CheckoutSessionPayload {
  items: CheckoutItem[];
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export const getStripePublishableKey = (): string => {
  return import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '';
};

export const createCheckoutSession = async (payload: CheckoutSessionPayload) => {
  const response = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Stripe checkout session failed');
  }

  return response.json() as Promise<{ sessionId: string }>;
};
