import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { LoadingRegion, TextSkeleton } from '@/components/ui';
import { ProjectFolderCardSkeleton } from '@/pages/Projects/components/ProjectFolders';
import {
  FoldersGrid,
  GridWrapper,
} from '@/pages/Projects/components/ProjectFolders/ProjectFoldersGrid/ProjectFoldersGrid.styles';
import { LibraryContainer } from './WorkspaceLibrary.styles';

/**
 * The Projects page while it first loads: its header, tabs, filters and
 * project cards, in place (before, the page stayed blank meanwhile).
 */
export const WorkspaceLibrarySkeleton: React.FC = () => {
  const { t } = useTranslation();
  return (
    <LibraryContainer sx={{ pb: 6 }}>
      <LoadingRegion label={t('projects.loading')}>
        {/* Breadcrumb */}
        <TextSkeleton width={84} height={12} sx={{ mb: 2.5 }} />
        {/* Title and actions */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: 'grid', gap: 1, flex: 1 }}>
            <TextSkeleton width={180} height={26} />
            <TextSkeleton width="min(320px, 70%)" height={12} />
          </Box>
          <Skeleton
            animation="wave"
            variant="rounded"
            width={132}
            height={36}
            sx={{ borderRadius: '10px', flexShrink: 0 }}
          />
        </Box>
        {/* Tabs and filters */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          {[96, 84].map((width) => (
            <Skeleton
              key={width}
              animation="wave"
              variant="rounded"
              width={width}
              height={32}
              sx={{ borderRadius: '10px' }}
            />
          ))}
          <Box sx={{ flex: 1 }} />
          <Skeleton
            animation="wave"
            variant="rounded"
            width="min(260px, 100%)"
            height={36}
            sx={{ borderRadius: '10px' }}
          />
        </Box>
        <GridWrapper>
          <FoldersGrid>
            {Array.from({ length: 6 }, (_, i) => (
              <ProjectFolderCardSkeleton key={i} index={i} />
            ))}
          </FoldersGrid>
        </GridWrapper>
      </LoadingRegion>
    </LibraryContainer>
  );
};
