import { loadStripe } from '@stripe/stripe-js';

const publishableKey =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51UNH6GAJyAA60rb5aX6hfKROSgP9GupGSIZCE22I3crFCqOSH7nPI6rSwRbuW7FbFgpOtsl65ahnBxq3RiZ1fVMd00evYJK83l';

if (!publishableKey) {
  console.warn(
    '[Stripe] VITE_STRIPE_PUBLISHABLE_KEY is not defined in environment variables.',
  );
}

export const stripePromise = loadStripe(publishableKey);

export const DEFAULT_PRO_PRICE_ID =
  import.meta.env.VITE_STRIPE_PRICE_ID || 'price_1UNIiQAJyAA60rb54rrTjLev';
