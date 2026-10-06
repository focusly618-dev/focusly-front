import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import type { StripeElementLocale } from '@stripe/stripe-js';
import { stripePromise } from '@/config/stripe';
import { CHECKOUT_RETURN_PATH } from '@/config/plans';
import { useAppSelector } from '@/redux/hooks';
import { buildPaymentElementOptions } from './paymentElementOptions';

// The app's font, so Stripe's form matches the dialog around it.
const FONT_CSS =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap';

const BRAND = '#008767';

export interface StripeCheckoutProps {
  clientSecret: string;
  /** A PaymentIntent (first charge) or a SetupIntent (e.g. a trial). */
  intentType: 'payment' | 'setup';
  /** "$9.99" */
  priceLabel: string | null;
  /** "mes" */
  intervalLabel: string | null;
  /** Lets the form offer the cards the customer already saved. */
  customerSessionClientSecret?: string | null;
  /** Price in cents and Stripe interval, for Apple Pay's subscription sheet. */
  amount?: number | null;
  interval?: string | null;
  /** The payment went through (or is being processed by the bank). */
  onPaid: () => void;
  onBack: () => void;
  /** True while Stripe is confirming: the dialog shouldn't close. */
  onBusyChange?: (busy: boolean) => void;
}

const CheckoutForm: React.FC<StripeCheckoutProps> = ({
  intentType,
  priceLabel,
  intervalLabel,
  amount,
  interval,
  onPaid,
  onBack,
  onBusyChange,
}) => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const paymentElementOptions = buildPaymentElementOptions({
    name: user?.name,
    email: user?.email,
    amount,
    interval,
    planLabel: t('billing.plans.pro.name'),
    applePayDescription: t('billing.checkout.applePayDescription'),
    managementURL: `${window.location.origin}${CHECKOUT_RETURN_PATH}`,
  });
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setBusyState = (value: boolean) => {
    setBusy(value);
    onBusyChange?.(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || busy) return;
    setBusyState(true);
    setError(null);

    const confirmParams = {
      return_url: `${window.location.origin}${CHECKOUT_RETURN_PATH}`,
    };
    try {
      const result =
        intentType === 'setup'
          ? await stripe.confirmSetup({
              elements,
              confirmParams,
              redirect: 'if_required',
            })
          : await stripe.confirmPayment({
              elements,
              confirmParams,
              redirect: 'if_required',
            });

      if (result.error) {
        // Card and form errors come already worded (and translated) by Stripe.
        setError(
          result.error.type === 'card_error' ||
            result.error.type === 'validation_error'
            ? (result.error.message ?? t('billing.checkout.error'))
            : t('billing.checkout.error'),
        );
        setBusyState(false);
        return;
      }

      const status =
        'paymentIntent' in result
          ? result.paymentIntent?.status
          : result.setupIntent?.status;
      if (status === 'succeeded' || status === 'processing') {
        setBusyState(false);
        onPaid();
        return;
      }
      setError(t('billing.checkout.error'));
      setBusyState(false);
    } catch {
      setError(t('billing.checkout.error'));
      setBusyState(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          p: 2,
          mb: 2,
          borderRadius: '12px',
          bgcolor: 'action.hover',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 750, fontSize: '14px' }}>
            {t('billing.plans.pro.name')}
          </Typography>
          {intervalLabel && (
            <Typography variant="caption" color="text.secondary">
              {t('billing.checkout.renews', { interval: intervalLabel })}
            </Typography>
          )}
        </Box>
        {priceLabel && (
          <Typography sx={{ fontWeight: 850, fontSize: '18px', color: BRAND }}>
            {priceLabel}
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} role="alert">
          {error}
        </Alert>
      )}

      <Box sx={{ minHeight: 200, mb: 2, position: 'relative' }}>
        {!ready && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              color: 'text.secondary',
            }}
          >
            <CircularProgress size={18} />
            <Typography variant="body2">
              {t('billing.checkout.loading')}
            </Typography>
          </Box>
        )}
        <PaymentElement
          options={paymentElementOptions}
          onReady={() => setReady(true)}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 0.75,
          color: 'text.secondary',
          mb: 0.5,
        }}
      >
        <LockIcon sx={{ fontSize: 15, mt: '2px' }} />
        <Typography variant="caption">
          {t('billing.checkout.secure')}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        component="p"
        sx={{ mb: 2.5 }}
      >
        {t('billing.checkout.cancelNote')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap-reverse',
          gap: 1,
        }}
      >
        <Button
          onClick={onBack}
          disabled={busy}
          color="inherit"
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          {t('billing.checkout.back')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || !elements || !ready || busy}
          sx={{
            minWidth: 190,
            py: 1,
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 750,
            bgcolor: BRAND,
            boxShadow: 'none',
            flex: { xs: '1 1 100%', sm: '0 0 auto' },
            '&:hover': { bgcolor: '#007357', boxShadow: 'none' },
          }}
        >
          {busy ? (
            <CircularProgress size={20} color="inherit" />
          ) : priceLabel ? (
            t('billing.checkout.pay', { price: priceLabel })
          ) : (
            t('billing.checkout.payNoPrice')
          )}
        </Button>
      </Box>
    </Box>
  );
};

/** Stripe's Payment Element (cards, wallets…) for the first Pro payment. */
export const StripeCheckout: React.FC<StripeCheckoutProps> = (props) => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: props.clientSecret,
        ...(props.customerSessionClientSecret
          ? { customerSessionClientSecret: props.customerSessionClientSecret }
          : {}),
        locale: (i18n.language?.slice(0, 2) || 'auto') as StripeElementLocale,
        fonts: [{ cssSrc: FONT_CSS }],
        appearance: {
          theme: isDark ? 'night' : 'stripe',
          variables: {
            colorPrimary: BRAND,
            borderRadius: '10px',
            fontFamily: 'Outfit, Inter, system-ui, sans-serif',
            colorBackground: theme.palette.background.paper,
          },
        },
      }}
    >
      <CheckoutForm {...props} />
    </Elements>
  );
};
