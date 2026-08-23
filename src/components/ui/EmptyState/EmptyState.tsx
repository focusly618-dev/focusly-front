import React from 'react';
import { Box, Typography, Button, type SxProps, type Theme } from '@mui/material';
import { SearchOff as SearchOffIcon } from '@mui/icons-material';

import {
  containerSx,
  iconWrapperSx,
  clonedIconSx,
  fallbackIconSx,
  titleSx,
  descriptionSx,
  actionButtonSx,
} from './EmptyState.styles';
import type { EmptyStateProps } from './EmptyState.types';

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  sx,
}) => {
  return (
    <Box sx={containerSx(sx)}>
      <Box sx={iconWrapperSx}>
        {React.isValidElement(icon) ? (
          React.cloneElement(
            icon as React.ReactElement<{ sx?: SxProps<Theme> }>,
            {
              sx: clonedIconSx((icon.props as { sx?: SxProps<Theme> }).sx),
            },
          )
        ) : (
          <SearchOffIcon sx={fallbackIconSx} />
        )}
      </Box>

      <Typography variant="h6" sx={titleSx}>
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" sx={descriptionSx}>
          {description}
        </Typography>
      )}

      {actionText && onAction && (
        <Button
          variant="contained"
          onClick={() => onAction()}
          sx={actionButtonSx}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};
