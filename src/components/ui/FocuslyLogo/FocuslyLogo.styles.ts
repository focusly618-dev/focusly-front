import type { SxProps, Theme } from '@mui/material';

export const containerSx = (
  size: number,
  sx?: SxProps<Theme>,
): SxProps<Theme> => ({
  width: size,
  height: size,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...sx,
});
