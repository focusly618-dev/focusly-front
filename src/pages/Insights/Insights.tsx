import { Box, CircularProgress } from '@mui/material';
import { PageContainer, ChartsRow } from './Insights.styles';
import { useInsights } from './useInsights.hook';
import { InsightsHeader } from './components/InsightsHeader';
import { StatsCards } from './components/StatsCards';
import { ProductivityTrendsChart } from './components/ProductivityTrendsChart';
import { TimeDistributionChart } from './components/TimeDistributionChart';
import { BottomSection } from './components/BottomSection/BottomSection';

export const Insights = () => {
  const { stats, loading, hasData, filter, filters, setFilter } = useInsights();

  if (loading && !hasData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer>
      <InsightsHeader
        filter={filter}
        filters={[...filters]}
        onFilterChange={setFilter}
      />

      <Box
        sx={{
          opacity: loading ? 0.6 : 1,
          transition: 'opacity 0.25s ease-in-out',
          pointerEvents: loading ? 'none' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Box id="joyride-insights-stats">
          <StatsCards
            totalFocusHours={stats.totalFocusHours}
            taskCompletion={stats.taskCompletion}
            energyScore={stats.energyScore}
            breakHours={stats.breakHours}
            goldenWindow={stats.goldenWindow}
          />
        </Box>

        <ChartsRow>
          <Box id="joyride-insights-trends" sx={{ flex: 1 }}>
            <ProductivityTrendsChart data={stats.productivityTrends} />
          </Box>
          <Box id="joyride-insights-distribution" sx={{ flex: 1 }}>
            <TimeDistributionChart data={stats.timeDistribution} />
          </Box>
        </ChartsRow>

        <Box id="joyride-insights-heatmap">
          <BottomSection
            goldenWindowValue={stats.goldenWindow.value}
            heatmapCells={stats.heatmapCells}
            heatmapLabels={stats.heatmapLabels}
            filter={filter}
          />
        </Box>
      </Box>
    </PageContainer>
  );
};
