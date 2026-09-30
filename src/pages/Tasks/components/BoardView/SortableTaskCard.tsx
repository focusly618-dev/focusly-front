import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import { Box, Typography, useTheme, alpha, lighten } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SubtasksIcon from '@mui/icons-material/FormatListBulletedRounded';
import FlagIcon from '@mui/icons-material/Flag';
import { Tag } from '../GridViewTask/GridViewTask.styles';
import { getTagColors } from '../../../Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import { memo, useMemo } from 'react';
import { useAppSelector } from '@/redux/hooks';

interface SortableTaskCardProps {
  task: TaskResponse;
  onClick?: () => void;
  isOverlay?: boolean;
  isDropTarget?: boolean;
}

export const SortableTaskCard = memo(
  ({ task, onClick, isOverlay, isDropTarget }: SortableTaskCardProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { user } = useAppSelector((state) => state.auth);

    const isReadOnly = useMemo(() => {
      if (!task) return false;
      if (!user) return true;

      // Check Google Calendar event ownership
      if (task.task_type === 'GoogleTask' || task.google_event_id) {
        const organizerEmail = (task as unknown as { organizer_email?: string })
          .organizer_email;
        if (organizerEmail) {
          return organizerEmail.toLowerCase() !== user.email?.toLowerCase();
        }
      }

      // Check Focusly task ownership
      if (task.user_id && task.user_id !== user.id) {
        return true;
      }

      return false;
    }, [task, user]);

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: task.id,
      data: {
        type: 'Task',
        task,
      },
      disabled: isReadOnly,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: transition || 'transform 0.15s ease, opacity 0.15s ease',
      opacity: isDragging ? 0.4 : 1,
      cursor: isReadOnly ? 'default' : isOverlay ? 'grabbing' : 'grab',
      zIndex: isOverlay ? 999 : isDragging ? 100 : 1,
      scale: isOverlay ? '1.02' : '1',
    };

    const tagColors = getTagColors(task.category);

    const priorityConfig = useMemo(() => {
      if (
        task.priority_level === undefined ||
        task.priority_level === null ||
        task.priority_level < 1
      ) {
        return null;
      }
      if (task.priority_level >= 3) {
        return {
          label: task.priority_level >= 4 ? 'Urgente' : 'Alta',
          color: isDark ? '#f87171' : '#dc2626',
          bg: isDark ? 'rgba(239, 68, 68, 0.16)' : '#fee2e2',
        };
      }
      if (task.priority_level === 2) {
        return {
          label: 'Media',
          color: isDark ? '#fbbf24' : '#d97706',
          bg: isDark ? 'rgba(245, 158, 11, 0.14)' : '#fef3c7',
        };
      }
      return {
        label: 'Baja',
        color: isDark ? '#34d399' : '#16a34a',
        bg: isDark ? 'rgba(16, 185, 129, 0.16)' : '#dcfce7',
      };
    }, [task.priority_level, isDark]);

    return (
      <Box
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
          outline: 'none',
          display: 'block',
          marginBottom: '10px',
          touchAction: 'none',
        }}
      >
        <Box
          onClick={(e) => {
            // Prevent click if we are dragging
            if (isDragging) return;
            onClick?.();
            e.stopPropagation();
          }}
          sx={{
            backgroundColor: isDropTarget
              ? isDark
                ? alpha(theme.palette.primary.main, 0.18)
                : alpha(theme.palette.primary.main, 0.08)
              : isDark
                ? '#1c1d24'
                : '#ffffff',
            border: isDropTarget
              ? `2px solid ${isDark ? '#10b981' : '#008767'}`
              : `1px solid ${isDark ? '#282a32' : '#e2e8f0'}`,
            borderLeft:
              task.color && task.color !== 'none'
                ? `3.5px solid ${task.color}`
                : undefined,
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: isOverlay
              ? isDark
                ? '0 20px 40px -10px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 135, 103, 0.25)'
                : '0 20px 40px -10px rgba(0, 0, 0, 0.25)'
              : isDropTarget
                ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                : isDark
                  ? '0 2px 8px rgba(0, 0, 0, 0.25)'
                  : '0 1px 3px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: isOverlay ? 'none' : 'translateY(-2px)',
              backgroundColor: isDark ? '#22242c' : '#ffffff',
              borderColor: isDark ? '#3a3d48' : '#cbd5e1',
              boxShadow: isDark
                ? '0 8px 24px -6px rgba(0, 0, 0, 0.6)'
                : '0 6px 16px -5px rgba(0, 0, 0, 0.1)',
            },
            position: 'relative',
            '&::before': isDropTarget
              ? {
                  content: '""',
                  position: 'absolute',
                  top: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 36,
                  height: 3,
                  backgroundColor: isDark
                    ? '#10b981'
                    : theme.palette.primary.main,
                  borderRadius: 2,
                  boxShadow: `0 0 8px ${isDark ? '#10b981' : theme.palette.primary.main}`,
                  animation: 'pulse 1.5s ease-in-out infinite',
                }
              : undefined,
            '@keyframes pulse': {
              '0%, 100%': {
                opacity: 1,
                transform: 'translateX(-50%) scaleX(1)',
              },
              '50%': {
                opacity: 0.6,
                transform: 'translateX(-50%) scaleX(0.9)',
              },
            },
          }}
        >
          {/* Top row: Category tag + Priority badge + Estimate */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
          >
            <Box display="flex" alignItems="center" gap={0.75} flexWrap="wrap">
              <Tag
                tagColor={
                  isDark ? alpha(tagColors.color, 0.16) : tagColors.bgcolor
                }
                textColor={
                  isDark ? lighten(tagColors.color, 0.25) : tagColors.color
                }
                sx={{
                  border: `1px solid ${
                    isDark
                      ? alpha(tagColors.color, 0.28)
                      : alpha(tagColors.color, 0.15)
                  }`,
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '11px',
                }}
              >
                {task.category || 'General'}
              </Tag>

              {priorityConfig && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.4,
                    px: 0.75,
                    py: 0.2,
                    borderRadius: '4px',
                    bgcolor: priorityConfig.bg,
                    color: priorityConfig.color,
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  <FlagIcon
                    sx={{ fontSize: 11, color: priorityConfig.color }}
                  />
                  <span>{priorityConfig.label}</span>
                </Box>
              )}
            </Box>

            {task.estimate_timer ? (
              <Typography
                variant="caption"
                sx={{
                  color: isDark ? '#8A8F98' : '#64748b',
                  fontWeight: 600,
                  fontSize: '11.5px',
                  flexShrink: 0,
                }}
              >
                {task.estimate_timer}m
              </Typography>
            ) : null}
          </Box>

          {/* Title */}
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              fontSize: '13.5px',
              lineHeight: 1.4,
              color: isDark ? '#F3F4F6' : '#111827',
              wordBreak: 'break-word',
            }}
          >
            {task.title}
          </Typography>

          {/* Footer row: Deadline + Subtasks count + Avatar */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt="auto"
            pt={0.5}
          >
            {task.deadline ? (
              <Box display="flex" alignItems="center" gap={0.5}>
                <CalendarTodayIcon
                  sx={{
                    fontSize: 13,
                    color: isDark ? '#8A8F98' : '#64748b',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: isDark ? '#8A8F98' : '#64748b',
                    fontSize: '11.5px',
                    fontWeight: 500,
                  }}
                >
                  {new Date(task.deadline).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
            ) : (
              <Box />
            )}

            <Box display="flex" alignItems="center" gap={1}>
              {task.subtasks && task.subtasks.length > 0 && (
                <Box
                  sx={{
                    color:
                      task.subtasks.filter((s) => s.completed).length ===
                      task.subtasks.length
                        ? isDark
                          ? '#34d399'
                          : '#10b981'
                        : isDark
                          ? '#8A8F98'
                          : '#64748b',
                    fontSize: '11px',
                    fontWeight: 600,
                    bgcolor:
                      task.subtasks.filter((s) => s.completed).length ===
                      task.subtasks.length
                        ? isDark
                          ? 'rgba(16, 185, 129, 0.16)'
                          : '#dcfce7'
                        : isDark
                          ? '#22242b'
                          : '#f1f5f9',
                    border: `1px solid ${
                      isDark
                        ? task.subtasks.filter((s) => s.completed).length ===
                          task.subtasks.length
                          ? 'rgba(16, 185, 129, 0.3)'
                          : '#2e3037'
                        : task.subtasks.filter((s) => s.completed).length ===
                            task.subtasks.length
                          ? '#bbf7d0'
                          : '#e2e8f0'
                    }`,
                    px: 0.8,
                    py: 0.25,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.4,
                  }}
                >
                  <SubtasksIcon sx={{ fontSize: 13 }} />
                  <span>
                    {task.subtasks.filter((s) => s.completed).length}/
                    {task.subtasks.length}
                  </span>
                </Box>
              )}

              {/* Placeholder Avatar */}
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: isDark ? '#25272e' : '#f1f5f9',
                  border: `1px solid ${isDark ? '#32353e' : '#e2e8f0'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#F3F4F6' : '#475569',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10, fontWeight: 700, lineHeight: 1 }}
                >
                  {task.title ? task.title.charAt(0).toUpperCase() : 'U'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  },
);

SortableTaskCard.displayName = 'SortableTaskCard';
