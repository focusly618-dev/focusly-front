import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import confetti from 'canvas-confetti';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircleRounded as DoneIcon,
  HourglassTopRounded as PendingIcon,
} from '@mui/icons-material';
import { LuminaAnimatedFace } from '@/components/ui';
import { PlanCards } from '@/components/Billing/PlanCards';
import { StripeCheckout } from '@/components/Billing/StripeCheckout';
import {
  billingApi,
  type BillingInterval,
  type SubscriptionResponse,
} from '@/api/Billing/billingApi';
import { isStripeConfigured } from '@/config/stripe';
import { formatDate, formatPrice } from '@/config/plans';
import { useBilling } from '@/hooks/useBilling';
import { notify } from '@/utils';
import type { UpgradeModalProps } from './UpgradeModal.types';

const BRAND = '#008767';

type Step =
  | 'plans'
  | 'starting'
  | 'checkout'
  | 'activating'
  | 'done'
  | 'pending';

/**
 * Free vs Pro, then Stripe's payment form, then the plan's activation — one
 * dialog for the whole upgrade, opened from wherever the free plan stops
 * the user (see billingService.openUpgrade).
 */
export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  open,
  reason = 'manual',
  startCheckout = false,
  interval: startInterval = 'month',
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const billing = useBilling();
  const paymentsAvailable = isStripeConfigured && billing.billingEnabled;
  const firstStep: Step =
    startCheckout && paymentsAvailable ? 'starting' : 'plans';
  const [step, setStep] = useState<Step>(open ? firstStep : 'plans');
  const [starting, setStarting] = useState(false);
  const [checkout, setCheckout] = useState<SubscriptionResponse | null>(null);
  const [busy, setBusy] = useState(false);
  // The plan being bought, and a promotion code being applied or removed.
  const [interval, setInterval] = useState<BillingInterval>(startInterval);
  const [promoBusy, setPromoBusy] = useState(false);

  // A payment is reported once (see handlePaid).
  const activatingRef = useRef(false);

  // Every opening starts at the plans (or the payment, when asked).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStep(firstStep);
      setCheckout(null);
      setBusy(false);
      setInterval(startInterval);
      activatingRef.current = false;
    }
  }

  const price = checkout ?? billing.status?.pro_price ?? null;
  const priceLabel = formatPrice(price, i18n.language);
  const priceInterval = price?.interval;
  const intervalLabel = priceInterval
    ? t(`billing.plans.interval.${priceInterval}`, {
        defaultValue: priceInterval,
      })
    : null;

  const { refresh } = billing;

  /** Creates the subscription and moves to Stripe's form. */
  const requestCheckout = async (plan: BillingInterval = interval) => {
    try {
      setCheckout(await billingApi.createSubscription({ interval: plan }));
      setStep('checkout');
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      if (status === 409) {
        // Already Pro (e.g. paid in another tab).
        await refresh();
        setStep('done');
        return;
      }
      notify.error({
        title:
          status === 503
            ? t('billing.upgrade.notConfigured')
            : t('billing.upgrade.startError'),
      });
      setStep('plans');
    }
  };

  // Set in the click itself: a double click starts one checkout.
  const startingRef = useRef(false);
  const choosePro = async (plan: BillingInterval = 'month') => {
    if (startingRef.current) return;
    if (!paymentsAvailable) {
      notify.error({ title: t('billing.upgrade.notConfigured') });
      return;
    }
    startingRef.current = true;
    setStarting(true);
    setInterval(plan);
    try {
      await requestCheckout(plan);
    } finally {
      startingRef.current = false;
      setStarting(false);
    }
  };

  // Opened straight on the payment (from the profile's Pro card). Once per
  // opening: StrictMode runs effects twice, and each call is a subscription.
  const requested = useRef(false);
  useEffect(() => {
    if (!open || step !== 'starting') {
      requested.current = false;
      return;
    }
    if (requested.current) return;
    requested.current = true;
    void requestCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step]);

  /** A promotion code replaces the checkout with one at the new price (the
   * old one is cancelled by the server, so it can't be paid as well). */
  const changePromo = async (code: string | null): Promise<string | null> => {
    setPromoBusy(true);
    try {
      setCheckout(
        await billingApi.createSubscription({
          interval,
          ...(code ? { promotionCode: code } : {}),
        }),
      );
      return null;
    } catch (err) {
      const response = axios.isAxiosError(err) ? err.response : undefined;
      if (response?.status === 400) {
        return typeof response.data?.detail === 'string'
          ? response.data.detail
          : t('billing.checkout.promo.invalid');
      }
      if (response?.status === 409) {
        await refresh();
        setStep('done');
        return null;
      }
      return t('billing.checkout.promo.error');
    } finally {
      setPromoBusy(false);
    }
  };

  const handlePaid = async () => {
    // Reported once per payment, however many times the form calls it.
    if (activatingRef.current) return;
    activatingRef.current = true;
    setStep('activating');
    if (await billing.waitForPro()) {
      setStep('done');
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch {
        // No canvas (tests, old browsers): skip the confetti.
      }
    } else {
      setStep('pending');
    }
  };

  // What the welcome says: the trial's end, or the next charge.
  const trialEnd = billing.status?.trial_end ?? checkout?.trial_end ?? null;
  const nextCharge = billing.status?.current_period_end ?? null;

  const canClose = !busy && !promoBusy && step !== 'activating';
  const close = () => {
    if (canClose) onClose();
  };

  const title =
    step === 'checkout' || step === 'starting'
      ? t('billing.checkout.title')
      : billing.isPro && step === 'plans'
        ? t('billing.upgrade.alreadyPro')
        : reason === 'limit'
          ? t('billing.upgrade.title.limit', { count: billing.limit })
          : t(`billing.upgrade.title.${reason}`);
  const subtitle =
    step === 'plans' && !billing.isPro
      ? t(`billing.upgrade.subtitle.${reason}`, { date: billing.freeRenewal })
      : null;

  const statusPanel = (
    icon: React.ReactNode,
    heading: string,
    body: string,
    action?: React.ReactNode,
  ) => (
    <Box
      role="status"
      sx={{
        py: { xs: 4, sm: 5 },
        px: 2,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {icon}
      <Typography component="h3" sx={{ fontWeight: 800, fontSize: '18px' }}>
        {heading}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
        {body}
      </Typography>
      {action}
    </Box>
  );

  const finishButton = (label: string) => (
    <Button
      variant="contained"
      onClick={onClose}
      sx={{
        mt: 1.5,
        px: 3,
        borderRadius: '10px',
        textTransform: 'none',
        fontWeight: 750,
        bgcolor: BRAND,
        boxShadow: 'none',
        '&:hover': { bgcolor: '#007357', boxShadow: 'none' },
      }}
    >
      {label}
    </Button>
  );

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth={step === 'plans' ? 'md' : 'sm'}
      aria-labelledby="upgrade-dialog-title"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '18px',
            m: { xs: 1.5, sm: 4 },
            width: { xs: 'calc(100% - 24px)', sm: undefined },
            p: { xs: 2, sm: 3 },
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}
        >
          <LuminaAnimatedFace size={28} />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              id="upgrade-dialog-title"
              component="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '17px', sm: '19px' },
                lineHeight: 1.3,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={close}
          disabled={!canClose}
          aria-label={t('billing.upgrade.close')}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {step === 'plans' && (
        <>
          {!paymentsAvailable && !billing.isPro && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {t('billing.upgrade.notConfigured')}
            </Alert>
          )}
          <PlanCards
            isPro={billing.isPro}
            used={billing.used}
            limit={billing.limit}
            price={billing.status?.pro_price}
            prices={billing.status?.pro_prices}
            trialDays={billing.status?.trial_days ?? 0}
            initialInterval={interval}
            onChoosePro={(plan) => void choosePro(plan)}
            starting={starting}
            disabled={!paymentsAvailable}
          />
        </>
      )}

      {step === 'checkout' && checkout && (
        <StripeCheckout
          // A new checkout (another code) is a new Stripe form.
          key={checkout.client_secret}
          clientSecret={checkout.client_secret}
          intentType={checkout.intent_type}
          customerSessionClientSecret={checkout.customer_session_client_secret}
          amount={checkout.amount}
          interval={checkout.interval}
          currency={checkout.currency}
          amountDue={checkout.amount_due}
          trialEnd={checkout.trial_end}
          discount={checkout.discount}
          promo={{
            apply: (code) => changePromo(code),
            remove: async () => {
              await changePromo(null);
            },
            busy: promoBusy,
          }}
          priceLabel={priceLabel}
          intervalLabel={intervalLabel}
          onPaid={handlePaid}
          onBack={() => setStep('plans')}
          onBusyChange={setBusy}
        />
      )}

      {step === 'starting' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress
            size={36}
            sx={{ color: BRAND }}
            aria-label={t('billing.checkout.loading')}
          />
        </Box>
      )}

      {step === 'activating' &&
        statusPanel(
          <CircularProgress size={40} sx={{ color: BRAND, mb: 1 }} />,
          t('billing.activating.title'),
          t('billing.activating.body'),
        )}

      {step === 'done' &&
        statusPanel(
          <DoneIcon sx={{ fontSize: 56, color: BRAND }} />,
          trialEnd ? t('billing.done.trialTitle') : t('billing.done.title'),
          trialEnd
            ? t('billing.done.trialBody', {
                date: formatDate(trialEnd, i18n.language),
              })
            : nextCharge
              ? `${t('billing.done.body')} ${t('billing.done.nextCharge', {
                  date: formatDate(nextCharge, i18n.language),
                })}`
              : t('billing.done.body'),
          finishButton(t('billing.done.cta')),
        )}

      {step === 'pending' &&
        statusPanel(
          <PendingIcon sx={{ fontSize: 52, color: 'warning.main' }} />,
          t('billing.pending.title'),
          t('billing.pending.body'),
          finishButton(t('billing.upgrade.close')),
        )}
    </Dialog>
  );
};

export default UpgradeModal;
