import { Box, Button } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';
import { alpha } from '@mui/material';

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
  gap: '8px',
  padding: '10px 24px',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(26, 31, 43, 0.4)' : '#ffffff',
  overflowX: 'auto',
  whiteSpace: 'nowrap',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  position: 'sticky',
  left: 0,
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
})<StatusTabProps>(({ theme, active, tabColor }) => ({
  textTransform: 'none',
  fontSize: '12px',
  fontWeight: active ? 700 : 500,
  padding: '4px 14px',
  borderRadius: '20px',
  minWidth: 'auto',
  whiteSpace: 'nowrap',
  color: active
    ? theme.palette.mode === 'dark'
      ? '#ffffff'
      : tabColor
    : theme.palette.text.secondary,
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? tabColor
      : `${tabColor}15`
    : 'transparent',
  border: `1px solid ${active ? tabColor : 'transparent'}`,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: active
      ? theme.palette.mode === 'dark'
        ? tabColor
        : `${tabColor}25`
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.03)',
    borderColor: active
      ? tabColor
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(0, 0, 0, 0.08)',
  },
}));

export const TabCountBadge = muiStyled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'tabColor',
})<{ active: boolean; tabColor: string }>(({ theme, active, tabColor }) => ({
  marginLeft: '6px',
  fontSize: '10px',
  fontWeight: 700,
  padding: '1px 6px',
  borderRadius: '8px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(0, 0, 0, 0.25)'
      : 'rgba(255, 255, 255, 0.45)'
    : theme.palette.mode === 'dark'
      ? alpha(tabColor, 0.15)
      : alpha(tabColor, 0.1),
  color: active
    ? theme.palette.mode === 'dark'
      ? '#ffffff'
      : tabColor
    : tabColor,
  transition: 'all 0.2s ease',
}));
