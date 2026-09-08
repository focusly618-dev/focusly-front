import { Box, IconButton } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';

export const PaginatorCapsule = muiStyled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  height: '32px',
  padding: '2px 4px 2px 12px',
  borderRadius: '99px',
  border: '1px solid',
  borderColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.08)',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(12px)',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 2px 8px rgba(0, 0, 0, 0.25)'
      : '0 1px 4px rgba(0, 0, 0, 0.04)',
  flexShrink: 0,
  userSelect: 'none',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.14)'
        : 'rgba(0, 0, 0, 0.12)',
  },
}));

export const PaginatorInfo = muiStyled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '11px',
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '-0.01em',
  whiteSpace: 'nowrap',
  color: theme.palette.text.secondary,
}));

export const PaginatorDivider = muiStyled(Box)(({ theme }) => ({
  width: '1px',
  height: '14px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.08)',
}));

export const PaginatorControls = muiStyled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
}));

export const PagePill = muiStyled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: '8px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(99, 102, 241, 0.08)'
      : 'rgba(99, 102, 241, 0.06)',
  border: `1px solid ${
    theme.palette.mode === 'dark'
      ? 'rgba(99, 102, 241, 0.18)'
      : 'rgba(99, 102, 241, 0.14)'
  }`,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1,
}));

export const PaginatorNavBtn = muiStyled(IconButton)(({ theme }) => ({
  width: '24px',
  height: '24px',
  padding: 0,
  borderRadius: '50%',
  color: theme.palette.text.secondary,
  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover:not(:disabled)': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.05)',
    color: theme.palette.text.primary,
    transform: 'scale(1.08)',
  },
  '&:active:not(:disabled)': {
    transform: 'scale(0.92)',
  },
  '&:disabled': {
    opacity: 0.3,
    cursor: 'not-allowed',
  },
}));
