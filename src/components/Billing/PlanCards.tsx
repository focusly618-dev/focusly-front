import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Typography,
  alpha,
} from '@mui/material';
import {
  CheckRounded as CheckIcon,
  CloseRounded as NoIcon,
  AutoAwesome as SparkIcon,
} from '@mui/icons-material';
import type { PlanId, ProPrice } from '@/api/Billing/billingApi';
import { PLAN_FEATURES, formatPrice } from '@/config/plans';

const BRAND = '#008767';

export interface PlanCardsProps {
  isPro: boolean;
  used: number;
  limit: number;
  price: ProPrice | null | undefined;
  onChoosePro?: () => void;
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
  onChoosePro,
  starting = false,
  disabled = false,
}) => {
  const { t, i18n } = useTranslation();
  const priceLabel = formatPrice(price, i18n.language);
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
                  ? t('billing.usageNone')
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
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
              <Typography
                sx={{ fontWeight: 850, fontSize: '26px', lineHeight: 1.2 }}
              >
                {priceLabel}
              </Typography>
              {price?.interval && (
                <Typography variant="body2" color="text.secondary">
                  {t('billing.plans.perInterval', {
                    interval: t(`billing.plans.interval.${price.interval}`, {
                      defaultValue: price.interval,
                    }),
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
          {!isPro && onChoosePro && (
            <Button
              variant="contained"
              onClick={onChoosePro}
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
              ) : (
                t('billing.upgrade.cta')
              )}
            </Button>
          )}
        </>,
      )}
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
