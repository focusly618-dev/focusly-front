import React, { memo, useMemo } from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { mergeSx } from '@/styles/mui';

export interface TextShimmerProps {
  children: string;
  sx?: SxProps<Theme>;
  duration?: number;
  spread?: number;
}

const sweep = keyframes`
  from { background-position: 100% center, 0 0; }
  to { background-position: 0% center, 0 0; }
`;

const ShimmerComponent: React.FC<TextShimmerProps> = ({
  children,
  sx,
  duration = 2,
  spread = 2,
}) => {
  const dynamicSpread = useMemo(
    () => (children?.length ?? 0) * spread,
    [children, spread],
  );

  return (
    <Box
      component="span"
      sx={mergeSx(
        (theme) => ({
          position: 'relative',
          display: 'inline-block',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          backgroundRepeat: 'no-repeat, padding-box',
          backgroundSize: '250% 100%, auto',
          backgroundImage: `linear-gradient(90deg, transparent calc(50% - ${dynamicSpread}px), ${theme.palette.primary.main}, transparent calc(50% + ${dynamicSpread}px)), linear-gradient(${theme.palette.text.secondary}, ${theme.palette.text.secondary})`,
          animation: `${sweep} ${duration}s linear infinite`,
        }),
        sx,
      )}
    >
      {children}
    </Box>
  );
};

export const Shimmer = memo(ShimmerComponent);
