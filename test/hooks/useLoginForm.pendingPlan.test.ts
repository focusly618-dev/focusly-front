import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLoginForm } from '@/pages/Public/Login/hooks/useLoginForm.hook';
import { takePendingPlan } from '@/utils/storage/pendingPlan';

const visit = (search: string) =>
  window.history.replaceState(null, '', `/login${search}`);

describe('useLoginForm · plan picked on the pricing page', () => {
  beforeEach(() => localStorage.clear());

  it('opens the sign-up tab and keeps a yearly Pro choice', () => {
    visit('?mode=signup&plan=pro&interval=year');
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.isRegistering).toBe(true);
    expect(takePendingPlan()).toEqual({ interval: 'year' });
  });

  it('defaults to monthly', () => {
    visit('?mode=signup&plan=pro');
    renderHook(() => useLoginForm());
    expect(takePendingPlan()).toEqual({ interval: 'month' });
  });

  it('keeps nothing for the free plan', () => {
    visit('?mode=signup');
    renderHook(() => useLoginForm());
    expect(takePendingPlan()).toBeNull();
  });
});
