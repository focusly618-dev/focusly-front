import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { View } from 'react-big-calendar';
import type { ICalendarEvent } from '@/pages/Home/components/CalendarEvent';
import { Box, Button, Typography, styled, Stack } from '@mui/material';
import {
  Add as AddIcon,
  ChevronRight,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  format,
  isSameDay,
  isSameMonth,
  getDay,
  startOfDay,
  endOfDay,
} from 'date-fns';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { surfaceColor } from '@/context';

// Styled Components
const PanelContainer = styled(Box)(({ theme }) => ({
  width: '255px',
  borderLeft: `1px solid ${theme.palette.divider}`,
  backgroundColor: surfaceColor(
    theme,
    'rgba(17, 24, 39, 0.4)',
    'rgba(36, 36, 37, 0.4)',
    '#FAF9F6',
  ),
  backdropFilter: theme.palette.mode === 'dark' ? 'blur(16px)' : 'none',
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
}));

const AddTaskButton = styled(Button)({
  width: '100%',
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '12.5px',
  padding: '7px 12px',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
  transition: 'all 0.2s ease-in-out',
  gap: 6,
  '&:hover': {
    backgroundColor: '#2563eb',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)',
  },
});

const ViewToggleContainer = styled(Box)(({ theme }) => ({
  backgroundColor: surfaceColor(
    theme,
    'rgba(30, 41, 59, 0.7)',
    'rgba(42, 42, 44, 0.7)',
    'rgba(0, 0, 0, 0.04)',
  ),
  borderRadius: '8px',
  padding: '2px',
  display: 'flex',
  gap: '3px',
  border: `1px solid ${
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : theme.palette.divider
  }`,
  width: '100%',
}));

const ToggleButton = styled(Button)(({ theme }) => ({
  flex: 1,
  color:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.6)'
      : theme.palette.text.secondary,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '11.5px',
  padding: '5px 8px',
  borderRadius: '6px',
  border: 'none',
  boxShadow: 'none',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.04)',
    color: theme.palette.text.primary,
  },
  '&.active': {
    backgroundColor: theme.palette.mode === 'dark' ? '#3b82f6' : '#ffffff',
    color:
      theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.primary.main,
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 2px 8px rgba(59, 130, 246, 0.4)'
        : '0 1px 3px rgba(0, 0, 0, 0.06)',
  },
}));

const getCategoryColor = (category: string) => {
  const normCategory = (category || 'General').toLowerCase().trim();
  switch (normCategory) {
    case 'deep work':
    case 'research':
      return '#8b5cf6'; // purple
    case 'meeting':
    case 'planning':
      return '#3b82f6'; // blue
    case 'design':
    case 'learning':
      return '#f59e0b'; // orange
    case 'development':
    case 'dev':
      return '#2563eb'; // dark blue
    case 'marketing':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // grey
  }
};

interface CalendarSidePanelProps {
  currentView: View | string;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onViewChange: (view: View) => void;
  onAddTaskClick: () => void;
  events: ICalendarEvent[];
  onEventSelect: (event: ICalendarEvent) => void;
  onAIPlannerClick?: () => void;
  onWeeklyPlannerClick?: () => void;
}

export const CalendarSidePanel: React.FC<CalendarSidePanelProps> = ({
  currentView,
  currentDate,
  onDateChange,
  onViewChange,
  onAddTaskClick,
  events,
  onEventSelect,
  onAIPlannerClick,
  onWeeklyPlannerClick,
}) => {
  const { t } = useTranslation();
  const miniWeekDays = useMemo(() => {
    const startOfSelectedWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1 = Monday
    return Array.from({ length: 7 }, (_, i) => addDays(startOfSelectedWeek, i));
  }, [currentDate]);

  const miniMonthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const selectedDayColIndex = useMemo(() => {
    return (getDay(currentDate) + 6) % 7;
  }, [currentDate]);

  const awaitedTasks = useMemo(() => {
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);
    return events.filter((e) => {
      const start = new Date(e.start);
      const end = new Date(e.end);
      return start <= dayEnd && end >= dayStart;
    });
  }, [events, currentDate]);

  return (
    <PanelContainer>
      <PerfectScrollbar
        options={{ wheelPropagation: true }}
        style={{
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          height: '100%',
        }}
      >
        {/* Header Today & Date */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <Typography
            sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary' }}
          >
            {isSameDay(currentDate, new Date())
              ? t('calendar.today')
              : format(currentDate, 'eeee')}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '11.5px' }}
          >
            {format(currentDate, 'd MMMM')}
          </Typography>
        </Box>

        {/* View Toggle */}
        <ViewToggleContainer>
          {(['day', 'week', 'month'] as const).map((v) => (
            <ToggleButton
              key={v}
              className={currentView === v ? 'active' : ''}
              onClick={() => onViewChange(v as View)}
            >
              {v === 'day'
                ? t('calendar.day')
                : v === 'week'
                  ? t('calendar.week')
                  : t('calendar.month')}
            </ToggleButton>
          ))}
        </ViewToggleContainer>

        {/* Add Task */}
        <AddTaskButton onClick={onAddTaskClick} startIcon={<AddIcon sx={{ fontSize: 16 }} />}>
          {t('calendar.addTask')}
        </AddTaskButton>

        {/* Mini Calendar (Week vs Month) */}
        {String(currentView).toLowerCase() === 'month' ? (
          <Box
            sx={{
              p: 1.25,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.01)'
                  : '#ffffff',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Weekday letters */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  textAlign: 'center',
                }}
              >
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((letter, idx) => (
                  <Typography
                    key={idx}
                    variant="caption"
                    sx={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color:
                        idx === selectedDayColIndex
                          ? 'primary.main'
                          : 'text.disabled',
                    }}
                  >
                    {letter}
                  </Typography>
                ))}
              </Box>
              {/* All days of the month grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  rowGap: 0.5,
                  textAlign: 'center',
                }}
              >
                {miniMonthDays.map((dayDate, idx) => {
                  const isSelected = isSameDay(dayDate, currentDate);
                  const isToday = isSameDay(dayDate, new Date());
                  const isCurrentMonth = isSameMonth(dayDate, currentDate);
                  return (
                    <Box
                      key={idx}
                      onClick={() => onDateChange(dayDate)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 24,
                        width: 24,
                        mx: 'auto',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: isSelected || isToday ? 700 : 500,
                        bgcolor: isSelected ? 'primary.main' : 'transparent',
                        color: isSelected
                          ? '#ffffff'
                          : isToday
                            ? 'primary.main'
                            : isCurrentMonth
                              ? 'text.primary'
                              : 'text.disabled',
                        opacity: isCurrentMonth ? 1 : 0.4,
                        border: isToday && !isSelected ? '1px solid' : 'none',
                        borderColor: 'primary.main',
                        transition: 'all 0.15s ease-in-out',
                        '&:hover': {
                          bgcolor: isSelected ? 'primary.main' : 'action.hover',
                        },
                      }}
                    >
                      {format(dayDate, 'd')}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              p: 1.25,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.01)'
                  : '#ffffff',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Weekday letters */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  textAlign: 'center',
                }}
              >
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((letter, idx) => {
                  const dayDate = miniWeekDays[idx];
                  const isSelected = isSameDay(dayDate, currentDate);
                  return (
                    <Typography
                      key={idx}
                      variant="caption"
                      sx={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: isSelected ? 'primary.main' : 'text.disabled',
                      }}
                    >
                      {letter}
                    </Typography>
                  );
                })}
              </Box>
              {/* Weekday day numbers */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  textAlign: 'center',
                }}
              >
                {miniWeekDays.map((dayDate, idx) => {
                  const isSelected = isSameDay(dayDate, currentDate);
                  const isToday = isSameDay(dayDate, new Date());
                  return (
                    <Box
                      key={idx}
                      onClick={() => onDateChange(dayDate)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 24,
                        width: 24,
                        mx: 'auto',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 700,
                        bgcolor: isSelected ? 'primary.main' : 'transparent',
                        color: isSelected
                          ? '#ffffff'
                          : isToday
                            ? 'primary.main'
                            : 'text.primary',
                        border: isToday && !isSelected ? '1px solid' : 'none',
                        borderColor: 'primary.main',
                        transition: 'all 0.15s ease-in-out',
                        '&:hover': {
                          bgcolor: isSelected ? 'primary.main' : 'action.hover',
                        },
                      }}
                    >
                      {format(dayDate, 'd')}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
        {/* Awaited Tasks Section */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1.25,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontSize: '10px',
              }}
            >
              {t('calendar.awaitedTasks')}
            </Typography>
            <Button
              variant="text"
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '11px',
                color: 'primary.main',
                p: 0,
                minWidth: 0,
                '&:hover': {
                  bgcolor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              {t('calendar.viewAll')}
            </Button>
          </Box>

          <Stack
            spacing={1}
            sx={{
              overflowY: 'auto',
              maxHeight: '280px',
              pr: 0.5,
            }}
          >
            {awaitedTasks.length === 0 ? (
              <Box
                sx={{
                  py: 3,
                  px: 1.5,
                  textAlign: 'center',
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '12px' }}
                >
                  {t('calendar.noAwaitedTasks')}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '10.5px' }}>
                  {t('calendar.freeTimeDesc')}
                </Typography>
              </Box>
            ) : (
              awaitedTasks.map((event) => {
                const isTask = event.type === 'task';
                const task = isTask
                  ? (event.resource as { category?: string; status?: string })
                  : null;
                const category = task ? task.category || 'General' : 'Meeting';
                const categoryColor = getCategoryColor(category);

                const formatTime = (date: Date) =>
                  format(new Date(date), 'hh:mm a');
                const timeString = `${formatTime(event.start)} - ${formatTime(event.end)}`;

                return (
                  <Box
                    key={event.id}
                    onClick={() => onEventSelect(event)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.02)'
                          : '#ffffff',
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                        transform: 'translateX(2px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: categoryColor,
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            fontSize: '12px',
                            lineHeight: 1.2,
                            mb: 0.2,
                          }}
                        >
                          {event.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontSize: '10.5px', lineHeight: 1.1 }}
                        >
                          {timeString}
                        </Typography>
                      </Box>
                    </Box>
                    <ChevronRight
                      sx={{ fontSize: 16, color: 'text.disabled', flexShrink: 0 }}
                    />
                  </Box>
                );
              })
            )}
          </Stack>
        </Box>

        {/* Optimize Schedule / Weekly Planner Buttons */}
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 'auto' }}
        >
          <Button
            variant="contained"
            onClick={onAIPlannerClick}
            startIcon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              py: 0.9,
              fontWeight: 700,
              fontSize: '12.5px',
              bgcolor: '#4f46e5',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
              '&:hover': {
                bgcolor: '#4338ca',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
              },
            }}
          >
            {t('calendar.optimizeSchedule')}
          </Button>

          {onWeeklyPlannerClick && (
            <Button
              variant="text"
              onClick={onWeeklyPlannerClick}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                py: 0.5,
                fontWeight: 600,
                fontSize: '11.5px',
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                },
              }}
            >
              {t('calendar.openWeeklyPlanner')}
            </Button>
          )}
        </Box>
      </PerfectScrollbar>
    </PanelContainer>
  );
};

export default CalendarSidePanel;
