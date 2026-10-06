import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

const billing = vi.hoisted(() => ({
  isPro: false,
  known: true,
  remaining: 2,
  limit: 5,
  openUpgrade: vi.fn(),
}));
vi.mock('@/hooks/useBilling', () => ({ useBilling: () => billing }));
vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts && 'count' in opts ? `${key}:${opts.count}` : key,
  }),
}));

const { TryProButton } = await import('@/components/Billing/TryProButton');

describe('TryProButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    billing.isPro = false;
    billing.remaining = 2;
  });

  it('shows the free messages used and opens the plans', () => {
    render(<TryProButton reason="manual" />);
    const button = screen.getByRole('button', {
      name: 'billing.tryPro · billing.usageLeft:2',
    });
    expect(button).toHaveTextContent('3/5');
    fireEvent.click(button);
    expect(billing.openUpgrade).toHaveBeenCalledWith('manual');
  });

  it('is hidden for Pro users', () => {
    billing.isPro = true;
    const { container } = render(<TryProButton />);
    expect(container).toBeEmptyDOMElement();
  });
});
