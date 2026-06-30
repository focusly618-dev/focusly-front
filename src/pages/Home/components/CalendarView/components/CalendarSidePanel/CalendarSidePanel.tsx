import React, { useMemo } from 'react';
import type { View } from 'react-big-calendar';
import type { ICalendarEvent } from '@/pages/Home/components/CalendarEvent';
import {
  Box,
  Button,
  Typography,
  styled,
  useTheme,
  Stack,
  IconButton,
  Paper,
  alpha,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  ChevronLeft,
  ChevronRight,
  Category as CategoryIcon,
  AutoFixHigh as AutoFixHighIcon,
  Groups as GroupsIcon,
  Assignment as AssignmentIcon,
  Brush as BrushIcon,
  Code as CodeIcon,
  TrendingUp as TrendingUpIcon,
  EventNote as EventNoteIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
  isSameWeek,
  startOfMonth,
  addMonths,
  subMonths,
  startOfDay,
  endOfDay,
} from 'date-fns';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

// Styled Components
const PanelContainer = styled(Box)(({ theme }) => ({
  width: '320px',
  borderLeft: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.4)' : '#FAF9F6',
  backdropFilter: theme.palette.mode === 'dark' ? 'blur(16px)' : 'none',
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  [theme.breakpoints.down('md')]: {
    display: 'none', // Hide on smaller screens
  },
}));

const Card = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  boxShadow: 'none',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '14px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '12px',
}));

const AddTaskButton = styled(Button)({
  width: '100%',
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  padding: '12px 16px',
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
  transition: 'all 0.2s ease-in-out',
  gap: 8,
  '&:hover': {
    backgroundColor: '#2563eb',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.35)',
  },
});

const ViewToggleContainer = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(30, 41, 59, 0.7)'
      : 'rgba(0, 0, 0, 0.04)',
  borderRadius: '12px',
  padding: '4px',
  display: 'flex',
  gap: '8px',
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
  fontSize: '12px',
  padding: '8px 16px',
  borderRadius: '8px',
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
        ? '0 4px 12px rgba(59, 130, 246, 0.4)'
        : '0 2px 4px rgba(0, 0, 0, 0.06)',
  },
}));

const EventItemContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  padding: '12px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(0, 0, 0, 0.02)',
    transform: 'translateY(-2px)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
        : '0 4px 12px rgba(0, 0, 0, 0.05)',
    borderColor: theme.palette.primary.main,
  },
}));

const IconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color: string }>(({ color }) => ({
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  backgroundColor: alpha(color, 0.12),
  color: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

const getCategoryIcon = (category: string) => {
  const normCategory = (category || 'General').toLowerCase().trim();
  switch (normCategory) {
    case 'deep work':
      return <AutoFixHighIcon sx={{ fontSize: 16 }} />;
    case 'meeting':
      return <GroupsIcon sx={{ fontSize: 16 }} />;
    case 'admin':
      return <AssignmentIcon sx={{ fontSize: 16 }} />;
    case 'design':
      return <BrushIcon sx={{ fontSize: 16 }} />;
    case 'development':
    case 'dev':
      return <CodeIcon sx={{ fontSize: 16 }} />;
    case 'marketing':
      return <TrendingUpIcon sx={{ fontSize: 16 }} />;
    case 'planning':
      return <EventNoteIcon sx={{ fontSize: 16 }} />;
    case 'research':
      return <PsychologyIcon sx={{ fontSize: 16 }} />;
    case 'learning':
      return <SchoolIcon sx={{ fontSize: 16 }} />;
    case 'personal':
      return <PersonIcon sx={{ fontSize: 16 }} />;
    default:
      return <CategoryIcon sx={{ fontSize: 16 }} />;
  }
};

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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Done':
      return '#22c55e';
    case 'On Hold':
      return '#ef4444';
    case 'Pending':
      return '#f59e0b';
    case 'Planning':
      return '#3b82f6';
    case 'Scheduled':
      return '#8b5cf6';
    case 'Review':
      return '#06b6d4';
    case 'Archived':
      return '#4b5563';
    case 'Todo':
    default:
      return '#6b7280';
  }
};

interface UpcomingTasksProps {
  events: ICalendarEvent[];
  currentDate: Date;
  onEventSelect: (event: ICalendarEvent) => void;
}

const UpcomingTasks: React.FC<UpcomingTasksProps> = ({
  events,
  currentDate,
  onEventSelect,
}) => {
  const dayEvents = useMemo(() => {
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);
    return events.filter((e) => {
      const start = new Date(e.start);
      const end = new Date(e.end);
      return start <= dayEnd && end >= dayStart;
    });
  }, [events, currentDate]);

  const sortedDayEvents = useMemo(() => {
    return [...dayEvents].sort((a, b) => {
      const aStart = new Date(a.start).getTime();
      const bStart = new Date(b.start).getTime();
      return aStart - bStart;
    });
  }, [dayEvents]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <SectionTitle sx={{ mb: 0 }}>Upcoming Insights</SectionTitle>
        <Typography
          variant="caption"
          sx={{
            color: '#3b82f6',
            fontWeight: 600,
          }}
        >
          {sortedDayEvents.length}{' '}
          {sortedDayEvents.length === 1 ? 'Item' : 'Items'}
        </Typography>
      </Box>

      {sortedDayEvents.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            bgcolor: 'transparent',
            border: '1px dashed',
            borderColor: 'divider',
            alignItems: 'center',
            textAlign: 'center',
            py: 4,
            px: 2,
          }}
        >
          <CalendarIcon
            sx={{ fontSize: 28, color: 'text.disabled', mb: 1, opacity: 0.7 }}
          />
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5 }}
          >
            No events scheduled
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              display: 'block',
              maxWidth: '220px',
            }}
          >
            Select another day or click "Add New Task" to schedule items for
            today.
          </Typography>
        </Card>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '260px',
            overflowY: 'auto',
            pr: '6px',
            mr: '-6px',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '5px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(0, 0, 0, 0.08)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.22)'
                  : 'rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          {sortedDayEvents.map((event) => {
            const isTask = event.type === 'task';
            const task = isTask
              ? (event.resource as { category?: string; status?: string })
              : null;
            const category = task ? task.category || 'General' : 'Meeting';
            const status = task ? task.status || 'Todo' : 'Scheduled';
            const categoryColor = getCategoryColor(category);
            const statusColor = getStatusColor(status);

            const formatTime = (date: Date) => {
              return format(new Date(date), 'h:mm a');
            };
            const timeString = `${formatTime(event.start)} - ${formatTime(event.end)}`;

            return (
              <EventItemContainer
                key={event.id}
                onClick={() => onEventSelect(event)}
              >
                <IconWrapper color={categoryColor}>
                  {getCategoryIcon(category)}
                </IconWrapper>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                    sx={{ color: 'text.primary', mb: 0.2 }}
                  >
                    {event.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ color: 'text.secondary', display: 'block' }}
                  >
                    {timeString} • {category}
                  </Typography>
                </Box>
                <Chip
                  label={status}
                  size="small"
                  sx={{
                    height: '18px',
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    borderRadius: '4px',
                    bgcolor: alpha(statusColor, 0.1),
                    color: statusColor,
                    border: `1px solid ${alpha(statusColor, 0.15)}`,
                    flexShrink: 0,
                  }}
                />
              </EventItemContainer>
            );
          })}
        </Box>
      )}
    </Box>
  );
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
  const theme = useTheme();

  const miniCalendarDays = useMemo(() => {
    const startOfCurrentMonth = startOfMonth(currentDate);
    const startOfGrid = startOfWeek(startOfCurrentMonth, { weekStartsOn: 1 }); // 1 = Monday
    return Array.from({ length: 42 }, (_, i) => addDays(startOfGrid, i));
  }, [currentDate]);

  // Handler to change view parameter
  const handleViewChange = (newView: unknown) => {
    onViewChange(newView as View);
  };

  // Handler to change date parameter
  const handleDateClick = (dayDate: Date) => {
    onDateChange(dayDate);
  };

  // Handler to navigate mini-calendar months
  const handlePrevMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };

  // Handler to trigger Task Creation Modal
  const handleAddTaskClick = () => {
    onAddTaskClick();
  };

  return (
    <PanelContainer>
      <PerfectScrollbar
        options={{ wheelPropagation: true }}
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Add New Task Button */}
        <AddTaskButton onClick={handleAddTaskClick} startIcon={<AddIcon />}>
          Add New Task
        </AddTaskButton>

        {/* AI Planners */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={onAIPlannerClick}
            startIcon={<AutoAwesomeIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 3,
              fontWeight: 700,
              py: 1,
              borderColor: 'primary.light',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(124, 58, 237, 0.08)'
                    : 'rgba(124, 58, 237, 0.04)',
              },
            }}
          >
            AI Time Blocking
          </Button>
          <Button
            variant="outlined"
            onClick={onWeeklyPlannerClick}
            startIcon={<CalendarIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 3,
              fontWeight: 700,
              py: 1,
              borderColor: 'primary.light',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(124, 58, 237, 0.08)'
                    : 'rgba(124, 58, 237, 0.04)',
              },
            }}
          >
            AI Weekly Planner
          </Button>
        </Box>

        {/* View Toggle Group */}
        <Box>
          <SectionTitle>Calendar View</SectionTitle>
          <ViewToggleContainer>
            <ToggleButton
              onClick={() => handleViewChange('day')}
              className={currentView === 'day' ? 'active' : ''}
            >
              Day
            </ToggleButton>
            <ToggleButton
              onClick={() => handleViewChange('week')}
              className={currentView === 'week' ? 'active' : ''}
            >
              Week
            </ToggleButton>
            <ToggleButton
              onClick={() => handleViewChange('month')}
              className={currentView === 'month' ? 'active' : ''}
            >
              Month
            </ToggleButton>
          </ViewToggleContainer>
        </Box>

        {/* Mini Calendar Card */}
        <Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.01)'
                  : '#ffffff',
            }}
          >
            {/* Mini Calendar Month Header & Navigation */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ textTransform: 'capitalize' }}
              >
                {format(currentDate, 'MMMM yyyy')}
              </Typography>
              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" onClick={handlePrevMonth}>
                  <ChevronLeft sx={{ fontSize: 18 }} />
                </IconButton>
                <IconButton size="small" onClick={handleNextMonth}>
                  <ChevronRight sx={{ fontSize: 18 }} />
                </IconButton>
              </Stack>
            </Stack>

            {/* Weekdays Labels */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 0.5,
                textAlign: 'center',
                mb: 1,
              }}
            >
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((letter, idx) => (
                <Typography
                  key={idx}
                  variant="caption"
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: 'text.disabled',
                  }}
                >
                  {letter}
                </Typography>
              ))}
            </Box>

            {/* Calendar Grid Days */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 0.5,
                textAlign: 'center',
              }}
            >
              {miniCalendarDays.map((dayDate, idx) => {
                const isSelected = isSameDay(dayDate, currentDate);
                const isToday = isSameDay(dayDate, new Date());
                const isCurrentMonth =
                  dayDate.getMonth() === currentDate.getMonth();
                const isInSelectedWeek =
                  currentView === 'week' &&
                  isSameWeek(dayDate, currentDate, { weekStartsOn: 1 });

                return (
                  <Box
                    key={idx}
                    onClick={() => handleDateClick(dayDate)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      aspectRatio: '1',
                      borderRadius: isSelected ? '50%' : '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: isSelected || isToday ? 700 : 500,
                      transition: 'all 0.15s ease-in-out',
                      bgcolor: isSelected
                        ? theme.palette.primary.main
                        : isInSelectedWeek
                          ? theme.palette.mode === 'dark'
                            ? 'rgba(59, 130, 246, 0.12)'
                            : 'rgba(59, 130, 246, 0.08)'
                          : 'transparent',
                      color: isSelected
                        ? '#ffffff'
                        : !isCurrentMonth
                          ? 'text.disabled'
                          : isToday
                            ? theme.palette.primary.main
                            : 'text.primary',
                      border:
                        isToday && !isSelected
                          ? `1px solid ${alpha(theme.palette.primary.main, 0.4)}`
                          : 'none',
                      '&:hover': {
                        bgcolor: isSelected
                          ? theme.palette.primary.main
                          : theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.04)',
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

        {/* Upcoming Insights card */}
        <UpcomingTasks
          events={events}
          currentDate={currentDate}
          onEventSelect={onEventSelect}
        />
      </PerfectScrollbar>
    </PanelContainer>
  );
};

export default CalendarSidePanel;
