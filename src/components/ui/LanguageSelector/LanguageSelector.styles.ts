import type { SxProps, Theme } from '@mui/material';

export const iconTriggerSx: SxProps<Theme> = { mx: 0.5 };

export const iconSx: SxProps<Theme> = { fontSize: 20 };

export const fullTriggerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  cursor: 'pointer',
  px: 1.5,
  py: 0.75,
  borderRadius: 1,
  border: '1px solid',
  borderColor: 'divider',
  '&:hover': {
    backgroundColor: 'action.hover',
  },
};

export const secondaryIconSx: SxProps<Theme> = {
  fontSize: 18,
  color: 'text.secondary',
};

export const labelSx: SxProps<Theme> = { fontWeight: 500 };

export const menuPaperSx: SxProps<Theme> = {
  minWidth: 150,
  mt: 1,
  borderRadius: 2,
};

export const menuItemIconSx: SxProps<Theme> = {
  fontSize: '1.2rem',
  minWidth: '32px',
};
