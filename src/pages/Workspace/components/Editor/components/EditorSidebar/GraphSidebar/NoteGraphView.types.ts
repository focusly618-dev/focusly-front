import type { HeadingItem } from './markdownHeadings';

export interface NoteGraphViewProps {
  rootLabel: string;
  headings: HeadingItem[];
  onJump: (pos: number) => void;
}

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label: string;
  // 0 = root (the task/note itself), 1-6 = heading depth (# through ######)
  level: number;
  pos: number | null;
}

export interface GraphEdge {
  from: string;
  to: string;
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
