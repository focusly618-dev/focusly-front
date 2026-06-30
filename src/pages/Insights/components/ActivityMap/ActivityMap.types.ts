export interface HeatmapCompletedTask {
  id: string;
  title: string;
  completedAt?: string | null;
  category?: string | null;
  realTimer?: number | null;
}

export interface HeatmapCellData {
  key: string;
  label: string;
  intensity: number;
  count: number;
  tasks: HeatmapCompletedTask[];
}

export interface ActivityMapProps {
  cells: HeatmapCellData[];
  heatmapLabels?: string[];
  filter: string;
}
