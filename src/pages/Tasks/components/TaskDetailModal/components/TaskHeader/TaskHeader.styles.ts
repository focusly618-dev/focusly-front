import type { Theme } from '@mui/material/styles';

export const headerContainerSx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  px: 3,
  pt: 2.5,
  pb: 1,
  color: 'text.secondary',
};

export const headerIconButtonSx = {
  color: 'text.secondary',
  p: 0.75,
  borderRadius: '8px',
  transition: 'all 0.15s ease-in-out',
  '&:hover': {
    color: 'text.primary',
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.05)',
  },
};
