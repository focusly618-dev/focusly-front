export interface InsightsHeaderProps {
  filter: string;
  filters: string[];
  onFilterChange: (filter: string) => void;
  baseDate?: string | null;
  onNavigate?: (direction: 'prev' | 'next') => void;
  onReset?: () => void;
  periodLabel?: string;
}
