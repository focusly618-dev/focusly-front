import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import type { BillingStatus } from '@/api/Billing/billingApi';

const api = vi.hoisted(() => ({
  getStatus: vi.fn(),
  createSubscription: vi.fn(),
  getPortalUrl: vi.fn(),
}));
vi.mock('@/api/Billing/billingApi', () => ({ billingApi: api }));
vi.mock('@/config/stripe', () => ({
  isStripeConfigured: true,
  stripePromise: null,
}));
// Stripe's form is tested on its own; here it just reports a payment.
vi.mock('@/components/Billing/StripeCheckout', () => ({
  StripeCheckout: ({
    priceLabel,
    onPaid,
  }: {
    priceLabel: string;
    onPaid: () => void;
  }) => (
    <div>
      <span>STRIPE_FORM {priceLabel}</span>
      <button onClick={onPaid}>PAY</button>
    </div>
  ),
}));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
vi.mock('@/components/ui', () => ({ LuminaAnimatedFace: () => null }));
const toast = vi.hoisted(() => ({ error: vi.fn() }));
vi.mock('@/utils', () => ({ sileo: toast }));
vi.mock('@/redux/hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ auth: { user: { id: 'u-1', subscriptionStatus: 'free' } } }),
}));
vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts && 'count' in opts ? `${key}:${opts.count}` : key,
    i18n: { language: 'en' },
  }),
}));

const { UpgradeModal } =
  await import('@/components/modals/UpgradeModal/UpgradeModal');
const { billingService } = await import('@/services/billingService');

const status = (over: Partial<BillingStatus> = {}): BillingStatus => ({
  plan: 'free',
  subscription_status: null,
  cancel_at_period_end: false,
  current_period_end: null,
  ai_messages_used: 5,
  ai_messages_limit: 5,
  billing_enabled: true,
  pro_price: { amount: 999, currency: 'usd', interval: 'month' },
  ...over,
});

const renderModal = async (
  props: Partial<React.ComponentProps<typeof UpgradeModal>> = {},
) => {
  render(<UpgradeModal open reason="limit" onClose={vi.fn()} {...props} />);
  await act(async () => {});
};

describe('UpgradeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    billingService.reset();
    api.getStatus.mockResolvedValue(status());
    api.createSubscription.mockResolvedValue({
      subscription_id: 'sub_1',
      client_secret: 'pi_secret',
      intent_type: 'payment',
      status: 'incomplete',
      amount: 999,
      currency: 'usd',
      interval: 'month',
    });
  });

  it('compares Free with Pro, with the usage and the real price', async () => {
    await renderModal();
    expect(
      screen.getByText('billing.upgrade.title.limit:5'),
    ).toBeInTheDocument();
    expect(screen.getByText('billing.plans.free.name')).toBeInTheDocument();
    expect(screen.getByText('billing.plans.pro.name')).toBeInTheDocument();
    expect(screen.getByText('billing.usageNone')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    // Free lacks the editor assistant; Pro has it.
    expect(
      screen.getByText(/^billing\.features\.editorAi$/),
    ).toBeInTheDocument();
    expect(
      screen.getByText('billing.features.editorAiPro'),
    ).toBeInTheDocument();
  });

  it('goes to Stripe, then confirms the plan with the backend', async () => {
    await renderModal();
    await act(async () => {
      fireEvent.click(screen.getByText('billing.upgrade.cta'));
    });
    expect(api.createSubscription).toHaveBeenCalledWith();
    expect(screen.getByText('STRIPE_FORM $9.99')).toBeInTheDocument();

    api.getStatus.mockResolvedValue(status({ plan: 'pro' }));
    await act(async () => {
      fireEvent.click(screen.getByText('PAY'));
    });
    expect(api.getStatus).toHaveBeenCalledWith(true);
    expect(await screen.findByText('billing.done.title')).toBeInTheDocument();
  });

  it('already Pro elsewhere: no second charge', async () => {
    api.createSubscription.mockRejectedValue({
      isAxiosError: true,
      response: { status: 409 },
    });
    await renderModal();
    await act(async () => {
      fireEvent.click(screen.getByText('billing.upgrade.cta'));
    });
    expect(screen.getByText('billing.done.title')).toBeInTheDocument();
  });

  it('can open straight on the payment', async () => {
    await renderModal({ reason: 'manual', startCheckout: true });
    expect(api.createSubscription).toHaveBeenCalled();
    expect(screen.getByText('STRIPE_FORM $9.99')).toBeInTheDocument();
  });

  it("says so when payments can't start", async () => {
    api.createSubscription.mockRejectedValue(new Error('down'));
    await renderModal();
    await act(async () => {
      fireEvent.click(screen.getByText('billing.upgrade.cta'));
    });
    expect(toast.error).toHaveBeenCalledWith({
      title: 'billing.upgrade.startError',
    });
    expect(screen.getByText('billing.upgrade.cta')).toBeInTheDocument();
  });

  it('paid earlier (the plan was out of date): no spinner left, Pro shown', async () => {
    api.createSubscription.mockRejectedValue({
      isAxiosError: true,
      response: { status: 409 },
    });
    await renderModal();
    api.getStatus.mockResolvedValue(status({ plan: 'pro' }));
    await act(async () => {
      fireEvent.click(screen.getByText('billing.upgrade.cta'));
    });
    expect(api.getStatus).toHaveBeenCalledWith(true);
    expect(screen.getByText('billing.done.title')).toBeInTheDocument();
    expect(
      screen.queryByLabelText('billing.checkout.loading'),
    ).not.toBeInTheDocument();
    expect(billingService.getSnapshot().status?.plan).toBe('pro');
  });

  it('a backend that never answers ends in an error, not a spinner', async () => {
    api.createSubscription.mockRejectedValue({
      isAxiosError: true,
      code: 'ECONNABORTED',
    });
    await renderModal();
    await act(async () => {
      fireEvent.click(screen.getByText('billing.upgrade.cta'));
    });
    expect(toast.error).toHaveBeenCalledWith({
      title: 'billing.upgrade.startError',
    });
    // The button's spinner is gone and it can be tried again.
    expect(
      screen.queryByLabelText('billing.checkout.loading'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /billing\.upgrade\.cta/ }),
    ).toBeEnabled();
  });
});
