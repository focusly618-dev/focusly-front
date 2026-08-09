import type { GraphEdge, GraphNode } from '../NoteGraphView.types';

export const SETTINGS_STORAGE_KEY = 'workspace_graph_settings';
export const DRAG_THRESHOLD_PX = 4;
export const ZOOM_MIN = 1;
export const ZOOM_MAX = 4;

export const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

export const baseRadiusFor = (titleCount: number): number =>
  Math.min(150 + Math.max(0, titleCount - 4) * 16, 260);

export const buildGraph = (
  rootLabel: string,
  headings: HeadingItem[],
  spacing: number,
): { nodes: GraphNode[]; edges: GraphEdge[]; canvasSize: number } => {
  const titles = headings.filter((h) => h.level === 1);
  const n = titles.length;
  const radius = baseRadiusFor(n) * spacing;
  const canvasSize = Math.max(400, radius * 2 + 160);
  const center = canvasSize / 2;

  const nodes: GraphNode[] = [
    { id: 'root', x: center, y: center, label: rootLabel, level: 0, pos: null },
  ];
  const edges: GraphEdge[] = [];

  titles.forEach((title, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const id = `h1-${title.pos}`;
    nodes.push({ id, x, y, label: title.text, level: 1, pos: title.pos });
    edges.push({ from: 'root', to: id });
  });

  return { nodes, edges, canvasSize };
};

export const calculateNodeRadius = (
  level: 0 | 1,
  isHovered: boolean,
  nodeSize: number,
): number => (level === 0 ? 17 : 12) * nodeSize + (isHovered ? 2 : 0);

export const calculateTrimmedEdgeTarget = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  targetRadius: number,
  nodeSize: number,
): { trimmedX: number; trimmedY: number } => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const trimmedX = to.x - (dx / len) * (targetRadius * nodeSize + 4);
  const trimmedY = to.y - (dy / len) * (targetRadius * nodeSize + 4);
  return { trimmedX, trimmedY };
};
