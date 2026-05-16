import { useState } from 'react';
import {
  Box,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Stack,
  alpha,
} from '@mui/material';
import {
  CalendarToday as CalendarTodayIcon,
  Videocam as VideocamIcon,
  ContentCopy as DuplicateIcon,
  DeleteOutline as DeleteIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

import {
  getEventColor,
  EventContainer,
  contextMenuSx,
  PRIORITY_COLORS,
} from './CalendarEvent.styles';

import type { GoogleCalendarEvent } from '@/redux/calendar/calendar.types';
import type { Task } from '@/redux/tasks/task.types';
import moment from 'moment';
import { useCalendarContextMenu } from './hooks/useCalendarContextMenu';

export interface ICalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: Task | GoogleCalendarEvent;
  type: 'task' | 'event';
  overlapIndex?: number;
  provider?: string;
}

interface CalendarEventProps {
  event: ICalendarEvent;
  title: string;

  continuesPrior?: boolean;
  continuesAfter?: boolean;
  localizer?: unknown;
  slotStart?: Date;
  slotEnd?: Date;
  onStartFocus?: (task: Task) => void;
}

export const CalendarEvent = (props: CalendarEventProps) => {
  const { event, title, onStartFocus } = props;
  const variant = getEventColor(event as { id?: string });
  const timeRange = `${moment(event.start).format('HH:mm')} - ${moment(event.end).format('HH:mm')}`;

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const {
    handleDuplicateTask,
    handleChangePriority,
    handleDeleteTask,
    handleDeleteGoogleEvent,
  } = useCalendarContextMenu();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu(
      contextMenu === null
        ? { mouseX: e.clientX + 2, mouseY: e.clientY - 4 }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const onDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.type === 'task' && event.resource) {
      handleDuplicateTask(event.resource as Task);
    }
    handleClose();
  };

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.id) {
      if (event.type === 'task') {
        handleDeleteTask(event.id);
      } else {
        handleDeleteGoogleEvent(event.id);
      }
    }
    handleClose();
  };

  const onPriorityChange = (e: React.MouseEvent, level: number) => {
    e.stopPropagation();
    if (event.id) {
      handleChangePriority(event.id, level);
    }
    handleClose();
  };

  const handleOnStartFocus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStartFocus && event.type === 'task' && event.resource) {
      onStartFocus(event.resource as Task);
    }
    handleClose();
  };

  const isPast = moment(event.end).isBefore(moment());
  const VIDEO_CALL_DOMAINS =
    /meet\.google\.com|zoom\.us|teams\.microsoft\.com|webex\.com|skype\.com|slack\.com|discord\.com|jit\.si|whereby\.com/i;

  const hasVideoLinkInTask =
    event.type === 'task' &&
    ((event.resource as Task)?.links?.some((link) =>
      VIDEO_CALL_DOMAINS.test(link.url),
    ) ||
      VIDEO_CALL_DOMAINS.test(event.title));

  const isMeeting =
    (event.type === 'event' &&
      !!(
        (event.resource as GoogleCalendarEvent)?.links?.some((link) =>
          VIDEO_CALL_DOMAINS.test(link.url),
        ) ||
        ((event.resource as GoogleCalendarEvent)?.collaborators?.length ?? 0) >
          1
      )) ||
    hasVideoLinkInTask;

  const durationMinutes = (event.end.getTime() - event.start.getTime()) / 60000;
  const isShortEvent = durationMinutes <= 20;
  const startTime = moment(event.start).format('HH:mm');

  const currentPriority =
    event.type === 'task'
      ? (event.resource as Task)?.priority_level
      : undefined;

  const renderClassic = () => (
    <EventContainer
      variant={variant}
      isMeeting={isMeeting}
      overlapIndex={event.overlapIndex}
      onContextMenu={handleContextMenu}
      sx={{
        opacity: isPast ? 0.45 : 1,
        filter: isPast ? 'grayscale(0.2)' : 'none',
        transition: 'opacity 0.2s ease, transform 0.1s ease',
        '&:hover': {
          opacity: 1, // Full opacity on hover even if past
        },
      }}
    >
      <div
        className="event-card-inner"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '4px',
          height: '100%',
          minWidth: 0,
          padding: '4px 4px',
        }}
      >
        {(event.overlapIndex || 0) < 3 && (
          <div
            className="event-icon-container"
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              marginTop: '2px',
            }}
          >
            {isMeeting ? (
              <VideocamIcon
                sx={{ fontSize: '12px', color: '#60A5FA', opacity: 0.9 }}
              />
            ) : (
              <CalendarTodayIcon
                sx={{ fontSize: '10px', opacity: 0.6, color: 'inherit' }}
              />
            )}
          </div>
        )}
        <div
          className="event-info"
          style={{
            minWidth: 0,
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexWrap: isShortEvent ? 'nowrap' : 'wrap',
            }}
          >
            {currentPriority && (
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill={PRIORITY_COLORS[currentPriority as 1 | 2 | 3 | 4]?.main}
                xmlns="http://www.w3.org/2000/svg"
                style={{ flexShrink: 0 }}
              >
                <path d="M12.45 4L12.15 2.52C12.07 2.22 11.8 2 11.5 2H4C3.45 2 3 2.45 3 3V19C3 19.55 3.45 20 4 20H5C5.55 20 6 19.55 6 19V14H10.55L10.85 15.48C10.93 15.78 11.2 16 11.5 16H19C19.55 16 20 15.55 20 15V5C20 4.45 19.55 4 19 4H12.45Z" />
              </svg>
            )}
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                fontSize: '11px',
                lineHeight: 1.2,
                display: 'inline',
                color: 'inherit',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: isShortEvent ? 'nowrap' : 'normal',
                fontFamily: '"Inter", "Roboto", sans-serif',
              }}
              title={title}
            >
              {title} {isShortEvent && startTime}
            </Typography>
          </Box>
          {!isShortEvent && (
            <Typography
              variant="caption"
              sx={{
                fontSize: '9px',
                fontWeight: 500,
                display: 'block',
                opacity: 0.6,
                color: 'inherit',
                lineHeight: 1.1,
                fontFamily: '"Inter", "Roboto Mono", monospace',
                mt: 0.2,
              }}
            >
              {timeRange}
            </Typography>
          )}
        </div>
      </div>
    </EventContainer>
  );

  return (
    <>
      {renderClassic()}

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        sx={contextMenuSx}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.disabled"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Actions
          </Typography>
        </Box>

        {onStartFocus && (
          <MenuItem onClick={handleOnStartFocus}>
            <ScheduleIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            Start Focus
          </MenuItem>
        )}

        {event.type === 'task' && (
          <MenuItem onClick={onDuplicate}>
            <DuplicateIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            Duplicate Task
          </MenuItem>
        )}

        {event.type === 'task' && <Divider />}
        {event.type === 'task' && (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.disabled"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 1.5,
                display: 'block',
              }}
            >
              Set Priority
            </Typography>
            <Stack spacing={0.5}>
              {[
                { level: 4, label: 'Urgent', color: PRIORITY_COLORS[4].main },
                { level: 3, label: 'High', color: PRIORITY_COLORS[3].main },
                { level: 2, label: 'Medium', color: PRIORITY_COLORS[2].main },
                { level: 1, label: 'Low', color: PRIORITY_COLORS[1].main },
              ].map((p) => (
                <MenuItem
                  key={p.level}
                  onClick={(e) => onPriorityChange(e, p.level)}
                  sx={{
                    borderRadius: '6px',
                    mb: 0.2,
                    bgcolor:
                      currentPriority === p.level
                        ? alpha(p.color, 0.08)
                        : 'transparent',
                    '&:hover': { bgcolor: alpha(p.color, 0.12) },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      width: '100%',
                      color:
                        currentPriority === p.level ? p.color : 'text.primary',
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={p.color}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.45 4L12.15 2.52C12.07 2.22 11.8 2 11.5 2H4C3.45 2 3 2.45 3 3V19C3 19.55 3.45 20 4 20H5C5.55 20 6 19.55 6 19V14H10.55L10.85 15.48C10.93 15.78 11.2 16 11.5 16H19C19.55 16 20 15.55 20 15V5C20 4.45 19.55 4 19 4H12.45Z" />
                    </svg>
                    <Typography
                      variant="body2"
                      fontWeight={currentPriority === p.level ? 700 : 500}
                    >
                      {p.label}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Stack>
          </Box>
        )}

        <Divider />

        <MenuItem
          onClick={onDelete}
          sx={{
            color: '#ef4444',
            '&:hover': { bgcolor: alpha('#ef4444', 0.08) },
          }}
        >
          <DeleteIcon sx={{ mr: 1.5, color: '#ef4444' }} />
          Delete {event.type === 'task' ? 'Task' : 'Event'}
        </MenuItem>
      </Menu>
    </>
  );
};
