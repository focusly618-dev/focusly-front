import { Box, Typography, Button, ListItemButton, styled } from '@mui/material';

export const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 260,
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
