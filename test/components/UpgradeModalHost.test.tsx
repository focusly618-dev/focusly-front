import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { savePendingPlan } from '@/utils/storage/pendingPlan';

const billing = vi.hoisted(() => ({
  known: true,
  isPro: false,
  billingEnabled: true,
  upgrade: {
    open: false,
    reason: 'manual',
    checkout: false,
    interval: 'month',
  },
  closeUpgrade: vi.fn(),
}));
const openUpgrade = vi.hoisted(() => vi.fn());
vi.mock('@/hooks/useBilling', () => ({ useBilling: () => billing }));
vi.mock('@/services/billingService', () => ({
  billingService: { openUpgrade },
}));
vi.mock('@/components/modals/UpgradeModal/UpgradeModal', () => ({
  UpgradeModal: () => null,
}));

const { UpgradeModalHost } =
  await import('@/components/Billing/UpgradeModalHost');

describe('UpgradeModalHost · Pro picked on the pricing page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    billing.known = true;
    billing.isPro = false;
    billing.billingEnabled = true;
  });

  it('opens the checkout with the chosen interval after sign-up', () => {
    savePendingPlan('year');
    render(<UpgradeModalHost />);
    expect(openUpgrade).toHaveBeenCalledWith('manual', {
      checkout: true,
      interval: 'year',
    });
    expect(localStorage.getItem('focusly_pending_plan')).toBeNull();
  });

  it('waits for the plan to be known', () => {
    savePendingPlan('month');
    billing.known = false;
    const { rerender } = render(<UpgradeModalHost />);
    expect(openUpgrade).not.toHaveBeenCalled();
    billing.known = true;
    rerender(<UpgradeModalHost />);
    expect(openUpgrade).toHaveBeenCalledTimes(1);
  });

  it('does nothing for an account that is already Pro, and forgets the choice', () => {
    savePendingPlan('month');
    billing.isPro = true;
    render(<UpgradeModalHost />);
    expect(openUpgrade).not.toHaveBeenCalled();
    expect(localStorage.getItem('focusly_pending_plan')).toBeNull();
  });

  it('does nothing without a pending choice', () => {
    render(<UpgradeModalHost />);
    expect(openUpgrade).not.toHaveBeenCalled();
  });
});
