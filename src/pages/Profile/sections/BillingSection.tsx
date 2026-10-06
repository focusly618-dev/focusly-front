import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  AutoAwesome as SparkIcon,
  CreditCard as CreditCardIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { billingApi } from '@/api/Billing/billingApi';
import { PlanCards } from '@/components/Billing/PlanCards';
import { useBilling } from '@/hooks/useBilling';
import { sileo } from '@/utils';
import { Card, CardDescription, CardTitle, Divider } from '../Profile.styles';

const BRAND = '#008767';

// Stripe adds these to the return URL when a payment method had to leave
// the page (3-D Secure, bank redirects…).
const RETURN_PARAMS = [
  'payment_intent',
  'payment_intent_client_secret',
  'setup_intent',
  'setup_intent_client_secret',
  'redirect_status',
];

export const BillingSection = () => {
  const { t, i18n } = useTranslation();
  const billing = useBilling();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openingPortal, setOpeningPortal] = useState(false);
  const [returnNotice, setReturnNotice] = useState<
    'success' | 'pending' | 'failed' | null
  >(null);
  const { refresh, waitForPro } = billing;

  // Read the subscription from Stripe when the page opens (renewal date,
  // a cancellation done in the portal…).
  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Back from a payment that needed a redirect: confirm the plan.
  const redirectStatus = searchParams.get('redirect_status');
  const handledReturn = useRef(false);
  useEffect(() => {
    if (!redirectStatus || handledReturn.current) return;
    handledReturn.current = true;
    const next = new URLSearchParams(searchParams);
    RETURN_PARAMS.forEach((param) => next.delete(param));
    setSearchParams(next, { replace: true });

    if (redirectStatus === 'failed') {
      setReturnNotice('failed');
      return;
    }
    void waitForPro().then((active) =>
      setReturnNotice(active ? 'success' : 'pending'),
    );
  }, [redirectStatus, searchParams, setSearchParams, waitForPro]);

  const openPortal = async () => {
    setOpeningPortal(true);
    try {
      const { url } = await billingApi.getPortalUrl();
      window.location.assign(url);
    } catch (err) {
      console.error('Could not open the Stripe portal:', err);
      sileo.error({ title: t('billing.section.portalError') });
      setOpeningPortal(false);
    }
  };

  const status = billing.status;
  const periodEnd = status?.current_period_end
    ? new Date(status.current_period_end * 1000).toLocaleDateString(
        i18n.language,
        { day: 'numeric', month: 'long', year: 'numeric' },
      )
    : null;

  return (
    <>
      <Card>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <CardTitle>{t('billing.section.title')}</CardTitle>
            <CardDescription>
              {t('billing.section.description')}
            </CardDescription>
          </Box>
          <Chip
            icon={billing.isPro ? <SparkIcon /> : undefined}
            label={
              billing.isPro
                ? t('billing.section.pro')
                : t('billing.section.free')
            }
            sx={{
              fontWeight: 750,
              ...(billing.isPro && {
                bgcolor: BRAND,
                color: '#fff',
                '& .MuiChip-icon': { color: '#fff' },
              }),
            }}
          />
        </Box>

        {returnNotice && (
          <Alert
            severity={
              returnNotice === 'success'
                ? 'success'
                : returnNotice === 'pending'
                  ? 'info'
                  : 'warning'
            }
            onClose={() => setReturnNotice(null)}
            sx={{ mt: 2 }}
          >
            {t(
              returnNotice === 'success'
                ? 'billing.section.returnSuccess'
                : returnNotice === 'pending'
                  ? 'billing.section.returnPending'
                  : 'billing.section.returnFailed',
            )}
          </Alert>
        )}

        {billing.isPro ? (
          <Box
            sx={{ mt: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}
          >
            {status?.subscription_status === 'past_due' && (
              <Alert severity="warning">{t('billing.section.pastDue')}</Alert>
            )}
            {periodEnd && (
              <Typography variant="body2" color="text.secondary">
                {status?.cancel_at_period_end
                  ? t('billing.section.cancels', { date: periodEnd })
                  : t('billing.section.renews', { date: periodEnd })}
              </Typography>
            )}
            <Box>
              <Button
                variant="outlined"
                startIcon={<CreditCardIcon />}
                endIcon={
                  openingPortal ? (
                    <CircularProgress size={16} />
                  ) : (
                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                  )
                }
                onClick={openPortal}
                disabled={openingPortal}
                sx={{
                  textTransform: 'none',
                  fontWeight: 650,
                  borderRadius: '10px',
                }}
              >
                {t('billing.section.manage')}
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                component="p"
                sx={{ mt: 0.75 }}
              >
                {t('billing.section.manageHint')}
              </Typography>
            </Box>
          </Box>
        ) : (
          billing.known && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {t('billing.usage', { used: billing.used, limit: billing.limit })}
            </Typography>
          )
        )}
      </Card>

      <Divider />

      <Card>
        <CardTitle>{t('billing.section.plansTitle')}</CardTitle>
        <CardDescription sx={{ mb: 2 }}>
          {t('billing.section.plansDescription')}
        </CardDescription>
        <PlanCards
          isPro={billing.isPro}
          used={billing.used}
          limit={billing.limit}
          price={billing.status?.pro_price}
          onChoosePro={() => billing.openUpgrade('manual', { checkout: true })}
        />
      </Card>
    </>
  );
};
