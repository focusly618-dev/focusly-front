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

export const StatusTabsContainer = muiStyled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '4px 0 16px 0',
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
  padding: '6px 14px',
  borderRadius: '24px',
  minWidth: 'auto',
  whiteSpace: 'nowrap',
  color: active
    ? '#ffffff'
    : theme.palette.mode === 'dark'
      ? '#d1d5db'
      : '#374151',
  backgroundColor: active
    ? '#008767'
    : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.04)'
      : '#ffffff',
  border: active
    ? '1px solid transparent'
    : `1px solid ${
        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
      }`,
  boxShadow: active ? '0 1px 3px rgba(0, 135, 103, 0.25)' : 'none',
  transition: 'all 0.15s ease',
  '&:hover': {
    backgroundColor: active
      ? '#007357'
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : '#f9fafb',
    borderColor: active
      ? 'transparent'
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.15)'
        : '#d1d5db',
  },
}));

export const TabCountBadge = muiStyled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'tabColor',
})<{ active: boolean; tabColor: string }>(({ theme, active }) => ({
  marginLeft: '8px',
  fontSize: '11px',
  fontWeight: 700,
  padding: '1px 8px',
  borderRadius: '99px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: active
    ? 'rgba(255, 255, 255, 0.24)'
    : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : '#f3f4f6',
  color: active
    ? '#ffffff'
    : theme.palette.mode === 'dark'
      ? '#9ca3af'
      : '#4b5563',
  transition: 'all 0.15s ease',
}));
