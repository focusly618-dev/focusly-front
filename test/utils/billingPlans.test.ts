import { describe, it, expect } from 'vitest';
import {
  discountValue,
  perMonth,
  priceFor,
  yearlySavings,
} from '@/config/plans';

const monthly = { amount: 999, currency: 'usd', interval: 'month' };
const yearly = { amount: 9990, currency: 'usd', interval: 'year' };

describe('plan prices', () => {
  it('finds the price of each interval', () => {
    expect(priceFor([monthly, yearly], 'year')).toBe(yearly);
    expect(priceFor([monthly], 'year')).toBeNull();
    expect(priceFor(undefined, 'month')).toBeNull();
  });

  it('a year at ten months: two months free, 17% saved', () => {
    expect(yearlySavings(monthly, yearly)).toEqual({ months: 2, percent: 17 });
  });

  it('no saving, no badge', () => {
    expect(yearlySavings(monthly, { ...yearly, amount: 11988 })).toBeNull();
    expect(yearlySavings(monthly, null)).toBeNull();
  });

  it('a yearly price per month', () => {
    expect(perMonth(yearly, 'en')).toBe('$8.33');
    expect(perMonth({ ...yearly, amount: 12000 }, 'en')).toBe('$10');
  });

  it('what a code takes off', () => {
    const base = {
      code: 'X',
      currency: null,
      duration: 'once' as const,
      duration_in_months: null,
    };
    expect(
      discountValue({ ...base, percent_off: 20, amount_off: null }, 'en'),
    ).toBe('20%');
    expect(
      discountValue(
        { ...base, percent_off: null, amount_off: 500, currency: 'usd' },
        'en',
      ),
    ).toBe('$5');
    expect(discountValue(null, 'en')).toBeNull();
  });
});
