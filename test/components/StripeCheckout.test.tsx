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

  describe('never two charges', () => {
    // A confirmation Stripe hasn't answered yet.
    const pending = () => {
      let resolve!: (value: unknown) => void;
      stripe.confirmPayment.mockImplementation(
        () => new Promise((r) => (resolve = r)),
      );
      return (value: unknown) => act(async () => resolve(value));
    };
    const button = () =>
      screen.getByRole('button', { name: /billing\.checkout\.pay/ });

    it('two clicks in the same instant confirm once', async () => {
      pending();
      render(<StripeCheckout {...props} />);
      // Both before React re-renders the disabled button.
      await act(async () => {
        fireEvent.click(button());
        fireEvent.click(button());
      });
      expect(stripe.confirmPayment).toHaveBeenCalledTimes(1);
    });

    it('a burst of clicks and Enter presses confirms once', async () => {
      pending();
      const { container } = render(<StripeCheckout {...props} />);
      const form = container.querySelector('form')!;
      await act(async () => {
        for (let i = 0; i < 10; i++) {
          fireEvent.click(button());
          fireEvent.submit(form);
        }
      });
      expect(stripe.confirmPayment).toHaveBeenCalledTimes(1);
    });

    it('the button is disabled while Stripe confirms', async () => {
      const finish = pending();
      render(<StripeCheckout {...props} />);
      await pay();
      expect(screen.getByRole('button', { name: '' })).toBeDisabled();
      expect(screen.getByText('billing.checkout.back')).toBeDisabled();
      // Clicking the disabled button does nothing either.
      fireEvent.click(screen.getByRole('button', { name: '' }));
      expect(stripe.confirmPayment).toHaveBeenCalledTimes(1);
      await finish({ error: { type: 'card_error', message: 'Declined' } });
    });

    it('after a payment went through it can never be confirmed again', async () => {
      const finish = pending();
      render(<StripeCheckout {...props} />);
      await pay();
      await finish({ paymentIntent: { status: 'succeeded' } });

      expect(button()).toBeDisabled();
      await act(async () => {
        fireEvent.click(button());
        fireEvent.submit(button().closest('form')!);
      });
      expect(stripe.confirmPayment).toHaveBeenCalledTimes(1);
      expect(props.onPaid).toHaveBeenCalledTimes(1);
    });

    it('a payment the bank is still processing is final too', async () => {
      stripe.confirmPayment.mockResolvedValue({
        paymentIntent: { status: 'processing' },
      });
      render(<StripeCheckout {...props} />);
      await pay();
      await pay();
      expect(stripe.confirmPayment).toHaveBeenCalledTimes(1);
      expect(props.onPaid).toHaveBeenCalledTimes(1);
      expect(button()).toBeDisabled();
    });

    it('a declined card can be retried, one confirmation per try', async () => {
      stripe.confirmPayment
        .mockResolvedValueOnce({
          error: { type: 'card_error', message: 'Your card was declined.' },
        })
        .mockResolvedValueOnce({ paymentIntent: { status: 'succeeded' } });
      render(<StripeCheckout {...props} />);
      await pay();
      expect(button()).not.toBeDisabled();
      await act(async () => {
        fireEvent.click(button());
        fireEvent.click(button());
      });
      expect(stripe.confirmPayment).toHaveBeenCalledTimes(2);
      expect(props.onPaid).toHaveBeenCalledTimes(1);
    });

    it('Stripe throwing (network) unlocks the button for a retry', async () => {
      stripe.confirmPayment.mockRejectedValueOnce(new Error('offline'));
      render(<StripeCheckout {...props} />);
      await pay();
      expect(screen.getByRole('alert')).toHaveTextContent(
        'billing.checkout.error',
      );
      expect(button()).not.toBeDisabled();
      expect(props.onBusyChange).toHaveBeenLastCalledWith(false);
    });

    it('a 3-D Secure step left unfinished is not a payment', async () => {
      stripe.confirmPayment.mockResolvedValue({
        paymentIntent: { status: 'requires_action' },
      });
      render(<StripeCheckout {...props} />);
      await pay();
      expect(props.onPaid).not.toHaveBeenCalled();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});

describe('StripeCheckout: the order summary', () => {
  beforeEach(() => vi.clearAllMocks());

  const summary = () =>
    screen.getByRole('region', { name: 'billing.checkout.summary' });

  it('a promotion code: what it takes off and what is paid today', () => {
    render(
      <StripeCheckout
        {...props}
        currency="usd"
        amount={999}
        amountDue={799}
        discount={{
          code: 'BIENVENIDA20',
          percent_off: 20,
          amount_off: null,
          currency: null,
          duration: 'repeating',
          duration_in_months: 3,
        }}
      />,
    );
    expect(summary()).toHaveTextContent('billing.checkout.discountMonths');
    expect(summary()).toHaveTextContent('−$2');
    expect(summary()).toHaveTextContent('billing.checkout.dueToday');
    expect(summary()).toHaveTextContent('$7.99');
    // The button charges what's due today, not the list price.
    expect(
      screen.getByRole('button', { name: 'billing.checkout.pay:$7.99' }),
    ).toBeInTheDocument();
  });

  it('a free trial: nothing today, and when the first charge comes', () => {
    render(
      <StripeCheckout
        {...props}
        intentType="setup"
        currency="usd"
        amount={999}
        amountDue={0}
        trialEnd={1_800_000_000}
      />,
    );
    expect(summary()).toHaveTextContent('billing.checkout.trialRow');
    expect(summary()).toHaveTextContent(/dueToday\$0(?!\.)/);
    expect(summary()).toHaveTextContent('billing.checkout.afterTrial');
    expect(
      screen.getByRole('button', { name: 'billing.checkout.startTrial' }),
    ).toBeInTheDocument();
  });

  it('says it renews and how to cancel, next to the button', () => {
    render(<StripeCheckout {...props} />);
    expect(
      screen.getByText(/billing\.checkout\.disclosure:\$9\.99\/month/),
    ).toHaveTextContent('billing.checkout.cancelNote');
  });

  describe('the promotion code', () => {
    const promo = (over = {}) => ({
      apply: vi.fn().mockResolvedValue(null),
      remove: vi.fn().mockResolvedValue(undefined),
      busy: false,
      ...over,
    });

    it('typed in any case, applied in capitals', async () => {
      const controls = promo();
      render(<StripeCheckout {...props} promo={controls} />);
      fireEvent.click(screen.getByText('billing.checkout.promo.toggle'));
      fireEvent.change(
        screen.getByRole('textbox', { name: 'billing.checkout.promo.label' }),
        { target: { value: 'bienvenida20' } },
      );
      await act(async () => {
        fireEvent.click(screen.getByText('billing.checkout.promo.apply'));
      });
      expect(controls.apply).toHaveBeenCalledWith('BIENVENIDA20');
    });

    it("a code that doesn't work says why, under the field", async () => {
      const controls = promo({
        apply: vi
          .fn()
          .mockResolvedValue('Ese código no es válido o ya venció.'),
      });
      render(<StripeCheckout {...props} promo={controls} />);
      fireEvent.click(screen.getByText('billing.checkout.promo.toggle'));
      const field = screen.getByRole('textbox', {
        name: 'billing.checkout.promo.label',
      });
      fireEvent.change(field, { target: { value: 'NOPE' } });
      await act(async () => {
        fireEvent.keyDown(field, { key: 'Enter' });
      });
      expect(
        screen.getByText('Ese código no es válido o ya venció.'),
      ).toBeInTheDocument();
      expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    it('an applied code shows and can be removed', async () => {
      const controls = promo();
      render(
        <StripeCheckout
          {...props}
          promo={controls}
          discount={{
            code: 'LANZAMIENTO50',
            percent_off: 50,
            amount_off: null,
            currency: null,
            duration: 'once',
            duration_in_months: null,
          }}
        />,
      );
      expect(screen.getByText('LANZAMIENTO50')).toBeInTheDocument();
      expect(
        screen.queryByText('billing.checkout.promo.toggle'),
      ).not.toBeInTheDocument();
      await act(async () => {
        fireEvent.click(screen.getByTestId('CancelIcon'));
      });
      expect(controls.remove).toHaveBeenCalled();
    });

    it("while a code is applied the old form can't be paid", () => {
      render(<StripeCheckout {...props} promo={promo({ busy: true })} />);
      expect(
        screen.getByRole('button', { name: 'billing.checkout.pay:$9.99' }),
      ).toBeDisabled();
    });
  });
});
