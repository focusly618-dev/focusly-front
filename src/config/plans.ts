import type {
  BillingInterval,
  Discount,
  PlanId,
  ProPrice,
} from '@/api/Billing/billingApi';

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

/** The Pro price for a billing interval, if on sale. */
export const priceFor = (
  prices: ProPrice[] | null | undefined,
  interval: BillingInterval,
): ProPrice | null =>
  prices?.find((price) => price.interval === interval) ?? null;

/** How much the yearly plan saves against paying monthly, in whole months
 * (2 for a year at ten months' price) and percent. */
export const yearlySavings = (
  monthly: ProPrice | null | undefined,
  yearly: ProPrice | null | undefined,
): { months: number; percent: number } | null => {
  if (!monthly?.amount || !yearly?.amount) return null;
  const twelve = monthly.amount * 12;
  if (yearly.amount >= twelve) return null;
  return {
    months: Math.round((twelve - yearly.amount) / monthly.amount),
    percent: Math.round((1 - yearly.amount / twelve) * 100),
  };
};

/** A yearly price spread over its months: "$8.33". */
export const perMonth = (
  price: ProPrice | null | undefined,
  locale: string,
): string | null =>
  price?.amount != null
    ? formatPrice(
        { amount: Math.round(price.amount / 12), currency: price.currency },
        locale,
      )
    : null;

/** What a promotion code takes off: "20%" or "$5". */
export const discountValue = (
  discount: Discount | null | undefined,
  locale: string,
): string | null => {
  if (!discount) return null;
  if (discount.percent_off != null) return `${discount.percent_off}%`;
  return formatPrice(
    { amount: discount.amount_off, currency: discount.currency },
    locale,
  );
};

/** A date in the interface language: "12 de noviembre de 2026". */
export const formatDate = (unixSeconds: number, locale: string): string =>
  new Date(unixSeconds * 1000).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
