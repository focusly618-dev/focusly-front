import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TextSkeleton, skeletonWidth } from '@/components/ui';
import {
  CardContainer,
  StatusBar,
  WorkspacePreviewBox,
} from './ProjectFolderCard.styles';

/**
 * A project card while the projects load: the same shell, sizes and parts
 * as ProjectFolderCard (icon, name, count, recent document, footer), so the
 * grid doesn't move when the real cards arrive.
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
      <Box
        sx={{
          p: 2,
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Skeleton
          animation="wave"
          variant="rounded"
          width={36}
          height={36}
          sx={{ borderRadius: '10px' }}
        />
        <Skeleton animation="wave" variant="circular" width={20} height={20} />
      </Box>

      <Box
        sx={{ px: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}
      >
        <TextSkeleton width={skeletonWidth(index)} height={17} sx={{ mb: 1 }} />
        <TextSkeleton width="58%" height={11} sx={{ mb: 1.5 }} />
        <WorkspacePreviewBox>
          <TextSkeleton width="40%" height={8} sx={{ mb: 1 }} />
          <TextSkeleton
            width={skeletonWidth(index, 2)}
            height={12}
            sx={{ mb: 0.75 }}
          />
          <TextSkeleton width="45%" height={10} />
        </WorkspacePreviewBox>
      </Box>

      <StatusBar sx={{ px: 2, py: 1.25, mt: 1.5 }}>
        <Skeleton
          animation="wave"
          variant="rounded"
          width={56}
          height={18}
          sx={{ borderRadius: '6px' }}
        />
        <TextSkeleton width={48} height={12} />
      </StatusBar>
    </CardContainer>
  );
};
