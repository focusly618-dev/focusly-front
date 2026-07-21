import { Box, Button } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';

export const FloatingActionBar = muiStyled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: '24px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '24px',
  padding: '12px 24px',
  borderRadius: '16px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(35, 37, 42, 0.85)'
      : 'rgba(255, 255, 255, 0.85)',
  border: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(20px)',
  boxShadow: '0 20px 40px 0 rgba(0, 0, 0, 0.25)',
  zIndex: 1000,
  minWidth: '380px',
  animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',

  '@keyframes slideUp': {
    '0%': {
      transform: 'translate(-50%, 100px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translate(-50%, 0)',
      opacity: 1,
    },
  },
}));

export const StatusTabsContainer = muiStyled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '8px 0px',
  borderBottom: `1px solid ${
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'
  }`,
  backgroundColor: 'transparent',
  overflowX: 'auto',
  whiteSpace: 'nowrap',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  position: 'relative',
  width: '100%',
  boxSizing: 'border-box',
  zIndex: 4,
  marginBottom: '16px',
}));

export interface StatusTabProps {
  active: boolean;
  tabColor: string;
}

export const StatusTabButton = muiStyled(Button, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'tabColor',
})<StatusTabProps>(({ theme, active }) => ({
  textTransform: 'none',
  fontSize: '13px',
  fontWeight: active ? 700 : 500,
  padding: '8px 12px 10px 12px',
  borderRadius: 0,
  minWidth: 'auto',
  whiteSpace: 'nowrap',
  color: active
    ? theme.palette.mode === 'dark'
      ? '#818cf8'
      : '#4f46e5'
    : theme.palette.text.secondary,
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: active
    ? `2px solid ${theme.palette.mode === 'dark' ? '#818cf8' : '#4f46e5'}`
    : '2px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.mode === 'dark' ? '#a5b4fc' : '#6366f1',
    borderBottom: active
      ? `2px solid ${theme.palette.mode === 'dark' ? '#818cf8' : '#4f46e5'}`
      : `2px solid ${
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.05)'
        }`,
  },
}));

export const TabCountBadge = muiStyled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'tabColor',
})<{ active: boolean; tabColor: string }>(({ theme, active }) => ({
  marginLeft: '6px',
  fontSize: '10px',
  fontWeight: 700,
  padding: '1px 6px',
  borderRadius: '6px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(129, 140, 248, 0.15)'
      : '#e0e7ff'
    : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.06)'
      : '#f1f5f9',
  color: active
    ? theme.palette.mode === 'dark'
      ? '#a5b4fc'
      : '#4f46e5'
    : theme.palette.text.secondary,
  transition: 'all 0.2s ease',
}));
