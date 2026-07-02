import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import type { ButtonProps } from './Button.types';
import { buttonSx } from './Button.styles';

export const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  disabled,
  rounded = true,
  sx,
  variant,
  ...props
}) => {
  return (
    <MuiButton
      disabled={disabled || loading}
      sx={buttonSx(rounded, variant, sx)}
      variant={variant}
      {...props}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </MuiButton>
  );
};
