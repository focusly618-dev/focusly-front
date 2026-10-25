import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  PENDING_PLAN_TTL_MS,
  savePendingPlan,
  takePendingPlan,
} from '@/utils/storage/pendingPlan';

describe('pendingPlan', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.useRealTimers());

  it('returns the saved interval once, then nothing', () => {
    savePendingPlan('year');
    expect(takePendingPlan()).toEqual({ interval: 'year' });
    expect(takePendingPlan()).toBeNull();
  });

  it('drops a choice older than its lifetime', () => {
    vi.useFakeTimers();
    savePendingPlan('month');
    vi.advanceTimersByTime(PENDING_PLAN_TTL_MS + 1);
    expect(takePendingPlan()).toBeNull();
    expect(localStorage.getItem('focusly_pending_plan')).toBeNull();
  });

  it('ignores a corrupted entry', () => {
    localStorage.setItem('focusly_pending_plan', '{nope');
    expect(takePendingPlan()).toBeNull();
  });
});
