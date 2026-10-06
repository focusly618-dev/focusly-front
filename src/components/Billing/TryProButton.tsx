import React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase, Tooltip, alpha } from '@mui/material';
import { AutoAwesome as SparkIcon } from '@mui/icons-material';
import { useBilling } from '@/hooks/useBilling';
import type { UpgradeReason } from '@/services/billingService';

const BRAND = '#008767';

/** "✨ Prueba Pro · 3/5" for free users; nothing for Pro. */
export const TryProButton: React.FC<{ reason?: UpgradeReason }> = ({
  reason = 'manual',
}) => {
  const { t } = useTranslation();
  const billing = useBilling();
  if (billing.isPro) return null;

  const left = billing.remaining;
  const usage = billing.known
    ? left === 0
      ? t('billing.usageNone')
      : t('billing.usageLeft', { count: left })
    : null;

  return (
    <Tooltip title={usage ?? ''}>
      <ButtonBase
        onClick={() => billing.openUpgrade(reason)}
        aria-label={
          usage ? `${t('billing.tryPro')} · ${usage}` : t('billing.tryPro')
        }
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.25,
          py: 0.5,
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 750,
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          color: BRAND,
          bgcolor: alpha(BRAND, 0.1),
          border: `1px solid ${alpha(BRAND, 0.3)}`,
          transition: 'background-color 0.15s ease',
          '&:hover': { bgcolor: alpha(BRAND, 0.18) },
          '&.Mui-focusVisible': {
            outline: `2px solid ${BRAND}`,
            outlineOffset: 2,
          },
        }}
      >
        <SparkIcon sx={{ fontSize: 15 }} />
        {t('billing.tryPro')}
        {billing.known && (
          <span
            style={{
              fontWeight: 650,
              opacity: 0.85,
              color: left === 0 ? '#dc2626' : undefined,
            }}
          >
            · {Math.max(0, billing.limit - left)}/{billing.limit}
          </span>
        )}
      </ButtonBase>
    </Tooltip>
  );
};
