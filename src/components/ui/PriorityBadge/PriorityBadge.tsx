import React from 'react';
import { Box, type SxProps, type Theme, alpha } from '@mui/material';
import { getPriorityConfig } from './priority.constants';

export interface PriorityBadgeProps {
  priority?: string | number | null;
  size?: number;
  borderRadius?: number | string;
  sx?: SxProps<Theme>;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 18,
  borderRadius = size <= 16 ? '3px' : size <= 20 ? '4px' : '6px',
  sx,
}) => {
  const config = getPriorityConfig(priority);
  const fontSize =
    size <= 15 ? '9.5px' : size <= 18 ? '11px' : size <= 22 ? '11.5px' : '12px';

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius,
        bgcolor: alpha(config.color, 0.16),
        color: config.color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 800,
        lineHeight: 1,
        flexShrink: 0,
        userSelect: 'none',
        ...sx,
      }}
    >
      {config.symbol}
    </Box>
  );
};
