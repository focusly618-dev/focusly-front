import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  LocalOfferOutlined as TagIcon,
} from '@mui/icons-material';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import type { StripeElementLocale } from '@stripe/stripe-js';
import { stripePromise } from '@/config/stripe';
import type { Discount } from '@/api/Billing/billingApi';
import {
  CHECKOUT_RETURN_PATH,
  discountValue,
  formatDate,
  formatPrice,
} from '@/config/plans';
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
  currency?: string | null;
  /** Charged today (the first payment less the discount; 0 in a trial). */
  amountDue?: number | null;
  /** Unix seconds: when the free trial ends (none: charged today). */
  trialEnd?: number | null;
  discount?: Discount | null;
  /** The promotion code field; without it there's none. */
  promo?: PromoControls;
  /** The payment went through (or is being processed by the bank). */
  onPaid: () => void;
  onBack: () => void;
  /** True while Stripe is confirming: the dialog shouldn't close. */
  onBusyChange?: (busy: boolean) => void;
}

export interface PromoControls {
  /** Applies a code: resolves with an error to show, or null if applied. */
  apply: (code: string) => Promise<string | null>;
  remove: () => Promise<void>;
  /** A code is being applied or removed (the form is being replaced). */
  busy: boolean;
}

/** "¿Tienes un código?" → the field → the code applied, removable. */
const PromoCodeField: React.FC<{
  promo: PromoControls;
  applied: string | null;
  disabled: boolean;
}> = ({ promo, applied, disabled }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (applied) {
    return (
      <Chip
        icon={<TagIcon sx={{ fontSize: 16 }} />}
        label={applied}
        onDelete={
          disabled || promo.busy ? undefined : () => void promo.remove()
        }
        aria-label={t('billing.checkout.promo.applied', { code: applied })}
        sx={{ fontWeight: 700, alignSelf: 'flex-start' }}
      />
    );
  }
  if (!open) {
    return (
      <Button
        size="small"
        startIcon={<TagIcon sx={{ fontSize: 16 }} />}
        onClick={() => setOpen(true)}
        disabled={disabled}
        sx={{
          alignSelf: 'flex-start',
          textTransform: 'none',
          fontWeight: 650,
          color: BRAND,
          px: 0.5,
        }}
      >
        {t('billing.checkout.promo.toggle')}
      </Button>
    );
  }
  const submit = async () => {
    const value = code.trim();
    if (!value) return;
    setError(await promo.apply(value));
  };
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <TextField
        size="small"
        autoFocus
        value={code}
        onChange={(e) => {
          setCode(e.target.value.toUpperCase());
          setError(null);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            void submit();
          }
        }}
        placeholder={t('billing.checkout.promo.placeholder')}
        error={Boolean(error)}
        helperText={error ?? undefined}
        disabled={disabled || promo.busy}
        slotProps={{
          htmlInput: {
            'aria-label': t('billing.checkout.promo.label'),
            maxLength: 64,
            autoCapitalize: 'characters',
          },
        }}
        sx={{ flex: 1 }}
      />
      <Button
        variant="outlined"
        onClick={() => void submit()}
        disabled={disabled || promo.busy || !code.trim()}
        sx={{ textTransform: 'none', fontWeight: 650, minWidth: 92 }}
      >
        {promo.busy ? (
          <CircularProgress size={18} />
        ) : (
          t('billing.checkout.promo.apply')
        )}
      </Button>
    </Box>
  );
};

const CheckoutForm: React.FC<StripeCheckoutProps> = ({
  intentType,
  priceLabel,
  intervalLabel,
  amount,
  interval,
  currency,
  amountDue,
  trialEnd,
  discount,
  promo,
  onPaid,
  onBack,
  onBusyChange,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const trial = Boolean(trialEnd);
  const due = amountDue ?? amount;
  const dueLabel =
    due != null && currency
      ? formatPrice({ amount: due, currency }, locale)
      : priceLabel;
  const discountOff =
    discount && amount != null && amountDue != null && !trial
      ? amount - amountDue
      : null;
  const pricePerInterval =
    priceLabel && intervalLabel ? `${priceLabel}/${intervalLabel}` : priceLabel;
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
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Never two charges: checked and set in the same click, before React
  // re-renders the disabled button (state alone lets a double click, or
  // Enter pressed while clicking, confirm twice).
  const lock = useRef<'idle' | 'confirming' | 'paid'>('idle');

  const setBusyState = (value: boolean) => {
    setBusy(value);
    onBusyChange?.(value);
  };

  const unlock = (message: string) => {
    lock.current = 'idle';
    setError(message);
    setBusyState(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || lock.current !== 'idle') return;
    lock.current = 'confirming';
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
        unlock(
          result.error.type === 'card_error' ||
            result.error.type === 'validation_error'
            ? (result.error.message ?? t('billing.checkout.error'))
            : t('billing.checkout.error'),
        );
        return;
      }

      const status =
        'paymentIntent' in result
          ? result.paymentIntent?.status
          : result.setupIntent?.status;
      if (status === 'succeeded' || status === 'processing') {
        // Paid (or being paid by the bank): the form stays locked for good.
        lock.current = 'paid';
        setPaid(true);
        setBusyState(false);
        onPaid();
        return;
      }
      unlock(t('billing.checkout.error'));
    } catch {
      unlock(t('billing.checkout.error'));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Box
        component="section"
        aria-label={t('billing.checkout.summary')}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 2,
          mb: 2,
          borderRadius: '12px',
          bgcolor: 'action.hover',
        }}
      >
        <SummaryRow
          label={
            <>
              <Typography
                component="span"
                sx={{ fontWeight: 750, fontSize: '14px' }}
              >
                {t('billing.plans.pro.name')}
              </Typography>
              {interval && (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  {' · '}
                  {t(`billing.checkout.plan.${interval}`, {
                    defaultValue: intervalLabel ?? interval,
                  })}
                </Typography>
              )}
            </>
          }
          value={pricePerInterval}
        />
        {discount && (
          <SummaryRow
            label={t(
              discount.duration === 'repeating'
                ? 'billing.checkout.discountMonths'
                : discount.duration === 'forever'
                  ? 'billing.checkout.discountForever'
                  : 'billing.checkout.discountOnce',
              {
                code: discount.code ?? '',
                value: discountValue(discount, locale),
                count: discount.duration_in_months ?? 0,
              },
            )}
            value={
              discountOff != null && currency
                ? `−${formatPrice({ amount: discountOff, currency }, locale)}`
                : null
            }
            accent
          />
        )}
        {trial && trialEnd && (
          <SummaryRow
            label={t('billing.checkout.trialRow', {
              date: formatDate(trialEnd, locale),
            })}
            value={t('billing.checkout.free')}
            accent
          />
        )}
        <Divider sx={{ my: 0.5 }} />
        <SummaryRow
          label={
            <Typography
              component="span"
              sx={{ fontWeight: 800, fontSize: '14px' }}
            >
              {t('billing.checkout.dueToday')}
            </Typography>
          }
          value={
            <Typography
              component="span"
              sx={{ fontWeight: 850, fontSize: '18px', color: BRAND }}
            >
              {trial && currency
                ? formatPrice({ amount: 0, currency }, locale)
                : dueLabel}
            </Typography>
          }
        />
        <Typography variant="caption" color="text.secondary">
          {trial && trialEnd
            ? t('billing.checkout.afterTrial', {
                date: formatDate(trialEnd, locale),
                price: pricePerInterval,
              })
            : intervalLabel
              ? t('billing.checkout.renews', { interval: intervalLabel })
              : null}
        </Typography>
        {promo && (
          <PromoCodeField
            promo={promo}
            applied={discount?.code ?? null}
            disabled={busy || paid}
          />
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
        {pricePerInterval &&
          t('billing.checkout.disclosure', {
            price: pricePerInterval,
          })}{' '}
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
          disabled={busy || paid}
          color="inherit"
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          {t('billing.checkout.back')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={
            !stripe || !elements || !ready || busy || paid || promo?.busy
          }
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
          ) : trial ? (
            t('billing.checkout.startTrial')
          ) : dueLabel ? (
            t('billing.checkout.pay', { price: dueLabel })
          ) : (
            t('billing.checkout.payNoPrice')
          )}
        </Button>
      </Box>
    </Box>
  );
};

const SummaryRow: React.FC<{
  label: React.ReactNode;
  value: React.ReactNode;
  /** Something taken off (a discount, the trial). */
  accent?: boolean;
}> = ({ label, value, accent }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 2,
    }}
  >
    <Typography
      component="div"
      variant="body2"
      sx={{ minWidth: 0, color: accent ? BRAND : 'text.primary' }}
    >
      {label}
    </Typography>
    {value != null && (
      <Typography
        component="div"
        variant="body2"
        sx={{
          flexShrink: 0,
          fontWeight: 650,
          fontVariantNumeric: 'tabular-nums',
          color: accent ? BRAND : 'text.primary',
        }}
      >
        {value}
      </Typography>
    )}
  </Box>
);

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
