import type { SxProps, Theme } from '@mui/material';

import { surfaceColor } from '@/context';

export const containerSx = (sx?: SxProps<Theme>): SxProps<Theme> => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  flex: 1,
  textAlign: 'center',
  p: 4,
  ...sx,
});

export const iconWrapperSx: SxProps<Theme> = {
  width: 80,
  height: 80,
  borderRadius: '24px',
  background: (theme) =>
    surfaceColor(
      theme,
      'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      'linear-gradient(135deg, #2A2A2C 0%, #19191A 100%)',
      'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    ),
  border: '1px solid',
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mb: 3,
  position: 'relative',
  boxShadow: (theme) =>
    theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)'
      : '0 8px 32px rgba(0,0,0,0.05)',
};

export const clonedIconSx = (existingSx?: SxProps<Theme>): SxProps<Theme> => ({
  fontSize: 40,
  color: 'primary.main',
  filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
  ...((existingSx as Record<string, unknown>) || {}),
});

export const fallbackIconSx: SxProps<Theme> = {
  fontSize: 40,
  color: 'primary.main',
  filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
};

export const titleSx: SxProps<Theme> = {
  color: 'text.primary',
  mb: 1,
  fontWeight: 700,
  letterSpacing: '-0.01em',
};

export const descriptionSx: SxProps<Theme> = {
  maxWidth: 320,
  mb: 3,
  lineHeight: 1.6,
  color: 'text.secondary',
};

export const actionButtonSx: SxProps<Theme> = {
  textTransform: 'none',
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  px: 3,
  py: 1,
  borderRadius: '10px',
  fontWeight: 600,
  fontSize: '0.875rem',
  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
  '&:hover': {
    bgcolor: 'primary.dark',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)',
  },
  transition: 'all 0.2s',
};
