import { Typography, Box } from '@mui/material';
import { PriorityCard, PriorityCardsContainer } from '../../Tasks.styles';
import {
  KeyboardDoubleArrowUp as HighPriorityIcon,
  KeyboardArrowUp as MediumPriorityIcon,
  KeyboardArrowDown as LowPriorityIcon,
  List as AllIcon,
} from '@mui/icons-material';

interface TaskPriorityCardsProps {
  activePriority?: number;
  onPriorityChange: (priority: number | undefined) => void;
}

export const TaskPriorityCards = ({
  activePriority,
  onPriorityChange,
}: TaskPriorityCardsProps) => {
  const priorities = [
    {
      label: 'All Tasks',
      value: undefined,
      icon: <AllIcon />,
      color: '#7c4dff',
    },
    {
      label: 'High Priority',
      value: 3,
      icon: <HighPriorityIcon />,
      color: '#ff5252',
    },
    {
      label: 'Medium Priority',
      value: 2,
      icon: <MediumPriorityIcon />,
      color: '#ffab40',
    },
    {
      label: 'Low Priority',
      value: 1,
      icon: <LowPriorityIcon />,
      color: '#448aff',
    },
  ];

  return (
    <PriorityCardsContainer>
      {priorities.map((p) => (
        <PriorityCard
          key={p.label}
          active={activePriority === p.value}
          priorityColor={p.color}
          onClick={() => onPriorityChange(p.value)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', color: p.color }}>{p.icon}</Box>
            <Typography
              variant="body2"
              fontWeight={activePriority === p.value ? 700 : 500}
              sx={{
                color: activePriority === p.value ? p.color : 'text.primary',
                whiteSpace: 'nowrap',
              }}
            >
              {p.label}
            </Typography>
          </Box>
        </PriorityCard>
      ))}
    </PriorityCardsContainer>
  );
};
