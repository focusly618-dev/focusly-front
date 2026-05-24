import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  alpha,
} from '@mui/material';
import { SubdirectoryArrowRight as SubdirectoryArrowRightIcon } from '@mui/icons-material';

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

export const SubtaskToggleBtn = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasSubtasks',
})<{ hasSubtasks?: boolean }>(({ theme, hasSubtasks }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
  padding: '3px 8px',
  borderRadius: '20px',
  backgroundColor: hasSubtasks
    ? theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.04)'
      : 'rgba(0, 0, 0, 0.03)'
    : 'transparent',
  border: `1px solid ${hasSubtasks ? theme.palette.divider : 'transparent'}`,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.05)',
  },
}));

export const SubtaskArrow = styled(SubdirectoryArrowRightIcon, {
  shouldForwardProp: (prop) => prop !== 'isExpanded',
})<{ isExpanded?: boolean }>(({ isExpanded }) => ({
  fontSize: 13,
  opacity: 0.7,
  transform: isExpanded ? 'rotate(90deg)' : 'none',
  transition: 'transform 0.2s',
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
      ? 'rgba(99, 102, 241, 0.08)'
      : 'rgba(59, 130, 246, 0.05)',
  color: theme.palette.mode === 'dark' ? '#818cf8' : '#2563eb',
  border: `1px solid ${
    theme.palette.mode === 'dark'
      ? 'rgba(99, 102, 241, 0.15)'
      : 'rgba(59, 130, 246, 0.12)'
  }`,
  flexShrink: 0,
  width: 'fit-content',
}));

export const PriorityChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'priorityColor',
})<{ priorityColor?: string }>(({ theme, priorityColor }) => {
  const defaultColor = priorityColor || '#6b7280';
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 8px',
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
    transition: 'all 0.2s ease',
    width: 'fit-content',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? alpha(defaultColor, 0.18)
          : alpha(defaultColor, 0.12),
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
  padding: '3px 8px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: 600,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(0, 0, 0, 0.03)',
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease',
  width: 'fit-content',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.05)',
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

export const SubtasksContainer = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(6),
  marginBottom: theme.spacing(2),
  borderLeft: `1px solid ${theme.palette.divider}`,
}));

export const SubtaskRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const SubtaskTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'completed',
})<{ completed?: boolean }>(({ theme, completed }) => ({
  color: completed ? theme.palette.text.secondary : theme.palette.text.primary,
  flexGrow: 1,
  fontSize: '13px',
  textDecoration: completed ? 'line-through' : 'none',
  cursor: 'pointer',
}));

// Table Styled Components
export const TableWrapper = styled(Box)(({ theme }) => ({
  width: 'calc(100% + 48px)',
  marginLeft: '-24px',
  marginRight: '-24px',
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : '1px solid rgba(0, 0, 0, 0.05)',
  borderLeft: 'none',
  borderRight: 'none',
  borderRadius: 0,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.4)' : '#ffffff',
  backdropFilter: theme.palette.mode === 'dark' ? 'blur(12px)' : 'none',
  overflow: 'hidden',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
      : '0 4px 20px rgba(0, 0, 0, 0.02)',
  marginBottom: '24px',
}));

export const TableHeader = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns:
    '45px 120px minmax(180px, 3fr) 110px 95px 110px 80px 95px 95px 90px 80px',
  padding: '6px 40px 6px 24px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(26, 31, 43, 0.6)'
      : 'rgba(249, 250, 251, 0.8)',
  borderBottom:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.06)'
      : '1px solid rgba(0, 0, 0, 0.06)',
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : '#6B7280',
  fontWeight: 600,
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  gap: '12px',
  alignItems: 'center',
  zIndex: 2,

  // Responsive hiding
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns:
      '45px 120px minmax(180px, 3fr) 110px 95px 110px 80px 80px',
    '& .col-estimated, & .col-actual, & .col-ai, & .cell-estimated, & .cell-actual, & .cell-ai':
      { display: 'none' },
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '45px 120px minmax(180px, 3fr) 110px 95px 110px 80px',
    '& .col-estimated, & .col-actual, & .col-subtasks, & .col-ai, & .cell-estimated, & .cell-actual, & .cell-subtasks, & .cell-ai':
      { display: 'none' },
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '45px 120px minmax(120px, 2fr) 95px 110px 80px',
    '& .col-estimated, & .col-actual, & .col-subtasks, & .col-category, & .col-ai, & .cell-estimated, & .cell-actual, & .cell-subtasks, & .cell-category, & .cell-ai':
      {
        display: 'none',
      },
  },
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
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : theme.palette.divider,
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.15)'
        : theme.palette.text.secondary,
  },
}));

export const TableStatusGroupRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor?: string }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 40px 6px 24px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(10, 14, 24, 0.95)'
      : 'rgba(232, 232, 232, 0.62)',
  borderBottom:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.06)'
      : '1px solid rgba(0, 0, 0, 0.07)',
  backdropFilter: 'blur(12px)',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(20, 26, 40, 0.95)'
        : 'rgba(215, 218, 226, 0.97)',
  },
}));

export const TaskRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor?: string }>(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns:
    '45px 120px minmax(180px, 3fr) 110px 95px 110px 80px 95px 95px 90px 80px',
  alignItems: 'center',
  padding: '5px 40px 5px 24px',
  backgroundColor: 'transparent',
  borderBottom:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.04)'
      : '1px solid rgba(0, 0, 0, 0.04)',
  cursor: 'pointer',
  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  gap: '12px',

  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.02)'
        : 'rgba(0, 0, 0, 0.015)',
    transform: 'translateY(-0.5px)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 2px 8px rgba(0, 0, 0, 0.2)'
        : '0 2px 8px rgba(0, 0, 0, 0.01)',
  },

  // Responsive hiding
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns:
      '45px 120px minmax(180px, 3fr) 110px 95px 110px 80px 80px',
    '& .col-estimated, & .col-actual, & .col-ai, & .cell-estimated, & .cell-actual, & .cell-ai':
      { display: 'none' },
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '45px 120px minmax(180px, 3fr) 110px 95px 110px 80px',
    '& .col-estimated, & .col-actual, & .col-subtasks, & .col-ai, & .cell-estimated, & .cell-actual, & .cell-subtasks, & .cell-ai':
      { display: 'none' },
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '45px 120px minmax(120px, 2fr) 95px 110px 80px',
    '& .col-estimated, & .col-actual, & .col-subtasks, & .col-category, & .col-ai, & .cell-estimated, & .cell-actual, & .cell-subtasks, & .cell-category, & .cell-ai':
      {
        display: 'none',
      },
  },
}));

export const CustomUncheckedIcon = styled(Box)(({ theme }) => ({
  width: 15,
  height: 15,
  borderRadius: 4,
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.25)'
      : '1px solid rgba(0, 0, 0, 0.2)',
  backgroundColor: 'transparent',
  transition: 'all 0.15s ease',
  boxSizing: 'border-box',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

export const CustomCheckedIcon = styled(Box)(({ theme }) => ({
  width: 15,
  height: 15,
  borderRadius: 4,
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.primary.main,
  position: 'relative',
  boxSizing: 'border-box',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '4px',
    top: '1px',
    width: '3px',
    height: '6px',
    border: 'solid white',
    borderWidth: '0 1.5px 1.5px 0',
    transform: 'rotate(45deg)',
  },
}));

export const CustomIndeterminateIcon = styled(Box)(({ theme }) => ({
  width: 15,
  height: 15,
  borderRadius: 4,
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.primary.main,
  position: 'relative',
  boxSizing: 'border-box',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '3px',
    top: '5px',
    width: '7px',
    height: '1.5px',
    backgroundColor: 'white',
  },
}));
