import type { Theme } from '@mui/material/styles';

export const subtasksContainerSx = {
  px: 4,
  mb: 2.5,
};

export const subtasksHeaderSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: 1.5,
};

export const subtaskCountBadgeSx = (allCompleted: boolean) => ({
  ml: 1.2,
  px: 1,
  py: 0.2,
  borderRadius: '12px',
  bgcolor: allCompleted
    ? 'rgba(16, 185, 129, 0.15)'
    : (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? 'rgba(99, 102, 241, 0.18)'
          : 'rgba(59, 130, 246, 0.12)',
  color: allCompleted
    ? '#10b981'
    : (theme: Theme) => (theme.palette.mode === 'dark' ? '#818cf8' : '#2563eb'),
  fontSize: '11px',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  border: '1px solid',
  borderColor: allCompleted
    ? 'rgba(16, 185, 129, 0.3)'
    : 'rgba(99, 102, 241, 0.25)',
  transition: 'all 0.2s ease',
});

export const progressBarContainerSx = {
  width: '100%',
  height: 4,
  borderRadius: 2,
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)',
  overflow: 'hidden',
  mb: 2,
};

export const subtaskItemSx = (completed: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  py: 0.8,
  px: 1.2,
  borderRadius: '8px',
  bgcolor: (theme: Theme) =>
    completed
      ? theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.015)'
        : 'rgba(0, 0, 0, 0.015)'
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(0, 0, 0, 0.02)',
  border: '1px solid',
  borderColor: (theme: Theme) =>
    completed
      ? 'transparent'
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(0, 0, 0, 0.06)',
  transition: 'all 0.18s ease-in-out',
  '&:hover': {
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(0, 0, 0, 0.04)',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.1)',
    '& .subtask-actions': {
      opacity: 1,
      visibility: 'visible',
    },
  },
});

export const subtaskInputFormSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mt: 1.2,
  p: '4px 8px 4px 12px',
  borderRadius: '8px',
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(0, 0, 0, 0.02)',
  border: '1px dashed',
  borderColor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.15)'
      : 'rgba(0, 0, 0, 0.15)',
  transition: 'border-color 0.2s, background-color 0.2s',
  '&:focus-within': {
    borderColor: 'primary.main',
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(99, 102, 241, 0.05)'
        : 'rgba(59, 130, 246, 0.04)',
  },
};

export const aiButtonSx = {
  textTransform: 'none',
  borderRadius: '6px',
  px: 1.2,
  py: 0.3,
  fontSize: '11px',
  fontWeight: 600,
  color: '#8b5cf6',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  bgcolor: 'rgba(139, 92, 246, 0.06)',
  gap: 0.6,
  '&:hover': {
    bgcolor: 'rgba(139, 92, 246, 0.14)',
    borderColor: '#8b5cf6',
  },
};
