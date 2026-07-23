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
    padding: 0,
    borderLeft: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      display: isOpen ? 'flex' : 'none',
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1200,
      borderLeft: 'none',
      padding: 0,
    },
  }),
);

export const SidebarHeaderTop = styled(Box)(({ theme }) => ({
  height: '60px',
  minHeight: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxSizing: 'border-box',
  flexShrink: 0,
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('md')]: {
    height: '56px',
    padding: '0 16px',
  },
}));

export const SidebarBody = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
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
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(0, 0, 0, 0.12)',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.25)'
          : 'rgba(0, 0, 0, 0.2)',
    },
  },
}));

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

export const PropertyGrid = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '24px',
}));

export const PropertyCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 0px',
  borderBottom: `1px solid ${
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)'
  }`,
}));

export const PropertyLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '11px',
  fontWeight: 700,
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
  justifyContent: 'flex-end',
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
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.08)' : '#f0f4fe',
  borderRadius: '12px',
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(59, 130, 246, 0.2)'
      : '1px solid rgba(59, 130, 246, 0.12)',
  padding: '16px',
  marginBottom: '24px',
  marginTop: '12px',
  fontSize: '13px',
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

export const SidebarTabs = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: '20px',
  gap: '16px',
}));

export const TabItem = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
  flex: 1,
  padding: '10px 0',
  borderRadius: 0,
  borderBottom: `2px solid ${active ? theme.palette.primary.main : 'transparent'}`,
  color: active ? theme.palette.text.primary : theme.palette.text.secondary,
  fontWeight: active ? 700 : 500,
  fontSize: '13px',
  letterSpacing: '0.5px',
  minWidth: 0,
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
  },
}));

export const ChatContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  position: 'relative',
});

export const ChatViewport = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  paddingRight: '4px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '16px',
  // Custom scrollbar
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.06)',
    borderRadius: '10px',
  },
}));

export const MessageRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser: boolean }>(({ isUser }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  alignItems: 'flex-start',
  gap: '10px',
}));

export const AIAvatar = styled(Box)(({ theme }) => ({
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
  border: `1px solid ${theme.palette.primary.main}30`,
  boxShadow: `0 0 10px ${theme.palette.primary.main}15`,
  color: theme.palette.primary.main,
}));

export const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  maxWidth: '85%',
  padding: '12px 16px',
  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
  fontSize: '13.5px',
  lineHeight: 1.5,
  wordBreak: 'break-word',
  whiteSpace: 'normal',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.15)'
      : '0 2px 8px rgba(0, 0, 0, 0.04)',
  ...(isUser
    ? {
        background: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)',
        color: '#ffffff',
        border: 'none',
      }
    : {
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(0, 0, 0, 0.02)',
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        '& > p': { margin: 0, marginBottom: '8px' },
        '& > p:last-child': { marginBottom: 0 },
        '& > ul, & > ol': { margin: '8px 0', paddingLeft: '20px' },
        '& > :first-of-type': { marginTop: 0 },
        '& > :last-child': { marginBottom: 0 },
        '& li': { marginBottom: '4px' },
        '& a': {
          color: theme.palette.primary.light,
          textDecoration: 'underline',
          fontWeight: 600,
        },
        '& code': {
          fontFamily: 'monospace',
          backgroundColor: 'rgba(255,255,255,0.06)',
          padding: '2px 4px',
          borderRadius: '4px',
          fontSize: '12px',
        },
        '& pre': {
          fontFamily: 'monospace',
          backgroundColor: 'rgba(0,0,0,0.2)',
          padding: '10px',
          borderRadius: '8px',
          overflowX: 'auto',
          fontSize: '12px',
          margin: '8px 0',
        },
      }),
}));

export const SuggestionGrid = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '16px',
});

export const SuggestionChip = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  textAlign: 'left',
  padding: '10px 14px',
  borderRadius: '10px',
  fontSize: '12.5px',
  textTransform: 'none',
  fontWeight: 500,
  color: theme.palette.text.primary,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(0, 0, 0, 0.01)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(99, 102, 241, 0.08)'
        : 'rgba(19, 127, 236, 0.05)',
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 12px ${theme.palette.primary.main}15`,
  },
}));

export const ChatInputWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '8px',
  padding: '10px 12px',
  borderRadius: '12px',
  backgroundColor:
    theme.palette.mode === 'dark' ? '#1A1F2B' : 'rgba(0,0,0,0.015)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${theme.palette.primary.main}25`,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(26, 31, 43, 0.95)' : undefined,
  },
}));

export const ChatTextArea = styled('textarea')(({ theme }) => ({
  flexGrow: 1,
  border: 'none',
  resize: 'none',
  outline: 'none',
  background: 'transparent',
  color: theme.palette.text.primary,
  fontFamily: 'inherit',
  fontSize: '13px',
  lineHeight: 1.5,
  maxHeight: '120px',
  minHeight: '24px',
  padding: '4px 0',
  '&::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 0.8,
  },
}));

export const SendButton = styled(IconButton)(({ theme }) => ({
  color: '#ffffff',
  backgroundColor: theme.palette.primary.main,
  borderRadius: '8px',
  width: '30px',
  height: '30px',
  padding: 0,
  flexShrink: 0,
  transition: 'all 0.2s ease',
  boxShadow: `0 2px 8px ${theme.palette.primary.main}30`,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 12px ${theme.palette.primary.main}45`,
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    boxShadow: 'none',
  },
}));
