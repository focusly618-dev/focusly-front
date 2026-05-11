import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Motion-inspired professional design
export const TaskCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  padding: '8px 16px', // More compact padding
  marginBottom: '6px',
  display: 'flex',
  alignItems: 'center', // Centered for single-line look
  justifyContent: 'space-between',
  transition: 'all 0.2s ease',
  position: 'relative',

  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 4px 20px rgba(0, 0, 0, 0.4)'
        : '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
}));

export const CardLeft = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '14px',
  flex: 1,
});

export const CardRight = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const TaskMetaItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  color: 'inherit',
});

export const StatusBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor?: string }>(({ statusColor }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: statusColor || '#6b7280',
  flexShrink: 0,
}));

export const CategoryChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'chipColor',
})<{ chipColor?: string }>(({ theme, chipColor }) => ({
  padding: '2px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: 500,
  backgroundColor:
    chipColor ||
    (theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.06)'
      : 'rgba(0, 0, 0, 0.04)'),
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
}));

export const PriorityIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'priorityColor',
})<{ priorityColor?: string }>(({ priorityColor }) => ({
  width: '3px',
  height: '16px',
  borderRadius: '2px',
  backgroundColor: priorityColor,
  marginRight: '2px',
}));
