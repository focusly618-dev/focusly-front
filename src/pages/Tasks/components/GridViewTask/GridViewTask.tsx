import { Box, Typography, LinearProgress } from '@mui/material';
import {
  CalendarToday as CalendarTodayIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { GeminiAIToggle } from '@/components/ui/GeminiSwitch';

import {
  GridTaskCard,
  GridCardHeader,
  GridCardFooter,
  ProgressBarContainer,
  ProgressLabel,
  Tag,
  StatusDot,
  MetaBadge,
  PriorityBar,
} from './GridViewTask.styles';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import { getTagColors } from '../../../Tasks/components/TaskDetailModal/TaskDetailModal.utils';

interface GridViewTaskProps {
  task: TaskResponse;
  onTaskClick: (task: TaskResponse) => void;
  updateTask?: (taskId: string, updates: Partial<TaskResponse>) => Promise<void>;
}

// Professional color scheme matching ListViewTask
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Done: '#22c55e',
    Todo: '#3b82f6',
    Planning: '#8b5cf6',
    Pending: '#f59e0b',
    OnHold: '#ef4444',
    Review: '#06b6d4',
    Backlog: '#6b7280',
  };
  return colors[status] || '#6b7280';
};

const getPriorityColor = (level: number) => {
  if (level >= 3) return '#ef4444';
  if (level === 2) return '#f59e0b';
  return '#22c55e';
};

export const GridViewTask = ({ task, onTaskClick, updateTask }: GridViewTaskProps) => {
  const statusColor = getStatusColor(task.status);
  const priorityColor = getPriorityColor(task.priority_level);

  const subtaskCount = task.subtasks?.length || 0;
  const completedSubtasks =
    task.subtasks?.filter((s) => s.completed || s.status === 'Done')?.length ||
    0;
  const progress =
    subtaskCount > 0 ? (completedSubtasks / subtaskCount) * 100 : 0;

  return (
    <GridTaskCard onClick={() => onTaskClick(task)}>
      <GridCardHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StatusDot color={statusColor} />
          <Tag
            tagColor={getTagColors(task.category || 'General').bgcolor}
            textColor={getTagColors(task.category || 'General').color}
          >
            {task.category || 'General'}
          </Tag>
        </Box>
        {task.links && task.links.length > 0 && (
          <MetaBadge sx={{ color: '#3b82f6' }}>
            <LinkIcon sx={{ fontSize: 14 }} />
            <Typography
              variant="caption"
              sx={{ fontSize: '11px', fontWeight: 500 }}
            >
              {task.links.length}
            </Typography>
          </MetaBadge>
        )}
      </GridCardHeader>

      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'text.primary',
            lineHeight: 1.4,
            mb: 1,
          }}
        >
          {task.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '12px',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.notes_encrypted?.replace(/\[COLOR:(.*?)\]/g, '').trim() ||
            'No description provided.'}
        </Typography>
      </Box>

      {/* Metadata row */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {task.priority_level > 0 && (
          <MetaBadge>
            <PriorityBar color={priorityColor} />
            <Typography
              variant="caption"
              sx={{
                fontSize: '11px',
                fontWeight: 500,
                color: 'text.secondary',
              }}
            >
              {task.priority_level >= 3
                ? 'High'
                : task.priority_level === 2
                  ? 'Med'
                  : 'Low'}
            </Typography>
          </MetaBadge>
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
        <MetaBadge
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          sx={{ gap: 0, ml: 'auto', '&:hover': { bgcolor: 'transparent' } }}
        >
          <GeminiAIToggle
            checked={task.use_ai || false}
            onChange={async (e) => {
              if (updateTask) {
                await updateTask(task.id, { ...task, use_ai: e.target.checked });
              }
            }}
          />
        </MetaBadge>
      </Box>

      <GridCardFooter>
        <ProgressBarContainer>
          <ProgressLabel>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontSize: '11px' }}
            >
              {completedSubtasks}/{subtaskCount} subtasks
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
