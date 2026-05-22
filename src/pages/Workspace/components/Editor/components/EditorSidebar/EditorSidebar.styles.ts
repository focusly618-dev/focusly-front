import { styled, Box, Typography, Button, IconButton } from '@mui/material';
import { keyframes } from '@emotion/react';
import {
  SidebarHeader as BaseSidebarHeader,
  SectionTitle as BaseSectionTitle,
  MetadataSection as BaseMetadataSection,
  MetaLabel as BaseMetaLabel,
  MetaValue as BaseMetaValue,
  StatusBadge as BaseStatusBadge,
  ViewTaskButton as BaseViewTaskButton,
  StartFocusButton as BaseStartFocusButton,
  MarkDoneButton as BaseMarkDoneButton,
} from '../../WorkspaceEditor.styles';

const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.5; }
`;

// Dynamic, stretchable Right Sidebar
export const RightSidebar = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'isOpen' && prop !== 'widthVal' && prop !== 'isDragging',
})<{ isOpen: boolean; widthVal: number; isDragging: boolean }>(
  ({ theme, isOpen, widthVal, isDragging }) => ({
    width: isOpen ? `${widthVal}px` : '60px',
    flexShrink: 0,
    transition: isDragging ? 'none' : 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    padding: isOpen ? '24px' : '24px 8px',
    borderLeft: `1px solid ${theme.palette.divider}`,
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    height: '100%',
    // Custom scrollbar
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.08)',
      borderRadius: '10px',
      '&:hover': {
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(0, 0, 0, 0.15)',
      },
    },
    colorScheme: theme.palette.mode,
  }),
);

// Col-resize Drag Handle
export const DragHandle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragging',
})<{ isDragging?: boolean }>(({ theme, isDragging }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '6px',
  cursor: 'col-resize',
  zIndex: 100,
  backgroundColor: isDragging ? theme.palette.primary.main : 'transparent',
  transition: 'background-color 0.2s ease, width 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    width: '6px',
  },
}));

export const SidebarHeader = BaseSidebarHeader;
export const SectionTitle = BaseSectionTitle;
export const MetadataSection = BaseMetadataSection;
export const MetaLabel = BaseMetaLabel;
export const MetaValue = BaseMetaValue;
export const StatusBadge = BaseStatusBadge;
export const ViewTaskButton = BaseViewTaskButton;
export const StartFocusButton = BaseStartFocusButton;
export const MarkDoneButton = BaseMarkDoneButton;

// Redesigned to be a single, cohesive vertical property list
export const PropertyGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '12px 16px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(0, 0, 0, 0.015)',
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: '24px',
}));

export const PropertyCard = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '32px',
  padding: '0 4px',
});

export const PropertyLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  width: '100px',
  flexShrink: 0,
}));

export const PropertyValue = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '13px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexGrow: 1,
  justifyContent: 'flex-start',
}));

export const SidebarSubtaskList = styled(Box)({
  marginBottom: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const SubtaskActions = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  opacity: 0,
  transition: 'opacity 0.2s ease, transform 0.2s ease',
  transform: 'translateX(4px)',
});

export const SidebarSubtaskItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'completed',
})<{ completed?: boolean }>(({ theme, completed }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 8px',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease',
  opacity: completed ? 0.6 : 1,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    paddingLeft: '12px',
  },
  [`&:hover ${SubtaskActions}`]: {
    opacity: 1,
    transform: 'translateX(0)',
  },
}));

export const ProgressSection = styled(Box)({
  marginBottom: '24px',
});

export const ProgressBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'value',
})<{ value: number }>(({ theme, value }) => ({
  height: '4px',
  width: '100%',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.05)',
  borderRadius: '2px',
  marginTop: '8px',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: `${value}%`,
    backgroundColor: theme.palette.primary.main,
    borderRadius: '2px',
    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
}));

export const SectionSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  marginTop: '24px',
  marginBottom: '12px',
  opacity: 0.8,
}));

export const DescriptionContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'transparent',
  borderLeft: `3px solid ${theme.palette.primary.main}40`,
  padding: '0px 16px',
  marginBottom: '24px',
  marginTop: '12px',
  fontSize: '13.5px',
  lineHeight: 1.6,
  color: theme.palette.text.primary,
  '& p': {
    margin: 0,
    marginBottom: '8px',
    '&:last-child': { marginBottom: 0 },
  },
  '& ul, & ol': { margin: '8px 0', paddingLeft: '20px' },
}));

export const DescriptionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: theme.palette.text.secondary,
  opacity: 0.8,
  marginBottom: '4px',
}));

export const SubtaskCheck = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'completed',
})<{ completed?: boolean }>(({ theme, completed }) => ({
  width: 18,
  height: 18,
  borderRadius: '50%',
  border: `1.5px solid ${completed ? theme.palette.primary.main : theme.palette.text.secondary}80`,
  backgroundColor: completed
    ? `${theme.palette.primary.main}15`
    : 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: `${theme.palette.primary.main}10`,
    transform: 'scale(1.05)',
  },
}));

export const FocusButton = styled(IconButton)(({ theme }) => ({
  padding: '4px',
  color: theme.palette.warning.main,
  opacity: 0.8,
  transition: 'all 0.2s ease',
  '&:hover': {
    opacity: 1,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    transform: 'scale(1.1)',
  },
}));

// Clean, modern link item container
export const ResourceItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 12px',
  borderRadius: '8px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(0, 0, 0, 0.015)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-1px)',
  },
}));

export const ResourceButton = styled(Button)(({ theme }) => ({
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'none',
  borderRadius: '6px',
  padding: '4px 10px',
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  backgroundColor: 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.text.secondary,
  },
}));

export const PulseIndicator = styled(Box)(({ theme }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  boxShadow: `0 0 8px ${theme.palette.primary.main}`,
  animation: `${pulse} 2s infinite ease-in-out`,
}));
