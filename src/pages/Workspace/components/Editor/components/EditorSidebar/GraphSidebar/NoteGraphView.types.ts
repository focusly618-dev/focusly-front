import type { HeadingItem } from './markdownHeadings';

export type GraphNodeType = 'document' | 'section' | 'source' | 'concept';
export type GraphFilterCategory = 'all' | 'sections' | 'sources' | 'concepts';

export interface NoteGraphViewProps {
  rootLabel: string;
  rootIcon?: string;
  headings: HeadingItem[];
  markdownContent?: string;
  onJump: (pos: number, label?: string) => void;
}

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label: string;
  type?: GraphNodeType;
  // 0 = root (the task/note itself), 1-6 = heading depth (# through ######)
  level: number;
  pos: number | null;
  url?: string;
  icon?: string;
  subtitle?: string;
  status?: string;
  statusColor?: 'amber' | 'green' | 'blue' | 'indigo' | 'gray';
  tagColor?: string;
  outgoingCount?: number;
  category?: 'section' | 'source' | 'concept';
}

export interface GraphEdge {
  from: string;
  to: string;
  color?: string;
  dashed?: boolean;
}

export interface GraphSettings {
  nodeSize: number;
  labelSize: number;
  spacing: number;
  linkThickness: number;
  showLabels: boolean;
  showArrows: boolean;
}

export const DEFAULT_SETTINGS: GraphSettings = {
  nodeSize: 1,
  labelSize: 1,
  spacing: 1,
  linkThickness: 1,
  showLabels: true,
  showArrows: false,
};

export interface NodeDragState {
  id: string;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
  dragged: boolean;
}

export interface PanState {
  x: number;
  y: number;
}
