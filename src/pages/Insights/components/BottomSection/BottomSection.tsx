import { Box } from '@mui/material';
import { GoldenHoursCard } from './GoldenHoursCard';
import { ActivityMap } from '../ActivityMap';
import type { HeatmapCellData } from '../ActivityMap';
import { TimeDistributionChart } from '../TimeDistributionChart';
import type { DistributionEntry } from '../../useInsights.types';

export interface BottomSectionProps {
  goldenWindowValue: string;
  heatmapCells: HeatmapCellData[];
  heatmapLabels?: string[];
  timeDistribution: DistributionEntry[];
  filter: string;
  baseDate?: string | null;
  loading?: boolean;
}

export const BottomSection = ({
  goldenWindowValue,
  heatmapCells,
  heatmapLabels,
  timeDistribution,
  filter,
  baseDate,
  loading,
}: BottomSectionProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1.2fr',
        gap: '16px',
        width: '100%',
        '@media (max-width: 1024px)': {
          gridTemplateColumns: '1fr',
        },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <GoldenHoursCard fallbackGoldenWindow={goldenWindowValue} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <ActivityMap
          cells={heatmapCells}
          heatmapLabels={heatmapLabels}
          filter={filter}
          baseDate={baseDate}
          loading={loading}
        />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <TimeDistributionChart data={timeDistribution} />
      </Box>
    </Box>
  );
};
