import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  LinearProgress,
  Typography,
  alpha,
} from '@mui/material';
import {
  AutoAwesome as SparkIcon,
  CheckCircleRounded as DoneIcon,
  ExpandMore as ExpandIcon,
  RadioButtonUnchecked as PendingIcon,
} from '@mui/icons-material';
import { format, isToday, isTomorrow, startOfDay } from 'date-fns';
import { enUS, es, ja } from 'date-fns/locale';
import { LuminaOrb } from '@/components/ui';
import type { Task } from '@/redux/tasks/task.types';
import type {
  CalendarPlanState,
  PlanPhase,
} from '@/services/calendarPlanService';
import type { ICalendarEvent } from '../../../CalendarEvent';

const STEPS: PlanPhase[] = ['tasks', 'slots', 'thinking', 'checking'];
const PRIORITY: Record<number, { key: string; color: string }> = {
  3: { key: 'high', color: '#ef4444' },
  2: { key: 'medium', color: '#f59e0b' },
  1: { key: 'low', color: '#10b981' },
};

export interface AIPlanPanelProps {
  plan: Pick<
    CalendarPlanState,
    'isPlanning' | 'phase' | 'startedAt' | 'drafts' | 'excluded' | 'unplaced'
  >;
  confirming: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onDiscard: () => void;
  onToggle: (draftId: string) => void;
  /** Shows the block on the calendar (its day, highlighted). */
  onFocus: (draft: ICalendarEvent) => void;
  onHover: (draftId: string | null) => void;
  /** 'floating': the card over the calendar on small screens. */
  variant?: 'panel' | 'floating';
}

const minutes = (d: ICalendarEvent) =>
  Math.round((d.end.getTime() - d.start.getTime()) / 60_000);

const dateLocale = (language: string) =>
  language.startsWith('es') ? es : language.startsWith('ja') ? ja : enUS;

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

const PlanReview: React.FC<Omit<AIPlanPanelProps, 'onCancel' | 'variant'>> = ({
  plan,
  confirming,
  onConfirm,
  onDiscard,
  onToggle,
  onFocus,
  onHover,
}) => {
  const { t, i18n } = useTranslation();
  const locale = dateLocale(i18n.language);
  const [showUnplaced, setShowUnplaced] = useState(false);
  const excluded = useMemo(() => new Set(plan.excluded), [plan.excluded]);

  const included = plan.drafts.filter((d) => !excluded.has(d.id));
  const totalMinutes = included.reduce((sum, d) => sum + minutes(d), 0);
  const hours = Math.floor(totalMinutes / 60);
  const rest = totalMinutes % 60;

  const days = useMemo(() => {
    const groups = new Map<number, ICalendarEvent[]>();
    [...plan.drafts]
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .forEach((d) => {
        const day = startOfDay(d.start).getTime();
        groups.set(day, [...(groups.get(day) ?? []), d]);
      });
    return [...groups.entries()];
  }, [plan.drafts]);

  const dayLabel = (day: Date) =>
    isToday(day)
      ? t('calendar.plan.today')
      : isTomorrow(day)
        ? t('calendar.plan.tomorrow')
        : format(day, 'EEEE d MMM', { locale });

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 0 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <SparkIcon sx={{ fontSize: 18, color: 'primary.main', mt: '2px' }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h3"
            sx={{ fontWeight: 750, fontSize: '14px', lineHeight: 1.3 }}
          >
            {t('calendar.plan.reviewTitle')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {t('calendar.plan.reviewSummary', { count: included.length })}
            {totalMinutes > 0 &&
              ` · ${t('calendar.plan.focusTime', { hours, minutes: rest })}`}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {days.map(([dayTime, drafts]) => (
          <Box key={dayTime} component="section">
            <Typography
              sx={{
                fontSize: '10.5px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'text.secondary',
                mb: 0.75,
              }}
            >
              {dayLabel(new Date(dayTime))}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {drafts.map((draft) => {
                const task = draft.resource as Task | undefined;
                const off = excluded.has(draft.id);
                const priority = PRIORITY[task?.priority_level ?? 0];
                const deadline = task?.deadline
                  ? new Date(task.deadline)
                  : null;
                const late = deadline ? draft.end > deadline : false;
                const moved = Boolean(task?.estimated_start_date);
                return (
                  <Box
                    key={draft.id}
                    onMouseEnter={() => onHover(draft.id)}
                    onMouseLeave={() => onHover(null)}
                    sx={{
                      display: 'flex',
                      gap: 0.5,
                      p: '8px 10px 8px 4px',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: off
                        ? 'divider'
                        : (theme) => alpha(theme.palette.primary.main, 0.35),
                      bgcolor: off
                        ? 'transparent'
                        : (theme) => alpha(theme.palette.primary.main, 0.05),
                      opacity: off ? 0.55 : 1,
                      transition: 'all .15s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <Checkbox
                      size="small"
                      checked={!off}
                      onChange={() => onToggle(draft.id)}
                      disabled={confirming}
                      inputProps={{
                        'aria-label': t('calendar.plan.include', {
                          title: draft.title,
                        }),
                      }}
                      sx={{ p: 0.5, alignSelf: 'flex-start' }}
                    />
                    <Box
                      role="button"
                      tabIndex={0}
                      onClick={() => onFocus(draft)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onFocus(draft);
                        }
                      }}
                      sx={{
                        minWidth: 0,
                        flex: 1,
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: 'primary.main',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {format(draft.start, 'HH:mm')} –{' '}
                        {format(draft.end, 'HH:mm')}
                        <Box
                          component="span"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 500,
                            ml: 0.75,
                          }}
                        >
                          {t('calendar.plan.duration', {
                            count: minutes(draft),
                          })}
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '13px',
                          fontWeight: 600,
                          lineHeight: 1.3,
                          textDecoration: off ? 'line-through' : 'none',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {draft.title}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        {priority && (
                          <Tag dot={priority.color}>
                            {t(`calendar.plan.priority.${priority.key}`)}
                          </Tag>
                        )}
                        {deadline && (
                          <Tag tone={late ? 'warning' : 'success'}>
                            {t(
                              late
                                ? 'calendar.plan.afterDeadline'
                                : 'calendar.plan.beforeDeadline',
                            )}
                          </Tag>
                        )}
                        {moved && <Tag>{t('calendar.plan.rescheduled')}</Tag>}
                      </Box>
                      {draft.draftReason && (
                        <Typography
                          sx={{
                            mt: 0.5,
                            fontSize: '11.5px',
                            color: 'text.secondary',
                            lineHeight: 1.35,
                          }}
                        >
                          {draft.draftReason}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>

      {plan.unplaced.length > 0 && (
        <Box
          sx={{
            borderRadius: '10px',
            bgcolor: 'action.hover',
            px: 1.25,
            py: 0.75,
          }}
        >
          <Button
            fullWidth
            size="small"
            onClick={() => setShowUnplaced((v) => !v)}
            aria-expanded={showUnplaced}
            endIcon={
              <ExpandIcon
                sx={{
                  transform: showUnplaced ? 'rotate(180deg)' : 'none',
                  transition: 'transform .2s',
                }}
              />
            }
            sx={{
              justifyContent: 'space-between',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '12px',
              color: 'text.secondary',
              px: 0,
            }}
          >
            {t('calendar.plan.unplaced', { count: plan.unplaced.length })}
          </Button>
          <Collapse in={showUnplaced}>
            <Box component="ul" sx={{ m: 0, pl: 2, pb: 0.5 }}>
              {plan.unplaced.map((task) => (
                <Typography
                  component="li"
                  key={task.id}
                  sx={{ fontSize: '12px', color: 'text.secondary' }}
                >
                  {task.title}
                </Typography>
              ))}
            </Box>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {t('calendar.plan.unplacedHint')}
            </Typography>
          </Collapse>
        </Box>
      )}

      <Typography
        variant="caption"
        sx={{ color: 'text.secondary', lineHeight: 1.4 }}
      >
        {t('calendar.plan.dragHint')}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          onClick={onDiscard}
          disabled={confirming}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
            borderRadius: '8px',
          }}
        >
          {t('calendar.discard')}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={confirming || included.length === 0}
          startIcon={
            confirming ? (
              <CircularProgress size={14} color="inherit" />
            ) : undefined
          }
          sx={{
            flex: 1,
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '8px',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          }}
        >
          {confirming
            ? t('calendar.scheduling')
            : t('calendar.plan.confirm', { count: included.length })}
        </Button>
      </Box>
    </Box>
  );
};

const Tag: React.FC<{
  children: React.ReactNode;
  dot?: string;
  tone?: 'success' | 'warning';
}> = ({ children, dot, tone }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.5,
      px: 0.75,
      py: '1px',
      borderRadius: '6px',
      fontSize: '10.5px',
      fontWeight: 600,
      color: tone ? `${tone}.main` : 'text.secondary',
      bgcolor: (theme) =>
        tone
          ? alpha(theme.palette[tone].main, 0.12)
          : theme.palette.action.hover,
    }}
  >
    {dot && (
      <Box
        component="span"
        sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: dot }}
      />
    )}
    {children}
  </Box>
);

/**
 * "Optimizar agenda" in the calendar: Lumina's progress while it works, then
 * its proposal to review before anything is scheduled.
 */
export const AIPlanPanel: React.FC<AIPlanPanelProps> = ({
  variant = 'panel',
  onCancel,
  ...props
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
      {props.plan.isPlanning ? (
        <PlanProgress plan={props.plan} onCancel={onCancel} />
      ) : (
        <PlanReview {...props} />
      )}
    </Box>
  );
};

export default AIPlanPanel;
