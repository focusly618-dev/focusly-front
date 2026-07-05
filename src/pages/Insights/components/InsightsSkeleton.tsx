import React from 'react';
import { Box, Skeleton } from '@mui/material';
import {
  PageContainer,
  StatsGrid,
  StatCard,
  ChartCard,
  BottomRow,
} from '../Insights.styles';

export const InsightsSkeleton: React.FC = () => {
  return (
    <PageContainer>
      {/* Header Skeleton */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Skeleton variant="text" width={200} height={40} animation="wave" />
          <Skeleton
            variant="text"
            width={300}
            height={24}
            animation="wave"
            sx={{ mt: 1 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton
            variant="rounded"
            width={100}
            height={36}
            sx={{ borderRadius: '8px' }}
            animation="wave"
          />
          <Skeleton
            variant="rounded"
            width={130}
            height={36}
            sx={{ borderRadius: '8px' }}
            animation="wave"
          />
        </Box>
      </Box>

      {/* Filter Tabs Skeleton */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Skeleton
          variant="rounded"
          width={60}
          height={32}
          sx={{ borderRadius: '20px' }}
          animation="wave"
        />
        <Skeleton
          variant="rounded"
          width={80}
          height={32}
          sx={{ borderRadius: '20px' }}
          animation="wave"
        />
        <Skeleton
          variant="rounded"
          width={80}
          height={32}
          sx={{ borderRadius: '20px' }}
          animation="wave"
        />
      </Box>

      {/* Main Body Skeleton */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Stats Grid */}
        <StatsGrid>
          {[1, 2, 3, 4, 5].map((i) => (
            <StatCard key={i}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="start"
              >
                <Box sx={{ flex: 1, mr: 2 }}>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={20}
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={48}
                    sx={{ mt: 1 }}
                    animation="wave"
                  />
                </Box>
                <Skeleton
                  variant="rounded"
                  width={40}
                  height={40}
                  sx={{ borderRadius: '12px' }}
                  animation="wave"
                />
              </Box>
              <Skeleton
                variant="rounded"
                width={70}
                height={24}
                sx={{ borderRadius: '4px', mt: 1 }}
                animation="wave"
              />
            </StatCard>
          ))}
        </StatsGrid>

        {/* Productivity Trends Chart taking full width */}
        <Box sx={{ width: '100%' }}>
          <ChartCard>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Skeleton
                variant="text"
                width={180}
                height={28}
                animation="wave"
              />
              <Box display="flex" gap={1}>
                <Skeleton
                  variant="rounded"
                  width={60}
                  height={28}
                  sx={{ borderRadius: '6px' }}
                  animation="wave"
                />
                <Skeleton
                  variant="rounded"
                  width={60}
                  height={28}
                  sx={{ borderRadius: '6px' }}
                  animation="wave"
                />
              </Box>
            </Box>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={300}
              sx={{ borderRadius: '8px', mt: 2 }}
              animation="wave"
            />
          </ChartCard>
        </Box>

        {/* Bottom Row */}
        <BottomRow>
          {/* Golden Hours Card */}
          <ChartCard sx={{ height: 'auto', minHeight: '340px', gap: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Skeleton
                variant="text"
                width={120}
                height={28}
                animation="wave"
              />
              <Skeleton
                variant="rounded"
                width={120}
                height={28}
                sx={{ borderRadius: '20px' }}
                animation="wave"
              />
            </Box>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={68}
              sx={{ borderRadius: 2 }}
              animation="wave"
            />
            <Box sx={{ mt: 1 }}>
              <Skeleton
                variant="text"
                width={120}
                height={16}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width="60%"
                height={24}
                sx={{ mt: 0.5 }}
                animation="wave"
              />
            </Box>
            <Box sx={{ mt: 1 }}>
              <Skeleton
                variant="text"
                width={150}
                height={16}
                animation="wave"
              />
              <Box display="flex" gap={1} sx={{ mt: 1 }}>
                <Skeleton
                  variant="rounded"
                  width={80}
                  height={24}
                  sx={{ borderRadius: '6px' }}
                  animation="wave"
                />
                <Skeleton
                  variant="rounded"
                  width={90}
                  height={24}
                  sx={{ borderRadius: '6px' }}
                  animation="wave"
                />
              </Box>
            </Box>
          </ChartCard>

          {/* Activity Map & Time Distribution side-by-side sub-grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.2fr',
              gap: '16px',
              width: '100%',
              '@media (max-width: 1024px)': {
                gridTemplateColumns: '1fr',
              },
            }}
          >
            {/* Activity Map / Heatmap Card */}
            <ChartCard sx={{ height: 'auto', minHeight: '340px' }}>
              <Skeleton
                variant="text"
                width={150}
                height={28}
                animation="wave"
              />
              <Box sx={{ mt: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Skeleton
                    variant="text"
                    width={200}
                    height={20}
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    width={120}
                    height={20}
                    animation="wave"
                  />
                </Box>
                <Box display="flex" flexDirection="column" gap={0.5}>
                  {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                    <Box key={row} display="flex" gap={0.5}>
                      {Array.from({ length: 14 }).map((_, col) => (
                        <Skeleton
                          key={col}
                          variant="rectangular"
                          sx={{
                            aspectRatio: '1',
                            flex: 1,
                            borderRadius: '4px',
                          }}
                          animation="wave"
                        />
                      ))}
                    </Box>
                  ))}
                </Box>
              </Box>
            </ChartCard>

            {/* Time Distribution Chart */}
            <ChartCard sx={{ height: 'auto', minHeight: '340px' }}>
              <Skeleton
                variant="text"
                width={180}
                height={28}
                animation="wave"
              />
              <Skeleton
                variant="circular"
                width={180}
                height={180}
                sx={{ mx: 'auto', mt: 4 }}
                animation="wave"
              />
            </ChartCard>
          </Box>
        </BottomRow>
      </Box>
    </PageContainer>
  );
};
