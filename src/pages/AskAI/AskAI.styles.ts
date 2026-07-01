import {
  Box,
  Paper,
  TextField,
  styled,
  IconButton,
  Button,
} from '@mui/material';

/* ── Layout containers ─────────────────────────────────────────────────────── */

export const AskAIContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  height: '100%',
  width: '100%',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
}));

export const ChatScrollArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: '12px',
  '&::-webkit-scrollbar': { width: '6px' },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: '3px',
  },
}));

export const CenteredColumn = styled(Box)({
  width: '100%',
  maxWidth: '780px',
  padding: '0 24px',
});

/* ── Welcome / Hero ────────────────────────────────────────────────────────── */

export const WelcomeSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  paddingTop: '60px',
  paddingBottom: '36px',
  gap: '12px',
});

export const MascotWrapper = styled(Box)(({ theme }) => ({
  width: '88px',
  height: '88px',
  borderRadius: '50%',
  background:
    theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at 35% 35%, #1e3a5f 0%, #0d1117 100%)'
      : 'radial-gradient(circle at 35% 35%, #dbeafe 0%, #eff6ff 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 12px rgba(19, 127, 236, 0.07), 0 8px 32px rgba(0,0,0,0.4)'
      : '0 0 0 12px rgba(19, 127, 236, 0.07), 0 8px 32px rgba(19, 127, 236, 0.15)',
  marginBottom: '8px',
}));

/* ── Suggestion cards ──────────────────────────────────────────────────────── */

export const SuggestionGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px',
  width: '100%',
  marginTop: '8px',
  '@media (max-width: 600px)': {
    gridTemplateColumns: '1fr',
  },
});

export const SuggestionCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '14px 16px',
  borderRadius: '14px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.03)'
      : 'rgba(255,255,255,0.8)',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
  backdropFilter: 'blur(8px)',
  userSelect: 'none',
  '&:hover': {
    transform: 'translateY(-2px)',
    borderColor: theme.palette.primary.main,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(19, 127, 236, 0.08)'
        : 'rgba(19, 127, 236, 0.05)',
    boxShadow: `0 4px 20px rgba(19, 127, 236, 0.15)`,
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
}));

/* ── Message area ──────────────────────────────────────────────────────────── */

export const MessageRow = styled(Box)<{ isUser?: boolean }>(({ isUser }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '12px',
  width: '100%',
  padding: '6px 0',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  '&:hover .msg-action-btn': {
    opacity: 0.85,
  },
}));

export const AvatarWrapper = styled(Box)(({ theme }) => ({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  flexShrink: 0,
  overflow: 'hidden',
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #0f2d55 0%, #1a1f2e 100%)'
      : 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1.5px solid ${theme.palette.divider}`,
  marginTop: '2px',
}));

export const UserAvatar = styled(Box)(({ theme }) => ({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  fontSize: '13px',
  fontWeight: 700,
  marginTop: '2px',
}));

export const MessageBubble = styled(Box)<{ isUser?: boolean }>(
  ({ theme, isUser }) => ({
    maxWidth: '78%',
    padding: '10px 14px',
    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
    backgroundColor: isUser
      ? theme.palette.primary.main
      : theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.02)'
        : 'rgba(0,0,0,0.015)',
    color: isUser ? '#fff' : theme.palette.text.primary,
    fontSize: '13.5px',
    lineHeight: '1.5',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
    '& p': { margin: 0 },
    '& strong': { fontWeight: 700 },
    '& code': {
      fontFamily: 'monospace',
      fontSize: '12px',
      backgroundColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(0,0,0,0.05)',
      padding: '1px 5px',
      borderRadius: '4px',
    },
  }),
);

/* ── Typing indicator ──────────────────────────────────────────────────────── */

export const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  padding: '10px 14px',
  borderRadius: '16px 16px 16px 4px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.02)'
      : 'rgba(0,0,0,0.015)',
  width: 'fit-content',
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

/* ── Input area ────────────────────────────────────────────────────────────── */

export const InputWrapper = styled(Box)(({ theme }) => ({
  padding: '16px 24px 20px',
  display: 'flex',
  justifyContent: 'center',
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}));

export const InputBox = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '8px',
  padding: '8px 10px 8px 16px',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '780px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.02)'
      : 'rgba(255,255,255,0.95)',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${theme.palette.primary.main}25`,
  },
}));

export const StyledInput = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiInputBase-root': {
    padding: 0,
    fontSize: '14px',
    color: theme.palette.text.primary,
    background: 'transparent',
    '&::before, &::after': { display: 'none' },
  },
  '& .MuiInputBase-input': {
    padding: '6px 0',
    lineHeight: 1.6,
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 1,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '& .MuiFilledInput-underline:before': { display: 'none' },
  '& .MuiFilledInput-underline:after': { display: 'none' },
}));

export const SendButton = styled(IconButton)<{ active?: boolean }>(
  ({ theme, active }) => ({
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    flexShrink: 0,
    backgroundColor: active
      ? theme.palette.primary.main
      : theme.palette.action.disabledBackground,
    color: active ? '#fff' : theme.palette.text.disabled,
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '&:hover': active
      ? {
          backgroundColor: theme.palette.primary.dark,
          transform: 'scale(1.08)',
        }
      : {},
  }),
);

export const HistorySidebar = styled(Box)(({ theme }) => ({
  width: '260px',
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(15, 23, 42, 0.6)'
      : 'rgba(248, 250, 252, 0.8)',
  borderLeft: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  transition: 'width 0.2s',
  '@media (max-width: 768px)': {
    width: '0px',
    overflow: 'hidden',
    borderLeft: 'none',
  },
}));

export const ChatAreaWrapper = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
});

export const ChatHeader = styled(Box)(({ theme }) => ({
  height: '52px',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(15, 23, 42, 0.4)'
      : 'rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(10px)',
  zIndex: 10,
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
