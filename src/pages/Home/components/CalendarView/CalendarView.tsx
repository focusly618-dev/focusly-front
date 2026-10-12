import { calendarPlanService } from '@/services/calendarPlanService';
import React, {
  useState,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { format, parse, startOfWeek, getDay, addDays, isToday } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Components
import { CalendarHeader } from '../CalendarHeader';
import {
  CalendarEvent,
  CalendarEventSkeleton,
  type ICalendarEvent,
} from '../CalendarEvent';
import { CalendarSlotWrapper } from './components/CalendarSlotWrapper/CalendarSlotWrapper';
import { CalendarSidePanel } from './components/CalendarSidePanel/CalendarSidePanel';
import { AIPlanPanel } from './components/AIPlanPanel/AIPlanPanel';
import { CalendarWeeklyPlannerModal } from './components/CalendarWeeklyPlannerModal/CalendarWeeklyPlannerModal';
import { AwaitedTasksModal } from './components/AwaitedTasksModal';
import { surfaceColor } from '@/context';

// Material UI
import {
  Box,
  Menu,
  Stack,
  Typography,
  Drawer,
  Button,
  IconButton,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

// Styles & Hooks
import { CalendarContainer, CalendarTopBar } from './CalendarView.styles';
import { useCalendarView } from './hooks/useCalendarView.hook';
import { useAIScheduler } from './hooks/useAIScheduler.hook';
import {
  contextMenuSx,
  priorityCircleSx,
  PRIORITY_COLORS,
} from '../CalendarEvent/CalendarEvent.styles';

// Types
import type { Task } from '@/redux/tasks/task.types';

const locales = {
  'en-US': enUS,
};

// Setup the localizer with Monday as first day of week
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop<ICalendarEvent, object>(Calendar);

interface CalendarViewProps {
  onStartFocus: (task: Task) => void;
}

interface CalendarEventsContextValue {
  onStartFocus: (task: Task) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentView: any;
  handleDeleteDraft: (id: string) => void;
  handleDeleteTask: (id: string) => void;
  handleToggleSubtask?: (taskId: string, subtaskId: string) => void;
  expandedTaskId: string | null;
  handleToggleExpandTask: (taskId: string) => void;
  hoveredEventId: string | null;
  deletingTaskIds?: string[];
  handleSlotContextMenu: (
    e: React.MouseEvent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    slotInfo: any,
  ) => void;
}

const CalendarEventsContext =
  React.createContext<CalendarEventsContextValue | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StableCalendarEvent = (props: any) => {
  const ctx = React.useContext(CalendarEventsContext);
  if (!ctx) return null;

  if (props.event.type === 'skeleton') {
    return (
      <CalendarEventSkeleton
        colorIndex={Number(props.event.id.split('-')[1]) || 0}
      />
    );
  }

  const isExpanded = Boolean(
    ctx.expandedTaskId &&
    (props.event.id === ctx.expandedTaskId ||
      (props.event.resource &&
        'id' in props.event.resource &&
        (props.event.resource as { id: string }).id === ctx.expandedTaskId)),
  );

  const isHighlighted =
    ctx.hoveredEventId !== null &&
    (props.event.id === ctx.hoveredEventId ||
      Boolean(
        props.event.resource &&
        'id' in props.event.resource &&
        (props.event.resource as { id: string }).id === ctx.hoveredEventId,
      ) ||
      Boolean(
        props.event.resource &&
        'google_event_id' in props.event.resource &&
        (props.event.resource as { google_event_id: string })
          .google_event_id === ctx.hoveredEventId,
      ));

  const isDeleting =
    ctx.deletingTaskIds?.includes(props.event.id) ||
    Boolean(
      props.event.resource &&
      'id' in props.event.resource &&
      ctx.deletingTaskIds?.includes(
        (props.event.resource as { id: string }).id,
      ),
    ) ||
    Boolean(
      props.event.resource &&
      'google_event_id' in props.event.resource &&
      ctx.deletingTaskIds?.includes(
        (props.event.resource as { google_event_id: string }).google_event_id,
      ),
    );

  const handleToggleExpand = () => {
    const taskId =
      props.event.resource && 'id' in props.event.resource
        ? (props.event.resource as { id: string }).id
        : props.event.id;
    ctx.handleToggleExpandTask(taskId);
  };

  return (
    <CalendarEvent
      {...props}
      onStartFocus={ctx.onStartFocus}
      currentView={ctx.currentView}
      onDeleteDraft={ctx.handleDeleteDraft}
      onDeleteTask={ctx.handleDeleteTask}
      onToggleSubtask={ctx.handleToggleSubtask}
      isExpanded={isExpanded}
      onToggleExpand={handleToggleExpand}
      isHighlighted={isHighlighted}
      isDeleting={isDeleting}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StableSlotWrapper = (props: any) => {
  const ctx = React.useContext(CalendarEventsContext);
  return (
    <CalendarSlotWrapper
      {...props}
      onContextMenu={ctx?.handleSlotContextMenu}
    />
  );
};

export const CalendarView: React.FC<CalendarViewProps> = ({ onStartFocus }) => {
  const { t, i18n } = useTranslation();
  const [isWeeklyPlannerOpen, setIsWeeklyPlannerOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isAwaitedTasksModalOpen, setIsAwaitedTasksModalOpen] = useState(false);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const {
    events,
    skeletonEvents,
    isCalendarLoading,
    currentView,
    currentDate,
    handleOnChangeView,
    handleOnNavigate,
    handleSelectSlot,
    handleSelectEvent,
    handleEventDrop,
    handleEventResize,
    handleShowMore,
    slotContextMenu,
    handleSlotContextMenu,
    closeSlotContextMenu,
    scrollToTime,
    dayPropGetter,
    slotPropGetter,
    workHoursConfig,
    handleAddTaskClick,
    tasks,
    isCalendarInDraftMode,
    handleDeleteDraft,
    handleToggleSubtask,
    confirmDraftEvents,
    clearDraftEvents,
    confirmingDraft,
    deletingTaskIds,
    handleDeleteTask,
    expandedTaskId,
    handleToggleExpandTask,
  } = useCalendarView();

  const calendarEventsContextValue = useMemo<CalendarEventsContextValue>(
    () => ({
      onStartFocus,
      currentView,
      handleDeleteDraft,
      handleDeleteTask,
      handleToggleSubtask,
      expandedTaskId,
      handleToggleExpandTask,
      hoveredEventId,
      deletingTaskIds,
      handleSlotContextMenu,
    }),
    [
      onStartFocus,
      currentView,
      handleDeleteDraft,
      handleDeleteTask,
      handleToggleSubtask,
      expandedTaskId,
      handleToggleExpandTask,
      hoveredEventId,
      deletingTaskIds,
      handleSlotContextMenu,
    ],
  );

  const calendarComponents = useMemo(
    () => ({
      header: CalendarHeader,
      event: StableCalendarEvent,
      timeSlotWrapper: StableSlotWrapper,
      dateCellWrapper: StableSlotWrapper,
    }),
    [],
  );

  const isCurrentDateToday = isToday(currentDate);

  const formattedDateTitle = useMemo(() => {
    try {
      const isSpanish = !i18n.language || i18n.language.startsWith('es');
      if (isSpanish) {
        const dayOfWeek = format(currentDate, 'EEEE', { locale: es });
        const dayOfMonth = format(currentDate, 'd');
        const month = format(currentDate, 'MMMM', { locale: es });
        const capDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
        const capMonth = month.charAt(0).toUpperCase() + month.slice(1);
        return `${capDay}, ${dayOfMonth} de ${capMonth}`;
      }
      return format(currentDate, 'EEEE, MMMM d', { locale: enUS });
    } catch {
      return format(currentDate, 'EEEE, d MMMM');
    }
  }, [currentDate, i18n.language]);

  useEffect(() => {
    const BADGE_ID = 'rbc-time-badge-live';

    const updateTimeBadge = () => {
      const indicator = document.querySelector('.rbc-current-time-indicator');
      const gutter = document.querySelector('.rbc-time-gutter');
      if (!indicator || !gutter) return;

      // Get the indicator's vertical position relative to .rbc-time-content
      const timeContent = indicator.closest('.rbc-time-content');
      if (!timeContent) return;

      const contentRect = timeContent.getBoundingClientRect();
      const indicatorRect = indicator.getBoundingClientRect();
      const topOffset =
        indicatorRect.top - contentRect.top + timeContent.scrollTop;

      // Create or reuse the badge element
      let badge = document.getElementById(BADGE_ID);
      if (!badge) {
        badge = document.createElement('div');
        badge.id = BADGE_ID;
        badge.className = 'rbc-time-badge';
        // Place it inside the gutter's first timeslot-group parent for proper positioning
        const gutterColumn = gutter as HTMLElement;
        gutterColumn.style.position = 'relative';
        gutterColumn.appendChild(badge);
      }

      badge.textContent = format(new Date(), 'h:mm a');
      badge.style.top = `${topOffset}px`;
    };

    // Initial + delayed retry
    updateTimeBadge();
    const retryTimeout = setTimeout(updateTimeBadge, 500);
    const interval = setInterval(updateTimeBadge, 20000);

    // Re-sync when the library re-renders the indicator
    const observer = new MutationObserver(() => {
      requestAnimationFrame(updateTimeBadge);
    });
    const timeContent = document.querySelector('.rbc-time-content');
    if (timeContent) {
      observer.observe(timeContent, { childList: true, subtree: true });
    }

    // Re-sync on scroll (the indicator moves with scroll)
    const handleScroll = () => requestAnimationFrame(updateTimeBadge);
    timeContent?.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(retryTimeout);
      clearInterval(interval);
      observer.disconnect();
      timeContent?.removeEventListener('scroll', handleScroll);
      document.getElementById(BADGE_ID)?.remove();
    };
  }, [currentView, currentDate]);

  const aiScheduler = useAIScheduler({
    events,
    currentDate,
    workHours: workHoursConfig,
  });
  // Tells Lumina's background run whether the user is looking (see
  // calendarPlanService.isCalendarOpen).
  useEffect(() => calendarPlanService.attachCalendar(), []);
  const planState = useSyncExternalStore(
    calendarPlanService.subscribe,
    calendarPlanService.getSnapshot,
  );
  const showPlan = aiScheduler.isPlanning || isCalendarInDraftMode;
  const renderPlan = (variant: 'panel' | 'floating') => (
    <AIPlanPanel
      variant={variant}
      plan={planState}
      confirming={confirmingDraft}
      onCancel={aiScheduler.cancel}
      onConfirm={confirmDraftEvents}
      onDiscard={clearDraftEvents}
      onToggle={(id) => calendarPlanService.toggleExcluded(id)}
      onFocus={(draft) => {
        handleOnNavigate(draft.start);
        setHoveredEventId(draft.id);
      }}
      onHover={setHoveredEventId}
    />
  );
  const aiPlannerHint = aiScheduler.isPro
    ? undefined
    : aiScheduler.freeMessagesLeft === 0
      ? t('calendar.optimizeProOnly')
      : t('calendar.optimizeFreeHint', {
          count: aiScheduler.freeMessagesLeft ?? 0,
        });

  const handleCreateTaskAtSlot = (priority?: number) => {
    if (slotContextMenu) {
      const start = slotContextMenu.date;
      const end = new Date(start.getTime() + 30 * 60000); // Default 30 mins

      const params: {
        action: string;
        start: string;
        end: string;
        priority?: number;
      } = {
        action: 'create',
        start: start.toISOString(),
        end: end.toISOString(),
      };

      if (priority) {
        params.priority = priority;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleSelectSlot(params as any);
      closeSlotContextMenu();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Lumina working: a bar over the calendar, which stays usable. */}
      {/* Small screens: Lumina's progress or proposal as a card over the
          calendar (the side panel shows it on larger ones). */}
      {showPlan && (
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 12,
            zIndex: 1100,
          }}
        >
          {renderPlan('floating')}
        </Box>
      )}
      <CalendarContainer
        isDayView={currentView === Views.DAY}
        sx={{
          flexGrow: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CalendarTopBar>
          {/* Left: Date Title & Navigation Stepper */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.15rem' },
                color: 'text.primary',
                letterSpacing: '-0.02em',
              }}
            >
              {formattedDateTitle}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleOnNavigate(new Date())}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '12px',
                  height: '30px',
                  px: 1.25,
                  minWidth: 0,
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.12)',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(99, 102, 241, 0.08)'
                        : 'rgba(99, 102, 241, 0.04)',
                  },
                }}
              >
                {t('calendar.today', 'Hoy')}
              </Button>

              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.04)',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.08)',
                  p: '1px',
                  height: '30px',
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleOnNavigate(addDays(currentDate, -1))}
                  sx={{ p: 0.5, color: 'text.secondary' }}
                >
                  <ChevronLeftIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    px: 0.75,
                    fontWeight: 600,
                    fontSize: '12px',
                    color: 'text.primary',
                    userSelect: 'none',
                  }}
                >
                  {isCurrentDateToday
                    ? t('calendar.today', 'Hoy')
                    : format(currentDate, 'd MMM')}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleOnNavigate(addDays(currentDate, 1))}
                  sx={{ p: 0.5, color: 'text.secondary' }}
                >
                  <ChevronRightIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Stack>
          </Stack>
        </CalendarTopBar>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%', // Fill remaining height below header
            position: 'relative',
            overflowX: 'auto', // Allow horizontal scroll on small devices
            overflowY: 'hidden', // Contain vertical overflow inside big-calendar
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(0, 0, 0, 0.1)',
              borderRadius: '3px',
            },
          }}
        >
          <CalendarEventsContext.Provider value={calendarEventsContextValue}>
            <DnDCalendar
              localizer={localizer}
              toolbar={false}
              events={
                isCalendarLoading ? [...events, ...skeletonEvents] : events
              }
              startAccessor="start"
              endAccessor="end"
              view={currentView}
              onView={handleOnChangeView}
              date={currentDate}
              onNavigate={(newDate) => handleOnNavigate(newDate as Date)}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              onEventDrop={handleEventDrop}
              onEventResize={handleEventResize}
              draggableAccessor={(event: ICalendarEvent) =>
                event.type !== 'skeleton'
              }
              resizableAccessor={(event: ICalendarEvent) =>
                event.type !== 'skeleton'
              }
              scrollToTime={scrollToTime}
              dayPropGetter={dayPropGetter}
              slotPropGetter={slotPropGetter}
              resizable
              selectable
              showAllEvents={false}
              doShowMoreDrillDown={false}
              dayLayoutAlgorithm="no-overlap"
              showMultiDayTimes={true}
              components={calendarComponents}
              step={5}
              timeslots={12}
              onShowMore={handleShowMore}
              popup={false}
              messages={{
                showMore: (count: number) => t('calendar.showMore', { count }),
              }}
              formats={{
                timeGutterFormat: (
                  date: Date,
                  culture?: string,
                  localizer?: {
                    format: (
                      date: Date,
                      format: string,
                      culture?: string,
                    ) => string;
                  },
                ) => (localizer ? localizer.format(date, 'h a', culture) : ''),
              }}
            />
          </CalendarEventsContext.Provider>
        </Box>

        <Menu
          open={slotContextMenu !== null}
          onClose={closeSlotContextMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            slotContextMenu !== null
              ? { top: slotContextMenu.mouseY, left: slotContextMenu.mouseX }
              : undefined
          }
          sx={contextMenuSx}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                display: 'block',
                mb: 0.5,
                lineHeight: 1.2,
                letterSpacing: '0.05em',
                fontSize: '10px',
              }}
            >
              {t('calendar.quickCreateTask')}
            </Typography>

            <Stack
              direction="row"
              spacing={1.5}
              justifyContent="center"
              sx={{ mt: 1 }}
            >
              {[1, 2, 3, 4].map((level) => (
                <Box
                  key={level}
                  onClick={() => handleCreateTaskAtSlot(level)}
                  sx={priorityCircleSx(PRIORITY_COLORS[level].main, false)}
                />
              ))}
            </Stack>
          </Box>
        </Menu>
      </CalendarContainer>

      {/* Desktop Sidebar (In-flow) */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <CalendarSidePanel
          currentView={currentView}
          currentDate={currentDate}
          onDateChange={handleOnNavigate}
          onViewChange={handleOnChangeView}
          onAddTaskClick={handleAddTaskClick}
          events={events}
          onEventSelect={handleSelectEvent}
          onAIPlannerClick={aiScheduler.plan}
          isAIPlanning={aiScheduler.isPlanning}
          aiPlannerHint={aiPlannerHint}
          planPanel={showPlan ? renderPlan('panel') : undefined}
          onWeeklyPlannerClick={() => setIsWeeklyPlannerOpen(true)}
          hoveredEventId={hoveredEventId}
          onHoverEvent={setHoveredEventId}
          onToggleSubtask={handleToggleSubtask}
          onViewAllClick={() => setIsAwaitedTasksModalOpen(true)}
        />
      </Box>

      {/* Mobile Overlay Side Panel Drawer */}
      <Drawer
        anchor="right"
        open={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: '260px',
            boxSizing: 'border-box',
            backgroundColor: (theme) =>
              surfaceColor(theme, '#0f172a', '#19191A', '#faf9f6'),
          },
        }}
      >
        <CalendarSidePanel
          currentView={currentView}
          currentDate={currentDate}
          onDateChange={(date) => {
            handleOnNavigate(date);
            setIsSidePanelOpen(false);
          }}
          onViewChange={(view) => {
            handleOnChangeView(view);
            setIsSidePanelOpen(false);
          }}
          onAddTaskClick={() => {
            handleAddTaskClick();
            setIsSidePanelOpen(false);
          }}
          events={events}
          onEventSelect={(event) => {
            handleSelectEvent(event);
            setIsSidePanelOpen(false);
          }}
          onAIPlannerClick={() => {
            void aiScheduler.plan();
            setIsSidePanelOpen(false);
          }}
          isAIPlanning={aiScheduler.isPlanning}
          aiPlannerHint={aiPlannerHint}
          planPanel={showPlan ? renderPlan('panel') : undefined}
          onWeeklyPlannerClick={() => {
            setIsWeeklyPlannerOpen(true);
            setIsSidePanelOpen(false);
          }}
          hoveredEventId={hoveredEventId}
          onHoverEvent={setHoveredEventId}
          onToggleSubtask={handleToggleSubtask}
          onViewAllClick={() => {
            setIsAwaitedTasksModalOpen(true);
            setIsSidePanelOpen(false);
          }}
        />
      </Drawer>

      <CalendarWeeklyPlannerModal
        open={isWeeklyPlannerOpen}
        onClose={() => setIsWeeklyPlannerOpen(false)}
        tasks={tasks}
        currentDate={currentDate}
      />

      <AwaitedTasksModal
        open={isAwaitedTasksModalOpen}
        onClose={() => setIsAwaitedTasksModalOpen(false)}
        currentDate={currentDate}
        events={events}
        onSelectEvent={handleSelectEvent}
        onToggleSubtask={handleToggleSubtask}
      />
    </Box>
  );
};

export default CalendarView;
