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
  padding: '8px 16px', // More compact padding
  marginBottom: '6px',
  display: 'flex',
  alignItems: 'center', // Centered for single-line look
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
  lineHeight: 1,
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
  padding: '2px 6px',
  borderRadius: '4px',
  backgroundColor: hasSubtasks ? theme.palette.action.hover : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
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
  flexShrink: 0,
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

export const AIBadge = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: '#7c3aed',
  padding: '2px 8px',
  borderRadius: '12px',
  background: 'rgba(124, 58, 237, 0.1)',
  border: '1px solid rgba(124, 58, 237, 0.2)',
  boxShadow: '0 0 10px rgba(124, 58, 237, 0.2)',
});

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
  width: '100%',
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(15, 23, 42, 0.4)'
      : 'rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(12px)',
  overflow: 'hidden',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
      : '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
  marginBottom: '24px',
}));

export const TableHeader = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns:
    '40px minmax(180px, 3fr) 120px 100px 120px 85px 60px 130px 100px',
  padding: '14px 16px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(15, 23, 42, 0.6)'
      : 'rgba(255, 255, 255, 0.6)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  fontWeight: 700,
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  gap: '12px',
  alignItems: 'center',
  zIndex: 2,

  // Responsive hiding
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '40px minmax(180px, 3fr) 100px 100px 120px 85px 100px',
    '& .col-links, & .col-progress': { display: 'none' },
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '40px minmax(180px, 3fr) 100px 100px 120px 100px',
    '& .col-links, & .col-progress, & .col-subtasks': { display: 'none' },
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '40px minmax(120px, 2fr) 90px 100px 80px',
    '& .col-links, & .col-progress, & .col-subtasks, & .col-category': {
      display: 'none',
    },
  },
}));

export const TableHeaderCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 700,
  fontSize: '11px',
  color: theme.palette.text.secondary,
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
    background: theme.palette.divider,
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.text.secondary,
  },
}));

export const TableStatusGroupRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor?: string }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 16px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(30, 41, 59, 0.7)'
      : 'rgba(241, 245, 249, 0.9)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(8px)',
  position: 'sticky',
  top: 0,
  zIndex: 1,
}));

export const TaskRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor?: string }>(({ theme, statusColor }) => ({
  display: 'grid',
  gridTemplateColumns:
    '40px minmax(180px, 3fr) 120px 100px 120px 85px 60px 130px 100px',
  alignItems: 'center',
  padding: '12px 16px',
  backgroundColor: 'transparent',
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderLeft: statusColor ? `3px solid ${statusColor}` : undefined,
  cursor: 'pointer',
  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  gap: '12px',

  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(0, 0, 0, 0.015)',
    transform: 'translateY(-0.5px)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 4px 12px rgba(0, 0, 0, 0.2)'
        : '0 4px 12px rgba(0, 0, 0, 0.02)',
  },

  // Responsive hiding
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '40px minmax(180px, 3fr) 100px 100px 120px 85px 100px',
    '& .cell-links, & .cell-progress': { display: 'none' },
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '40px minmax(180px, 3fr) 100px 100px 120px 100px',
    '& .cell-links, & .cell-progress, & .cell-subtasks': { display: 'none' },
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '40px minmax(120px, 2fr) 90px 100px 80px',
    '& .cell-links, & .cell-progress, & .cell-subtasks, & .cell-category': {
      display: 'none',
    },
  },
}));
