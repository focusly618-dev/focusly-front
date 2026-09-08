import { Box, Skeleton } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { GridTaskCard } from '../GridViewTask/GridViewTask.styles';
import { GridTaskContainer } from '../../Tasks.styles';

interface TasksSkeletonsProps {
  viewMode: 'list' | 'grid' | 'board' | 'workload';
}

const getSkeletonBg = (theme: Theme) =>
  theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.12)'
    : 'rgba(0, 0, 0, 0.08)';

export const TasksSkeletons = ({ viewMode }: TasksSkeletonsProps) => {
  if (viewMode === 'grid') {
    return (
      <GridTaskContainer>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <GridTaskCard
            key={i}
            sx={{
              borderStyle: 'solid',
              cursor: 'default',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : '#e2e8f0',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.03)'
                  : '#ffffff',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Skeleton
                variant="rectangular"
                width="40%"
                height={24}
                sx={{
                  borderRadius: '12px',
                  bgcolor: (theme) => getSkeletonBg(theme),
                }}
                animation="wave"
              />
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
                animation="wave"
              />
            </Box>
            <Skeleton
              variant="text"
              width="80%"
              height={28}
              sx={{ mb: 1, bgcolor: (theme) => getSkeletonBg(theme) }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width="100%"
              height={20}
              sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width="90%"
              height={20}
              sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
              animation="wave"
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Skeleton
                variant="text"
                width="20%"
                height={20}
                sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width="30%"
                height={20}
                sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
                animation="wave"
              />
            </Box>
            <Box sx={{ mt: 'auto', width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Skeleton
                  variant="text"
                  width="30%"
                  height={14}
                  sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width="10%"
                  height={14}
                  sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
                  animation="wave"
                />
              </Box>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={4}
                sx={{
                  borderRadius: 2,
                  bgcolor: (theme) => getSkeletonBg(theme),
                }}
                animation="wave"
              />
            </Box>
          </GridTaskCard>
        ))}
      </GridTaskContainer>
    );
  }

  if (viewMode === 'board') {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          width: '100%',
        }}
      >
        {[1, 2, 3].map((col) => (
          <Box
            key={col}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              p: 2,
              borderRadius: '16px',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.02)'
                  : 'rgba(0, 0, 0, 0.02)',
              border: (theme) =>
                `1px solid ${
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.06)'
                    : '#e2e8f0'
                }`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Skeleton
                variant="rectangular"
                width="45%"
                height={26}
                sx={{
                  borderRadius: '8px',
                  bgcolor: (theme) => getSkeletonBg(theme),
                }}
                animation="wave"
              />
              <Skeleton
                variant="circular"
                width={22}
                height={22}
                sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
                animation="wave"
              />
            </Box>
            {[1, 2, 3].map((card) => (
              <Box
                key={card}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.04)'
                      : '#ffffff',
                  border: (theme) =>
                    `1px solid ${
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : '#e2e8f0'
                    }`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                <Skeleton
                  variant="text"
                  width="75%"
                  height={22}
                  sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width="45%"
                  height={16}
                  sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
                  animation="wave"
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 1,
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width="35%"
                    height={20}
                    sx={{
                      borderRadius: '10px',
                      bgcolor: (theme) => getSkeletonBg(theme),
                    }}
                    animation="wave"
                  />
                  <Skeleton
                    variant="circular"
                    width={20}
                    height={20}
                    sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
                    animation="wave"
                  />
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    );
  }

  // Default: list view skeleton
  const rowWidths = ['45%', '60%', '35%', '55%', '40%', '50%', '38%'];

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Table Header Skeleton */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns:
            '55px minmax(150px, 3fr) 100px 117px 123px 80px 125px 95px',
          padding: '8px 40px 8px 24px',
          borderBottom: (theme) =>
            theme.palette.mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.06)'
              : '1px solid rgba(0, 0, 0, 0.06)',
          gap: '12px',
          alignItems: 'center',
          minWidth: '950px',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Skeleton
            variant="rectangular"
            width={16}
            height={16}
            sx={{
              borderRadius: '3px',
              bgcolor: (theme) => getSkeletonBg(theme),
            }}
          />
        </Box>
        <Skeleton
          variant="text"
          width={80}
          height={16}
          sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
        />
        <Skeleton
          variant="text"
          width={60}
          height={16}
          sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
        />
        <Skeleton
          variant="text"
          width={70}
          height={16}
          sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
        />
        <Skeleton
          variant="text"
          width={65}
          height={16}
          sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
        />
        <Skeleton
          variant="text"
          width={50}
          height={16}
          sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
        />
        <Skeleton
          variant="text"
          width={25}
          height={16}
          sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Skeleton
            variant="text"
            width={45}
            height={16}
            sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
          />
        </Box>
      </Box>

      {/* Table Rows Skeletons */}
      {rowWidths.map((titleWidth, index) => (
        <Box
          key={index}
          sx={{
            display: 'grid',
            gridTemplateColumns:
              '55px minmax(150px, 3fr) 100px 117px 123px 80px 125px 95px',
            padding: '10px 40px 10px 24px',
            borderBottom: (theme) =>
              theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.04)'
                : '1px solid rgba(0, 0, 0, 0.04)',
            gap: '12px',
            alignItems: 'center',
            minWidth: '950px',
            boxSizing: 'border-box',
          }}
        >
          {/* Checkbox */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Skeleton
              variant="circular"
              width={18}
              height={18}
              animation="wave"
              sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
            />
          </Box>

          {/* Task Name */}
          <Skeleton
            variant="text"
            width={titleWidth}
            height={22}
            animation="wave"
            sx={{
              borderRadius: '4px',
              bgcolor: (theme) => getSkeletonBg(theme),
            }}
          />

          {/* Priority */}
          <Skeleton
            variant="rectangular"
            width={68}
            height={22}
            animation="wave"
            sx={{
              borderRadius: '12px',
              bgcolor: (theme) => getSkeletonBg(theme),
            }}
          />

          {/* Due Date */}
          <Skeleton
            variant="rectangular"
            width={85}
            height={22}
            animation="wave"
            sx={{
              borderRadius: '12px',
              bgcolor: (theme) => getSkeletonBg(theme),
            }}
          />

          {/* Estimated */}
          <Skeleton
            variant="text"
            width={50}
            height={18}
            animation="wave"
            sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
          />

          {/* Actual */}
          <Skeleton
            variant="text"
            width={40}
            height={18}
            animation="wave"
            sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
          />

          {/* AI */}
          <Skeleton
            variant="circular"
            width={22}
            height={22}
            animation="wave"
            sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
          />

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Skeleton
              variant="circular"
              width={22}
              height={22}
              animation="wave"
              sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
            />
            <Skeleton
              variant="circular"
              width={22}
              height={22}
              animation="wave"
              sx={{ bgcolor: (theme) => getSkeletonBg(theme) }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
