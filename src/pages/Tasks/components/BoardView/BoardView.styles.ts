import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const BoardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  overflowX: 'auto',
  paddingBottom: theme.spacing(2),
  width: '100%',
  alignItems: 'flex-start',
  height: '100%',
  minHeight: '600px',
}));

export const ColumnWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '320px',
  minWidth: '320px',
  flexShrink: 0,
}));

export const ColumnHeader = styled(Box)<{ borderColor?: string }>(
  ({ theme, borderColor }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderBottom: `3px solid ${borderColor || theme.palette.divider}`,
  }),
);

export const ColumnTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '14px',
  textTransform: 'uppercase',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.primary,
}));

export const TaskCountBadge = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? '#30363d' : theme.palette.grey[200],
  color: theme.palette.text.secondary,
  borderRadius: '4px',
  padding: '2px 6px',
  fontSize: '12px',
  fontWeight: 600,
}));

export const DroppableArea = styled(Box)<{ isOver?: boolean }>(
  ({ theme, isOver }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    minHeight: '200px',
    maxHeight: 'calc(100vh - 250px)',
    height: '100%',
    padding: theme.spacing(1),
    borderRadius: '12px',
    backgroundColor: isOver
      ? theme.palette.mode === 'dark'
        ? 'rgba(59, 130, 246, 0.08)'
        : 'rgba(59, 130, 246, 0.04)'
      : 'transparent',
    border: isOver
      ? `2px dashed ${theme.palette.primary.main}`
      : '2px dashed transparent',
    transition: 'all 0.15s ease',
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.divider,
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: theme.palette.text.disabled,
    },
  }),
);

export const DropIndicator = styled(Box)(({ theme }) => ({
  height: '4px',
  backgroundColor: theme.palette.primary.main,
  borderRadius: '2px',
  margin: '4px 0',
  boxShadow: `0 0 8px ${theme.palette.primary.main}`,
  animation: 'pulse 1.5s ease-in-out infinite',
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
      transform: 'scaleX(1)',
    },
    '50%': {
      opacity: 0.6,
      transform: 'scaleX(0.95)',
    },
  },
}));

export const TaskPlaceholder = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  height: '120px',
  border: isActive
    ? `2px dashed ${theme.palette.primary.main}`
    : `2px dashed ${theme.palette.divider}`,
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: isActive
    ? theme.palette.mode === 'dark'
      ? 'rgba(59, 130, 246, 0.1)'
      : 'rgba(59, 130, 246, 0.05)'
    : 'transparent',
  transition: 'all 0.2s ease',
}));

export const DraggingCardPreview = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: '12px',
  padding: '16px',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 20px 40px -10px rgba(0, 0, 0, 0.8)'
      : '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
  transform: 'rotate(2deg)',
  cursor: 'grabbing',
  opacity: 0.95,
}));
