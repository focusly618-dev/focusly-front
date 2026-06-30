import { GoldenHoursCard } from './GoldenHoursCard';
import { ActivityMap } from '../ActivityMap';
import type { HeatmapCellData } from '../ActivityMap';
import { BottomRow } from '../../Insights.styles';

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
      <GoldenHoursCard fallbackGoldenWindow={goldenWindowValue} />

      <ActivityMap
        cells={heatmapCells}
        heatmapLabels={heatmapLabels}
        filter={filter}
      />
    </BottomRow>
  );
};
