import type { HeatmapCellData } from './components/ActivityMap/ActivityMap.types';

export interface StatValue {
  value: string;
  change: string;
  trend: string;
}

export interface TrendData {
  label: string;
  actual: number;
  planned: number;
}

export interface DistributionEntry {
  name: string;
  value: number;
  color: string;
}

export interface InsightsData {
  totalFocusHours: StatValue;
  taskCompletion: StatValue;
  energyScore: StatValue;
  goldenWindow: StatValue;
  breakHours: StatValue;
  productivityTrends: TrendData[];
  timeDistribution: DistributionEntry[];
  heatmap: number[];
  heatmapLabels: string[];
  heatmapCells: HeatmapCellData[];
}
