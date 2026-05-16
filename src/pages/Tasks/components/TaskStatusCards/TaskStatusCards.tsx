import { Typography, Box } from '@mui/material';
import { PriorityCard, PriorityCardsContainer } from '../../Tasks.styles';
import {
  List as AllIcon,
  CircleOutlined as TodoIcon,
  EventNote as PlanningIcon,
  EventAvailable as ScheduledIcon,
  CheckCircle as DoneIcon,
} from '@mui/icons-material';
import type { TaskStatus } from '@/api/Tasks/apiTaskTypes';

interface TaskStatusCardsProps {
  activeStatus?: TaskStatus | 'all';
  onStatusChange: (status: TaskStatus | 'all') => void;
  statusCounts: Record<string, number>;
}

export const TaskStatusCards = ({
  activeStatus = 'all',
  onStatusChange,
  statusCounts,
}: TaskStatusCardsProps) => {
  const statuses = [
    {
      label: 'All Tasks',
      value: 'all' as const,
      icon: <AllIcon />,
      color: '#7c4dff',
    },
    {
      label: 'To Do',
      value: 'Todo' as const,
      icon: <TodoIcon />,
      color: '#64748b',
    },
    {
      label: 'Planning',
      value: 'Planning' as const,
      icon: <PlanningIcon />,
      color: '#3b82f6',
    },
    {
      label: 'Scheduled',
      value: 'Scheduled' as const,
      icon: <ScheduledIcon />,
      color: '#8b5cf6',
    },
    {
      label: 'Done',
      value: 'Done' as const,
      icon: <DoneIcon />,
      color: '#10b981',
    },
  ];

  return (
    <PriorityCardsContainer>
      {statuses.map((s) => (
        <PriorityCard
          key={s.label}
          active={activeStatus === s.value}
          priorityColor={s.color}
          onClick={() => onStatusChange(s.value)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', color: s.color }}>{s.icon}</Box>
            <Typography
              variant="body2"
              fontWeight={activeStatus === s.value ? 700 : 500}
              sx={{
                color: activeStatus === s.value ? s.color : 'text.primary',
                whiteSpace: 'nowrap',
              }}
            >
              {s.label}
            </Typography>
            <Box
              sx={{
                ml: 0.5,
                px: 0.8,
                py: 0.2,
                borderRadius: '10px',
                bgcolor: activeStatus === s.value ? s.color : 'action.hover',
                color: activeStatus === s.value ? 'white' : 'text.secondary',
                fontSize: '10px',
                fontWeight: 700,
              }}
            >
              {statusCounts[s.value] || 0}
            </Box>
          </Box>
        </PriorityCard>
      ))}
    </PriorityCardsContainer>
  );
};
