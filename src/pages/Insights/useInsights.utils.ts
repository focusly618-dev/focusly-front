import type {
  TrendData,
  DistributionEntry,
  InsightsData,
} from './useInsights.types';
import type { HeatmapCellData } from './components/ActivityMap/ActivityMap.types';

export const FILTERS = ['Daily', 'Weekly', 'Monthly'] as const;

export const DEFAULT_TRENDS: TrendData[] = [
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
  'SUN',
].map((label) => ({
  label,
  actual: 0,
  planned: 0,
}));

export const DEFAULT_DISTRIBUTION: DistributionEntry[] = [
  { name: 'Deep Work', value: 0, color: '#3b82f6' },
  { name: 'Meetings', value: 0, color: '#6366f1' },
  { name: 'Admin/Misc', value: 0, color: '#8b5cf6' },
  { name: 'Rest/Breaks', value: 0, color: '#1e293b' },
];

export const DEFAULT_STATS: InsightsData = {
  totalFocusHours: { value: '0h 0m', change: 'No data', trend: 'neutral' },
  taskCompletion: { value: '0%', change: '0%', trend: 'neutral' },
  energyScore: { value: 'N/A', change: '0 pts', trend: 'neutral' },
  goldenWindow: { value: 'N/A', change: '-', trend: 'neutral' },
  breakHours: { value: '0h 0m', change: '0%', trend: 'neutral' },
  productivityTrends: DEFAULT_TRENDS,
  timeDistribution: DEFAULT_DISTRIBUTION,
  heatmap: [],
  heatmapLabels: [],
  heatmapCells: [],
};

/**
 * Calculates the label representation of the selected period.
 */
export const calculatePeriodLabel = (
  filter: string,
  baseDate: string | null,
  cells: HeatmapCellData[] = [],
): string => {
  if (cells.length === 0) return '';

  if (filter === 'Daily') {
    const refDate = baseDate ? new Date(baseDate + 'T00:00:00') : new Date();
    return refDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  if (filter === 'Weekly') {
    const first = cells[0]?.key;
    const last = cells[cells.length - 1]?.key;
    if (!first || !last) return '';
    const firstDate = new Date(first + 'T00:00:00');
    const lastDate = new Date(last + 'T00:00:00');
    const firstStr = firstDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    const lastStr = lastDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${firstStr} - ${lastStr}`;
  }

  if (filter === 'Monthly') {
    const refDate = baseDate ? new Date(baseDate + 'T00:00:00') : new Date();
    return refDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
    });
  }

  return '';
};
