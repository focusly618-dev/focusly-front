import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  LinearProgress,
  Stack,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  CheckCircleRounded as CheckedIcon,
  RadioButtonUncheckedRounded as UncheckedIcon,
  Schedule as ScheduleIcon,
  AssignmentTurnedIn as AssignmentIcon,
  KeyboardArrowDownRounded as ArrowDownIcon,
  FlagRounded as FlagIcon,
} from '@mui/icons-material';
import { format, isToday, startOfDay, endOfDay } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { surfaceColor } from '@/context';
import type { ICalendarEvent } from '@/pages/Home/components/CalendarEvent';
import type { Task } from '@/redux/tasks/task.types';
import { PRIORITY_COLORS } from '@/pages/Home/components/CalendarEvent/CalendarEvent.styles';

interface AwaitedTasksModalProps {
  open: boolean;
  onClose: () => void;
  currentDate: Date;
  events: ICalendarEvent[];
  onSelectEvent: (event: ICalendarEvent) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

type FilterStatus = 'all' | 'pending' | 'completed';

export const AwaitedTasksModal: React.FC<AwaitedTasksModalProps> = ({
  open,
  onClose,
  currentDate,
  events,
  onSelectEvent,
  onToggleSubtask,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selectedPriority, setSelectedPriority] = useState<number | 'all'>(
    'all',
  );
  const [expandedSubtasks, setExpandedSubtasks] = useState<
    Record<string, boolean>
  >({});

  const isSpanish = !i18n.language || i18n.language.startsWith('es');
  const dateLocale = isSpanish ? es : enUS;

  // Filter events scheduled for the current day that are tasks
  const dailyTasks = useMemo(() => {
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);

    return events.filter((e) => {
      if (e.type !== 'task') return false;
      const start = new Date(e.start);
      const end = new Date(e.end);
      return start <= dayEnd && end >= dayStart;
    });
  }, [events, currentDate]);

  // Compute metrics
  const totalTasksCount = dailyTasks.length;
  const completedTasksCount = dailyTasks.filter((e) => {
    const task = e.resource as Task | undefined;
    return task?.status === 'Done';
  }).length;

  const totalSubtasksCount = dailyTasks.reduce((acc, e) => {
    const task = e.resource as Task | undefined;
    return acc + (task?.subtasks?.length || 0);
  }, 0);

  const completedSubtasksCount = dailyTasks.reduce((acc, e) => {
    const task = e.resource as Task | undefined;
    return acc + (task?.subtasks?.filter((s) => s.completed).length || 0);
  }, 0);

  const taskProgressPercent =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  // Filter tasks based on search, status, and priority
  const filteredTasks = useMemo(() => {
    return dailyTasks.filter((event) => {
      const task = event.resource as Task | undefined;
      const isCompleted = task?.status === 'Done';

      // Status filter
      if (statusFilter === 'pending' && isCompleted) return false;
      if (statusFilter === 'completed' && !isCompleted) return false;

      // Priority filter
      if (
        selectedPriority !== 'all' &&
        task?.priority_level !== selectedPriority
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = event.title?.toLowerCase().includes(query);
        const matchesSubtask = task?.subtasks?.some((s) =>
          s.title.toLowerCase().includes(query),
        );
        if (!matchesTitle && !matchesSubtask) return false;
      }

      return true;
    });
  }, [dailyTasks, statusFilter, selectedPriority, searchQuery]);

  const toggleSubtasksList = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSubtasks((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const formattedDateTitle = useMemo(() => {
    const isCurrentToday = isToday(currentDate);
    const dayText = format(currentDate, "EEEE, d 'de' MMMM", {
      locale: dateLocale,
    });
    const capitalized = dayText.charAt(0).toUpperCase() + dayText.slice(1);
    return isCurrentToday ? `Hoy • ${capitalized}` : capitalized;
  }, [currentDate, dateLocale]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: surfaceColor(
            theme,
            'rgba(15, 23, 42, 0.95)',
            'rgba(25, 25, 26, 0.95)',
            'rgba(255, 255, 255, 0.98)',
          ),
          backgroundImage: 'none',
          backdropFilter: 'blur(16px)',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: isDark
            ? '0 24px 48px -12px rgba(0, 0, 0, 0.8)'
            : '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: 2.5,
          pb: 1.5,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '17px' }}>
              {t('calendar.awaitedTasks')}
            </Typography>
            <Chip
              label={`${dailyTasks.length}`}
              size="small"
              sx={{
                height: 20,
                fontSize: '11px',
                fontWeight: 700,
                bgcolor: isDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.06)',
                color: 'text.secondary',
              }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '12px',
              mt: 0.2,
            }}
          >
            {formattedDateTitle}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Progress Metric Card */}
      <Box sx={{ px: 2.5, pb: 1.5 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: '10px',
            bgcolor: isDark
              ? 'rgba(255, 255, 255, 0.03)'
              : 'rgba(0, 0, 0, 0.02)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 0.8,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                fontSize: '11.5px',
              }}
            >
              Progreso de la jornada
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'primary.main', fontSize: '12px' }}
            >
              {completedTasksCount}/{totalTasksCount} tareas (
              {taskProgressPercent}%)
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={taskProgressPercent}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.06)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor:
                  taskProgressPercent === 100 ? '#10b981' : 'primary.main',
              },
            }}
          />

          {totalSubtasksCount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.6 }}>
              <Typography
                variant="caption"
                sx={{ fontSize: '10.5px', color: 'text.disabled' }}
              >
                Subtareas completadas: {completedSubtasksCount} de{' '}
                {totalSubtasksCount}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Filters & Search Bar */}
      <Box
        sx={{
          px: 2.5,
          pb: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <TextField
          size="small"
          placeholder="Buscar por título de tarea o subtarea..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: '12.5px',
              bgcolor: isDark
                ? 'rgba(255, 255, 255, 0.03)'
                : 'rgba(0, 0, 0, 0.02)',
            },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            flexWrap: 'wrap',
          }}
        >
          <Chip
            label={`Todas (${totalTasksCount})`}
            size="small"
            clickable
            color={statusFilter === 'all' ? 'primary' : 'default'}
            variant={statusFilter === 'all' ? 'filled' : 'outlined'}
            onClick={() => setStatusFilter('all')}
            sx={{ fontSize: '11px', fontWeight: 600, height: 26 }}
          />
          <Chip
            label={`Por hacer (${totalTasksCount - completedTasksCount})`}
            size="small"
            clickable
            color={statusFilter === 'pending' ? 'primary' : 'default'}
            variant={statusFilter === 'pending' ? 'filled' : 'outlined'}
            onClick={() => setStatusFilter('pending')}
            sx={{ fontSize: '11px', fontWeight: 600, height: 26 }}
          />
          <Chip
            label={`Completadas (${completedTasksCount})`}
            size="small"
            clickable
            color={statusFilter === 'completed' ? 'success' : 'default'}
            variant={statusFilter === 'completed' ? 'filled' : 'outlined'}
            onClick={() => setStatusFilter('completed')}
            sx={{ fontSize: '11px', fontWeight: 600, height: 26 }}
          />

          {/* Priority filter pills */}
          <Box
            sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <FlagIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
            {[
              { level: 'all', label: 'Todas', color: 'transparent' },
              {
                level: 1,
                label: 'Baja',
                color: PRIORITY_COLORS[1]?.main || '#d1fae5',
              },
              {
                level: 2,
                label: 'Media',
                color: PRIORITY_COLORS[2]?.main || '#dbeafe',
              },
              {
                level: 3,
                label: 'Alta',
                color: PRIORITY_COLORS[3]?.main || '#fef3c7',
              },
              {
                level: 4,
                label: 'Crítica',
                color: PRIORITY_COLORS[4]?.main || '#fee2e2',
              },
            ].map((p) => {
              const isSelected = selectedPriority === p.level;
              return (
                <Chip
                  key={p.level}
                  label={p.label}
                  size="small"
                  clickable
                  onClick={() => setSelectedPriority(p.level as number | 'all')}
                  sx={{
                    fontSize: '10px',
                    height: 22,
                    fontWeight: isSelected ? 700 : 500,
                    bgcolor: isSelected
                      ? isDark
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(0, 0, 0, 0.1)'
                      : 'transparent',
                    border: '1px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Task List */}
      <DialogContent sx={{ p: 2.5, pt: 0, overflowY: 'auto' }}>
        {filteredTasks.length === 0 ? (
          <Box
            sx={{
              py: 5,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: 'text.secondary' }}
            >
              No se encontraron tareas con los filtros actuales
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              Intenta cambiar el estado, prioridad o término de búsqueda.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.2}>
            {filteredTasks.map((event) => {
              const task = event.resource as Task | undefined;
              const subtasks = task?.subtasks || [];
              const hasSubtasks = subtasks.length > 0;
              const completedSubtasks = subtasks.filter(
                (s) => s.completed,
              ).length;
              const isExpanded = Boolean(expandedSubtasks[event.id]);
              const isTaskDone = task?.status === 'Done';

              const startTime = format(new Date(event.start), 'hh:mm a');
              const endTime = format(new Date(event.end), 'hh:mm a');

              const priorityColor =
                task?.priority_level && PRIORITY_COLORS[task.priority_level]
                  ? PRIORITY_COLORS[task.priority_level].main
                  : '#cbd5e1';

              return (
                <Box
                  key={event.id}
                  onClick={() => {
                    onSelectEvent(event);
                    onClose();
                  }}
                  sx={{
                    p: 1.5,
                    borderRadius: '10px',
                    bgcolor: isDark
                      ? isTaskDone
                        ? 'rgba(255, 255, 255, 0.02)'
                        : 'rgba(255, 255, 255, 0.04)'
                      : isTaskDone
                        ? 'rgba(0, 0, 0, 0.015)'
                        : '#ffffff',
                    border: '1px solid',
                    borderColor: isTaskDone
                      ? 'divider'
                      : isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: isDark
                        ? 'rgba(255, 255, 255, 0.06)'
                        : 'rgba(0, 0, 0, 0.02)',
                      transform: 'translateY(-1px)',
                      boxShadow: isDark
                        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                        : '0 4px 12px rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  {/* Task Card Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.2,
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      {/* Priority Dot */}
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: priorityColor,
                          mt: 0.6,
                          flexShrink: 0,
                        }}
                      />

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: '13px',
                            color: isTaskDone
                              ? 'text.disabled'
                              : 'text.primary',
                            textDecoration: isTaskDone
                              ? 'line-through'
                              : 'none',
                            lineHeight: 1.3,
                          }}
                        >
                          {event.title}
                        </Typography>

                        {/* Schedule & Category Meta */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 0.5,
                            flexWrap: 'wrap',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.4,
                              color: 'text.secondary',
                            }}
                          >
                            <ScheduleIcon sx={{ fontSize: 12, opacity: 0.7 }} />
                            <Typography
                              variant="caption"
                              sx={{ fontSize: '11px' }}
                            >
                              {startTime} - {endTime}
                            </Typography>
                          </Box>

                          {task?.category && (
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '10.5px',
                                px: 0.6,
                                py: 0.1,
                                borderRadius: '4px',
                                bgcolor: isDark
                                  ? 'rgba(255, 255, 255, 0.06)'
                                  : 'rgba(0, 0, 0, 0.04)',
                                color: 'text.secondary',
                              }}
                            >
                              {task.category}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    {/* Subtasks trigger pill if subtasks exist */}
                    {hasSubtasks && (
                      <Box
                        component="button"
                        type="button"
                        onClick={(e) => toggleSubtasksList(event.id, e)}
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.4,
                          px: 0.8,
                          py: 0.3,
                          borderRadius: '5px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: isExpanded ? 'primary.main' : 'divider',
                          bgcolor: isExpanded
                            ? isDark
                              ? 'rgba(59, 130, 246, 0.15)'
                              : 'rgba(59, 130, 246, 0.08)'
                            : 'transparent',
                          color: isExpanded ? 'primary.main' : 'text.secondary',
                          outline: 'none',
                          transition: 'all 0.15s ease',
                          flexShrink: 0,
                          '&:hover': {
                            bgcolor: isDark
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(0, 0, 0, 0.05)',
                          },
                        }}
                      >
                        <span>
                          {completedSubtasks}/{subtasks.length} subtareas
                        </span>
                        <ArrowDownIcon
                          sx={{
                            fontSize: 14,
                            transform: isExpanded ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s ease',
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  {/* Subtasks Interactive Accordion */}
                  {hasSubtasks && (
                    <Box
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        display: 'grid',
                        gridTemplateRows: isExpanded ? '1fr' : '0fr',
                        opacity: isExpanded ? 1 : 0,
                        transition:
                          'grid-template-rows 0.22s ease, opacity 0.18s ease',
                        width: '100%',
                      }}
                    >
                      <Box sx={{ minHeight: 0, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            pt: 1,
                            mt: 1,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                          }}
                        >
                          {subtasks.map((subtask) => (
                            <Box
                              key={subtask.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (task?.id && onToggleSubtask) {
                                  onToggleSubtask(task.id, subtask.id);
                                }
                              }}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.8,
                                py: 0.4,
                                px: 0.8,
                                borderRadius: '5px',
                                cursor: onToggleSubtask ? 'pointer' : 'default',
                                transition: 'background-color 0.12s ease',
                                '&:hover': onToggleSubtask
                                  ? {
                                      bgcolor: isDark
                                        ? 'rgba(255, 255, 255, 0.06)'
                                        : 'rgba(0, 0, 0, 0.04)',
                                    }
                                  : undefined,
                              }}
                            >
                              {subtask.completed ? (
                                <CheckedIcon
                                  sx={{
                                    fontSize: 14,
                                    color: '#10b981',
                                    flexShrink: 0,
                                  }}
                                />
                              ) : (
                                <UncheckedIcon
                                  sx={{
                                    fontSize: 14,
                                    color: 'text.disabled',
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <Typography
                                variant="caption"
                                noWrap
                                sx={{
                                  fontSize: '11.5px',
                                  fontWeight: 500,
                                  color: subtask.completed
                                    ? 'text.disabled'
                                    : 'text.primary',
                                  textDecoration: subtask.completed
                                    ? 'line-through'
                                    : 'none',
                                  flex: 1,
                                }}
                              >
                                {subtask.title}
                              </Typography>
                              {Boolean(subtask.estimate_timer) && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '10px',
                                    color: 'text.secondary',
                                    bgcolor: isDark
                                      ? 'rgba(255, 255, 255, 0.08)'
                                      : 'rgba(0, 0, 0, 0.05)',
                                    px: 0.5,
                                    py: 0.1,
                                    borderRadius: '3px',
                                    flexShrink: 0,
                                  }}
                                >
                                  {subtask.estimate_timer}m
                                </Typography>
                              )}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};
