import React from 'react';
import { TextField as MuiTextField, useTheme } from '@mui/material';
import type { TextFieldProps } from './TextField.types';
import { getTextFieldSx } from './TextField.styles';

export const TextField: React.FC<TextFieldProps> = ({ sx, ...props }) => {
  const theme = useTheme();

  return (
    <MuiTextField
      fullWidth
      variant="outlined"
      sx={getTextFieldSx(theme, sx)}
      {...props}
    />
  );
};
