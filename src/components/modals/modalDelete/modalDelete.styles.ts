import type { SxProps, Theme } from '@mui/material';

export const deleteButtonSx: SxProps<Theme> = {
  bgcolor: '#f24848',
  color: 'white',
  '&:hover': { bgcolor: '#d83a3a' },
};

export const cancelButtonSx: SxProps<Theme> = {
  color: '#cbd5e1',
  borderColor: '#283447',
  '&:hover': { borderColor: '#475569', bgcolor: 'rgba(255,255,255,0.05)' },
};

export const descriptionBoxSx: SxProps<Theme> = {
  background: '#1a2432',
  padding: 2.5,
  borderRadius: 2,
  mt: 1,
  border: '1px solid #283447',
};

export const descriptionTextSx: SxProps<Theme> = {
  color: '#cbd5e1',
  lineHeight: 1.6,
};
