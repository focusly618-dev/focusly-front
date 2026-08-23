import type { HeadingItem } from '../markdownHeadings';
import type { GraphEdge, GraphNode } from '../NoteGraphView.types';

export const SETTINGS_STORAGE_KEY = 'workspace_graph_settings';
export const DRAG_THRESHOLD_PX = 4;
export const ZOOM_MIN = 1;
export const ZOOM_MAX = 4;

export const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

export const baseRadiusFor = (titleCount: number): number =>
  Math.min(150 + Math.max(0, titleCount - 4) * 16, 260);

// Visual size/prominence tapers off with heading depth, so H1s read as more
// important than H2s, which read as more important than H3s, etc.
export const baseRadiusForLevel = (level: number): number =>
  level === 0 ? 17 : Math.max(6, 12 - (level - 1) * 1.8);

export const fontSizeForLevel = (level: number): number =>
  level === 0 ? 14.5 : Math.max(10, 13 - (level - 1));

export const labelOffsetForLevel = (level: number): number =>
  level === 0 ? 22 : Math.max(11, 18 - (level - 1) * 2);

export const truncateLenForLevel = (level: number): number =>
  level === 0 ? 22 : Math.max(12, 20 - (level - 1) * 2);

interface HeadingTreeNode {
  heading: HeadingItem;
  children: HeadingTreeNode[];
}

// Nests headings the same way a markdown outline would: each heading's
// parent is the nearest preceding heading with a shallower level (or the
// note root if none — e.g. a document that opens straight into an H2).
const buildHeadingTree = (headings: HeadingItem[]): HeadingTreeNode[] => {
  const roots: HeadingTreeNode[] = [];
  const stack: HeadingTreeNode[] = [];

  headings.forEach((heading) => {
    const node: HeadingTreeNode = { heading, children: [] };
    while (
      stack.length > 0 &&
      stack[stack.length - 1].heading.level >= heading.level
    ) {
      stack.pop();
    }
    const parent = stack[stack.length - 1];
    if (parent) parent.children.push(node);
    else roots.push(node);
    stack.push(node);
  });

  return roots;
};

const countLeaves = (node: HeadingTreeNode): number =>
  node.children.length === 0
    ? 1
    : node.children.reduce((sum, child) => sum + countLeaves(child), 0);

const maxLevelOf = (node: HeadingTreeNode): number =>
  node.children.reduce(
    (max, child) => Math.max(max, maxLevelOf(child)),
    node.heading.level,
  );

export const buildGraph = (
  rootLabel: string,
  headings: HeadingItem[],
  spacing: number,
): { nodes: GraphNode[]; edges: GraphEdge[]; canvasSize: number } => {
  const roots = buildHeadingTree(headings);

  if (roots.length === 0) {
    const canvasSize = 400;
    const center = canvasSize / 2;
    return {
      nodes: [
        {
          id: 'root',
          x: center,
          y: center,
          label: rootLabel,
          level: 0,
          pos: null,
        },
      ],
      edges: [],
      canvasSize,
    };
  }

  const totalLeaves = roots.reduce((sum, r) => sum + countLeaves(r), 0);
  const maxLevel = Math.max(...roots.map(maxLevelOf));
  const baseRadius = baseRadiusFor(totalLeaves) * spacing;
  const ringStep = 90 * spacing;
  const maxRadius = baseRadius + (maxLevel - 1) * ringStep;
  const canvasSize = Math.max(400, maxRadius * 2 + 160);
  const center = canvasSize / 2;

  const nodes: GraphNode[] = [
    { id: 'root', x: center, y: center, label: rootLabel, level: 0, pos: null },
  ];
  const edges: GraphEdge[] = [];

  const place = (
    node: HeadingTreeNode,
    parentId: string,
    angleStart: number,
    angleEnd: number,
  ) => {
    const angle = (angleStart + angleEnd) / 2;
    const radius = baseRadius + (node.heading.level - 1) * ringStep;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const id = `h-${node.heading.pos}`;

    nodes.push({
      id,
      x,
      y,
      label: node.heading.text,
      level: node.heading.level,
      pos: node.heading.pos,
    });
    edges.push({ from: parentId, to: id });

    if (node.children.length === 0) return;

    const childLeafCounts = node.children.map(countLeaves);
    const totalChildLeaves = childLeafCounts.reduce((a, b) => a + b, 0);
    const span = angleEnd - angleStart;
    let cursor = angleStart;

    node.children.forEach((child, i) => {
      const childSpan = (childLeafCounts[i] / totalChildLeaves) * span;
      place(child, id, cursor, cursor + childSpan);
      cursor += childSpan;
    });
  };

  const rootLeafCounts = roots.map(countLeaves);
  const totalRootLeaves = rootLeafCounts.reduce((a, b) => a + b, 0);
  const fullSpan = 2 * Math.PI;
  let cursor = -Math.PI / 2;

  roots.forEach((root, i) => {
    const span = (rootLeafCounts[i] / totalRootLeaves) * fullSpan;
    place(root, 'root', cursor, cursor + span);
    cursor += span;
  });

  return { nodes, edges, canvasSize };
};

export const calculateNodeRadius = (
  level: number,
  isHovered: boolean,
  nodeSize: number,
): number => baseRadiusForLevel(level) * nodeSize + (isHovered ? 2 : 0);

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
