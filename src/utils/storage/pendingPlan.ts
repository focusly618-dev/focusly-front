import type { BillingInterval } from '@/api/Billing/billingApi';
import { safeSetItem } from './localData';

// "Elegir Pro" on the public pricing page sends visitors to sign up with
// ?plan=pro. The choice has to outlive the sign-up: Google's popup keeps the
// page, but the email magic link comes back in a new tab. It is kept here
// until the first logged-in screen picks it up, and expires so an abandoned
// sign-up doesn't open the checkout days later.

const KEY = 'focusly_pending_plan';
export const PENDING_PLAN_TTL_MS = 6 * 60 * 60 * 1000;

interface PendingPlan {
  interval: BillingInterval;
  savedAt: number;
}

export const savePendingPlan = (interval: BillingInterval) =>
  safeSetItem(KEY, JSON.stringify({ interval, savedAt: Date.now() }));

/** The pending Pro choice, if any and still fresh; reading it clears it. */
export const takePendingPlan = (): { interval: BillingInterval } | null => {
  try {
    const raw = localStorage.getItem(KEY);
    localStorage.removeItem(KEY);
    if (!raw) return null;
    const { interval, savedAt } = JSON.parse(raw) as PendingPlan;
    if (Date.now() - savedAt > PENDING_PLAN_TTL_MS) return null;
    return { interval: interval === 'year' ? 'year' : 'month' };
  } catch {
    return null;
  }
};
