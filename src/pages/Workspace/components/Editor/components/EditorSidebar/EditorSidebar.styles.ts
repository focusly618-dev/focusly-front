import { styled, Box, Typography, Button } from '@mui/material';
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

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const EmptyStateContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 16px',
  textAlign: 'center',
  animation: `${fadeIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
}));

export const EmptyStateIconWrapper = styled(Box)(({ theme }) => ({
  width: '68px',
  height: '68px',
  borderRadius: '20px',
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0.02) 100%)',
  border: `1px solid ${theme.palette.primary.main}20`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  position: 'relative',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 8px 24px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.02)'
      : '0 8px 24px rgba(99, 102, 241, 0.06)',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: theme.palette.primary.main,
    boxShadow:
      theme.palette.mode === 'dark'
        ? `0 12px 28px rgba(99, 102, 241, 0.15), 0 0 12px ${theme.palette.primary.main}30`
        : `0 12px 28px rgba(99, 102, 241, 0.1), 0 0 12px ${theme.palette.primary.main}20`,
  },
}));

export const EmptyStateTipCard = styled(Box)(({ theme }) => ({
  marginTop: '28px',
  padding: '14px 16px',
  borderRadius: '12px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.015)'
      : 'rgba(0, 0, 0, 0.01)',
  border: `1px dashed ${theme.palette.divider}`,
  width: '100%',
  maxWidth: '280px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}));
