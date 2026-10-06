import type { PlanId, ProPrice } from '@/api/Billing/billingApi';

// What the Free and Pro cards list. Only what the backend really enforces
// is a difference (focusly-workflows app/modules/billing/plans.py): the
// number of free AI messages and the editor assistant.

/** Where Stripe sends the user back when a payment method needs a redirect. */
export const CHECKOUT_RETURN_PATH = '/profile/billing';

export interface PlanFeature {
  /** i18n key under billing.features. */
  key: string;
  included: boolean;
  /** Pro's own advantages. */
  highlight?: boolean;
}

export const PLAN_FEATURES: Record<PlanId, PlanFeature[]> = {
  free: [
    { key: 'aiTrial', included: true },
    { key: 'core', included: true },
    { key: 'calendar', included: true },
    { key: 'editorAi', included: false },
  ],
  pro: [
    { key: 'unlimitedAi', included: true, highlight: true },
    { key: 'editorAiPro', included: true, highlight: true },
    { key: 'everythingFree', included: true },
    { key: 'cancelAnytime', included: true },
  ],
};

/** "$9.99" for 999 USD cents, in the interface language. */
export const formatPrice = (
  price: Pick<ProPrice, 'amount' | 'currency'> | null | undefined,
  locale: string,
): string | null => {
  if (price?.amount == null || !price.currency) return null;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: price.currency.toUpperCase(),
    minimumFractionDigits: price.amount % 100 === 0 ? 0 : 2,
  }).format(price.amount / 100);
};
