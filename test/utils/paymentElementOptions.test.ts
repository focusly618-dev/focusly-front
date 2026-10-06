import { describe, it, expect } from 'vitest';
import { buildPaymentElementOptions } from '@/components/Billing/paymentElementOptions';

const base = {
  planLabel: 'Focusly Pro',
  applePayDescription: 'Focusly Pro subscription',
  managementURL: 'https://focusly.app/profile/billing',
};

describe('buildPaymentElementOptions', () => {
  it('shows Apple Pay a monthly subscription with its real price', () => {
    const options = buildPaymentElementOptions({
      ...base,
      amount: 999,
      interval: 'month',
    });
    expect(options.applePay).toEqual({
      recurringPaymentRequest: {
        paymentDescription: 'Focusly Pro subscription',
        managementURL: 'https://focusly.app/profile/billing',
        regularBilling: {
          label: 'Focusly Pro',
          amount: 999,
          recurringPaymentIntervalUnit: 'month',
          recurringPaymentIntervalCount: 1,
        },
      },
    });
  });

  it('a weekly price is seven days for Apple Pay', () => {
    const options = buildPaymentElementOptions({
      ...base,
      amount: 300,
      interval: 'week',
    });
    expect(
      options.applePay?.recurringPaymentRequest?.regularBilling,
    ).toMatchObject({
      recurringPaymentIntervalUnit: 'day',
      recurringPaymentIntervalCount: 7,
    });
  });

  it('without a known price, leaves Apple Pay as a plain payment', () => {
    expect(buildPaymentElementOptions(base).applePay).toBeUndefined();
  });

  it('only prefills what the account has', () => {
    expect(
      buildPaymentElementOptions({ ...base, email: 'ana@example.com' })
        .defaultValues,
    ).toEqual({ billingDetails: { email: 'ana@example.com' } });
  });
});
