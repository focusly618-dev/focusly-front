import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { LoadingRegion, TextSkeleton, skeletonWidth } from '@/components/ui';

/**
 * The project tasks while they load: status groups with their task rows
 * (check, title, date and priority), like ProjectTaskStatusGroup.
 */
export const ProjectTasksSkeleton: React.FC = () => {
  const { t } = useTranslation();
  return (
    <LoadingRegion
      label={t('projectTasks.loading')}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
    >
      {/* Toolbar: summary and filters */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextSkeleton width={140} height={14} />
        <Box sx={{ flex: 1 }} />
        {[88, 104].map((width) => (
          <Skeleton
            key={width}
            animation="wave"
            variant="rounded"
            width={width}
            height={30}
            sx={{ borderRadius: '8px' }}
          />
        ))}
      </Box>

      {[3, 2].map((rows, group) => (
        <Box key={group}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
            <Skeleton
              animation="wave"
              variant="circular"
              width={10}
              height={10}
            />
            <TextSkeleton width={group ? 90 : 110} height={13} />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={22}
              height={18}
              sx={{ borderRadius: '10px' }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Array.from({ length: rows }, (_, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.25,
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={18}
                  height={18}
                />
                <TextSkeleton width={skeletonWidth(i + group)} height={13} />
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    gap: 1,
                    ml: 'auto',
                    flexShrink: 0,
                  }}
                >
                  <TextSkeleton
                    width={64}
                    height={20}
                    sx={{ borderRadius: '6px' }}
                  />
                  <TextSkeleton
                    width={52}
                    height={20}
                    sx={{ borderRadius: '6px' }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </LoadingRegion>
  );
};
