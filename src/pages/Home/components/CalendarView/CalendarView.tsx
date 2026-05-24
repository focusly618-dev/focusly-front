import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Components
import { CalendarToolbar } from '../CalendarToolbar';
import { CalendarHeader } from '../CalendarHeader';
import { CalendarEvent } from '../CalendarEvent';
import { CalendarSidePanel } from './components/CalendarSidePanel/CalendarSidePanel';
import { CalendarSlotWrapper } from './components/CalendarSlotWrapper/CalendarSlotWrapper';

// Material UI
import { Box, Menu, Stack, Typography } from '@mui/material';

// Styles & Hooks
import { CalendarContainer } from './CalendarView.styles';
import { useCalendarView } from './hooks/useCalendarView.hook';
import {
  contextMenuSx,
  priorityCircleSx,
  PRIORITY_COLORS,
} from '../CalendarEvent/CalendarEvent.styles';

// Types
import type { ICalendarEvent } from '../CalendarEvent/CalendarEvent';
import type { ToolbarProps } from 'react-big-calendar';
import type { Task } from '@/redux/tasks/task.types';

// Setup the localizer
const localizer = momentLocalizer(moment);

const DnDCalendar = withDragAndDrop<ICalendarEvent, object>(Calendar);

interface CalendarViewProps {
  onStartFocus: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onStartFocus }) => {
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
  } = useCalendarView();

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
    <CalendarContainer isDayView={currentView === Views.DAY}>
      {/* Top Header */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}
          >
            Calendar
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Stay Organized and On Track with Your Personalized Calendar
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
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
          resizable
          selectable
          showAllEvents={false}
          doShowMoreDrillDown={false}
          dayLayoutAlgorithm="overlap"
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
            ) => (localizer ? localizer.format(date, 'h A', culture) : ''),
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

      <Box id="joyride-side-panel">
        <CalendarSidePanel />
      </Box>
    </CalendarContainer>
  );
};

export default CalendarView;
