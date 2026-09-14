export interface PriorityOption {
  id: string;
  label: string;
  color: string;
  symbol: string;
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { id: 'Critical', label: 'Critical', color: '#ef4444', symbol: '!' },
  { id: 'High', label: 'High', color: '#f59e0b', symbol: '▲' },
  { id: 'Medium', label: 'Medium', color: '#3b82f6', symbol: '▲' },
  { id: 'Low', label: 'Low', color: '#10b981', symbol: '▼' },
  { id: 'None', label: 'None', color: '#6b7280', symbol: '—' },
];

export const getPriorityConfig = (
  priority?: string | number | null,
): PriorityOption => {
  if (typeof priority === 'number') {
    if (priority >= 4) return PRIORITY_OPTIONS[0];
    if (priority === 3) return PRIORITY_OPTIONS[1];
    if (priority === 2) return PRIORITY_OPTIONS[2];
    if (priority === 1) return PRIORITY_OPTIONS[3];
    return PRIORITY_OPTIONS[4];
  }
  const norm = (priority || '').toString().toLowerCase().trim();
  if (norm === 'critical' || norm === '4') return PRIORITY_OPTIONS[0];
  if (norm === 'high' || norm === '3') return PRIORITY_OPTIONS[1];
  if (norm === 'medium' || norm === 'med' || norm === '2')
    return PRIORITY_OPTIONS[2];
  if (norm === 'low' || norm === '1') return PRIORITY_OPTIONS[3];
  return PRIORITY_OPTIONS[4];
};

export const getPriorityColor = (priority?: string | number | null): string => {
  return getPriorityConfig(priority).color;
};

export const getPrioritySymbol = (
  priority?: string | number | null,
): string => {
  return getPriorityConfig(priority).symbol;
};
