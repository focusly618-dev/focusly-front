import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TextSkeleton, skeletonWidth } from '@/components/ui';
import { CardContainer, CardDivider } from './ProjectFolderCard.styles';

/**
 * A project card while the projects load: the same shell and parts as
 * ProjectFolderCard (icon tile, name, last document, footer), so the grid
 * doesn't move when the real cards arrive.
 */
export const ProjectFolderCardSkeleton: React.FC<{ index?: number }> = ({
  index = 0,
}) => {
  const theme = useTheme();
  return (
    <CardContainer
      baseColor={theme.palette.divider}
      sx={{
        cursor: 'default',
        pointerEvents: 'none',
        '&:hover': { transform: 'none', boxShadow: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Skeleton
          animation="wave"
          variant="rounded"
          width={50}
          height={50}
          sx={{ borderRadius: '13px', flexShrink: 0 }}
        />
        <Box sx={{ flex: 1, minWidth: 0, pt: '5px' }}>
          <TextSkeleton
            width={skeletonWidth(index)}
            height={17}
            sx={{ mb: 1.25 }}
          />
          <TextSkeleton width={skeletonWidth(index, 2)} height={12} />
        </Box>
        <Skeleton animation="wave" variant="circular" width={20} height={20} />
      </Box>

      <Box sx={{ mt: 'auto' }}>
        <CardDivider />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <TextSkeleton width={92} height={12} />
          <TextSkeleton width={64} height={12} />
          <TextSkeleton width={84} height={12} />
        </Box>
      </Box>
    </CardContainer>
  );
};
