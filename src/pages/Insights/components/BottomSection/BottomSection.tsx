import { Box, Typography, Tooltip } from '@mui/material';
import { WbSunny, InfoOutlined as InfoIcon } from '@mui/icons-material';
import { BottomRow, ChartCard, ActionButton } from '../../Insights.styles';
import { ActivityMap } from '../ActivityMap';
import type { HeatmapCellData } from '../ActivityMap';

export interface BottomSectionProps {
  goldenWindowValue: string;
  heatmapCells: HeatmapCellData[];
  heatmapLabels?: string[];
  filter: string;
}

export const BottomSection = ({
  goldenWindowValue,
  heatmapCells,
  heatmapLabels,
  filter,
}: BottomSectionProps) => {
  return (
    <BottomRow>
      <ChartCard sx={{ height: 'auto', minHeight: '300px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="h6" fontWeight="bold">
              Golden Hours
            </Typography>
            <Tooltip
              title="We identify your peak concentration moments by analyzing what time of day you usually accumulate the most real focus minutes."
              arrow
            >
              <InfoIcon
                sx={{ fontSize: 16, color: 'text.disabled', cursor: 'help' }}
              />
            </Tooltip>
          </Box>
          <ActionButton>VIEW DETAILS</ActionButton>
        </Box>
        <Box
          p={2}
          bgcolor="warning.light"
          borderRadius={2}
          display="flex"
          gap={2}
          alignItems="start"
        >
          <WbSunny sx={{ color: 'warning.main', mt: 0.5 }} />
          <Box>
            <Typography variant="body2" color="warning.main">
              You are most productive between <b>{goldenWindowValue}</b>
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" mt={2}>
          PRODUCTIVITY SCORE (LAST 7 DAYS)
        </Typography>
      </ChartCard>

      <ActivityMap
        cells={heatmapCells}
        heatmapLabels={heatmapLabels}
        filter={filter}
      />
    </BottomRow>
  );
};
