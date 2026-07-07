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
  gap: '12px',
  transition: 'right 0.3s ease',
}));

export const FloatingButton = styled(IconButton)(({ theme }) => ({
  width: '56px',
  height: '56px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
  color: theme.palette.mode === 'dark' ? '#f5f5f5' : '#37352f',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
  transition:
    'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#2e2e2e' : '#f7f7f5',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.06)',
    transform: 'translateY(-1px)',
  },
}));

export const NotificationCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  padding: '14px 16px',
  width: '300px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
  position: 'relative',
  animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  marginBottom: '4px',
  color: theme.palette.mode === 'dark' ? '#f5f5f5' : '#37352f',
  '@keyframes slideIn': {
    from: { opacity: 0, transform: 'translateY(12px) scale(0.98)' },
    to: { opacity: 1, transform: 'translateY(0) scale(1)' },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    right: '24px',
    width: '16px',
    height: '16px',
    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
    transform: 'rotate(45deg)',
    borderRight: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

export const ChatWindow = styled(Paper)(({ theme }) => ({
  width: '380px',
  maxWidth: 'calc(100vw - 32px)',
  height: '600px',
  maxHeight: 'calc(100vh - 100px)',
  backgroundColor: theme.palette.mode === 'dark' ? '#191919' : '#ffffff',
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 12px 32px rgba(0, 0, 0, 0.45), 0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 12px 32px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transformOrigin: 'bottom right',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
}));

export const Header = styled(Box)(({ theme }) => ({
  padding: '14px 16px',
  backgroundColor: theme.palette.mode === 'dark' ? '#202020' : '#f7f7f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: '8px',
  minHeight: '56px',
  flexShrink: 0,
  overflow: 'hidden',
}));

export const ModelBadgeButton = styled(Button)(({ theme }) => ({
  padding: '4px 8px',
  borderRadius: '6px',
  textTransform: 'none',
  fontSize: '11px',
  fontWeight: 600,
  minWidth: 0,
  gap: '4px',
  backgroundColor: 'transparent',
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.03)',
    borderColor: theme.palette.text.primary,
    color: theme.palette.text.primary,
  },
}));

export const TokenCounterBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '10px',
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? '#f5f5f5' : '#37352f',
  backgroundColor: theme.palette.mode === 'dark' ? '#2e2e2e' : '#f1f1ef',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  flexShrink: 0,
  whiteSpace: 'nowrap',
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
    ? theme.palette.mode === 'dark'
      ? '#2f2f2f'
      : '#f1f1ef'
    : 'transparent',
  color: theme.palette.text.primary,
  padding: '8px 12px',
  borderRadius: '8px',
  fontSize: '13.5px',
  lineHeight: '1.6',
  wordBreak: 'break-word',
  boxShadow: 'none',
  border: isUser ? 'none' : `1px solid ${theme.palette.divider}`,
  '& p': { margin: 0, marginBottom: '6px' },
  '& p:last-child': { marginBottom: 0 },
  '& ul, & ol': { margin: '6px 0', paddingLeft: '20px' },
  '& li': { marginBottom: '4px' },
  '& code': {
    fontFamily: 'monospace',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.06)'
        : 'rgba(0,0,0,0.04)',
    padding: '2px 4px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  '& pre': {
    fontFamily: 'monospace',
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)',
    padding: '10px',
    borderRadius: '6px',
    overflowX: 'auto',
    fontSize: '12px',
    margin: '8px 0',
  },
}));

export const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  padding: '8px 12px',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: 'transparent',
  width: 'fit-content',
  alignSelf: 'flex-start',
  '@keyframes dotBounce': {
    '0%, 80%, 100%': { transform: 'translateY(0)', opacity: 0.4 },
    '40%': { transform: 'translateY(-4px)', opacity: 1 },
  },
  '& .dot': {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: theme.palette.text.secondary,
    animation: 'dotBounce 1.2s ease-in-out infinite',
    '&:nth-of-type(2)': { animationDelay: '0.2s' },
    '&:nth-of-type(3)': { animationDelay: '0.4s' },
  },
}));

export const RobotIconWrapper = styled(Box)(({ theme }) => ({
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  backgroundColor: theme.palette.mode === 'dark' ? '#2e2e2e' : '#f1f1ef',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

export const AIAvatar = styled(Box)(({ theme }) => ({
  width: '28px',
  height: '28px',
  borderRadius: '6px',
  backgroundColor: theme.palette.mode === 'dark' ? '#2e2e2e' : '#f1f1ef',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
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
  padding: '12px',
  backgroundColor: theme.palette.background.default,
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: '6px',
  alignItems: 'flex-end',
  flexShrink: 0,
  minWidth: 0,
  overflow: 'hidden',
}));

export const ChatInputWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '6px',
  padding: '6px 10px',
  borderRadius: '8px',
  flexGrow: 1,
  minWidth: 0,
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? '#222222' : '#f7f7f5',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'border-color 0.15s ease, background-color 0.15s ease',
  '&:focus-within': {
    borderColor: theme.palette.mode === 'dark' ? '#4f4f4f' : '#dfdfde',
    backgroundColor: theme.palette.mode === 'dark' ? '#252525' : '#ffffff',
  },
}));

export const ChatTextArea = styled('textarea')(({ theme }) => ({
  flexGrow: 1,
  flexShrink: 1,
  minWidth: 0,
  border: 'none',
  resize: 'none',
  outline: 'none',
  background: 'transparent',
  color: theme.palette.text.primary,
  fontFamily: 'inherit',
  fontSize: '13.5px',
  lineHeight: 1.5,
  maxHeight: '100px',
  minHeight: '24px',
  padding: '4px 0',
  '&::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 0.6,
  },
}));

export const SendButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#37352f',
  backgroundColor: 'transparent',
  borderRadius: '6px',
  width: '30px',
  height: '30px',
  padding: 0,
  flexShrink: 0,
  transition: 'all 0.2s ease',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)',
  },
  '&:disabled': {
    color: theme.palette.action.disabled,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
}));
