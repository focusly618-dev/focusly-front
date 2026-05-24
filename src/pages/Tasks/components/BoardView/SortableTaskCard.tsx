import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import { Box, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Tag } from '../GridViewTask/GridViewTask.styles';
import { getTagColors } from '../../../Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import { memo } from 'react';

interface SortableTaskCardProps {
  task: TaskResponse;
  onClick?: () => void;
  isOverlay?: boolean;
  isDropTarget?: boolean;
}

export const SortableTaskCard = memo(
  ({ task, onClick, isOverlay, isDropTarget }: SortableTaskCardProps) => {
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
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: transition || 'transform 0.15s ease, opacity 0.15s ease',
      opacity: isDragging ? 0.4 : 1,
      cursor: isOverlay ? 'grabbing' : 'grab',
      zIndex: isOverlay ? 999 : isDragging ? 100 : 1,
      scale: isOverlay ? '1.02' : '1',
    };

    const tagColors = getTagColors(task.category);

    return (
      <Box
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
          outline: 'none',
          display: 'block',
          marginBottom: '12px',
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
            backgroundColor: (theme) =>
              isDropTarget
                ? theme.palette.mode === 'dark'
                  ? 'rgba(99, 102, 241, 0.15)'
                  : 'rgba(59, 130, 246, 0.08)'
                : theme.palette.mode === 'dark'
                  ? 'rgba(26, 31, 43, 0.65)'
                  : theme.palette.background.paper,
            backdropFilter: (theme) =>
              theme.palette.mode === 'dark' ? 'blur(8px)' : 'none',
            WebkitBackdropFilter: (theme) =>
              theme.palette.mode === 'dark' ? 'blur(8px)' : 'none',
            border: (theme) =>
              isDropTarget
                ? `2px solid ${theme.palette.mode === 'dark' ? '#6366f1' : theme.palette.primary.main}`
                : theme.palette.mode === 'dark'
                  ? '1px solid rgba(255, 255, 255, 0.05)'
                  : `1px solid ${theme.palette.divider}`,
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: (theme) =>
              isOverlay
                ? theme.palette.mode === 'dark'
                  ? '0 20px 40px -10px rgba(0, 0, 0, 0.8)'
                  : '0 20px 40px -10px rgba(0, 0, 0, 0.25)'
                : isDropTarget
                  ? `0 0 0 3px ${theme.palette.mode === 'dark' ? '#6366f120' : theme.palette.primary.main + '20'}`
                  : theme.palette.mode === 'dark'
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.2)'
                    : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: isOverlay ? 'none' : 'translateY(-2px)',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(99, 102, 241, 0.4)'
                  : theme.palette.primary.main,
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 8px 24px -10px rgba(0, 0, 0, 0.6), 0 0 12px rgba(99, 102, 241, 0.12)'
                  : '0 6px 16px -5px rgba(0, 0, 0, 0.1)',
            },
            position: 'relative',
            '&::before': isDropTarget
              ? {
                  content: '""',
                  position: 'absolute',
                  top: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 40,
                  height: 4,
                  backgroundColor: 'primary.main',
                  borderRadius: 2,
                  boxShadow: (theme) => `0 0 8px ${theme.palette.primary.main}`,
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={1}
          >
            <Tag tagColor={tagColors.bgcolor} textColor={tagColors.color}>
              {task.category || 'General'}
            </Tag>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 600 }}
            >
              {task.estimate_timer || 0}m
            </Typography>
          </Box>

          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            {task.title}
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt="auto"
          >
            {task.deadline ? (
              <Box display="flex" alignItems="center" gap={0.5}>
                <CalendarTodayIcon
                  sx={{ fontSize: 14, color: 'text.secondary' }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {new Date(task.deadline).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
            ) : (
              <Box /> // Empty box to maintain flex layout
            )}

            {/* Placeholder Avatar - matching mockup */}
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontSize: 10, fontWeight: 600 }}
              >
                {task.title ? task.title.charAt(0).toUpperCase() : 'U'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  },
);

SortableTaskCard.displayName = 'SortableTaskCard';
