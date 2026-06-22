import { Box, Paper, styled, IconButton, Button } from '@mui/material';

export const ChatContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'rightOffset',
})<{ rightOffset?: number }>(({ rightOffset = 100 }) => ({
  position: 'fixed',
  bottom: '32px',
  right: `${rightOffset}px`,
  zIndex: 1300,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '16px',
  transition: 'right 0.3s ease',
}));

export const FloatingButton = styled(IconButton)(() => ({
  width: '60px',
  height: '60px',
  background: 'linear-gradient(135deg, #137fec 0%, #4f46e5 100%)',
  color: '#ffffff',
  boxShadow: '0 0 0 0 rgba(19,127,236,0.5), 0 8px 32px rgba(19,127,236,0.35)',
  transition:
    'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
  border: '2px solid rgba(255, 255, 255, 0.15)',
  animation: 'floatingPulse 2.8s ease-in-out infinite',
  '@keyframes floatingPulse': {
    '0%': {
      boxShadow:
        '0 0 0 0 rgba(19,127,236,0.45), 0 8px 28px rgba(19,127,236,0.3)',
    },
    '60%': {
      boxShadow:
        '0 0 0 10px rgba(19,127,236,0), 0 8px 28px rgba(19,127,236,0.3)',
    },
    '100%': {
      boxShadow: '0 0 0 0 rgba(19,127,236,0), 0 8px 28px rgba(19,127,236,0.3)',
    },
  },
  '&:hover': {
    transform: 'scale(1.12) translateY(-2px)',
    background: 'linear-gradient(135deg, #1e91ff 0%, #4f46e5 100%)',
    boxShadow: '0 12px 40px rgba(19,127,236,0.5)',
  },
}));

export const NotificationCard = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(30, 41, 59, 0.95)'
      : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(12px)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '16px',
  padding: '16px',
  width: '320px',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.4)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  marginBottom: '8px',
  '@keyframes slideIn': {
    from: { opacity: 0, transform: 'translateY(20px) scale(0.95)' },
    to: { opacity: 1, transform: 'translateY(0) scale(1)' },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    right: '24px',
    width: '16px',
    height: '16px',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(30, 41, 59, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
    transform: 'rotate(45deg)',
    borderRight: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

export const ChatWindow = styled(Paper)(({ theme }) => ({
  width: '380px',
  height: '600px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(15, 23, 42, 0.95)'
      : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 24px 48px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255,255,255,0.05)'
      : '0 24px 48px -12px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transformOrigin: 'bottom right',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
}));

export const Header = styled(Box)(({ theme }) => ({
  padding: '16px 20px',
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)'
      : 'linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const ModelBadgeButton = styled(Button)(({ theme }) => ({
  padding: '4px 10px',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '11px',
  fontWeight: 700,
  minWidth: 0,
  gap: '4px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.05)',
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.08)',
    borderColor: theme.palette.primary.main,
  },
}));

export const TokenCounterBadge = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  borderRadius: '8px',
  fontSize: '11px',
  fontWeight: 700,
  color: '#ffffff',
  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
}));

export const MessageList = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: '20px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: '3px',
  },
}));

export const MessageRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser: boolean }>(({ isUser }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  gap: '8px',
  maxWidth: '90%',
}));

export const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser?: boolean }>(({ theme, isUser }) => ({
  backgroundColor: isUser
    ? theme.palette.primary.main
    : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(0, 0, 0, 0.02)',
  color: isUser
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  ...(isUser && {
    background: 'linear-gradient(135deg, #137fec 0%, #4f46e5 100%)',
  }),
  padding: '12px 16px',
  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
  fontSize: '13.5px',
  lineHeight: '1.5',
  wordBreak: 'break-word',
  boxShadow: isUser
    ? '0 4px 12px rgba(19, 127, 236, 0.25)'
    : theme.palette.mode === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.15)'
      : 'none',
  border: isUser ? 'none' : `1px solid ${theme.palette.divider}`,
  backdropFilter: isUser ? 'none' : 'blur(8px)',
  '& p': { margin: 0, marginBottom: '6px' },
  '& p:last-child': { marginBottom: 0 },
  '& ul, & ol': { margin: '6px 0', paddingLeft: '20px' },
  '& li': { marginBottom: '4px' },
  '& code': {
    fontFamily: 'monospace',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.08)'
        : 'rgba(0,0,0,0.05)',
    padding: '2px 4px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  '& pre': {
    fontFamily: 'monospace',
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)',
    padding: '10px',
    borderRadius: '8px',
    overflowX: 'auto',
    fontSize: '12px',
    margin: '8px 0',
  },
}));

export const RobotIconWrapper = styled(Box)(({ theme }) => ({
  width: '32px',
  height: '32px',
  borderRadius: '10px',
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
  border: `1px solid ${theme.palette.primary.main}30`,
  boxShadow: `0 0 10px ${theme.palette.primary.main}15`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}));

export const AIAvatar = styled(Box)(({ theme }) => ({
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
  border: `1px solid ${theme.palette.primary.main}30`,
  boxShadow: `0 0 10px ${theme.palette.primary.main}15`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  flexShrink: 0,
}));

export const SuggestionGrid = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '0 20px',
  marginBottom: '16px',
});

export const SuggestionChip = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  textAlign: 'left',
  padding: '10px 14px',
  borderRadius: '12px',
  fontSize: '12px',
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
    transform: 'translateY(-1.5px)',
    boxShadow: `0 4px 12px ${theme.palette.primary.main}15`,
  },
}));

export const InputArea = styled(Box)(({ theme }) => ({
  padding: '16px',
  backgroundColor: theme.palette.background.default,
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: '8px',
  alignItems: 'flex-end',
}));

export const ChatInputWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '8px',
  padding: '10px 12px',
  borderRadius: '12px',
  flexGrow: 1,
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
  maxHeight: '100px',
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
  width: '32px',
  height: '32px',
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
