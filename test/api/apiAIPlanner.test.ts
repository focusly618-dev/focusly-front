import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { post, billing } = vi.hoisted(() => ({
  post: vi.fn(),
  billing: {
    setRemaining: vi.fn(),
    markLimitReached: vi.fn(),
    openUpgrade: vi.fn(),
  },
}));

vi.mock('@/api/axiosInstance', () => ({ default: { post } }));
vi.mock('@/services/billingService', () => ({ billingService: billing }));

import { improveTaskAI } from '@/api/AI/apiAIPlanner';
import { isPlanLimitError } from '@/api/Billing/planLimit';

const response = (
  status: number,
  data: unknown,
  headers: Record<string, string> = {},
) =>
  ({
    status,
    data,
    headers,
    statusText: '',
    config: { headers: new AxiosHeaders() },
  }) as AxiosResponse;

describe('planner calls and the free plan', () => {
  beforeEach(() => vi.clearAllMocks());

  it('reports the free messages left', async () => {
    post.mockResolvedValue(
      response(
        200,
        { estimatedTime: '30m' },
        { 'x-ai-messages-remaining': '2' },
      ),
    );
    const result = await improveTaskAI({ title: 'x', mode: 'estimate' });
    expect(result).toEqual({ estimatedTime: '30m' });
    expect(billing.setRemaining).toHaveBeenCalledWith(2);
  });

  it('opens the Pro plans when the free messages are used up', async () => {
    post.mockRejectedValue(
      new AxiosError(
        'limit',
        '402',
        undefined,
        undefined,
        response(402, {
          detail: { code: 'free_limit_reached', limit: 5 },
        }),
      ),
    );
    const error = await improveTaskAI({ title: 'x', mode: 'all' }).catch(
      (e: unknown) => e,
    );
    expect(isPlanLimitError(error)).toBe(true);
    expect(billing.markLimitReached).toHaveBeenCalledWith(5);
    expect(billing.openUpgrade).toHaveBeenCalledWith('limit');
  });

  it('leaves other errors alone', async () => {
    post.mockRejectedValue(
      new AxiosError('boom', '500', undefined, undefined, response(500, {})),
    );
    const error = await improveTaskAI({ title: 'x', mode: 'all' }).catch(
      (e: unknown) => e,
    );
    expect(isPlanLimitError(error)).toBe(false);
    expect(billing.openUpgrade).not.toHaveBeenCalled();
  });
});
