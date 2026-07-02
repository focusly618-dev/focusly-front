import type { SxProps, Theme } from '@mui/material';

export const buttonSx = (
  rounded: boolean,
  variant: string | undefined,
  sx?: SxProps<Theme>,
): SxProps<Theme> => ({
  borderRadius: rounded ? '16px' : '8px',
  textTransform: 'none',
  px: 4,
  py: 1.2,
  fontSize: '1rem',
  fontWeight: 700,
  boxShadow: variant === 'contained' ? `0 8px 16px rgba(0,0,0,0.1)` : 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    filter: 'brightness(1.1)',
    boxShadow: variant === 'contained' ? `0 12px 24px rgba(0,0,0,0.2)` : 'none',
  },
  ...sx,
});
