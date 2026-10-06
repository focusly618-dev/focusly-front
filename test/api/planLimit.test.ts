import { describe, it, expect } from 'vitest';
import {
  PlanLimitError,
  isPlanLimitMessage,
  remainingFromHeaders,
  throwIfPlanLimit,
} from '@/api/Billing/planLimit';

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
});
