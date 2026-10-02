import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  alpha,
} from '@mui/material';
import { surfaceColor } from '@/context';

// Motion-inspired professional design
export const TaskCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor?: string }>(({ theme, statusColor }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderLeft: statusColor ? `3px solid ${statusColor}` : undefined,
  borderRadius: '8px',
  padding: '8px 16px',
  marginBottom: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'all 0.2s ease',
  position: 'relative',
  cursor: 'pointer',

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
  alignItems: 'center',
  gap: '12px',
  flex: 1,
});

export const CardRight = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const TaskMainInfo = styled(Box)({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  minWidth: 0,
});

export const TitleWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: 0,
  flexShrink: 1,
});

export const TaskTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '14px',
  color: theme.palette.text.primary,
  lineHeight: 1.2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const TaskMetaSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  color: theme.palette.text.secondary,
  flexShrink: 0,
}));

export const TaskMetaItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  color: 'inherit',
});

export const InteractiveMetaItem = styled(TaskMetaItem)(({ theme }) => ({
  cursor: 'pointer',
  padding: '2px 4px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
}));

export const LinkMetaItem = styled(TaskMetaItem)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const MetaText = styled(Typography)({
  fontSize: '11px',
  fontWeight: 600,
});

export const StatusBadgeDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor?: string }>(({ statusColor }) => ({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: statusColor || '#6b7280',
  flexShrink: 0,
}));

export const StatusChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor?: string }>(({ theme, statusColor }) => {
  const defaultColor = statusColor || '#6b7280';
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(defaultColor, 0.12)
        : alpha(defaultColor, 0.08),
    color:
      theme.palette.mode === 'dark' ? alpha(defaultColor, 0.9) : defaultColor,
    border: `1px solid ${
      theme.palette.mode === 'dark'
        ? alpha(defaultColor, 0.2)
        : alpha(defaultColor, 0.15)
    }`,
    cursor: 'pointer',
    width: 'fit-content',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? alpha(defaultColor, 0.18)
          : alpha(defaultColor, 0.12),
      transform: 'translateY(-0.5px)',
    },
  };
});

// Legacy dot component mapping to StatusBadgeDot to prevent build breaks
export const StatusBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor?: string }>(({ statusColor }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: statusColor || '#6b7280',
  flexShrink: 0,
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.2)',
  },
  transition: 'transform 0.2s',
}));

export const CategoryChip = styled(Box)(({ theme }) => ({
  padding: '3px 8px',
  display: 'flex',
  gap: '5px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: 600,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(16, 185, 129, 0.1)'
      : 'rgba(0, 135, 103, 0.06)',
  color: theme.palette.mode === 'dark' ? '#34d399' : '#008767',
  border: `1px solid ${
    theme.palette.mode === 'dark'
      ? 'rgba(16, 185, 129, 0.2)'
      : 'rgba(0, 135, 103, 0.15)'
  }`,
  flexShrink: 0,
  width: 'fit-content',
}));

export const PriorityChip = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'priorityColor' && prop !== 'priorityLevel',
})<{ priorityColor?: string; priorityLevel?: number }>(({
  theme,
  priorityLevel,
}) => {
  let bg = '#f3f4f6';
  let color = '#4b5563';

  if (priorityLevel === 3 || priorityLevel === 4) {
    // Alta
    bg = theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.16)' : '#fee2e2';
    color = theme.palette.mode === 'dark' ? '#f87171' : '#dc2626';
  } else if (priorityLevel === 2) {
    // Media
    bg = theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.14)' : '#fef3c7';
    color = theme.palette.mode === 'dark' ? '#fbbf24' : '#d97706';
  } else if (priorityLevel === 1 || priorityLevel === 0) {
    // Baja
    bg = theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.16)' : '#dcfce7';
    color = theme.palette.mode === 'dark' ? '#34d399' : '#16a34a';
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3px 12px',
    borderRadius: '20px',
    fontSize: '11.5px',
    fontWeight: 600,
    backgroundColor: bg,
    color: color,
    transition: 'all 0.15s ease',
    width: 'fit-content',
    cursor: 'pointer',
    flexShrink: 0,
    '&:hover': {
      filter: 'brightness(0.96)',
    },
  };
});

export const PriorityDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'priorityColor',
})<{ priorityColor?: string }>(({ priorityColor }) => ({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: priorityColor || '#6b7280',
  flexShrink: 0,
}));

export const DateChip = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '3px 0',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 500,
  backgroundColor: 'transparent',
  color: theme.palette.mode === 'dark' ? '#8a8f98' : '#4b5563',
  transition: 'all 0.15s ease',
  width: 'fit-content',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.text.primary,
  },
}));

export const TimeChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: 'estimated' | 'actual' | 'actual-over' }>(({
  theme,
  variant,
}) => {
  let bgColor = 'transparent';
  let textColor = theme.palette.text.secondary;
  let borderColor = 'transparent';

  if (variant === 'estimated') {
    bgColor =
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(0, 0, 0, 0.02)';
    borderColor =
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(0, 0, 0, 0.04)';
    textColor = theme.palette.text.secondary;
  } else if (variant === 'actual') {
    bgColor =
      theme.palette.mode === 'dark'
        ? 'rgba(16, 185, 129, 0.06)'
        : 'rgba(16, 185, 129, 0.04)';
    borderColor =
      theme.palette.mode === 'dark'
        ? 'rgba(16, 185, 129, 0.15)'
        : 'rgba(16, 185, 129, 0.1)';
    textColor = theme.palette.mode === 'dark' ? '#34d399' : '#059669';
  } else if (variant === 'actual-over') {
    bgColor =
      theme.palette.mode === 'dark'
        ? 'rgba(239, 68, 68, 0.08)'
        : 'rgba(239, 68, 68, 0.05)';
    borderColor =
      theme.palette.mode === 'dark'
        ? 'rgba(239, 68, 68, 0.18)'
        : 'rgba(239, 68, 68, 0.12)';
    textColor = theme.palette.mode === 'dark' ? '#f87171' : '#dc2626';
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: bgColor,
    color: textColor,
    border: `1px solid ${borderColor}`,
    whiteSpace: 'nowrap',
    width: 'fit-content',
    minWidth: '45px',
  };
});

// Legacy styling for safety
export const PriorityIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'priorityColor',
})<{ priorityColor?: string }>(({ priorityColor }) => ({
  width: '3px',
  height: '16px',
  borderRadius: '2px',
  backgroundColor: priorityColor,
  marginRight: '2px',
}));

export const ProgressBarWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: 120,
});

export const ProgressText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'overLimit',
})<{ overLimit?: boolean }>(({ theme, overLimit }) => ({
  fontSize: '11px',
  fontWeight: 600,
  color: overLimit ? '#ef4444' : theme.palette.text.secondary,
  whiteSpace: 'nowrap',
}));

export const TaskProgressBar = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'overLimit',
})<{ overLimit?: boolean }>(({ theme, overLimit }) => ({
  height: 6,
  borderRadius: 3,
  width: 60,
  flexShrink: 0,
  backgroundColor: theme.palette.divider,
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 3,
    backgroundColor: overLimit
      ? theme.palette.error.main
      : theme.palette.primary.main,
  },
}));

export const FocusIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    transform: 'scale(1.1)',
  },
  transition: 'all 0.2s',
  width: 32,
  height: 32,
}));

export const AIBadge = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  color: '#7c3aed',
  padding: '3px 8px',
  borderRadius: '20px',
  backgroundColor: 'rgba(124, 58, 237, 0.08)',
  border: '1px solid rgba(124, 58, 237, 0.15)',
  flexShrink: 0,
}));

export const AIText = styled(Typography)({
  fontSize: '10px',
  fontWeight: 800,
  letterSpacing: '0.05em',
});

// Table Styled Components matching screenshot
export const TableWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  border:
    theme.palette.mode === 'dark' ? '1px solid #25272e' : '1px solid #e2e8f0',
  borderRadius: '16px',
  backgroundColor: surfaceColor(theme, '#18191e', '#18191e', '#ffffff'),
  overflowX: 'auto',
  overflowY: 'hidden',
  WebkitOverflowScrolling: 'touch',
  boxShadow:
    theme.palette.mode === 'dark' ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.02)',
  marginBottom: '24px',
  boxSizing: 'border-box',
}));

export const TableHeader = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns:
    '48px minmax(260px, 4fr) 110px 100px 120px 85px 75px 65px',
  padding: '12px 24px',
  backgroundColor: surfaceColor(theme, '#18191e', '#242425', '#f9fafb'),
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.mode === 'dark' ? '#717684' : '#6B7280',
  fontWeight: 600,
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  gap: '12px',
  alignItems: 'center',
  zIndex: 2,
  boxSizing: 'border-box',
  minWidth: '880px',
}));

export const TableHeaderCell = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'inherit',
  fontSize: 'inherit',
  color: 'inherit',
  whiteSpace: 'nowrap',
}));

export const TableBodyContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  minHeight: 0,
  minWidth: '880px',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: surfaceColor(
      theme,
      '#2e3037',
      '#3E3E3E',
      theme.palette.divider,
    ),
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: surfaceColor(
      theme,
      '#3a3d48',
      '#4D4D4D',
      theme.palette.text.secondary,
    ),
  },
}));

export const TableStatusGroupRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor?: string }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 24px',
  backgroundColor: surfaceColor(
    theme,
    '#14151a',
    '#1c1d22',
    'rgba(232, 232, 232, 0.62)',
  ),
  borderBottom:
    theme.palette.mode === 'dark'
      ? '1px solid #25272e'
      : '1px solid rgba(0, 0, 0, 0.07)',
  backdropFilter: 'blur(12px)',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'background-color 0.15s ease',
  minWidth: '880px',
  boxSizing: 'border-box',
  '&:hover': {
    backgroundColor: surfaceColor(
      theme,
      '#1c1d24',
      '#23242a',
      'rgba(215, 218, 226, 0.97)',
    ),
  },
}));

export const TaskRow = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'statusColor' && prop !== 'isDone' && prop !== 'isSelected',
})<{ statusColor?: string; isDone?: boolean; isSelected?: boolean }>(
  ({ theme, isDone, isSelected }) => ({
    display: 'grid',
    gridTemplateColumns:
      '48px minmax(260px, 4fr) 110px 100px 120px 85px 75px 65px',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: isSelected
      ? theme.palette.mode === 'dark'
        ? 'rgba(0, 135, 103, 0.08)'
        : 'rgba(0, 135, 103, 0.05)'
      : 'transparent',
    opacity: isDone ? 0.65 : 1,
    borderBottom:
      theme.palette.mode === 'dark' ? '1px solid #22242b' : '1px solid #f3f4f6',
    cursor: 'pointer',
    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    gap: '12px',
    boxSizing: 'border-box',
    minWidth: '880px',

    '&:hover': {
      backgroundColor: isSelected
        ? theme.palette.mode === 'dark'
          ? 'rgba(0, 135, 103, 0.12)'
          : 'rgba(0, 135, 103, 0.08)'
        : theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.025)'
          : '#f9fafb',
    },

    '&:hover .checkbox-cell': {
      opacity: 1,
    },
  }),
);
