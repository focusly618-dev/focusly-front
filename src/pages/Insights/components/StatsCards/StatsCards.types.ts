import type { DistributionEntry, StatValue } from '../../useInsights.types';

export interface StatsCardsProps {
  totalFocusHours: StatValue;
  taskCompletion: StatValue;
  energyScore: StatValue;
  breakHours: StatValue;
  goldenWindow: StatValue;
  timeDistribution: DistributionEntry[];
}
