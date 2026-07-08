import { Box, Typography, Button, ListItemButton, styled } from '@mui/material';

export const SidebarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<{ collapsed?: boolean }>(({ theme, collapsed }) => ({
  width: collapsed ? 80 : 260,
  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.6)' : '#F5F5F4',
  backdropFilter: theme.palette.mode === 'dark' ? 'blur(16px)' : 'none',
  borderRight:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : '1px solid rgba(0, 0, 0, 0.06)',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.text.primary,
  flexShrink: 0,
  overflow: 'hidden',
  [theme.breakpoints.down('lg')]: {
    width: 80,
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
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(17, 24, 39, 0.8)'
        : 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
  },
}));

export const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1.25rem',
  color: theme.palette.text.primary,
  padding: '0px 0px 20px 0px',
  display: 'flex',
  margin: '20px 0px 20px 0px',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
}));

export const AddTaskButton = styled(Button)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : '1px solid rgba(0, 0, 0, 0.05)',
  color: theme.palette.text.primary,
  textTransform: 'none',
  justifyContent: 'center',
  padding: '16px',
  margin: '20px',
  borderRadius: 12,
  alignItems: 'center',
  textAlign: 'center',
  boxShadow:
    theme.palette.mode === 'dark' ? 'none' : '0 1px 2px rgba(0,0,0,0.02)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#fafafa',
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
  marginBottom: 4,
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(99, 102, 241, 0.15)'
      : 'rgba(0, 0, 0, 0.05)'
    : 'transparent',
  color: active
    ? theme.palette.mode === 'dark'
      ? '#818cf8'
      : '#1C1C1A'
    : theme.palette.text.secondary,
  borderLeft:
    active && theme.palette.mode === 'dark'
      ? '3px solid #6366f1'
      : '3px solid transparent',
  paddingLeft: active && theme.palette.mode === 'dark' ? 13 : 16,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(99, 102, 241, 0.08)'
        : 'rgba(0, 0, 0, 0.03)',
    color: theme.palette.mode === 'dark' ? '#818cf8' : '#1C1C1A',
  },
  '& .MuiListItemIcon-root': {
    color: 'inherit',
    minWidth: 40,
  },
  [theme.breakpoints.down('lg')]: {
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
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
        ? '3px solid #6366f1'
        : '3px solid transparent',
    padding: '8px 12px',
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

export const EnergyCard = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(26, 31, 43, 0.5) 0%, rgba(17, 24, 39, 0.8) 100%)'
      : '#ffffff',
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
      ? 'rgba(59, 130, 246, 0.12)'
      : 'rgba(59, 130, 246, 0.08)'
    : 'transparent',
  color: isActive
    ? theme.palette.mode === 'dark'
      ? '#93c5fd'
      : '#1d4ed8'
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
        ? 'rgba(59, 130, 246, 0.16)'
        : 'rgba(59, 130, 246, 0.12)'
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
