import type { StripePaymentElementOptions } from '@stripe/stripe-js';

// Apple Pay's interval units (the type isn't exported by @stripe/stripe-js).
type ApplePayIntervalUnit = 'year' | 'month' | 'day' | 'hour' | 'minute';

// How Stripe's Payment Element looks and behaves in the Pro checkout. The
// web counterpart of Stripe's embedded mobile Payment Element: methods as a
// list with radios, the customer's details filled in, saved cards (through
// the CustomerSession) and wallets (Apple Pay, Google Pay, Link).

export interface PaymentElementInput {
  name?: string | null;
  email?: string | null;
  /** Pro price in cents, and Stripe's billing interval ("month"…). */
  amount?: number | null;
  interval?: string | null;
  /** "Focusly Pro" */
  planLabel: string;
  /** Shown in the Apple Pay wallet next to the subscription. */
  applePayDescription: string;
  /** Where the user manages the subscription (Apple Pay links to it). */
  managementURL: string;
}

const APPLE_PAY_UNITS: Record<
  string,
  { unit: ApplePayIntervalUnit; count: number }
> = {
  day: { unit: 'day', count: 1 },
  week: { unit: 'day', count: 7 },
  month: { unit: 'month', count: 1 },
  year: { unit: 'year', count: 1 },
};

export const buildPaymentElementOptions = ({
  name,
  email,
  amount,
  interval,
  planLabel,
  applePayDescription,
  managementURL,
}: PaymentElementInput): StripePaymentElementOptions => {
  const billing = interval ? APPLE_PAY_UNITS[interval] : undefined;
  return {
    // One payment method per row with a radio, like the mobile embedded list.
    layout: {
      type: 'accordion',
      radios: 'always',
      spacedAccordionItems: false,
      defaultCollapsed: false,
    },
    // Filled in from the account: fewer fields, and Link recognizes the email.
    defaultValues: {
      billingDetails: {
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
      },
    },
    business: { name: 'Focusly' },
    // A subscription in Apple Pay's sheet (and a merchant token for renewals).
    ...(amount != null && billing
      ? {
          applePay: {
            recurringPaymentRequest: {
              paymentDescription: applePayDescription,
              managementURL,
              regularBilling: {
                label: planLabel,
                amount,
                recurringPaymentIntervalUnit: billing.unit,
                recurringPaymentIntervalCount: billing.count,
              },
            },
          },
        }
      : {}),
  };
};
