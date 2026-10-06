import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';

const stripe = vi.hoisted(() => ({
  confirmPayment: vi.fn(),
  confirmSetup: vi.fn(),
}));
const seen = vi.hoisted(() => ({
  elementsOptions: null as unknown as Record<string, unknown>,
  paymentOptions: null as unknown as Record<string, unknown>,
}));
vi.mock('@stripe/react-stripe-js', async () => {
  const { useEffect } = await import('react');
  return {
    Elements: ({
      children,
      options,
    }: {
      children: React.ReactNode;
      options: Record<string, unknown>;
    }) => {
      seen.elementsOptions = options;
      return children;
    },
    PaymentElement: ({
      onReady,
      options,
    }: {
      onReady?: () => void;
      options: Record<string, unknown>;
    }) => {
      seen.paymentOptions = options;
      useEffect(() => onReady?.(), [onReady]);
      return <div>PAYMENT_ELEMENT</div>;
    },
    useStripe: () => stripe,
    useElements: () => ({}),
  };
});
vi.mock('@/config/stripe', () => ({ stripePromise: null }));
vi.mock('@/redux/hooks', () => ({
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ auth: { user: { name: 'Ana', email: 'ana@example.com' } } }),
}));
vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts && 'price' in opts ? `${key}:${opts.price}` : key,
    i18n: { language: 'en' },
  }),
}));

const { StripeCheckout } = await import('@/components/Billing/StripeCheckout');

const props = {
  clientSecret: 'pi_secret',
  intentType: 'payment' as const,
  priceLabel: '$9.99',
  intervalLabel: 'month',
  onPaid: vi.fn(),
  onBack: vi.fn(),
  onBusyChange: vi.fn(),
};

const pay = async () => {
  await act(async () => {
    fireEvent.click(screen.getByText('billing.checkout.pay:$9.99'));
  });
};

describe('StripeCheckout', () => {
  beforeEach(() => vi.clearAllMocks());

  it('confirms the payment and reports it once Stripe accepts it', async () => {
    stripe.confirmPayment.mockResolvedValue({
      paymentIntent: { status: 'succeeded' },
    });
    render(<StripeCheckout {...props} />);
    await pay();

    expect(stripe.confirmPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/profile/billing`,
        },
      }),
    );
    expect(props.onPaid).toHaveBeenCalled();
    expect(props.onBusyChange).toHaveBeenCalledWith(true);
  });

  it("shows the card's error and doesn't report a payment", async () => {
    stripe.confirmPayment.mockResolvedValue({
      error: { type: 'card_error', message: 'Your card was declined.' },
    });
    render(<StripeCheckout {...props} />);
    await pay();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Your card was declined.',
    );
    expect(props.onPaid).not.toHaveBeenCalled();
  });

  it('an unpaid intent is an error, never a success', async () => {
    stripe.confirmPayment.mockResolvedValue({
      paymentIntent: { status: 'requires_payment_method' },
    });
    render(<StripeCheckout {...props} />);
    await pay();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'billing.checkout.error',
    );
    expect(props.onPaid).not.toHaveBeenCalled();
  });

  it('a trial (SetupIntent) is confirmed as a setup', async () => {
    stripe.confirmSetup.mockResolvedValue({
      setupIntent: { status: 'succeeded' },
    });
    render(<StripeCheckout {...props} intentType="setup" />);
    await pay();

    expect(stripe.confirmSetup).toHaveBeenCalled();
    expect(stripe.confirmPayment).not.toHaveBeenCalled();
    expect(props.onPaid).toHaveBeenCalled();
  });

  it("offers the customer's saved cards and fills in their details", () => {
    render(
      <StripeCheckout
        {...props}
        customerSessionClientSecret="cuss_secret"
        amount={999}
        interval="month"
      />,
    );
    expect(seen.elementsOptions).toMatchObject({
      clientSecret: 'pi_secret',
      customerSessionClientSecret: 'cuss_secret',
    });
    expect(seen.paymentOptions).toMatchObject({
      layout: { type: 'accordion', radios: 'always' },
      defaultValues: {
        billingDetails: { name: 'Ana', email: 'ana@example.com' },
      },
    });
  });

  it('works without saved cards', () => {
    render(<StripeCheckout {...props} customerSessionClientSecret={null} />);
    expect(seen.elementsOptions).not.toHaveProperty(
      'customerSessionClientSecret',
    );
  });
});
