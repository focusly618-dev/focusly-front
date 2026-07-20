import React, { useState } from 'react';
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  type ToolbarProps,
} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfDay,
  addDays,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Components
import { CalendarToolbar } from '../CalendarToolbar';
import { CalendarHeader } from '../CalendarHeader';
import { CalendarEvent, type ICalendarEvent } from '../CalendarEvent';
import { CalendarSlotWrapper } from './components/CalendarSlotWrapper/CalendarSlotWrapper';
import { CalendarSidePanel } from './components/CalendarSidePanel/CalendarSidePanel';
import { CalendarWeeklyPlannerModal } from './components/CalendarWeeklyPlannerModal/CalendarWeeklyPlannerModal';
import type { AITimeBlockItem } from '@/api/AI/apiAIPlanner';

// Material UI
import {
  Box,
  Menu,
  Stack,
  Typography,
  Drawer,
  IconButton,
  Backdrop,
  Button,
  CircularProgress,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

// Styles & Hooks
import { CalendarContainer, DraftActionBar } from './CalendarView.styles';
import { useCalendarView } from './hooks/useCalendarView.hook';
import {
  contextMenuSx,
  priorityCircleSx,
  PRIORITY_COLORS,
} from '../CalendarEvent/CalendarEvent.styles';
import { sileo } from '@/utils';

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

export const CalendarView: React.FC<CalendarViewProps> = ({ onStartFocus }) => {
  const [isWeeklyPlannerOpen, setIsWeeklyPlannerOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const {
    events,
    currentView,
    currentDate,
    handleOnChangeView,
    handleOnNavigate,
    handleSelectSlot,
    handleSelectEvent,
    handleEventDrop,
    handleEventResize,
    isFocusSessionActive,
    handleShowMore,
    slotContextMenu,
    handleSlotContextMenu,
    closeSlotContextMenu,
    handleNavigateAction,
    scrollToTime,
    dayPropGetter,
    handleAddTaskClick,
    tasks,
    draftEvents,
    setDraftEvents,
    isCalendarInDraftMode,
    setIsCalendarInDraftMode,
    handleDeleteDraft,
    confirmDraftEvents,
    clearDraftEvents,
    confirmingDraft,
  } = useCalendarView();

  const [isAILoading, setIsAILoading] = useState(false);

  const handleAIPlanningTrigger = async () => {
    if (isAILoading) return;
    setIsAILoading(true);
    sileo.info({
      title: 'Planificador IA',
      description:
        'Lumina está buscando los mejores espacios de enfoque para tus tareas...',
      duration: 3500,
    });

    try {
      const pendingTasks = tasks.filter((t) => t.status !== 'Done');
      const slots: { start: string; end: string }[] = [];
      const startDay = startOfDay(currentDate);

      for (let d = 0; d < 3; d++) {
        const day = addDays(startDay, d);
        for (let hour = 9; hour < 18; hour++) {
          const slotStart = new Date(day);
          slotStart.setHours(hour, 0, 0, 0);
          const slotEnd = new Date(day);
          slotEnd.setHours(hour + 1, 0, 0, 0);

          // Check overlap with existing events
          const isOverlap = events.some((e) => {
            const eStart = new Date(e.start);
            const eEnd = new Date(e.end);
            return slotStart < eEnd && slotEnd > eStart;
          });

          if (!isOverlap) {
            slots.push({
              start: slotStart.toISOString(),
              end: slotEnd.toISOString(),
            });
          }
        }
      }

      if (pendingTasks.length === 0) {
        sileo.info({
          title: 'Planner',
          description: 'No tienes tareas pendientes para agendar.',
          duration: 3000,
        });
        setIsAILoading(false);
        return;
      }

      if (slots.length === 0) {
        sileo.warning({
          title: 'Sin Disponibilidad',
          description: 'No hay espacios libres en el calendario para agendar.',
          duration: 3000,
        });
        setIsAILoading(false);
        return;
      }

      const { planCalendarAI } = await import('@/api/AI/apiAIPlanner');
      const res = await planCalendarAI(pendingTasks, slots);
      const proposed = res.events || [];

      if (proposed.length === 0) {
        sileo.info({
          title: 'Planner',
          description:
            'No se encontraron sugerencias óptimas de bloques de tiempo.',
          duration: 3000,
        });
        setIsAILoading(false);
        return;
      }

      const mappedDrafts = proposed.map(
        (item: AITimeBlockItem, idx: number) => {
          return {
            id: `draft-${item.taskId || idx}-${Date.now()}`,
            title: item.title,
            start: new Date(item.startTime),
            end: new Date(item.endTime),
            allDay: false,
            resource: item.taskId
              ? tasks.find((t) => t.id === item.taskId)
              : undefined,
            type: 'task' as const,
            isDraft: true,
          };
        },
      );

      setDraftEvents(mappedDrafts);
      setIsCalendarInDraftMode(true);

      sileo.success({
        title: 'Borrador Generado',
        description:
          'Lumina ha distribuido tus tareas. Revisa, ajusta o confirma tu agenda.',
        duration: 5000,
      });
    } catch (e) {
      console.error('Error generating AI schedule:', e);
      sileo.error({
        title: 'Error de Planeación',
        description: 'No se pudo generar la propuesta de bloques de tiempo.',
        duration: 4000,
      });
    } finally {
      setIsAILoading(false);
    }
  };

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

  console.log(events);
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
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1200,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        open={isAILoading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="body2" fontWeight={500}>
          Lumina AI está organizando tus tareas en el calendario...
        </Typography>
      </Backdrop>

      {isCalendarInDraftMode && (
        <DraftActionBar>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            ✨ Lumina propuso {draftEvents.length} bloques de enfoque
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={clearDraftEvents}
              disabled={confirmingDraft}
              sx={{
                textTransform: 'none',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '0.75rem',
                color: 'text.secondary',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'error.light',
                  bgcolor: 'rgba(239, 68, 68, 0.04)',
                  color: 'error.main',
                },
              }}
            >
              Descartar
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={confirmDraftEvents}
              disabled={confirmingDraft}
              sx={{
                textTransform: 'none',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.75rem',
                bgcolor: 'primary.main',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  boxShadow: 'none',
                },
              }}
            >
              {confirmingDraft ? 'Agendando...' : 'Confirmar Agenda 🚀'}
            </Button>
          </Stack>
        </DraftActionBar>
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
        {/* Top Header */}
        <Box
          sx={{
            px: 3,
            pt: 3,
            pb: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}
            >
              Calendar
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                display: { xs: 'none', md: 'block' },
              }}
            >
              Stay Organized and On Track with Your Personalized Calendar
            </Typography>
          </Box>
          <IconButton
            onClick={() => setIsSidePanelOpen(true)}
            sx={{
              display: { xs: 'flex', md: 'none' },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              p: 1,
              color: 'text.secondary',
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100% - 90px)', // Fill remaining height below header
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
          <DnDCalendar
            localizer={localizer}
            events={events}
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
            scrollToTime={scrollToTime}
            dayPropGetter={dayPropGetter}
            resizable
            selectable
            showAllEvents={false}
            doShowMoreDrillDown={false}
            dayLayoutAlgorithm="overlap"
            showMultiDayTimes={true}
            components={{
              toolbar: (props: ToolbarProps<ICalendarEvent>) => (
                <CalendarToolbar
                  {...props}
                  isSessionActive={isFocusSessionActive}
                  onNavigateAction={handleNavigateAction}
                />
              ),
              header: CalendarHeader,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              event: (props: any) => (
                <CalendarEvent
                  {...props}
                  onStartFocus={onStartFocus}
                  currentView={currentView}
                  onDeleteDraft={handleDeleteDraft}
                />
              ),
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              timeSlotWrapper: (props: any) => (
                <CalendarSlotWrapper
                  {...props}
                  onContextMenu={handleSlotContextMenu}
                />
              ),
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              dateCellWrapper: (props: any) => (
                <CalendarSlotWrapper
                  {...props}
                  onContextMenu={handleSlotContextMenu}
                />
              ),
            }}
            step={5}
            timeslots={12}
            onShowMore={handleShowMore}
            popup={false}
            messages={{
              showMore: (count: number) => `+${count} más`,
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
              Quick Create Task
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
          onAIPlannerClick={handleAIPlanningTrigger}
          onWeeklyPlannerClick={() => setIsWeeklyPlannerOpen(true)}
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
            width: '320px',
            boxSizing: 'border-box',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#0f172a' : '#faf9f6',
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
            handleAIPlanningTrigger();
            setIsSidePanelOpen(false);
          }}
          onWeeklyPlannerClick={() => {
            setIsWeeklyPlannerOpen(true);
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
    </Box>
  );
};

export default CalendarView;
