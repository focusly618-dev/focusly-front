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
  maxWidth: '860px',
  padding: '0 20px',
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
    paddingTop: '48px',
    paddingBottom: '32px',
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
  padding: '8px 0',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  '&:hover .msg-action-btn': {
    opacity: 0.85,
  },
}));

export const AvatarWrapper = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    flexShrink: 0,
    overflow: 'hidden',
    backgroundColor: isDark ? '#1e2029' : '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1.5px solid ${isDark ? 'rgba(99, 102, 241, 0.4)' : '#c7d2fe'}`,
    boxShadow: isDark
      ? '0 2px 8px rgba(0,0,0,0.4)'
      : '0 1px 4px rgba(99, 102, 241, 0.1)',
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
  backgroundColor: '#f97316', // Orange as in screenshot
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 700,
  marginTop: '2px',
  boxShadow: '0 2px 6px rgba(249, 115, 22, 0.25)',
}));

export const MessageBubble = styled(Box)<{ isUser?: boolean }>(
  ({ theme, isUser }) => ({
    maxWidth: '100%',
    padding: isUser ? '10px 16px' : '16px 20px',
    borderRadius: isUser ? '18px 18px 4px 18px' : '16px',
    backgroundColor: isUser
      ? '#2563eb' // Modern vibrant blue
      : theme.palette.mode === 'dark'
        ? surfaceColor(theme, '#18181b', '#202022', '#ffffff')
        : '#ffffff',
    color: isUser ? '#ffffff' : theme.palette.text.primary,
    fontSize: '14px',
    lineHeight: '1.65',
    border: isUser
      ? 'none'
      : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'}`,
    boxShadow: isUser
      ? '0 2px 8px rgba(37, 99, 235, 0.2)'
      : theme.palette.mode === 'dark'
        ? '0 2px 10px rgba(0,0,0,0.3)'
        : '0 1px 3px rgba(0,0,0,0.03)',
    '& p': { margin: '0 0 10px 0', '&:last-child': { margin: 0 } },
    '& strong': { fontWeight: 700 },
    '& code': {
      fontFamily: 'monospace',
      fontSize: '12.5px',
      backgroundColor: isUser
        ? 'rgba(255,255,255,0.2)'
        : theme.palette.mode === 'dark'
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(0,0,0,0.05)',
      padding: '2px 6px',
      borderRadius: '5px',
    },
  }),
);

/* ── Date separator pill ───────────────────────────────────────────────────── */

export const DateSeparator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  margin: '18px 0 14px 0',
  '& .date-pill': {
    padding: '4px 14px',
    borderRadius: '20px',
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(0, 0, 0, 0.02)',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: theme.palette.text.secondary,
    userSelect: 'none',
  },
}));

/* ── Lumina AI Message Card and Header ─────────────────────────────────────── */

export const AIMessageWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '82%',
  width: '100%',
  alignItems: 'flex-start',
});

export const AIMessageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '6px',
  paddingLeft: '2px',
  '& .ai-title': {
    fontSize: '13px',
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
  '& .ai-time': {
    fontSize: '11px',
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
}));

export const AIMessageActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginTop: '8px',
  paddingLeft: '4px',
  '& .action-btn': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    padding: '2px 6px',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
    '&:hover': {
      color: theme.palette.text.primary,
      backgroundColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.06)'
          : 'rgba(0, 0, 0, 0.04)',
    },
  },
}));

/* ── Suggestions Bar ───────────────────────────────────────────────────────── */

export const SuggestionsBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  maxWidth: '860px',
  padding: '0 6px',
  marginBottom: '10px',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
  '& .sug-label': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: 700,
    color: '#2563eb',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  '& .sug-pill': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 13px',
    borderRadius: '20px',
    border: `1px solid ${
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'
    }`,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? surfaceColor(theme, '#18181b', '#202022', '#ffffff')
        : '#ffffff',
    color: theme.palette.text.primary,
    fontSize: '12px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.18s ease',
    '&:hover': {
      borderColor: '#2563eb',
      backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.1)' : '#eff6ff',
      color: '#2563eb',
      transform: 'translateY(-1px)',
    },
  },
}));

/* ── Typing indicator ──────────────────────────────────────────────────────── */

export const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 18px',
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#ffffff',
  width: 'fit-content',
}));

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
    backgroundColor: '#2563eb',
    animation: 'luminaPulseDot 1s ease-in-out infinite',
    '&:nth-of-type(2)': { animationDelay: '0.15s' },
    '&:nth-of-type(3)': { animationDelay: '0.3s' },
  },
}));

/* ── Input area (Pill Design) ──────────────────────────────────────────────── */

export const InputWrapper = styled(Box)(({ theme }) => ({
  padding: '10px 20px 14px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.background.default,
}));

export const InputBox = styled(Paper)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 6px 4px 14px',
    borderRadius: '9999px', // Modern full pill container
    width: '100%',
    maxWidth: '860px',
    backgroundColor: isDark
      ? surfaceColor(theme, '#18181B', '#1F1F20', '#ffffff')
      : '#ffffff',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'}`,
    boxShadow: isDark
      ? '0 4px 20px rgba(0, 0, 0, 0.25)'
      : '0 2px 10px rgba(0, 0, 0, 0.04)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    '&:focus-within': {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.15)',
    },
  };
});

export const StyledInput = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiInputBase-root': {
    padding: 0,
    fontSize: '13.5px',
    color: theme.palette.text.primary,
    background: 'transparent',
    '&::before, &::after': { display: 'none' },
  },
  '& .MuiInputBase-input': {
    padding: '8px 4px',
    lineHeight: 1.5,
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.9,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '& .MuiFilledInput-underline:before': { display: 'none' },
  '& .MuiFilledInput-underline:after': { display: 'none' },
}));

export const SendButton = styled(IconButton)<{ active?: boolean }>(
  ({ theme, active }) => ({
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    flexShrink: 0,
    backgroundColor: active
      ? '#2563eb'
      : theme.palette.action.disabledBackground,
    color: active ? '#ffffff' : theme.palette.text.disabled,
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '&:hover': active
      ? {
          backgroundColor: '#1d4ed8',
          transform: 'scale(1.05)',
        }
      : {},
  }),
);

/* ── History Sidebar (Slide-over / Collapsible) ────────────────────────────── */

export const HistorySidebar = styled(Box)<{ isOpen?: boolean }>(
  ({ theme, isOpen = true }) => ({
    width: isOpen ? '300px' : '0px',
    height: '100%',
    backgroundColor: surfaceColor(theme, '#131518', '#1c1d20', '#ffffff'),
    borderLeft: isOpen ? `1px solid ${theme.palette.divider}` : 'none',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    overflow: 'hidden',
    transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    zIndex: 20,
    '@media (max-width: 768px)': {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: isOpen ? '280px' : '0px',
      boxShadow: isOpen ? '-4px 0 24px rgba(0,0,0,0.25)' : 'none',
    },
  }),
);

export const ChatAreaWrapper = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
});

export const ChatHeader = styled(Box)(({ theme }) => ({
  height: '64px',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: surfaceColor(
    theme,
    'rgba(15, 15, 16, 0.85)',
    'rgba(36, 36, 37, 0.4)',
    '#ffffff',
  ),
  backdropFilter: 'blur(10px)',
  zIndex: 10,
}));

export const ModelBadgeButton = styled(Button)(({ theme }) => ({
  padding: '4px 12px',
  borderRadius: '20px',
  textTransform: 'none',
  fontSize: '12px',
  fontWeight: 600,
  minWidth: 0,
  gap: '6px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.02)',
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.09)'
        : 'rgba(0, 0, 0, 0.05)',
    borderColor: '#2563eb',
  },
}));

export const StatusPill = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '2px 8px',
  borderRadius: '12px',
  backgroundColor: '#f0fdf4',
  color: '#16a34a',
  border: '1px solid #bbf7d0',
  fontSize: '11px',
  fontWeight: 600,
  lineHeight: 1,
  '& .status-dot': {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
  },
}));
