import type { SxProps, Theme } from '@mui/material';

export const robotIconInnerSx: SxProps<Theme> = {
  fontSize: 40,
  color: 'info.main',
};

export const lightningIconInnerSx: SxProps<Theme> = {
  fontSize: 14,
  color: 'background.default',
};

export const titleSx: SxProps<Theme> = {
  fontWeight: 700,
  mb: 2,
  textAlign: 'center',
  color: 'text.primary',
};

export const descriptionSx: SxProps<Theme> = {
  color: 'text.secondary',
  mb: 4,
  textAlign: 'center',
  maxWidth: 500,
  lineHeight: 1.6,
};
