import { Box, Typography, alpha, useTheme } from '@mui/material';
import {
  AccessTime as TimeIcon,
  EventAvailable as CalendarIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import type { Task } from '@/redux/tasks/task.types';
import {
  NextTaskContainer,
  TaskTimeBadge,
  EmptyStateContainer,
} from './NextTaskCard.styles';

interface NextTaskCardProps {
  tasks: Task[];
}

export const NextTaskCard = ({ tasks }: NextTaskCardProps) => {
  const theme = useTheme();
  const now = new Date();

  // Find the next upcoming task
  const nextTask = tasks
    .filter((task) => {
      const startDate = task.estimated_start_date
        ? new Date(task.estimated_start_date)
        : null;
      const deadline = task.deadline ? new Date(task.deadline) : null;
      // Filter tasks that are in the future and not completed
      return (
        !task.completed_at &&
        ((startDate && startDate > now) || (deadline && deadline > now))
      );
    })
    .sort((a, b) => {
      const aDate = a.estimated_start_date
        ? new Date(a.estimated_start_date)
        : new Date(a.deadline || 0);
      const bDate = b.estimated_start_date
        ? new Date(b.estimated_start_date)
        : new Date(b.deadline || 0);
      return aDate.getTime() - bDate.getTime();
    })[0];

  const getPriorityColor = (priority?: number) => {
    const colors = {
      1: '#22C55E', // Green
      2: '#3B82F6', // Blue
      3: '#F59E0B', // Amber
      4: '#EF4444', // Red
    };
    return colors[priority as keyof typeof colors] || colors[2];
  };

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  if (!nextTask) {
    return (
      <EmptyStateContainer>
        <CalendarIcon
          sx={{
            fontSize: 32,
            color: alpha(theme.palette.text.primary, 0.15),
            mb: 1,
          }}
        />
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.secondary"
          sx={{ fontSize: '13px' }}
        >
          No upcoming tasks
        </Typography>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontSize: '11px', textAlign: 'center' }}
        >
          Your schedule is clear for now
        </Typography>
      </EmptyStateContainer>
    );
  }

  const taskDate = nextTask.estimated_start_date
    ? new Date(nextTask.estimated_start_date)
    : new Date(nextTask.deadline || 0);
  const isToday = taskDate.toDateString() === now.toDateString();
  const priorityColor = getPriorityColor(nextTask.priority_level);

  return (
    <NextTaskContainer>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: priorityColor,
            flexShrink: 0,
          }}
        />
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{
            fontSize: '11px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'text.secondary',
          }}
        >
          Next Task
        </Typography>
      </Box>

      <Typography
        variant="body2"
        fontWeight={600}
        sx={{
          fontSize: '14px',
          lineHeight: 1.4,
          mb: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {nextTask.title}
      </Typography>

      <TaskTimeBadge>
        <TimeIcon sx={{ fontSize: 12, mr: 0.5 }} />
        <Typography
          variant="caption"
          fontWeight={500}
          sx={{ fontSize: '12px' }}
        >
          {isToday
            ? `Today, ${formatTime(taskDate)}`
            : format(taskDate, 'MMM d, h:mm a')}
        </Typography>
      </TaskTimeBadge>
    </NextTaskContainer>
  );
};
