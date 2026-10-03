import { Box, ButtonBase, IconButton, alpha, styled } from '@mui/material';
import { surfaceColor } from '@/context';

const BRAND = '#008767';
const BRAND_DARK = '#007357';

/* ── Dock: fixed to the viewport so it stays put on long documents ──── */

export const Dock = styled(Box)(({ theme }) => ({
  position: 'fixed',
  left: '50%',
  bottom: 28,
  transform: 'translateX(-50%)',
  zIndex: 1200,
  width: 'min(640px, calc(100vw - 32px))',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    bottom: 8,
    width: 'calc(100vw - 16px)',
  },
}));

export const Launcher = styled(ButtonBase)(({ theme }) => ({
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 1, 0.75, 1.25),
  borderRadius: 999,
  fontFamily: 'inherit',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(BRAND, 0.35)}`,
  boxShadow: `0 8px 28px ${alpha('#000', theme.palette.mode === 'dark' ? 0.45 : 0.12)}, 0 0 0 4px ${alpha(BRAND, 0.06)}`,
  transition:
    'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    borderColor: BRAND,
    boxShadow: `0 10px 32px ${alpha('#000', theme.palette.mode === 'dark' ? 0.5 : 0.14)}, 0 0 0 5px ${alpha(BRAND, 0.1)}`,
  },
  '&.Mui-focusVisible': {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 2,
  },
}));

export const Kbd = styled('kbd')(({ theme }) => ({
  fontFamily: 'inherit',
  fontSize: '0.7rem',
  fontWeight: 600,
  lineHeight: 1,
  padding: '3px 6px',
  borderRadius: 6,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.action.hover,
  border: `1px solid ${theme.palette.divider}`,
}));

/* ── Panel ───────────────────────────────────────────────────────────── */

export const Panel = styled(Box)(({ theme }) => ({
  width: '100%',
  maxHeight: 'min(68vh, 680px)',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 20,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: `0 24px 60px ${alpha('#000', theme.palette.mode === 'dark' ? 0.55 : 0.18)}`,
  animation: 'editorAiIn 0.18s ease-out',
  '@keyframes editorAiIn': {
    from: { opacity: 0, transform: 'translateY(8px) scale(0.99)' },
    to: { opacity: 1, transform: 'translateY(0) scale(1)' },
  },
  [theme.breakpoints.down('sm')]: {
    maxHeight: '78vh',
    borderRadius: 16,
  },
}));

export const PanelHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  padding: theme.spacing(1.25, 1.25, 1.25, 1.75),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const AvatarFrame = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: 10,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: surfaceColor(theme, '#1e2029', '#2C2C2C', '#ffffff'),
  border: `1.5px solid ${theme.palette.mode === 'dark' ? alpha(BRAND, 0.4) : '#a7f3d0'}`,
}));

export const Thread = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: theme.spacing(2, 1.75),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  '&::-webkit-scrollbar': { width: 6 },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.divider,
    borderRadius: 3,
  },
}));

/* ── Messages ────────────────────────────────────────────────────────── */

export const UserBubble = styled(Box)(({ theme }) => ({
  alignSelf: 'flex-end',
  maxWidth: '85%',
  padding: theme.spacing(1.1, 1.75),
  borderRadius: '16px 16px 4px 16px',
  backgroundColor: BRAND,
  color: '#ffffff',
  fontSize: '0.875rem',
  lineHeight: 1.55,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  boxShadow: `0 2px 8px ${alpha(BRAND, 0.2)}`,
}));

export const QuoteBlock = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(0.75),
  padding: theme.spacing(0.5, 1),
  borderLeft: '2px solid rgba(255, 255, 255, 0.55)',
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.12)',
  fontSize: '0.8rem',
  fontStyle: 'italic',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));

export const AssistantBlock = styled(Box)({
  alignSelf: 'stretch',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

export const AssistantBubble = styled(Box)(({ theme }) => ({
  maxWidth: '100%',
  padding: theme.spacing(1.25, 1.75),
  borderRadius: '16px 16px 16px 4px',
  backgroundColor: surfaceColor(theme, '#1b1c21', '#2A2A2B', '#f8fafc'),
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  fontSize: '0.875rem',
  lineHeight: 1.65,
  wordBreak: 'break-word',
}));

export const MessageActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  marginTop: theme.spacing(0.5),
}));

export const MessageActionButton = styled(ButtonBase)(({ theme }) => ({
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.4, 0.75),
  borderRadius: 6,
  fontFamily: 'inherit',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  transition: 'color 0.15s ease, background-color 0.15s ease',
  '& svg': { fontSize: 15 },
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-disabled': { opacity: 0.5 },
  '&.Mui-focusVisible': {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 1,
  },
}));

export const FragmentBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  padding: theme.spacing(1, 1.25),
  borderRadius: 10,
  border: `1px dashed ${alpha(BRAND, 0.5)}`,
  backgroundColor: alpha(BRAND, 0.05),
  whiteSpace: 'pre-wrap',
  fontSize: '0.85rem',
}));

export const StatusLine = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(0.75),
  fontSize: '0.8rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

/* ── Footer: quick actions, review bar, input ───────────────────────── */

export const Footer = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1, 1.25, 1.25),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const ChipRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.75),
  overflowX: 'auto',
  paddingBottom: 2,
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
}));

export const ActionChip = styled(ButtonBase)(({ theme }) => ({
  flexShrink: 0,
  gap: theme.spacing(0.6),
  padding: theme.spacing(0.55, 1.1),
  borderRadius: 999,
  fontFamily: 'inherit',
  fontSize: '0.775rem',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  transition: 'border-color 0.15s ease, background-color 0.15s ease',
  '& svg': { fontSize: 15, color: BRAND },
  '&:hover': {
    borderColor: BRAND,
    backgroundColor: alpha(BRAND, 0.06),
  },
  '&.Mui-disabled': { opacity: 0.5 },
  '&.Mui-focusVisible': {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 1,
  },
}));

export const ContextChip = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  maxWidth: '100%',
  alignSelf: 'flex-start',
  padding: theme.spacing(0.25, 0.5, 0.25, 1),
  borderRadius: 8,
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  backgroundColor: alpha(BRAND, 0.08),
  border: `1px solid ${alpha(BRAND, 0.25)}`,
  '& svg': { fontSize: 14, color: BRAND, flexShrink: 0 },
}));

export const ReviewBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  padding: theme.spacing(1, 1.25),
  borderRadius: 12,
  backgroundColor: alpha(BRAND, 0.08),
  border: `1px solid ${alpha(BRAND, 0.3)}`,
}));

export const InputShell = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 0.75, 0.75, 1.5),
  borderRadius: 16,
  backgroundColor: surfaceColor(theme, '#1e2025', '#1F1F20', '#ffffff'),
  border: `1px solid ${surfaceColor(theme, '#2e3037', '#3E3E3E', '#e2e8f0')}`,
  transition: 'border-color 0.2s, box-shadow 0.2s',
  '&:focus-within': {
    borderColor: BRAND,
    boxShadow: `0 0 0 3px ${alpha(BRAND, 0.15)}`,
  },
}));

export const SendButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  width: 34,
  height: 34,
  flexShrink: 0,
  color: active ? '#ffffff' : theme.palette.text.disabled,
  backgroundColor: active ? BRAND : theme.palette.action.disabledBackground,
  transition: 'background-color 0.2s ease, transform 0.2s ease',
  '&:hover': active
    ? { backgroundColor: BRAND_DARK, transform: 'scale(1.05)' }
    : {},
  '&.Mui-disabled': {
    color: theme.palette.text.disabled,
    backgroundColor: theme.palette.action.disabledBackground,
  },
}));

/** Three pulsing dots: a light stand-in for the orb inside status lines. */
export const ThinkingDots = styled('span')({
  display: 'inline-flex',
  gap: 3,
  '& > span': {
    width: 5,
    height: 5,
    borderRadius: '50%',
    backgroundColor: BRAND,
    animation: 'editorAiDot 1.2s ease-in-out infinite',
  },
  '& > span:nth-of-type(2)': { animationDelay: '0.15s' },
  '& > span:nth-of-type(3)': { animationDelay: '0.3s' },
  '@keyframes editorAiDot': {
    '0%, 80%, 100%': { opacity: 0.25, transform: 'scale(0.8)' },
    '40%': { opacity: 1, transform: 'scale(1)' },
  },
  '@media (prefers-reduced-motion: reduce)': {
    '& > span': { animation: 'none', opacity: 0.6 },
  },
});

/* ── History view ────────────────────────────────────────────────────── */

export const ConversationRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.25),
  padding: theme.spacing(1, 1, 1, 1.25),
  borderRadius: 12,
  cursor: 'pointer',
  border: `1px solid ${active ? alpha(BRAND, 0.45) : theme.palette.divider}`,
  backgroundColor: active ? alpha(BRAND, 0.07) : 'transparent',
  transition: 'border-color 0.15s ease, background-color 0.15s ease',
  '& .conversation-delete': { opacity: 0.4 },
  '&:hover': {
    borderColor: alpha(BRAND, 0.5),
    '& .conversation-delete': { opacity: 1 },
  },
  '&:focus-visible': {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 1,
  },
  '&[aria-disabled="true"]': { cursor: 'default', opacity: 0.6 },
}));

/** Small dot on the launcher: a reply finished while the panel was closed. */
export const ReadyDot = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: BRAND,
  boxShadow: `0 0 0 3px ${alpha(BRAND, 0.2)}`,
  flexShrink: 0,
  [theme.breakpoints.up('sm')]: { marginLeft: 2 },
}));
