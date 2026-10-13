import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography, alpha } from '@mui/material';
import { AutoAwesome as SparkIcon } from '@mui/icons-material';

interface AIPlanPillProps {
  count: number;
  onReview: () => void;
  onDiscard: () => void;
}

/**
 * While the review is closed (to look at the calendar), a small bar over it:
 * the proposed blocks are still there, one click from the review.
 */
export const AIPlanPill: React.FC<AIPlanPillProps> = ({
  count,
  onReview,
  onDiscard,
}) => {
  const { t } = useTranslation();
  return (
    <Box
      role="region"
      aria-label={t('calendar.plan.reviewTitle')}
      sx={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        pl: 1.75,
        pr: 0.75,
        py: 0.5,
        maxWidth: 'calc(100% - 32px)',
        borderRadius: '999px',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: (theme) => alpha(theme.palette.primary.main, 0.35),
        boxShadow: '0 10px 28px -8px rgba(0,0,0,0.25)',
        animation: 'aiPillIn .25s cubic-bezier(.16,1,.3,1)',
        '@keyframes aiPillIn': {
          from: { transform: 'translate(-50%, -12px)', opacity: 0 },
          to: { transform: 'translate(-50%, 0)', opacity: 1 },
        },
      }}
    >
      <SparkIcon sx={{ fontSize: 16, color: 'primary.main' }} />
      <Typography noWrap sx={{ fontSize: '13px', fontWeight: 600 }}>
        {t('calendar.plan.reviewTitle')}
        <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {' · '}
          {t('calendar.plan.reviewSummary', { count })}
        </Box>
      </Typography>
      <Button
        size="small"
        onClick={onDiscard}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          color: 'text.secondary',
          borderRadius: '999px',
          minWidth: 0,
        }}
      >
        {t('calendar.discard')}
      </Button>
      <Button
        size="small"
        variant="contained"
        onClick={onReview}
        sx={{
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: '999px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        }}
      >
        {t('calendar.plan.review')}
      </Button>
    </Box>
  );
};
