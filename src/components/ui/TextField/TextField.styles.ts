import type { SxProps, Theme } from '@mui/material';

export const getTextFieldSx = (
  theme: Theme,
  sx?: SxProps<Theme>,
): SxProps<Theme> => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    bgcolor: 'action.hover',
    fontSize: '1rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
    transition: 'all 0.2s ease',
    '& fieldset': { borderColor: 'transparent' },
    '&:hover fieldset': { borderColor: theme.palette.primary.main },
    '&.Mui-focused': {
      bgcolor: 'background.paper',
      '& fieldset': { borderColor: 'primary.main', borderWidth: '2px' },
    },
  },
  '& .MuiInputBase-input': {
    color: 'text.primary',
    '&::placeholder': {
      color: 'text.secondary',
      opacity: 0.5,
    },
  },
  ...sx,
});
