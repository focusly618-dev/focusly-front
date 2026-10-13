import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Typography,
  alpha,
} from '@mui/material';
import {
  CheckCircleRounded as DoneIcon,
  RadioButtonUnchecked as PendingIcon,
} from '@mui/icons-material';
import { LuminaOrb } from '@/components/ui';
import type {
  CalendarPlanState,
  PlanPhase,
} from '@/services/calendarPlanService';

const STEPS: PlanPhase[] = ['tasks', 'slots', 'thinking', 'checking'];

export interface AIPlanPanelProps {
  plan: Pick<CalendarPlanState, 'phase' | 'startedAt'>;
  onCancel: () => void;
  /** 'floating': the card over the calendar on small screens. */
  variant?: 'panel' | 'floating';
}

/** Seconds since `startedAt`, ticking. */
const useElapsed = (startedAt: number | null) => {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (!startedAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  return startedAt ? Math.max(0, Math.round((now - startedAt) / 1000)) : 0;
};

const PlanProgress: React.FC<Pick<AIPlanPanelProps, 'plan' | 'onCancel'>> = ({
  plan,
  onCancel,
}) => {
  const { t } = useTranslation();
  const elapsed = useElapsed(plan.startedAt);
  const current = plan.phase ? STEPS.indexOf(plan.phase) : 0;

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Box sx={{ flexShrink: 0, width: 34, height: 34 }}>
          <LuminaOrb size={34} state="thinking" />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: '13.5px', lineHeight: 1.3 }}
          >
            {t('calendar.plan.workingTitle')}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}
          >
            {t('calendar.plan.elapsed', { count: elapsed })}
          </Typography>
        </Box>
      </Box>

      <LinearProgress
        aria-hidden
        sx={{
          height: 3,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
        }}
      />

      <Box
        component="ol"
        sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1 }}
      >
        {STEPS.map((step, i) => {
          const state =
            i < current ? 'done' : i === current ? 'active' : 'pending';
          return (
            <Box
              component="li"
              key={step}
              aria-current={state === 'active' ? 'step' : undefined}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                {state === 'done' ? (
                  <DoneIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                ) : state === 'active' ? (
                  <CircularProgress size={12} thickness={6} />
                ) : (
                  <PendingIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                )}
              </Box>
              <Typography
                sx={{
                  fontSize: '12.5px',
                  fontWeight: state === 'active' ? 650 : 500,
                  color: state === 'pending' ? 'text.disabled' : 'text.primary',
                }}
              >
                {t(`calendar.plan.steps.${step}`)}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Typography
        variant="caption"
        sx={{ color: 'text.secondary', lineHeight: 1.4 }}
      >
        {t('calendar.plan.backgroundHint')}
      </Typography>

      <Button
        size="small"
        onClick={onCancel}
        sx={{
          alignSelf: 'flex-start',
          textTransform: 'none',
          fontWeight: 600,
          color: 'text.secondary',
          px: 1,
        }}
      >
        {t('calendar.cancelPlanning')}
      </Button>
    </Box>
  );
};

/**
 * "Optimizar agenda" while Lumina works: its steps, in the side panel (or a
 * card on small screens). The proposal is reviewed in AIPlanReviewDialog.
 */
export const AIPlanPanel: React.FC<AIPlanPanelProps> = ({
  variant = 'panel',
  onCancel,
  plan,
}) => {
  const floating = variant === 'floating';
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        ...(floating && {
          p: 2,
          borderRadius: '16px',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 16px 40px -8px rgba(0,0,0,0.25)',
          maxHeight: '60vh',
          overflowY: 'auto',
          animation: 'aiPlanIn .25s cubic-bezier(.16,1,.3,1)',
          '@keyframes aiPlanIn': {
            from: { transform: 'translateY(12px)', opacity: 0 },
            to: { transform: 'none', opacity: 1 },
          },
        }),
      }}
    >
      <PlanProgress plan={plan} onCancel={onCancel} />
    </Box>
  );
};

export default AIPlanPanel;
