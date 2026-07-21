import { Box, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageContainer } from './Insights.styles';
import { useInsights } from './useInsights.hook';
import { InsightsHeader } from './components/InsightsHeader';
import { StatsCards } from './components/StatsCards';
import { ProductivityTrendsChart } from './components/ProductivityTrendsChart';
import { BottomSection } from './components/BottomSection/BottomSection';
import { InsightsSkeleton } from './components/InsightsSkeleton';

export const Insights = () => {
  const {
    stats,
    loading,
    hasData,
    filter,
    filters,
    setFilter,
    baseDate,
    navigatePeriod,
    resetPeriod,
    periodLabel,
  } = useInsights();

  if (loading && !hasData) {
    return <InsightsSkeleton />;
  }

  return (
    <PageContainer>
      <InsightsHeader
        filter={filter}
        filters={[...filters]}
        onFilterChange={setFilter}
        baseDate={baseDate}
        onNavigate={navigatePeriod}
        onReset={resetPeriod}
        periodLabel={periodLabel}
      />

      <Box
        sx={{
          opacity: loading && !baseDate ? 0.6 : 1,
          transition: 'opacity 0.25s ease-in-out',
          pointerEvents: loading && !baseDate ? 'none' : 'auto',
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

        <Box id="joyride-insights-trends" sx={{ width: '100%' }}>
          <ProductivityTrendsChart data={stats.productivityTrends} />
        </Box>

        <Box id="joyride-insights-heatmap">
          <BottomSection
            goldenWindowValue={stats.goldenWindow.value}
            heatmapCells={stats.heatmapCells}
            heatmapLabels={stats.heatmapLabels}
            timeDistribution={stats.timeDistribution}
            filter={filter}
          />
        </Box>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
          bgcolor: 'primary.main',
          color: '#ffffff',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        <AddIcon />
      </Fab>
    </PageContainer>
  );
};
