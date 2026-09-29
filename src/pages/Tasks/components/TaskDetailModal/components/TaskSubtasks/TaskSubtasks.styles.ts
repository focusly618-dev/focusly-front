import type { Theme } from '@mui/material/styles';
import { surfaceColor } from '@/context';

export const subtasksContainerSx = {
  mt: 3,
  mb: 2,
};

export const subtasksHeaderSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: 1.5,
};

export const subtaskCountBadgeSx = (allCompleted: boolean) => ({
  ml: 1,
  px: 0.8,
  py: 0.15,
  borderRadius: '10px',
  bgcolor: allCompleted
    ? 'rgba(16, 185, 129, 0.15)'
    : (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? 'rgba(0, 135, 103, 0.18)'
          : 'rgba(0, 135, 103, 0.1)',
  color: allCompleted ? '#10b981' : '#008767',
  fontSize: '11px',
  fontWeight: 700,
});

export const progressBarContainerSx = {
  width: '100%',
  height: 3,
  borderRadius: 2,
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)',
  overflow: 'hidden',
  mb: 1.5,
};

export const subtaskItemSx = (completed?: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  py: 0.75,
  px: 1,
  borderRadius: '8px',
  bgcolor: 'transparent',
  opacity: completed ? 0.75 : 1,
  transition: 'all 0.15s ease-in-out',
  '&:hover': {
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(0, 0, 0, 0.03)',
  },
});

export const subtaskInputFormSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mt: 1,
  px: 1.5,
  py: 0.8,
  borderRadius: '10px',
  bgcolor: (theme: Theme) =>
    surfaceColor(theme, '#18191e', '#18191e', '#ffffff'),
  border: '1px solid',
  borderColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '#25272e' : '#e2e8f0',
  transition: 'border-color 0.2s, background-color 0.2s',
  '&:focus-within': {
    borderColor: '#008767',
    boxShadow: '0 0 0 2px rgba(0, 135, 103, 0.15)',
  },
};

export const aiButtonSx = {
  textTransform: 'none',
  borderRadius: '20px',
  px: 1.5,
  py: 0.35,
  fontSize: '11.5px',
  fontWeight: 600,
  color: '#008767',
  border: '1px solid rgba(0, 135, 103, 0.3)',
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(0, 135, 103, 0.15)'
      : 'rgba(0, 135, 103, 0.06)',
  gap: 0.5,
  '&:hover': {
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(0, 135, 103, 0.25)'
        : 'rgba(0, 135, 103, 0.12)',
    borderColor: '#008767',
  },
};
