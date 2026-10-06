import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { BillingStatus } from '@/api/Billing/billingApi';

const api = vi.hoisted(() => ({ getStatus: vi.fn() }));
vi.mock('@/api/Billing/billingApi', () => ({ billingApi: api }));

const { billingService } = await import('@/services/billingService');

const status = (over: Partial<BillingStatus> = {}): BillingStatus => ({
  plan: 'free',
  subscription_status: null,
  cancel_at_period_end: false,
  current_period_end: null,
  ai_messages_used: 2,
  ai_messages_limit: 5,
  billing_enabled: true,
  pro_price: { amount: 999, currency: 'usd', interval: 'month' },
  ...over,
});

describe('billingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    billingService.reset();
  });

  it('loads the plan once per user, and again on refresh', async () => {
    api.getStatus.mockResolvedValue(status());
    await Promise.all([billingService.load('u1'), billingService.load('u1')]);
    expect(api.getStatus).toHaveBeenCalledTimes(1);
    expect(billingService.getSnapshot().status?.ai_messages_used).toBe(2);

    await billingService.load('u1', { refresh: true });
    expect(api.getStatus).toHaveBeenLastCalledWith(true);
  });

  it("another user's plan never shows for the next one", async () => {
    api.getStatus.mockResolvedValueOnce(status({ plan: 'pro' }));
    await billingService.load('u1');
    api.getStatus.mockResolvedValueOnce(status());
    await billingService.load('u2');
    expect(billingService.getSnapshot()).toMatchObject({
      userId: 'u2',
      status: { plan: 'free' },
    });
  });

  it('after paying, asks again until the plan is Pro', async () => {
    api.getStatus
      .mockResolvedValueOnce(status())
      .mockResolvedValueOnce(status({ plan: 'pro' }));
    const active = await billingService.waitForPro('u1', { delayMs: 0 });
    expect(active).toBe(true);
    expect(api.getStatus).toHaveBeenCalledTimes(2);
    expect(api.getStatus).toHaveBeenCalledWith(true);
  });

  it('gives up waiting after a few tries', async () => {
    api.getStatus.mockResolvedValue(status());
    const active = await billingService.waitForPro('u1', {
      attempts: 3,
      delayMs: 0,
    });
    expect(active).toBe(false);
    expect(api.getStatus).toHaveBeenCalledTimes(3);
  });

  it('follows the messages left as the chat reports them', async () => {
    api.getStatus.mockResolvedValue(status());
    await billingService.load('u1');
    billingService.setRemaining(1);
    expect(billingService.getSnapshot().status?.ai_messages_used).toBe(4);
    billingService.markLimitReached();
    expect(billingService.getSnapshot().status?.ai_messages_used).toBe(5);
  });

  it('opens the Pro dialog with its reason', () => {
    billingService.openUpgrade('limit');
    expect(billingService.getSnapshot().upgrade).toEqual({
      open: true,
      reason: 'limit',
      checkout: false,
    });
    billingService.openUpgrade('manual', { checkout: true });
    expect(billingService.getSnapshot().upgrade.checkout).toBe(true);
    billingService.closeUpgrade();
    expect(billingService.getSnapshot().upgrade.open).toBe(false);
  });
});
