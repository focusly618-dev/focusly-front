import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Stack,
  alpha,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  ContentCopy as DuplicateIcon,
  DeleteOutline as DeleteIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  KeyboardArrowDownRounded as ArrowDownIcon,
  CheckCircleRounded as CheckedIcon,
  RadioButtonUncheckedRounded as UncheckedIcon,
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
  getContrastTextColor,
} from './CalendarEvent.styles';

import { resolveSemanticTheme } from './calendarSemanticTheme';

export const CalendarEvent = (props: CalendarEventProps) => {
  const {
    event,
    onStartFocus,
    onDeleteDraft,
    isDeleting: propIsDeleting,
    onDeleteTask,
    currentView,
    isHighlighted,
    onToggleSubtask,
    isExpanded: propIsExpanded,
    onToggleExpand,
  } = props;

  const [localExpanded, setLocalExpanded] = useState(false);
  const isExpanded =
    propIsExpanded !== undefined ? propIsExpanded : localExpanded;

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setLocalExpanded((prev) => !prev);
    }
  };

  const eventRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isHighlighted && eventRef.current) {
      eventRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isHighlighted]);

  useEffect(() => {
    if (isExpanded && eventRef.current) {
      const timer = setTimeout(() => {
        eventRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const isWeekView = currentView === 'week';
  const isMonthView = currentView === 'month';
  const variant = getEventColor(event as { id?: string });
  const formatTime = (date: Date) => {
    return getMinutes(date) === 0
      ? format(date, 'h:mm a')
      : format(date, 'h:mm a');
  };

  const formatMonthTime = (date: Date) => {
    return getMinutes(date) === 0
      ? format(date, 'ha').toLowerCase()
      : format(date, 'h:mma').toLowerCase();
  };

  const {
    theme: semanticTheme,
    tagLabel,
    tagPrefix,
    secondaryTag,
    linkTag,
  } = resolveSemanticTheme(event);

  const durationMinutes = Math.max(
    1,
    Math.round((event.end.getTime() - event.start.getTime()) / 60000),
  );
  const durationFormatted =
    durationMinutes >= 60
      ? `${(durationMinutes / 60).toFixed(durationMinutes % 60 === 0 ? 0 : 1)}h`
      : `${durationMinutes}m`;

  const timeHeader = `${formatTime(event.start)} – ${formatTime(event.end)}${
    durationMinutes >= 60 ? ` (${durationFormatted})` : ''
  }`;

  const taskResource = event.resource as Task | undefined;
  const rawNotes = taskResource?.notes_encrypted || '';
  const cleanNotes = rawNotes.replace(/\[.*?\]/g, '').trim();

  const {
    handleContextMenu,
    handleClose,
    onDuplicate,
    onDelete,
    onPriorityChange,
    handleOnStartFocus,
    isMeeting,
    currentPriority,
    contextMenu,
    isReadOnly,
    isDeleting: contextIsDeleting,
  } = useCalendarContextMenu(event, onStartFocus, onDeleteTask);

  const isDeleting = Boolean(propIsDeleting || contextIsDeleting);

  const isGoogleTask =
    event.type === 'event' ||
    (event.type === 'task' &&
      ((event.resource as Task)?.source === 'google' ||
        (event.resource as Task)?.task_type === 'GoogleTask'));
  const isDraft = event.isDraft;

  const subtasks = taskResource?.subtasks || [];
  const hasSubtasks = event.type === 'task' && subtasks.length > 0;
  const completedSubtasksCount = subtasks.filter((s) => s.completed).length;
  const totalSubtasksCount = subtasks.length;

  const renderClassic = () => {
    const isCustom = variant.isCustom;
    const contrast = isCustom ? getContrastTextColor(variant.main) : null;
    const titleColor = (theme: {
      palette: { mode: string };
      appMode?: string;
    }) =>
      contrast
        ? contrast.primary
        : theme.appMode === 'graydark'
          ? '#f8fafc'
          : theme.palette.mode === 'dark'
            ? '#f8fafc'
            : '#090d16';
    const subtextColor = (theme: {
      palette: { mode: string };
      appMode?: string;
    }) => {
      if (contrast) return contrast.secondary;
      if (theme.appMode === 'graydark') return '#cbd5e1';
      return theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b';
    };

    const renderSubtasksDropdownTrigger = () => {
      if (!hasSubtasks || isMonthView) return null;

      return (
        <Box
          component="button"
          type="button"
          onClick={handleToggleDropdown}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.35,
            px: 0.65,
            py: 0.2,
            borderRadius: '5px',
            cursor: 'pointer',
            border: '1px solid',
            outline: 'none',
            bgcolor: (theme) =>
              isExpanded
                ? theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.16)'
                  : 'rgba(0, 0, 0, 0.1)'
                : theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.05)',
            borderColor: (theme) =>
              isExpanded
                ? theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.3)'
                  : 'rgba(0, 0, 0, 0.2)'
                : theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.14)'
                  : 'rgba(0, 0, 0, 0.08)',
            color: (theme) =>
              theme.palette.mode === 'dark' ? '#f1f5f9' : '#1e293b',
            fontSize: '9.5px',
            fontWeight: 700,
            lineHeight: 1,
            flexShrink: 0,
            transition: 'all 0.15s ease',
            '&:hover': {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.22)'
                  : 'rgba(0, 0, 0, 0.14)',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.28)',
            },
          }}
        >
          <Box component="span" sx={{ userSelect: 'none' }}>
            {completedSubtasksCount}/{totalSubtasksCount}
          </Box>
          <ArrowDownIcon
            sx={{
              fontSize: 13,
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </Box>
      );
    };

    const renderSubtasksPanel = () => {
      if (!hasSubtasks || !isExpanded) return null;

      return (
        <Box
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          sx={{
            mt: 0.75,
            pt: 0.75,
            borderTop: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            width: '100%',
            cursor: 'default',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 0.25,
              mb: 0.2,
            }}
          >
            <Typography
              sx={{
                fontSize: '9px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: subtextColor,
              }}
            >
              Subtareas ({completedSubtasksCount}/{totalSubtasksCount})
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              maxHeight: '142px', // Height for up to 5 subtasks
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              pr: subtasks.length > 5 ? 0.5 : 0,
              flex: 1,
              minHeight: 0,
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': {
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.15)',
                borderRadius: '2px',
              },
            }}
          >
            {subtasks.map((subtask) => (
              <Box
                key={subtask.id}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onToggleSubtask && taskResource) {
                    onToggleSubtask(taskResource.id, subtask.id);
                  }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.6,
                  p: '3.5px 6px',
                  borderRadius: '5px',
                  cursor: onToggleSubtask ? 'pointer' : 'default',
                  bgcolor: (theme) =>
                    subtask.completed
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.02)'
                        : 'rgba(0, 0, 0, 0.02)'
                      : theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.06)'
                        : 'rgba(255, 255, 255, 0.65)',
                  border: '1px solid',
                  borderColor: (theme) =>
                    subtask.completed
                      ? 'transparent'
                      : theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.15s ease',
                  '&:hover': onToggleSubtask
                    ? {
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.12)'
                            : 'rgba(255, 255, 255, 0.95)',
                        borderColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.18)'
                            : 'rgba(0, 0, 0, 0.12)',
                      }
                    : undefined,
                }}
              >
                {subtask.completed ? (
                  <CheckedIcon
                    sx={{ fontSize: 13, color: '#10b981', flexShrink: 0 }}
                  />
                ) : (
                  <UncheckedIcon
                    sx={{ fontSize: 13, color: subtextColor, flexShrink: 0 }}
                  />
                )}

                <Typography
                  sx={{
                    fontSize: '10.5px',
                    fontWeight: 500,
                    color: subtask.completed ? subtextColor : titleColor,
                    textDecoration: subtask.completed ? 'line-through' : 'none',
                    lineHeight: 1.2,
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {subtask.title}
                </Typography>

                {Boolean(subtask.estimate_timer) && (
                  <Typography
                    sx={{
                      fontSize: '9px',
                      fontWeight: 600,
                      color: subtextColor,
                      flexShrink: 0,
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.07)'
                          : 'rgba(0, 0, 0, 0.05)',
                      px: 0.5,
                      py: 0.1,
                      borderRadius: '3px',
                    }}
                  >
                    {subtask.estimate_timer}m
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      );
    };

    return (
      <EventContainer
        ref={eventRef}
        data-highlighted={isHighlighted ? 'true' : undefined}
        data-expanded={hasSubtasks && isExpanded ? 'true' : undefined}
        variant={variant}
        isCustomColor={variant.isCustom}
        semanticTheme={semanticTheme}
        isMeeting={isMeeting}
        isDraft={isDraft}
        onContextMenu={
          isDraft || isDeleting
            ? (e) => {
                e.preventDefault();
                e.stopPropagation();
              }
            : handleContextMenu
        }
        sx={{
          position: 'relative',
          ...(hasSubtasks &&
            isExpanded && {
              height: 'auto !important',
              minHeight: '100% !important',
              overflow: 'visible !important',
              zIndex: 100,
            }),
          p: isMonthView
            ? '2px 6px'
            : isWeekView
              ? '3px 6px'
              : durationMinutes <= 45
                ? '2px 8px'
                : durationMinutes <= 60
                  ? '3px 8px'
                  : '5px 10px',
          pr:
            isDraft || isDeleting
              ? '24px'
              : isMonthView
                ? '6px'
                : isWeekView
                  ? '6px'
                  : durationMinutes <= 60
                    ? '8px'
                    : '10px',
          borderRadius: isMonthView
            ? '4px'
            : durationMinutes <= 40
              ? '8px'
              : '10px',
          borderWidth: isMonthView ? '1px' : undefined,
          boxShadow: isMonthView ? 'none' : undefined,
          minHeight: isMonthView ? '20px' : undefined,
          justifyContent: isMonthView ? 'center' : 'flex-start',
          opacity: isDeleting ? 0.6 : 1,
          pointerEvents: isDeleting ? 'none' : 'auto',
          transition:
            'opacity 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
          cursor: isDeleting ? 'wait' : 'pointer',
          '&:hover': isMonthView
            ? {
                transform: 'none',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
              }
            : undefined,
          ...(isHighlighted && {
            zIndex: 9999,
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? '#94a3b8 !important'
                : '#475569 !important',
            borderWidth: '2px !important',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 0 0 1px rgba(255, 255, 255, 0.15), 0 4px 14px rgba(0, 0, 0, 0.45) !important'
                : '0 0 0 1px rgba(0, 0, 0, 0.12), 0 4px 14px rgba(0, 0, 0, 0.08) !important',
          }),
        }}
      >
        {isDeleting ? (
          <Box
            sx={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(0, 0, 0, 0.65)'
                  : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              zIndex: 30,
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            <CircularProgress
              size={12}
              thickness={5}
              sx={{
                color: (theme) =>
                  theme.palette.mode === 'dark' ? '#f87171' : '#ef4444',
              }}
            />
          </Box>
        ) : (
          isDraft &&
          onDeleteDraft && (
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
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(0, 0, 0, 0.04)',
                zIndex: 10,
                '&:hover': {
                  color: 'error.main',
                  bgcolor: 'rgba(239, 68, 68, 0.12)',
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 12 }} />
            </IconButton>
          )
        )}

        {isMonthView ? (
          /* ── Month View: Single row, start time + title (e.g. "9am Tarea de prueba") ── */
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              width: '100%',
              height: '100%',
              minWidth: 0,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                color: (theme) =>
                  contrast
                    ? contrast.primary
                    : (theme as { appMode?: string }).appMode === 'graydark'
                      ? '#cbd5e1'
                      : theme.palette.mode === 'dark'
                        ? semanticTheme.tagColorDark
                        : semanticTheme.tagColorLight,
                flexShrink: 0,
                lineHeight: 1.2,
              }}
            >
              {formatMonthTime(event.start)}
            </Typography>
            <Typography
              component="span"
              noWrap
              sx={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: titleColor,
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1,
                minWidth: 0,
              }}
            >
              {event.title}
            </Typography>
          </Box>
        ) : isWeekView ? (
          /* ── Week View: Minimalist - Title on Top, Time on Bottom ── */
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: durationMinutes <= 30 ? 'center' : 'flex-start',
              gap: '2px',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                color: titleColor,
                lineHeight: 1.25,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: durationMinutes >= 55 ? 2 : 1,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {event.title}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 0.5,
                width: '100%',
                mt: 'auto',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: subtextColor,
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2,
                }}
              >
                {formatTime(event.start)} - {formatTime(event.end)}
              </Typography>
              {renderSubtasksDropdownTrigger()}
            </Box>
          </Box>
        ) : durationMinutes < 55 ? (
          durationMinutes <= 20 ? (
            /* ── Very Short Task (≤ 20 min): Single Row ── */
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 0.75,
                width: '100%',
                height: isExpanded ? 'auto' : '100%',
                minWidth: 0,
                overflow: isExpanded ? 'visible' : 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  minWidth: 0,
                  overflow: 'hidden',
                  flex: 1,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: subtextColor,
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  {formatTime(event.start)}
                </Typography>
                <Typography
                  component="span"
                  noWrap
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: titleColor,
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {event.title}
                </Typography>
              </Box>
              {renderSubtasksDropdownTrigger()}
            </Box>
          ) : (
            /* ── Medium / Short Task (21 - 54 min): Title on Top, Time on Bottom ── */
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: '2px',
                height: '100%',
                width: '100%',
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              {/* Title on top */}
              <Typography
                sx={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: titleColor,
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: durationMinutes >= 35 ? 2 : 1,
                  WebkitBoxOrient: 'vertical',
                  wordBreak: 'break-word',
                }}
              >
                {event.title}
              </Typography>

              {/* Time on bottom */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 0.5,
                  width: '100%',
                  minWidth: 0,
                  flexShrink: 0,
                  mt: 'auto',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '9.5px',
                    fontWeight: 600,
                    color: subtextColor,
                    whiteSpace: 'nowrap',
                    lineHeight: 1.1,
                    letterSpacing: '0.01em',
                  }}
                >
                  {formatTime(event.start)} – {formatTime(event.end)}
                </Typography>

                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    flexShrink: 0,
                  }}
                >
                  {isGoogleTask && (
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 13,
                        height: 13,
                        borderRadius: '3px',
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.05)',
                        border: '1px solid',
                        borderColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.12)'
                            : 'rgba(0, 0, 0, 0.08)',
                        color: (theme) =>
                          theme.palette.mode === 'dark' ? '#cbd5e1' : '#475569',
                        fontSize: '8px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      G
                    </Box>
                  )}
                  {durationMinutes >= 45 && secondaryTag && (
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '8.5px',
                        fontWeight: 600,
                        color: (theme) =>
                          theme.palette.mode === 'dark' ? '#d4b28c' : '#7c5835',
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(212, 178, 140, 0.12)'
                            : '#fef3c7',
                        px: 0.5,
                        borderRadius: '3px',
                        lineHeight: 1,
                      }}
                    >
                      {secondaryTag}
                    </Box>
                  )}
                  {renderSubtasksDropdownTrigger()}
                </Box>
              </Box>
            </Box>
          )
        ) : (
          /* ── Deep Work / Standard Long Event (≥ 50 min) ── */
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              width: '100%',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Header row with category chip */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 0.5,
                mb: 0.5,
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  minWidth: 0,
                }}
              >
                {isGoogleTask && (
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 16,
                      height: 16,
                      borderRadius: '4px',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)',
                      border: '1px solid',
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.12)'
                          : 'rgba(0, 0, 0, 0.08)',
                      color: (theme) =>
                        theme.palette.mode === 'dark' ? '#cbd5e1' : '#475569',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    G
                  </Box>
                )}

                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.3,
                    fontSize: '10px',
                    fontWeight: 700,
                    color: contrast
                      ? contrast.chipText
                      : (theme) =>
                          theme.palette.mode === 'dark'
                            ? semanticTheme.textColorDark
                            : semanticTheme.textColorLight,
                    bgcolor: (theme) =>
                      contrast
                        ? contrast.chipBg
                        : theme.palette.mode === 'dark'
                          ? semanticTheme.tagBgDark
                          : semanticTheme.tagBgLight,
                    border: '1px solid',
                    borderColor: (theme) =>
                      contrast
                        ? contrast.chipBorder
                        : theme.palette.mode === 'dark'
                          ? semanticTheme.tagBorderDark
                          : semanticTheme.tagBorderLight,
                    px: 0.75,
                    py: 0.2,
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.1,
                  }}
                >
                  {tagPrefix && <span>{tagPrefix}</span>}
                  <span>{tagLabel}</span>
                </Box>

                {secondaryTag && (
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      fontSize: '9.5px',
                      fontWeight: 600,
                      color: 'text.secondary',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.06)',
                      border: '1px solid',
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.12)'
                          : 'rgba(0, 0, 0, 0.08)',
                      px: 0.6,
                      py: 0.15,
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.1,
                    }}
                  >
                    {secondaryTag}
                  </Box>
                )}
              </Box>

              {renderSubtasksDropdownTrigger()}
            </Box>

            {/* Title */}
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 700,
                color: titleColor,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: durationMinutes >= 90 ? 4 : 3,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word',
              }}
            >
              {event.title}
            </Typography>

            {/* Clean Description / Notes */}
            {cleanNotes && durationMinutes >= 90 && (
              <Typography
                sx={{
                  fontSize: '10.5px',
                  fontWeight: 400,
                  color: (theme) =>
                    contrast
                      ? contrast.secondary
                      : (theme as { appMode?: string }).appMode === 'graydark'
                        ? '#cbd5e1'
                        : theme.palette.mode === 'dark'
                          ? semanticTheme.textColorDark
                          : '#475569',
                  lineHeight: 1.35,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  mt: 0.3,
                }}
              >
                {cleanNotes}
              </Typography>
            )}

            {/* Time row (BELOW title and description) */}
            <Typography
              variant="caption"
              sx={{
                fontSize: '10px',
                fontWeight: 600,
                color: subtextColor,
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
                letterSpacing: '0.01em',
                mt: 0.4,
              }}
            >
              {timeHeader}
            </Typography>

            {/* Footer chips: Focused hours / Jira link */}
            {durationMinutes >= 70 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  mt: 'auto',
                  pt: 0.5,
                  flexWrap: 'wrap',
                }}
              >
                {durationMinutes >= 60 && (
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: (theme) =>
                        theme.palette.mode === 'dark' ? '#94a3b8' : '#475569',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.04)',
                      border: '1px solid',
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(0, 0, 0, 0.08)',
                      px: 0.75,
                      py: 0.2,
                      borderRadius: '6px',
                      lineHeight: 1.1,
                    }}
                  >
                    {Math.round(durationMinutes / 60)} horas enfocadas
                  </Box>
                )}

                {linkTag && (
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.25,
                      fontSize: '10px',
                      fontWeight: 600,
                      color: (theme) =>
                        theme.palette.mode === 'dark' ? '#94a3b8' : '#475569',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.04)',
                      border: '1px solid',
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(0, 0, 0, 0.08)',
                      px: 0.75,
                      py: 0.2,
                      borderRadius: '6px',
                      lineHeight: 1.1,
                    }}
                  >
                    🔗 {linkTag}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}

        {renderSubtasksPanel()}
      </EventContainer>
    );
  };

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
