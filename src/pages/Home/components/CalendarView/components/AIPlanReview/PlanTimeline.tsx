import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, alpha } from '@mui/material';
import { format, isToday, isTomorrow } from 'date-fns';
import type { ICalendarEvent } from '../../../CalendarEvent';
import { dateLocale } from '../../utils/calendarNavigation';
import {
  busyOn,
  groupByDay,
  hourRange,
  placeInColumn,
} from './planReviewModel';

const HOUR_PX = 56;
const GUTTER_PX = 44;

interface PlanTimelineProps {
  drafts: ICalendarEvent[];
  excluded: string[];
  busyEvents: ICalendarEvent[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onToggle: (id: string) => void;
}

/**
 * The proposal as it would look on the calendar: one column per day, the
 * events already there in gray and Lumina's blocks in the brand color.
 */
export const PlanTimeline: React.FC<PlanTimelineProps> = ({
  drafts,
  excluded,
  busyEvents,
  hoveredId,
  onHover,
  onToggle,
}) => {
  const { t, i18n } = useTranslation();
  const locale = dateLocale(i18n.language);
  const days = useMemo(() => groupByDay(drafts), [drafts]);
  const { from, to } = useMemo(() => hourRange(drafts), [drafts]);
  const hours = Array.from({ length: to - from }, (_, i) => from + i);
  const height = (to - from) * HOUR_PX;

  const dayLabel = (day: Date) =>
    isToday(day)
      ? t('calendar.plan.today')
      : isTomorrow(day)
        ? t('calendar.plan.tomorrow')
        : format(day, 'EEE d', { locale });

  return (
    <Box
      sx={{ minWidth: GUTTER_PX + days.length * 132 }}
      aria-label={t('calendar.plan.previewLabel')}
      role="group"
    >
      {/* Day headers */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `${GUTTER_PX}px repeat(${days.length}, 1fr)`,
          position: 'sticky',
          top: 0,
          zIndex: 2,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <span />
        {days.map(({ day, items }) => (
          <Box key={day.getTime()} sx={{ py: 1.25, textAlign: 'center' }}>
            <Typography
              sx={{
                fontSize: '12.5px',
                fontWeight: 700,
                color: isToday(day) ? 'primary.main' : 'text.primary',
                textTransform: 'capitalize',
              }}
            >
              {dayLabel(day)}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
              {t('calendar.plan.reviewSummary', { count: items.length })}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Hours and columns */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `${GUTTER_PX}px repeat(${days.length}, 1fr)`,
          height,
          position: 'relative',
        }}
      >
        {/* Hour lines across every column */}
        {hours.map((hour, i) => (
          <Box
            key={hour}
            aria-hidden
            sx={{
              position: 'absolute',
              left: GUTTER_PX,
              right: 0,
              top: i * HOUR_PX,
              borderTop: '1px solid',
              borderColor: 'divider',
              opacity: 0.6,
            }}
          />
        ))}

        <Box sx={{ position: 'relative' }} aria-hidden>
          {hours.map((hour, i) => (
            <Typography
              key={hour}
              sx={{
                position: 'absolute',
                top: i * HOUR_PX - 7,
                right: 8,
                fontSize: '10.5px',
                color: 'text.disabled',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {i === 0 ? '' : format(new Date(2026, 0, 1, hour), 'HH:mm')}
            </Typography>
          ))}
        </Box>

        {days.map(({ day, items }) => (
          <Box
            key={day.getTime()}
            sx={{
              position: 'relative',
              borderLeft: '1px solid',
              borderColor: 'divider',
            }}
          >
            {busyOn(busyEvents, day)
              .map((event) => placeInColumn(event, day, from, to))
              .filter((p) => p !== null)
              .map(({ event, top, height: h }) => (
                <Box
                  key={`busy-${event.id}`}
                  sx={{
                    position: 'absolute',
                    top: `${top}%`,
                    height: `${h}%`,
                    left: 4,
                    right: 4,
                    px: 0.75,
                    py: 0.25,
                    borderRadius: '6px',
                    bgcolor: 'action.hover',
                    borderLeft: '3px solid',
                    borderColor: 'text.disabled',
                    overflow: 'hidden',
                  }}
                >
                  <Typography
                    noWrap
                    sx={{ fontSize: '11px', color: 'text.secondary' }}
                  >
                    {event.title}
                  </Typography>
                </Box>
              ))}

            {items
              .map((event) => placeInColumn(event, day, from, to))
              .filter((p) => p !== null)
              .map(({ event, top, height: h }) => {
                const off = excluded.includes(event.id);
                const hovered = hoveredId === event.id;
                return (
                  <Box
                    key={event.id}
                    data-testid={`preview-${event.id}`}
                    data-highlighted={hovered ? 'true' : undefined}
                    onMouseEnter={() => onHover(event.id)}
                    onMouseLeave={() => onHover(null)}
                    onClick={() => onToggle(event.id)}
                    sx={{
                      position: 'absolute',
                      top: `${top}%`,
                      height: `${h}%`,
                      left: 4,
                      right: 4,
                      zIndex: 1,
                      px: 0.75,
                      py: 0.5,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, off ? 0.04 : 0.16),
                      borderLeft: '3px solid',
                      borderColor: 'primary.main',
                      opacity: off ? 0.45 : 1,
                      outline: hovered ? '2px solid' : 'none',
                      outlineColor: 'primary.main',
                      transition: 'opacity .15s, background-color .15s',
                      ...(off && {
                        borderLeftStyle: 'dashed',
                      }),
                    }}
                  >
                    <Typography
                      noWrap
                      sx={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: 'text.primary',
                        textDecoration: off ? 'line-through' : 'none',
                      }}
                    >
                      {event.title}
                    </Typography>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: '10.5px',
                        color: 'primary.main',
                        fontWeight: 600,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {format(event.start, 'HH:mm')} –{' '}
                      {format(event.end, 'HH:mm')}
                    </Typography>
                  </Box>
                );
              })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
