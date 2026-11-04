import { describe, it, expect, vi, beforeEach } from 'vitest';

const notify = vi.hoisted(() => ({ warning: vi.fn(), info: vi.fn() }));
vi.mock('@/utils', () => ({ notify }));
vi.mock('i18next', () => ({
  default: {
    t: (key: string, values?: Record<string, unknown>) =>
      values ? `${key} ${JSON.stringify(values)}` : key,
  },
}));

const {
  PlanLimitError,
  isPlanLimitMessage,
  noteDailyRemaining,
  offersPro,
  remainingFromHeaders,
  resetDailyWarning,
  throwIfPlanLimit,
} = await import('@/api/Billing/planLimit');

const json = (status: number, body: unknown, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(body), { status, headers });

describe('plan limits from the AI endpoints', () => {
  it('turns a 402 into a PlanLimitError with its code', async () => {
    await expect(
      throwIfPlanLimit(
        json(402, { detail: { code: 'free_limit_reached', limit: 5 } }),
      ),
    ).rejects.toMatchObject({ code: 'free_limit_reached', limit: 5 });
    await expect(
      throwIfPlanLimit(json(402, { detail: { code: 'pro_required' } })),
    ).rejects.toBeInstanceOf(PlanLimitError);
  });

  it('lets other responses through', async () => {
    await expect(throwIfPlanLimit(json(200, {}))).resolves.toBeUndefined();
    await expect(throwIfPlanLimit(json(500, {}))).resolves.toBeUndefined();
  });

  it('reads how many free messages are left', () => {
    expect(
      remainingFromHeaders(json(200, {}, { 'X-AI-Messages-Remaining': '3' })),
    ).toBe(3);
    expect(remainingFromHeaders(json(200, {}))).toBeNull();
  });

  it('recognizes the error once only its message is left', () => {
    expect(
      isPlanLimitMessage(new PlanLimitError('free_limit_reached').message),
    ).toBe(true);
    expect(isPlanLimitMessage('Network error')).toBe(false);
  });

  it("says when Pro's fair use for today is used up, without offering Pro", async () => {
    await expect(
      throwIfPlanLimit(
        json(429, { detail: { code: 'daily_limit_reached', limit: 150 } }),
      ),
    ).rejects.toMatchObject({ code: 'daily_limit_reached', limit: 150 });
    expect(notify.warning.mock.calls[0][0].title).toBe(
      'billing.dailyLimit.title',
    );
    expect(offersPro('daily_limit_reached')).toBe(false);
    expect(offersPro('free_limit_reached')).toBe(true);
    expect(isPlanLimitMessage('daily_limit_reached')).toBe(true);
  });

  it('lets other 429s through', async () => {
    await expect(
      throwIfPlanLimit(json(429, { detail: 'Too many requests' })),
    ).resolves.toBeUndefined();
  });
});

describe("a Pro account's fair use for today", () => {
  beforeEach(() => {
    notify.info.mockClear();
    resetDailyWarning();
  });

  it('warns once a day, when a fifth or less is left', () => {
    noteDailyRemaining('100', 150);
    expect(notify.info).not.toHaveBeenCalled();

    noteDailyRemaining('30', 150);
    noteDailyRemaining('12', 150);
    expect(notify.info).toHaveBeenCalledTimes(1);
    expect(notify.info.mock.calls[0][0].title).toBe(
      'billing.dailyLow.title {"count":30}',
    );
  });

  it('says nothing without the header (free accounts, older servers)', () => {
    noteDailyRemaining(null);
    noteDailyRemaining(undefined);
    expect(notify.info).not.toHaveBeenCalled();
  });
});
