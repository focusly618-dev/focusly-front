import { Box, ButtonBase, Typography, alpha, styled } from '@mui/material';

/* ── Page layout ─────────────────────────────────────────────── */

export const PageLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: 'auto',
    minHeight: '100vh',
  },
}));

export const Sidebar = styled('aside')(({ theme }) => ({
  width: 272,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(3, 2),
  borderRight: `1px solid ${theme.palette.divider}`,
  overflowY: 'auto',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    borderRight: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
    overflowY: 'visible',
  },
}));

export const BackButton = styled(ButtonBase)(({ theme }) => ({
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 1.25, 0.75, 0.75),
  borderRadius: 8,
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  transition: 'background-color 0.15s ease, color 0.15s ease',
  '& svg': { fontSize: 18 },
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-focusVisible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export const UserSummary = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(0, 1),
  minWidth: 0,
}));

export const NavList = styled('nav')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'row',
    overflowX: 'auto',
    margin: theme.spacing(0, -2),
    padding: theme.spacing(0, 2),
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
}));

export const NavItem = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  justifyContent: 'flex-start',
  gap: theme.spacing(1.5),
  width: '100%',
  padding: theme.spacing(1, 1.5),
  borderRadius: 8,
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  fontWeight: active ? 600 : 500,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  color: active ? theme.palette.text.primary : theme.palette.text.secondary,
  backgroundColor: active
    ? alpha(theme.palette.primary.main, 0.1)
    : 'transparent',
  transition: 'background-color 0.15s ease, color 0.15s ease',
  '& svg': {
    fontSize: 20,
    color: active ? theme.palette.primary.main : 'inherit',
  },
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.14)
      : theme.palette.action.hover,
  },
  '&.Mui-focusVisible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: -2,
  },
  [theme.breakpoints.down('md')]: {
    width: 'auto',
    flexShrink: 0,
  },
}));

export const Content = styled('main')(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  overflowY: 'auto',
  padding: theme.spacing(6, 6, 10),
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(5, 4, 8),
  },
  [theme.breakpoints.down('md')]: {
    overflowY: 'visible',
    padding: theme.spacing(3, 2, 6),
  },
}));

export const ContentInner = styled(Box)({
  maxWidth: 720,
  margin: '0 auto',
});

/* ── Section building blocks ─────────────────────────────────── */

export const Card = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
  '& + &': {
    marginTop: theme.spacing(2),
  },
}));

export const DangerCard = styled(Card)(({ theme }) => ({
  borderColor: alpha(theme.palette.error.main, 0.3),
}));

export const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const CardDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.825rem',
  lineHeight: 1.5,
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

export const Divider = styled('hr')(({ theme }) => ({
  border: 'none',
  borderTop: `1px solid ${theme.palette.divider}`,
  margin: theme.spacing(2.5, 0),
}));

export const OptionGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(2),
}));

export const OptionCard = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.75),
  borderRadius: 10,
  fontFamily: 'inherit',
  textAlign: 'left',
  border: `1px solid ${active ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: active
    ? alpha(theme.palette.primary.main, 0.08)
    : 'transparent',
  color: theme.palette.text.primary,
  transition: 'border-color 0.15s ease, background-color 0.15s ease',
  '&:hover': {
    borderColor: active
      ? theme.palette.primary.main
      : alpha(theme.palette.primary.main, 0.5),
  },
  '&.Mui-focusVisible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export const OptionIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  width: 32,
  height: 32,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: active
    ? alpha(theme.palette.primary.main, 0.12)
    : theme.palette.action.hover,
  '& svg': { fontSize: 18 },
}));

export const Pill = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.25, 1),
  borderRadius: 999,
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '& svg': { fontSize: 14 },
}));
