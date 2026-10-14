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
// Stripe's form is tested on its own; here it reports a payment and offers
// the promotion code field.
vi.mock('@/components/Billing/StripeCheckout', async () => {
  const { useState } = await import('react');
  return {
    StripeCheckout: ({
      priceLabel,
      clientSecret,
      amountDue,
      promo,
      onPaid,
    }: {
      priceLabel: string;
      clientSecret: string;
      amountDue?: number;
      promo?: { apply: (code: string) => Promise<string | null> };
      onPaid: () => void;
    }) => {
      const [promoError, setPromoError] = useState<string | null>(null);
      return (
        <div>
          <span>STRIPE_FORM {priceLabel}</span>
          <span>
            CHECKOUT {clientSecret} DUE {amountDue}
          </span>
          <button onClick={onPaid}>PAY</button>
          <button
            onClick={async () =>
              setPromoError(await promo!.apply('BIENVENIDA20'))
            }
          >
            APPLY_PROMO
          </button>
          {promoError && <span>PROMO_ERROR {promoError}</span>}
        </div>
      );
    },
  };
});
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
vi.mock('@/components/ui', () => ({ LuminaAnimatedFace: () => null }));
const toast = vi.hoisted(() => ({ error: vi.fn() }));
vi.mock('@/utils', () => ({ notify: toast }));
vi.mock('@/redux/hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ auth: { user: { id: 'u-1', subscriptionStatus: 'free' } } }),
}));
vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts && 'count' in opts
        ? `${key}:${opts.count}`
        : opts && 'date' in opts
          ? `${key}:${opts.date}`
          : key,
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
    expect(api.createSubscription).toHaveBeenCalledWith({ interval: 'month' });
    expect(screen.getByText('STRIPE_FORM $9.99')).toBeInTheDocument();

    api.getStatus.mockResolvedValue(status({ plan: 'pro' }));
    await act(async () => {
      fireEvent.click(screen.getByText('PAY'));
    });
    expect(api.getStatus).toHaveBeenCalledWith(true);
    expect(await screen.findByText('billing.done.title')).toBeInTheDocument();
  });

  it('a double click on "Get Pro" starts one checkout', async () => {
    let resolve!: (value: unknown) => void;
    api.createSubscription.mockImplementation(
      () => new Promise((r) => (resolve = r)),
    );
    await renderModal();
    const cta = screen.getByText('billing.upgrade.cta');
    await act(async () => {
      fireEvent.click(cta);
      fireEvent.click(cta);
      fireEvent.click(cta);
    });
    expect(api.createSubscription).toHaveBeenCalledTimes(1);
    await act(async () =>
      resolve({
        subscription_id: 'sub_1',
        client_secret: 'pi_secret',
        intent_type: 'payment',
        status: 'incomplete',
        amount: 999,
        currency: 'usd',
        interval: 'month',
      }),
    );
    expect(screen.getByText('STRIPE_FORM $9.99')).toBeInTheDocument();
  });

  it('a payment reported twice activates the plan once', async () => {
    await renderModal();
    await act(async () => {
      fireEvent.click(screen.getByText('billing.upgrade.cta'));
    });
    api.getStatus.mockResolvedValue(status({ plan: 'pro' }));
    const payButton = screen.getByText('PAY');
    await act(async () => {
      fireEvent.click(payButton);
      fireEvent.click(payButton);
    });
    expect(await screen.findByText('billing.done.title')).toBeInTheDocument();
    expect(api.createSubscription).toHaveBeenCalledTimes(1);
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

  describe('monthly or yearly, a trial, a promotion code', () => {
    const prices = [
      { amount: 999, currency: 'usd', interval: 'month' },
      { amount: 9990, currency: 'usd', interval: 'year' },
    ];

    it('yearly: its price, what it saves, and the yearly checkout', async () => {
      api.getStatus.mockResolvedValue(status({ pro_prices: prices }));
      await renderModal();
      expect(
        screen.getByText('billing.plans.monthsFree:2'),
      ).toBeInTheDocument();
      fireEvent.click(
        screen.getByRole('button', { name: 'billing.plans.yearly' }),
      );
      expect(screen.getByText('$99.90')).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(screen.getByText('billing.upgrade.cta'));
      });
      expect(api.createSubscription).toHaveBeenCalledWith({ interval: 'year' });
    });

    it('a new customer is offered the free trial', async () => {
      api.getStatus.mockResolvedValue(status({ trial_days: 7 }));
      await renderModal();
      expect(
        screen.getByText('billing.plans.trialBadge:7'),
      ).toBeInTheDocument();
      expect(screen.getByText('billing.plans.trialNote')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /billing\.upgrade\.ctaTrial:7/ }),
      ).toBeInTheDocument();
    });

    it('the trial started: the welcome says until when it is free', async () => {
      api.createSubscription.mockResolvedValue({
        subscription_id: 'sub_1',
        client_secret: 'seti_secret',
        intent_type: 'setup',
        status: 'trialing',
        amount: 999,
        currency: 'usd',
        interval: 'month',
        amount_due: 0,
        trial_end: 1_800_000_000,
      });
      await renderModal();
      await act(async () => {
        fireEvent.click(screen.getByText('billing.upgrade.cta'));
      });
      api.getStatus.mockResolvedValue(
        status({ plan: 'pro', trial_end: 1_800_000_000 }),
      );
      await act(async () => {
        fireEvent.click(screen.getByText('PAY'));
      });
      expect(
        await screen.findByText('billing.done.trialTitle'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/^billing\.done\.trialBody:/),
      ).toBeInTheDocument();
    });

    it('a code replaces the checkout with one at the new price', async () => {
      await renderModal();
      await act(async () => {
        fireEvent.click(screen.getByText('billing.upgrade.cta'));
      });
      api.createSubscription.mockResolvedValue({
        subscription_id: 'sub_2',
        client_secret: 'pi_discounted',
        intent_type: 'payment',
        status: 'incomplete',
        amount: 999,
        currency: 'usd',
        interval: 'month',
        amount_due: 799,
      });
      await act(async () => {
        fireEvent.click(screen.getByText('APPLY_PROMO'));
      });
      expect(api.createSubscription).toHaveBeenLastCalledWith({
        interval: 'month',
        promotionCode: 'BIENVENIDA20',
      });
      expect(
        screen.getByText('CHECKOUT pi_discounted DUE 799'),
      ).toBeInTheDocument();
    });

    it('a code the server refuses keeps the checkout and says why', async () => {
      await renderModal();
      await act(async () => {
        fireEvent.click(screen.getByText('billing.upgrade.cta'));
      });
      api.createSubscription.mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 400,
          data: { detail: 'Ese código no es válido o ya venció.' },
        },
      });
      await act(async () => {
        fireEvent.click(screen.getByText('APPLY_PROMO'));
      });
      expect(
        screen.getByText('PROMO_ERROR Ese código no es válido o ya venció.'),
      ).toBeInTheDocument();
      expect(screen.getByText(/CHECKOUT pi_secret/)).toBeInTheDocument();
    });
  });
});
