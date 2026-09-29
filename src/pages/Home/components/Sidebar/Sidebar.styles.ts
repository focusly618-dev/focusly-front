import { Box, Typography, Button, ListItemButton, styled } from '@mui/material';
import { surfaceColor } from '@/context';

export const SidebarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<{ collapsed?: boolean }>(({ theme, collapsed }) => ({
  width: collapsed ? 58 : 220,
  transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: surfaceColor(theme, '#0e0f12', '#111215', '#FAFAFA'),
  backdropFilter: theme.palette.mode === 'dark' ? 'blur(16px)' : 'none',
  borderRight:
    theme.palette.mode === 'dark' ? '1px solid #1e2025' : '1px solid #E5E7EB',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.text.primary,
  flexShrink: 0,
  overflow: 'hidden',
  [theme.breakpoints.down('lg')]: {
    width: 58,
  },
  [theme.breakpoints.down('md')]: {
    width: 'fit-content',
    maxWidth: 'calc(100vw - 32px)',
    height: 'auto',
    position: 'fixed',
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1100,
    flexDirection: 'row',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    border:
      theme.palette.mode === 'dark'
        ? '1px solid rgba(255, 255, 255, 0.08)'
        : '1px solid rgba(0, 0, 0, 0.06)',
    padding: '6px 12px',
    backgroundColor: surfaceColor(
      theme,
      'rgba(14, 15, 18, 0.85)',
      'rgba(17, 18, 21, 0.85)',
      'rgba(255, 255, 255, 0.85)',
    ),
    backdropFilter: 'blur(20px)',
  },
}));

export const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '0.95rem',
  color: theme.palette.text.primary,
  padding: '0',
  display: 'flex',
  margin: '10px 0 6px 0',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
}));

export const AddTaskButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1e2025' : '#ffffff',
  border:
    theme.palette.mode === 'dark'
      ? '1px solid #2e3037'
      : '1px solid rgba(0, 0, 0, 0.05)',
  color: theme.palette.text.primary,
  textTransform: 'none',
  justifyContent: 'center',
  padding: '8px 12px',
  margin: '8px 12px',
  borderRadius: 8,
  alignItems: 'center',
  textAlign: 'center',
  boxShadow:
    theme.palette.mode === 'dark' ? 'none' : '0 1px 2px rgba(0,0,0,0.02)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#25272e' : '#fafafa',
    transform: 'translateY(-1px)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 4px 12px rgba(0,0,0,0.2)'
        : '0 2px 6px rgba(0,0,0,0.04)',
  },
}));

export const NavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  borderRadius: 8,
  marginBottom: 2,
  padding: '6px 10px',
  minHeight: 34,
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? '#102d29'
      : '#EAECEF'
    : 'transparent',
  color: active
    ? theme.palette.mode === 'dark'
      ? '#2dd4bf'
      : theme.palette.text.primary
    : theme.palette.mode === 'dark'
      ? '#8a8f98'
      : theme.palette.text.secondary,
  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: active
      ? theme.palette.mode === 'dark'
        ? '#133832'
        : '#E2E5E9'
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : '#F3F4F6',
    color: active
      ? theme.palette.mode === 'dark'
        ? '#2dd4bf'
        : theme.palette.text.primary
      : theme.palette.text.primary,
  },
  '& .MuiListItemIcon-root': {
    color: active
      ? theme.palette.mode === 'dark'
        ? '#2dd4bf'
        : theme.palette.text.primary
      : theme.palette.mode === 'dark'
        ? '#8a8f98'
        : theme.palette.text.secondary,
    minWidth: 28,
    display: 'flex',
    alignItems: 'center',
    '& .MuiSvgIcon-root': {
      fontSize: 18,
    },
  },
  [theme.breakpoints.down('lg')]: {
    justifyContent: 'center',
    paddingLeft: 6,
    paddingRight: 6,
    '& .MuiListItemIcon-root': {
      minWidth: 'auto',
      display: 'flex',
      justifyContent: 'center',
    },
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: 0,
    borderLeft: 'none',
    borderBottom:
      active && theme.palette.mode === 'dark'
        ? '3px solid #008767'
        : '3px solid transparent',
    padding: '6px 10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    '& .MuiListItemIcon-root': {
      minWidth: 'auto',
      marginRight: 0,
    },
  },
}));

export const SubNavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  borderRadius: 6,
  marginBottom: 2,
  padding: '4px 8px 4px 18px',
  minHeight: 28,
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? '#102d29'
      : 'rgba(0, 0, 0, 0.05)'
    : 'transparent',
  color: active
    ? theme.palette.mode === 'dark'
      ? '#2dd4bf'
      : theme.palette.text.primary
    : theme.palette.mode === 'dark'
      ? '#8a8f98'
      : theme.palette.text.secondary,
  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(0, 0, 0, 0.03)',
    color: theme.palette.text.primary,
  },
  '& .MuiListItemIcon-root': {
    color: 'inherit',
    minWidth: 22,
    display: 'flex',
    alignItems: 'center',
    '& .MuiSvgIcon-root': {
      fontSize: 15,
    },
  },
}));

export const NavCountBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  fontSize: '11px',
  fontWeight: 600,
  lineHeight: 1,
  padding: '2px 6px',
  borderRadius: '6px',
  minWidth: 18,
  textAlign: 'center',
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(45, 212, 191, 0.18)'
      : '#E5E7EB'
    : theme.palette.mode === 'dark'
      ? '#25272e'
      : '#E5E7EB',
  color: active
    ? theme.palette.mode === 'dark'
      ? '#2dd4bf'
      : theme.palette.text.primary
    : theme.palette.text.secondary,
  marginLeft: 'auto',
  transition: 'all 0.15s ease',
}));

export const CategoryHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#717684' : '#9CA3AF',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontSize: '10px',
  opacity: 1,
  padding: '0 8px',
  marginTop: '14px',
  marginBottom: '5px',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const EnergyCard = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode !== 'dark'
      ? '#ffffff'
      : theme.appMode === 'graydark'
        ? 'linear-gradient(135deg, rgba(36, 36, 37, 0.5) 0%, rgba(25, 25, 26, 0.8) 100%)'
        : 'linear-gradient(135deg, rgba(26, 31, 43, 0.5) 0%, rgba(17, 24, 39, 0.8) 100%)',
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow:
    theme.palette.mode === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.02)',
  borderRadius: 12,
  padding: '16px',
  textAlign: 'center',
  margin: '16px',
}));

export const ProjectsList = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  padding: '0 8px 16px 8px',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: '4px',
  },
  '&:hover::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
});

export const ProjectItemRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '7px 10px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.15s ease-in-out',
  position: 'relative',
  backgroundColor: isActive
    ? theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.04)'
    : 'transparent',
  color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.03)'
        : 'rgba(0,0,0,0.02)',
    color: theme.palette.text.primary,
    '& .hover-actions': {
      opacity: 1,
    },
  },
}));

export const WorkspaceItemRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '7px 10px 7px 18px',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.15s ease-in-out',
  position: 'relative',
  margin: '2px 0',
  backgroundColor: isActive
    ? theme.palette.mode === 'dark'
      ? 'rgba(0, 135, 103, 0.18)'
      : 'rgba(0, 135, 103, 0.08)'
    : 'transparent',
  color: isActive
    ? theme.palette.mode === 'dark'
      ? '#2dd4bf'
      : '#008767'
    : theme.palette.text.secondary,
  fontWeight: isActive ? 600 : 400,
  fontSize: '0.85rem',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    width: 12,
    height: 1,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.08)',
  },
  '&:hover': {
    backgroundColor: isActive
      ? theme.palette.mode === 'dark'
        ? 'rgba(0, 135, 103, 0.24)'
        : 'rgba(0, 135, 103, 0.12)'
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(0, 0, 0, 0.02)',
    color: theme.palette.text.primary,
    '& .hover-actions': {
      opacity: 1,
    },
    '&::before': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export const ColorDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color?: string }>(({ color }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: color || '#3b82f6',
  flexShrink: 0,
}));

export const ActionButtonContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  marginLeft: 'auto',
  opacity: 0,
  transition: 'opacity 0.15s ease-in-out',
  zIndex: 2,
});
