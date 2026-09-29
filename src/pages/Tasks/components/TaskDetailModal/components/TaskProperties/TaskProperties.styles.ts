import type { Theme } from '@mui/material/styles';
import { surfaceColor } from '@/context';

export const propertiesContainerSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export const propertiesCardSx = {
  p: 2,
  borderRadius: '16px',
  bgcolor: (theme: Theme) =>
    surfaceColor(theme, '#1e2025', '#1e2025', '#f8fafc'),
  border: '1px solid',
  borderColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '#25272e' : 'rgba(0, 0, 0, 0.06)',
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};

export const propertyRowSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: '34px',
};

export const propertyLabelSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.25,
  color: 'text.secondary',
  minWidth: '110px',
  '& svg': {
    fontSize: 16,
    color: 'text.secondary',
  },
  '& span, & p': {
    fontSize: '13px',
    fontWeight: 500,
    color: 'text.secondary',
  },
};

export const propertyPillSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  px: 1.5,
  py: 0.4,
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  bgcolor: (theme: Theme) =>
    surfaceColor(theme, '#25272e', '#25272e', '#ffffff'),
  border: '1px solid',
  borderColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '#2e3037' : '#e2e8f0',
  color: 'text.primary',
  '&:hover': {
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'dark' ? '#3a3d48' : '#cbd5e1',
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'dark' ? '#2a2c35' : '#f1f5f9',
  },
};

export const scheduleGridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: 2,
  mt: 0.5,
};

export const scheduleBoxSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
  px: 1.75,
  py: 1,
  minHeight: '44px',
  borderRadius: '10px',
  border: '1px solid',
  borderColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '#25272e' : '#e2e8f0',
  bgcolor: (theme: Theme) =>
    surfaceColor(theme, '#18191e', '#18191e', '#ffffff'),
  cursor: 'pointer',
  transition: 'border-color 0.15s ease',
  '&:hover': {
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'dark' ? '#3a3d48' : '#cbd5e1',
  },
};

export const timeSlotBannerSx = {
  mt: 1.5,
  px: 2,
  py: 1.25,
  borderRadius: '10px',
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(0, 135, 103, 0.18)'
      : 'rgba(0, 135, 103, 0.09)',
  border: '1px solid rgba(0, 135, 103, 0.22)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const popoverPaperSx = {
  borderRadius: '12px',
  mt: 1,
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
  border: '1px solid',
  borderColor: 'divider',
};

export const timerPopoverPaperSx = {
  minWidth: 100,
  borderRadius: '12px',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
};

export const timeLogPopoverPaperSx = {
  minWidth: 280,
  maxWidth: 320,
  borderRadius: '14px',
  p: 1.5,
  mt: 1,
};

export const colorPopoverPaperSx = {
  borderRadius: '16px',
  mt: 1,
  boxShadow: '0 10px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(128,128,128,0.15)',
};

export const colorGridSx = {
  p: 0.5,
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: 1.25,
  justifyItems: 'center',
};
