import {
  Box,
  Paper,
  TextField,
  styled,
  IconButton,
  Button,
} from '@mui/material';
import { surfaceColor } from '@/context';

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

export const WelcomeSection = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  const isGray = theme.appMode === 'graydark';
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: '60px',
    paddingBottom: '36px',
    gap: '12px',
    position: 'relative',
    width: '100%',
    '&::before': isDark
      ? {
          content: '""',
          position: 'absolute',
          top: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '280px',
          background: isGray
            ? 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.03) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(96, 165, 250, 0.08) 0%, rgba(32, 32, 36, 0.04) 50%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(30px)',
        }
      : {},
  };
});

export const MascotWrapper = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  const isGray = theme.appMode === 'graydark';
  return {
    width: '88px',
    height: '88px',
    borderRadius: '50%',
    position: 'relative',
    zIndex: 1,
    background: surfaceColor(
      theme,
      'radial-gradient(circle at 35% 35%, #242429 0%, #121214 100%)',
      'radial-gradient(circle at 35% 35%, #2A2A2C 0%, #19191A 100%)',
      'radial-gradient(circle at 35% 35%, #dbeafe 0%, #eff6ff 100%)',
    ),
    border: `1px solid ${
      isDark
        ? isGray
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(96, 165, 250, 0.22)'
        : 'rgba(19, 127, 236, 0.15)'
    }`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: isDark
      ? isGray
        ? '0 0 0 8px rgba(255, 255, 255, 0.02), 0 8px 32px rgba(0,0,0,0.5)'
        : '0 0 0 8px rgba(96, 165, 250, 0.05), 0 8px 32px rgba(0,0,0,0.6), 0 0 28px rgba(96, 165, 250, 0.12)'
      : '0 0 0 12px rgba(19, 127, 236, 0.07), 0 8px 32px rgba(19, 127, 236, 0.15)',
    marginBottom: '8px',
  };
});

/* ── Suggestion cards ──────────────────────────────────────────────────────── */

export const SuggestionGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px',
  width: '100%',
  marginTop: '8px',
  position: 'relative',
  zIndex: 1,
  '@media (max-width: 600px)': {
    gridTemplateColumns: '1fr',
  },
});

export const SuggestionCard = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  const isGray = theme.appMode === 'graydark';
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    borderRadius: '16px',
    border: `1px solid ${
      isDark
        ? isGray
          ? 'rgba(255, 255, 255, 0.07)'
          : 'rgba(255, 255, 255, 0.08)'
        : theme.palette.divider
    }`,
    backgroundColor: isDark
      ? surfaceColor(theme, '#18181B', '#242425', 'rgba(241, 245, 249, 0.5)')
      : 'rgba(241, 245, 249, 0.5)',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    userSelect: 'none',
    boxShadow: isDark
      ? '0 2px 8px rgba(0,0,0,0.35)'
      : '0 1px 3px rgba(0,0,0,0.02)',
    '&:hover': {
      transform: 'translateY(-2px)',
      borderColor: theme.palette.primary.main,
      backgroundColor: isDark
        ? surfaceColor(theme, '#202024', '#2C2C2E', '#ffffff')
        : '#ffffff',
      boxShadow: isDark
        ? '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(96, 165, 250, 0.1)'
        : '0 10px 30px rgba(79, 70, 229, 0.06)',
    },
    '&:active': {
      transform: 'translateY(0px)',
    },
  };
});

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

export const AvatarWrapper = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    flexShrink: 0,
    overflow: 'hidden',
    background: surfaceColor(
      theme,
      'linear-gradient(135deg, #242429 0%, #121214 100%)',
      'linear-gradient(135deg, #2A2A2C 0%, #19191A 100%)',
      'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
    ),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1.5px solid ${isDark ? 'rgba(96, 165, 250, 0.25)' : theme.palette.divider}`,
    marginTop: '2px',
  };
});

export const UserAvatar = styled(Box)(() => ({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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

// Bubble shell for the "Lumina is working" status while waiting for the
// first token — the shimmer text + pulse dots inside come from
// LuminaWorkingIndicator below.
export const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px 14px',
  borderRadius: '16px 16px 16px 4px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.02)'
      : 'rgba(0,0,0,0.015)',
  width: 'fit-content',
}));

/* ── "Lumina is working" inline indicator (shown while an [ACTION:...] tag
   is still streaming in, instead of the raw tag text) ──────────────────── */

export const LuminaWorkingIndicator = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '7px',
  '@keyframes luminaShimmer': {
    '0%': { backgroundPosition: '160% 0' },
    '100%': { backgroundPosition: '-160% 0' },
  },
  '& .shimmer-text': {
    fontSize: '13px',
    fontWeight: 600,
    backgroundImage: `linear-gradient(90deg, ${theme.palette.text.disabled} 35%, ${theme.palette.text.primary} 50%, ${theme.palette.text.disabled} 65%)`,
    backgroundSize: '260% 100%',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    animation: 'luminaShimmer 1.6s linear infinite',
  },
  '@keyframes luminaPulseDot': {
    '0%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
    '50%': { opacity: 1, transform: 'scale(1)' },
  },
  '& .pulse-dots': {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },
  '& .pulse-dot': {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    animation: 'luminaPulseDot 1s ease-in-out infinite',
    '&:nth-of-type(2)': { animationDelay: '0.15s' },
    '&:nth-of-type(3)': { animationDelay: '0.3s' },
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

export const InputBox = styled(Paper)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    padding: '8px 10px 8px 16px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '780px',
    backgroundColor: isDark
      ? surfaceColor(theme, '#18181B', '#1F1F20', 'rgba(255,255,255,0.95)')
      : 'rgba(255,255,255,0.95)',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : theme.palette.divider}`,
    boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.25)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    '&:focus-within': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 3px ${theme.palette.primary.main}25`,
    },
  };
});

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
  backgroundColor: surfaceColor(
    theme,
    'rgba(18, 18, 20, 0.85)',
    'rgba(36, 36, 37, 0.6)',
    'rgba(248, 250, 252, 0.8)',
  ),
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
  backgroundColor: surfaceColor(
    theme,
    'rgba(15, 15, 16, 0.85)',
    'rgba(36, 36, 37, 0.4)',
    'rgba(255, 255, 255, 0.4)',
  ),
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
