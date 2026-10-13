import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Typography,
  alpha,
} from '@mui/material';
import { ExpandMore as ExpandIcon } from '@mui/icons-material';
import { format, isToday, isTomorrow } from 'date-fns';
import type { Task } from '@/redux/tasks/task.types';
import type { UnplacedTask } from '@/services/calendarPlanService';
import type { ICalendarEvent } from '../../../CalendarEvent';
import { dateLocale } from '../../utils/calendarNavigation';
import { groupByDay, minutesOf } from './planReviewModel';

const PRIORITY: Record<number, { key: string; color: string }> = {
  3: { key: 'high', color: '#ef4444' },
  2: { key: 'medium', color: '#f59e0b' },
  1: { key: 'low', color: '#10b981' },
};

interface PlanListProps {
  drafts: ICalendarEvent[];
  excluded: string[];
  unplaced: UnplacedTask[];
  confirming: boolean;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onToggle: (id: string) => void;
}

/** Lumina's blocks by day: check the ones to keep, see why each goes there. */
export const PlanList: React.FC<PlanListProps> = ({
  drafts,
  excluded,
  unplaced,
  confirming,
  hoveredId,
  onHover,
  onToggle,
}) => {
  const { t, i18n } = useTranslation();
  const locale = dateLocale(i18n.language);
  const [showUnplaced, setShowUnplaced] = useState(false);

  const dayLabel = (day: Date) =>
    isToday(day)
      ? t('calendar.plan.today')
      : isTomorrow(day)
        ? t('calendar.plan.tomorrow')
        : format(day, 'EEEE d MMM', { locale });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {groupByDay(drafts).map(({ day, items }) => (
        <Box key={day.getTime()} component="section">
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
            {dayLabel(day)}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {items.map((draft) => {
              const task = draft.resource as Task | undefined;
              const off = excluded.includes(draft.id);
              const priority = PRIORITY[task?.priority_level ?? 0];
              const deadline = task?.deadline ? new Date(task.deadline) : null;
              const late = deadline ? draft.end > deadline : false;
              const moved = Boolean(task?.estimated_start_date);
              return (
                <Box
                  key={draft.id}
                  component="label"
                  onMouseEnter={() => onHover(draft.id)}
                  onMouseLeave={() => onHover(null)}
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                    p: '8px 12px 8px 4px',
                    borderRadius: '10px',
                    border: '1px solid',
                    cursor: confirming ? 'default' : 'pointer',
                    borderColor:
                      hoveredId === draft.id
                        ? 'primary.main'
                        : off
                          ? 'divider'
                          : (theme) => alpha(theme.palette.primary.main, 0.3),
                    bgcolor: off
                      ? 'transparent'
                      : (theme) => alpha(theme.palette.primary.main, 0.04),
                    opacity: off ? 0.55 : 1,
                    transition: 'border-color .15s, opacity .15s',
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
                  <Box sx={{ minWidth: 0, flex: 1 }}>
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
                          count: minutesOf(draft),
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

      {unplaced.length > 0 && (
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
            {t('calendar.plan.unplaced', { count: unplaced.length })}
          </Button>
          <Collapse in={showUnplaced}>
            <Box component="ul" sx={{ m: 0, pl: 2, pb: 0.5 }}>
              {unplaced.map((task) => (
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
