import { alpha, type SxProps, type Theme } from '@mui/material';

export const deleteButtonSx: SxProps<Theme> = {
  bgcolor: '#f24848',
  color: 'white',
  '&:hover': { bgcolor: '#d83a3a' },
};

export const cancelButtonSx: SxProps<Theme> = {
  color: 'text.secondary',
  borderColor: 'divider',
  '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' },
};

export const descriptionBoxSx: SxProps<Theme> = {
  bgcolor: (theme) => alpha(theme.palette.error.main, 0.06),
  padding: 2.5,
  borderRadius: 2,
  mt: 1,
  border: '1px solid',
  borderColor: (theme) => alpha(theme.palette.error.main, 0.2),
};

export const descriptionTextSx: SxProps<Theme> = {
  color: 'text.secondary',
  lineHeight: 1.6,
};

export const actionsContainerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  width: '100%',
};

export const deleteIconSx: SxProps<Theme> = {
  color: '#f24848',
};

export const modalSx: SxProps<Theme> = {
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
};
