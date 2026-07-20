import {
  Box,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Stack,
  alpha,
  IconButton,
} from '@mui/material';
import {
  ContentCopy as DuplicateIcon,
  DeleteOutline as DeleteIcon,
  Schedule as ScheduleIcon,
  AutoAwesome as AutoAwesomeIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import type { CalendarEventProps } from './CalendarEvent.types';
import type { Task } from '@/redux/tasks/task.types';
import { format, getMinutes } from 'date-fns';
import { useCalendarContextMenu } from './hooks/useCalendarContextMenu';

import {
  getEventColor,
  EventContainer,
  contextMenuSx,
  PRIORITY_COLORS,
} from './CalendarEvent.styles';

export const CalendarEvent = (props: CalendarEventProps) => {
  const { event, onStartFocus, onDeleteDraft } = props;
  const variant = getEventColor(event as { id?: string });
  const formatTime = (date: Date) => {
    return getMinutes(date) === 0
      ? format(date, 'h a')
      : format(date, 'h.mm a');
  };
  const timeRange = `${formatTime(event.start)} - ${formatTime(event.end)}`;

  const {
    handleContextMenu,
    handleClose,
    onDuplicate,
    onDelete,
    onPriorityChange,
    handleOnStartFocus,
    isMeeting,
    isShortEvent,
    startTime,
    currentPriority,
    contextMenu,
    isReadOnly,
  } = useCalendarContextMenu(event, onStartFocus);

  const isAiTask = event.type === 'task' && (event.resource as Task)?.use_ai;
  const isDraft = event.isDraft;

  const renderClassic = () => (
    <EventContainer
      variant={variant}
      isMeeting={isMeeting}
      isDraft={isDraft}
      onContextMenu={
        isDraft
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
            }
          : handleContextMenu
      }
      sx={{
        position: 'relative',
        pr: isDraft ? '24px' : '6px',
      }}
    >
      {isDraft && onDeleteDraft && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteDraft(event.id);
          }}
          sx={{
            position: 'absolute',
            top: 2,
            right: 2,
            padding: '2px',
            color: 'text.secondary',
            zIndex: 10,
            '&:hover': {
              color: 'error.main',
              bgcolor: 'rgba(239, 68, 68, 0.08)',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 12 }} />
        </IconButton>
      )}

      {isShortEvent ? (
        /* ── Short event (< 40 min): time + title in one row ── */
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '4px',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
          }}
        >
          <Box
            sx={{
              fontSize: '10px',
              fontWeight: 600,
              opacity: 0.85,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {startTime}
          </Box>
          {isDraft ? (
            <Typography
              component="span"
              sx={{
                fontSize: '8px',
                fontWeight: 700,
                color: 'primary.main',
                bgcolor: 'rgba(124, 58, 237, 0.1)',
                px: 0.5,
                py: 0.1,
                borderRadius: '3px',
                flexShrink: 0,
              }}
            >
              ✨ IA
            </Typography>
          ) : isAiTask ? (
            <AutoAwesomeIcon
              sx={{
                fontSize: 10,
                color: 'primary.main',
                flexShrink: 0,
              }}
            />
          ) : null}
          <Box
            sx={{
              fontSize: '11px',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flexGrow: 1,
            }}
          >
            {event.title}
          </Box>
        </Box>
      ) : (
        /* ── Normal event (≥ 40 min): time above, title below ── */
        <>
          <Box sx={{ fontSize: '11px', fontWeight: 500, mb: 0.5 }}>
            {timeRange}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 600,
              overflow: 'hidden',
            }}
          >
            {isDraft ? (
              <Typography
                component="span"
                sx={{
                  fontSize: '8px',
                  fontWeight: 700,
                  color: 'primary.main',
                  bgcolor: 'rgba(124, 58, 237, 0.1)',
                  px: 0.5,
                  py: 0.1,
                  borderRadius: '3px',
                  flexShrink: 0,
                }}
              >
                ✨ Sugerencia
              </Typography>
            ) : isAiTask ? (
              <AutoAwesomeIcon
                sx={{
                  fontSize: 12,
                  color: 'primary.main',
                  flexShrink: 0,
                }}
              />
            ) : null}
            <Box
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flexGrow: 1,
              }}
            >
              {event.title}
            </Box>
          </Box>
        </>
      )}
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

        {event.type === 'task' && !isReadOnly && <Divider />}
        {event.type === 'task' && !isReadOnly && (
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

        {!isReadOnly && <Divider />}

        {!isReadOnly && (
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
        )}
      </Menu>
    </>
  );
};
