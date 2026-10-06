import { loadStripe } from '@stripe/stripe-js';

// Only the publishable key lives in the browser. The price, and who is Pro,
// are decided by the backend.
const publishableKey: string | undefined = import.meta.env
  .VITE_STRIPE_PUBLISHABLE_KEY;

export const isStripeConfigured = Boolean(publishableKey);

if (!isStripeConfigured) {
  console.warn(
    '[Stripe] VITE_STRIPE_PUBLISHABLE_KEY is not set: payments are disabled.',
  );
}

export const stripePromise = publishableKey ? loadStripe(publishableKey) : null;
