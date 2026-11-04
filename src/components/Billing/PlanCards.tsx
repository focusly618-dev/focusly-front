import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  alpha,
} from '@mui/material';
import {
  CheckRounded as CheckIcon,
  CloseRounded as NoIcon,
  AutoAwesome as SparkIcon,
} from '@mui/icons-material';
import type {
  BillingInterval,
  PlanId,
  ProPrice,
} from '@/api/Billing/billingApi';
import {
  PLAN_FEATURES,
  formatPrice,
  perMonth,
  priceFor,
  yearlySavings,
} from '@/config/plans';
import { freeMessagesRenewal } from '@/utils/billing/aiRenewal';

const BRAND = '#008767';

export interface PlanCardsProps {
  isPro: boolean;
  used: number;
  limit: number;
  /** The monthly price (shown when there's no list of prices). */
  price: ProPrice | null | undefined;
  /** Every Pro price on sale; with a yearly one, a Monthly/Yearly switch. */
  prices?: ProPrice[];
  /** Days of free trial Pro starts with for this user (0: none). */
  trialDays?: number;
  /** The plan shown first. */
  initialInterval?: BillingInterval;
  onChoosePro?: (interval: BillingInterval) => void;
  /** The Pro button is starting the checkout. */
  starting?: boolean;
  disabled?: boolean;
}

/** Free (with its usage) next to Pro: what changes, and the way to upgrade. */
export const PlanCards: React.FC<PlanCardsProps> = ({
  isPro,
  used,
  limit,
  price,
  prices,
  trialDays = 0,
  initialInterval = 'month',
  onChoosePro,
  starting = false,
  disabled = false,
}) => {
  const { t, i18n } = useTranslation();
  const monthly = priceFor(prices, 'month') ?? price ?? null;
  const yearly = priceFor(prices, 'year');
  const [interval, setInterval] = useState<BillingInterval>(
    yearly ? initialInterval : 'month',
  );
  const shown = interval === 'year' && yearly ? yearly : monthly;
  const priceLabel = formatPrice(shown, i18n.language);
  const savings = yearlySavings(monthly, yearly);
  const remaining = Math.max(0, limit - used);

  const card = (plan: PlanId, children: React.ReactNode) => {
    const featured = plan === 'pro';
    return (
      <Box
        component="section"
        aria-labelledby={`plan-${plan}-name`}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          p: { xs: 2, sm: 2.5 },
          borderRadius: '14px',
          border: featured ? `2px solid ${BRAND}` : '1px solid',
          borderColor: featured ? BRAND : 'divider',
          bgcolor: featured
            ? (theme) =>
                alpha(BRAND, theme.palette.mode === 'dark' ? 0.08 : 0.03)
            : 'background.paper',
          minWidth: 0,
        }}
      >
        {children}
      </Box>
    );
  };

  const header = (plan: PlanId) => {
    const current = (plan === 'pro') === isPro;
    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            minHeight: 24,
          }}
        >
          <Typography
            id={`plan-${plan}-name`}
            component="h3"
            sx={{
              fontWeight: 800,
              fontSize: '15px',
              color: plan === 'pro' ? BRAND : 'text.primary',
            }}
          >
            {t(`billing.plans.${plan}.name`)}
          </Typography>
          {current ? (
            <Chip
              size="small"
              label={t('billing.plans.current')}
              sx={{ fontWeight: 700 }}
            />
          ) : plan === 'pro' ? (
            <Chip
              size="small"
              label={t('billing.plans.recommended')}
              sx={{ fontWeight: 700, bgcolor: BRAND, color: '#fff' }}
            />
          ) : null}
        </Box>
        <Typography variant="caption" color="text.secondary">
          {t(`billing.plans.${plan}.tagline`)}
        </Typography>
      </Box>
    );
  };

  const features = (plan: PlanId) => (
    <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', flex: 1 }}>
      {PLAN_FEATURES[plan].map((feature) => (
        <Box
          component="li"
          key={feature.key}
          sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, py: 0.5 }}
        >
          {feature.included ? (
            <CheckIcon
              sx={{
                fontSize: 17,
                mt: '1px',
                color: feature.highlight ? BRAND : 'text.secondary',
              }}
            />
          ) : (
            <NoIcon sx={{ fontSize: 17, mt: '1px', color: 'text.disabled' }} />
          )}
          <Typography
            variant="body2"
            sx={{
              fontSize: '13px',
              fontWeight: feature.highlight ? 650 : 450,
              color: feature.included ? 'text.primary' : 'text.disabled',
              textDecoration: feature.included ? 'none' : 'line-through',
            }}
          >
            {t(
              `billing.features.${feature.key}`,
              feature.key === 'aiTrial' ? { count: limit } : undefined,
            )}
            {!feature.included && (
              <Box component="span" sx={visuallyHidden}>
                {` (${t('billing.features.notIncluded')})`}
              </Box>
            )}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box>
      {yearly && !isPro && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2,
          }}
        >
          <ToggleButtonGroup
            exclusive
            size="small"
            value={interval}
            onChange={(_, next: BillingInterval | null) =>
              next && setInterval(next)
            }
            aria-label={t('billing.plans.intervalLabel')}
            sx={{
              bgcolor: 'action.hover',
              borderRadius: '999px',
              p: 0.5,
              '& .MuiToggleButton-root': {
                border: 0,
                borderRadius: '999px !important',
                px: 2,
                py: 0.5,
                textTransform: 'none',
                fontWeight: 650,
                fontSize: '13px',
              },
              '& .Mui-selected': {
                bgcolor: 'background.paper !important',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              },
            }}
          >
            <ToggleButton value="month">
              {t('billing.plans.monthly')}
            </ToggleButton>
            <ToggleButton value="year">
              {t('billing.plans.yearly')}
            </ToggleButton>
          </ToggleButtonGroup>
          {savings && (
            <Chip
              size="small"
              label={
                savings.months >= 1
                  ? t('billing.plans.monthsFree', { count: savings.months })
                  : t('billing.plans.save', { percent: savings.percent })
              }
              sx={{
                fontWeight: 700,
                bgcolor: alpha(BRAND, 0.12),
                color: BRAND,
              }}
            />
          )}
        </Box>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        {card(
          'free',
          <>
            {header('free')}
            <Typography
              sx={{ fontWeight: 850, fontSize: '26px', lineHeight: 1.2 }}
            >
              {t('billing.plans.free.price')}
            </Typography>
            {!isPro && (
              <Box>
                <LinearProgress
                  variant="determinate"
                  value={limit ? Math.min(100, (used / limit) * 100) : 0}
                  aria-label={t('billing.usage', { used, limit })}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    mb: 0.75,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: remaining === 0 ? 'error.main' : BRAND,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  color={remaining === 0 ? 'error' : 'text.secondary'}
                >
                  {remaining === 0
                    ? t('billing.usageNone', {
                        date: freeMessagesRenewal(null, i18n.language),
                      })
                    : t('billing.usageLeft', { count: remaining })}
                </Typography>
              </Box>
            )}
            {features('free')}
          </>,
        )}

        {card(
          'pro',
          <>
            {header('pro')}
            {priceLabel ? (
              <Box>
                <Box
                  sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}
                >
                  <Typography
                    sx={{ fontWeight: 850, fontSize: '26px', lineHeight: 1.2 }}
                  >
                    {priceLabel}
                  </Typography>
                  {shown?.interval && (
                    <Typography variant="body2" color="text.secondary">
                      {t('billing.plans.perInterval', {
                        interval: t(
                          `billing.plans.interval.${shown.interval}`,
                          {
                            defaultValue: shown.interval,
                          },
                        ),
                      })}
                    </Typography>
                  )}
                </Box>
                {interval === 'year' && yearly && (
                  <Typography variant="caption" color="text.secondary">
                    {t('billing.plans.perMonthEquivalent', {
                      price: perMonth(yearly, i18n.language),
                    })}
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minHeight: 31 }}
              >
                {t('billing.plans.priceLater')}
              </Typography>
            )}
            {features('pro')}
            {!isPro && trialDays > 0 && (
              <Chip
                size="small"
                icon={<SparkIcon sx={{ fontSize: 14 }} />}
                label={t('billing.plans.trialBadge', { count: trialDays })}
                sx={{
                  alignSelf: 'flex-start',
                  fontWeight: 700,
                  bgcolor: alpha(BRAND, 0.12),
                  color: BRAND,
                  '& .MuiChip-icon': { color: BRAND },
                }}
              />
            )}
            {!isPro && onChoosePro && (
              <Button
                variant="contained"
                onClick={() => onChoosePro(interval)}
                disabled={disabled || starting}
                startIcon={
                  starting ? undefined : <SparkIcon sx={{ fontSize: 17 }} />
                }
                sx={{
                  mt: 0.5,
                  py: 1,
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 750,
                  bgcolor: BRAND,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#007357', boxShadow: 'none' },
                }}
              >
                {starting ? (
                  <CircularProgress
                    size={20}
                    color="inherit"
                    aria-label={t('billing.checkout.loading')}
                  />
                ) : trialDays > 0 ? (
                  t('billing.upgrade.ctaTrial', { count: trialDays })
                ) : (
                  t('billing.upgrade.cta')
                )}
              </Button>
            )}
            {!isPro && onChoosePro && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                {trialDays > 0
                  ? t('billing.plans.trialNote')
                  : t('billing.plans.cancelAnytime')}
              </Typography>
            )}
          </>,
        )}
      </Box>
    </Box>
  );
};

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;
