import { Box, Typography, LinearProgress, alpha } from '@mui/material';
import {
  CalendarToday as CalendarTodayIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';

import {
  GridTaskCard,
  GridCardHeader,
  GridCardFooter,
  ProgressBarContainer,
  ProgressLabel,
  StatusDot,
  MetaBadge,
} from './GridViewTask.styles';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import { PriorityBadge, getPriorityConfig } from '@/components/ui';

interface GridViewTaskProps {
  task: TaskResponse;
  onTaskClick: (task: TaskResponse) => void;
  isAIScheduleEnabled?: boolean;
}

// Professional color scheme matching ListViewTask
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Todo: '#6b7280',
    Planning: '#3b82f6',
    Scheduled: '#8b5cf6',
    Pending: '#f59e0b',
    'On Hold': '#ef4444',
    Review: '#06b6d4',
    Done: '#10b981',
  };
  return colors[status] || '#6b7280';
};

const getPriorityColor = (level: number) => {
  if (level >= 4) return '#ef4444';
  if (level === 3) return '#f59e0b';
  if (level === 2) return '#3b82f6';
  return '#10b981';
};

export const GridViewTask = ({
  task,
  onTaskClick,
  isAIScheduleEnabled,
}: GridViewTaskProps) => {
  const statusColor = getStatusColor(task.status);
  const priorityColor = getPriorityColor(task.priority_level);

  const progress =
    task.status === 'Done'
      ? 100
      : task.subtasks && task.subtasks.length > 0
        ? Math.round(
            (task.subtasks.filter((s) => s.completed).length /
              task.subtasks.length) *
              100,
          )
        : task.status === 'Pending' || task.status === 'Planning'
          ? 50
          : 0;

  return (
    <GridTaskCard onClick={() => onTaskClick(task)}>
      {/* Top row: Status and AI Suggestion */}
      <GridCardHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StatusDot color={statusColor} />
          <Typography
            variant="caption"
            sx={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {task.status}
          </Typography>
        </Box>

        {isAIScheduleEnabled && task.ai_suggestion && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'action.hover',
              px: 1,
              py: 0.25,
              borderRadius: '12px',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 11, color: '#8b5cf6' }} />
            <Typography
              variant="caption"
              sx={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#8b5cf6',
              }}
            >
              AI
            </Typography>
          </Box>
        )}
      </GridCardHeader>

      {/* Task title */}
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          fontSize: '14px',
          color: 'text.primary',
          lineHeight: 1.4,
          mb: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {task.title}
      </Typography>

      {/* Task description preview */}
      <Box sx={{ mb: 2, flex: 1 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: '12px',
            color: 'text.secondary',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.description ||
            task.notes_encrypted ||
            'No description provided.'}
        </Typography>
      </Box>

      {/* Metadata row */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        {task.priority_level > 0 && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              px: '7px',
              py: '2px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              bgcolor: alpha(priorityColor, 0.12),
              color: priorityColor,
              border: `1px solid ${alpha(priorityColor, 0.25)}`,
              flexShrink: 0,
            }}
          >
            <PriorityBadge priority={task.priority_level} size={15} />
            <span>{getPriorityConfig(task.priority_level).label}</span>
          </Box>
        )}
        {task.deadline && (
          <MetaBadge>
            <CalendarTodayIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
            <Typography
              variant="caption"
              sx={{ fontSize: '11px', color: 'text.secondary' }}
            >
              {new Date(task.deadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </Typography>
          </MetaBadge>
        )}
      </Box>

      <GridCardFooter>
        <ProgressBarContainer>
          <ProgressLabel>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontSize: '11px' }}
            >
              {task.status === 'Done' ? 'Completed' : 'In progress'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '11px',
                fontWeight: 500,
              }}
            >
              {Math.round(progress)}%
            </Typography>
          </ProgressLabel>
          <LinearProgress
            variant="determinate"
            value={Math.max(progress, 3)}
            sx={{
              height: 3,
              borderRadius: 2,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                bgcolor: statusColor,
                borderRadius: 2,
              },
            }}
          />
        </ProgressBarContainer>
      </GridCardFooter>
    </GridTaskCard>
  );
};
