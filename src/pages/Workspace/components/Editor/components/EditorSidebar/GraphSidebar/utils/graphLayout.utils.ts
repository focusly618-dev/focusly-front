import type { HeadingItem } from '../markdownHeadings';
import type { GraphEdge, GraphNode } from '../NoteGraphView.types';

export const SETTINGS_STORAGE_KEY = 'workspace_graph_settings';
export const DRAG_THRESHOLD_PX = 4;
export const ZOOM_MIN = 0.3;
export const ZOOM_MAX = 3;

/** Space kept between any two nodes, and around the whole graph. */
const NODE_GAP = 14;
const CANVAS_MARGIN = 40;
const MAX_LABEL_CHARS = 24;

export const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

// A leading emoji in a heading becomes its node's icon.
const LEADING_EMOJI =
  /^(\p{Extended_Pictographic}(?:️|\p{Emoji_Modifier}|‍\p{Extended_Pictographic})*)\s*/u;

export const splitHeadingIcon = (
  text: string,
): { icon?: string; label: string } => {
  const trimmed = text.trim();
  const match = trimmed.match(LEADING_EMOJI);
  return match
    ? { icon: match[1], label: trimmed.slice(match[0].length).trim() }
    : { label: trimmed };
};

/** The text a node shows: its label, cut to fit the pill. */
export const nodeText = (node: Pick<GraphNode, 'label'>): string =>
  truncate(node.label || '', MAX_LABEL_CHARS);

/** A node's box. Depends only on what it shows (never on selection or hover),
 * so the layout that keeps nodes apart holds whatever is selected. */
export const getNodeDimensions = (
  node: Pick<GraphNode, 'label' | 'level' | 'icon'>,
): { width: number; height: number } => {
  const isRoot = node.level === 0;
  const chars = nodeText(node).length;
  const charWidth = isRoot ? 7.4 : 6.6;
  const leading = node.icon ? 30 : 24; // icon or depth dot, plus padding
  const width = Math.round(
    Math.min(
      isRoot ? 220 : 200,
      Math.max(72, leading + chars * charWidth + 14),
    ),
  );
  return { width, height: isRoot ? 36 : 28 };
};

export const calculateCurvedPath = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  fromSize: { width: number; height: number },
  toSize: { width: number; height: number },
): string => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // Leave and enter through the sides facing each other
  if (Math.abs(dx) >= Math.abs(dy) * 0.6) {
    const dir = dx >= 0 ? 1 : -1;
    const startX = from.x + (dir * fromSize.width) / 2;
    const endX = to.x - (dir * toSize.width) / 2;
    const bend = Math.max(24, Math.abs(endX - startX) * 0.5) * dir;
    return `M ${startX} ${from.y} C ${startX + bend} ${from.y}, ${endX - bend} ${to.y}, ${endX} ${to.y}`;
  }
  const dir = dy >= 0 ? 1 : -1;
  const startY = from.y + (dir * fromSize.height) / 2;
  const endY = to.y - (dir * toSize.height) / 2;
  const bend = Math.max(20, Math.abs(endY - startY) * 0.5) * dir;
  return `M ${from.x} ${startY} C ${from.x} ${startY + bend}, ${to.x} ${endY - bend}, ${to.x} ${endY}`;
};

interface HeadingTreeNode {
  heading: HeadingItem;
  children: HeadingTreeNode[];
}

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

/**
 * Pushes apart any two nodes whose boxes (plus a gap) overlap, along the
 * axis where they overlap least, until none do. The root stays put. Mutates
 * the nodes' x/y.
 */
export const resolveOverlaps = (nodes: GraphNode[], gap = NODE_GAP): void => {
  const sizes = nodes.map(getNodeDimensions);
  for (let iteration = 0; iteration < 300; iteration++) {
    let moved = false;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const overlapX =
          (sizes[i].width + sizes[j].width) / 2 + gap - Math.abs(dx);
        const overlapY =
          (sizes[i].height + sizes[j].height) / 2 + gap - Math.abs(dy);
        if (overlapX <= 0 || overlapY <= 0) continue;
        moved = true;

        // Share the push, unless one of them is the fixed root
        const aShare = a.level === 0 ? 0 : b.level === 0 ? 1 : 0.5;
        const bShare = 1 - aShare;
        if (overlapX < overlapY) {
          const dir = dx === 0 ? 1 : Math.sign(dx);
          a.x -= dir * overlapX * aShare;
          b.x += dir * overlapX * bShare;
        } else {
          const dir = dy === 0 ? 1 : Math.sign(dy);
          a.y -= dir * overlapY * aShare;
          b.y += dir * overlapY * bShare;
        }
      }
    }
    if (!moved) return;
  }
};

/** Tree columns, left-aligned so links land on a straight edge, each as wide
 * as its widest node so neighbors never touch. */
const placeColumns = (
  nodes: GraphNode[],
  depthOf: Map<GraphNode, number>,
  columnGap: number,
) => {
  const widestAt: number[] = [];
  nodes.forEach((node) => {
    const depth = depthOf.get(node) ?? 0;
    widestAt[depth] = Math.max(
      widestAt[depth] ?? 0,
      getNodeDimensions(node).width,
    );
  });
  const columnLeft = [0];
  for (let d = 1; d < widestAt.length; d++) {
    columnLeft[d] = columnLeft[d - 1] + widestAt[d - 1] + columnGap;
  }
  nodes.forEach((node) => {
    node.x =
      columnLeft[depthOf.get(node) ?? 0] + getNodeDimensions(node).width / 2;
  });
};

/** An outline link: down from under the parent's marker, then a rounded
 * turn into the child's left edge. */
export const calculateElbowPath = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  fromSize: { width: number; height: number },
  toSize: { width: number; height: number },
): string => {
  const x = from.x - fromSize.width / 2 + 13; // under the parent's dot
  const startY = from.y + fromSize.height / 2;
  const endX = to.x - toSize.width / 2;
  const radius = Math.min(8, Math.max(0, endX - x), Math.max(0, to.y - startY));
  return `M ${x} ${startY} V ${to.y - radius} Q ${x} ${to.y} ${x + radius} ${to.y} H ${endX}`;
};

/**
 * `tree`: a left-to-right map for wide views. `outline`: the same structure
 * as an indented list, one heading per row, for narrow ones (the sidebar).
 */
export type GraphLayout = 'tree' | 'outline';

export const buildGraph = (
  rootLabel: string,
  headings: HeadingItem[],
  spacing = 1,
  _markdownContent?: string,
  rootIcon?: string,
  layout: GraphLayout = 'tree',
): {
  nodes: GraphNode[];
  edges: GraphEdge[];
  canvasWidth: number;
  canvasHeight: number;
  canvasSize: number;
} => {
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
      canvasWidth: canvasSize,
      canvasHeight: canvasSize,
      canvasSize,
    };
  }

  // Both layouts keep the note's own order top to bottom and give each node
  // a row of its own within its column, so nodes can't overlap.
  //  - tree: the note on the left, each nesting depth a column to its right;
  //    leaves take rows and parents sit midway along their children, with a
  //    little extra air between top-level branches.
  //  - outline: every node takes the next row, indented by its depth.
  const rowStep = (28 + 10) * spacing;
  const columnGap = 56 * spacing;
  const indent = 28 * spacing;

  const nodes: GraphNode[] = [
    {
      id: 'root',
      x: 0,
      y: 0,
      label: rootLabel || 'Esta nota',
      type: 'document',
      level: 0,
      pos: null,
      icon: rootIcon,
    },
  ];
  const edges: GraphEdge[] = [];
  const depthOf = new Map<GraphNode, number>([[nodes[0], 0]]);

  let nextRow = 0;
  const place = (
    node: HeadingTreeNode,
    parentId: string,
    depth: number,
  ): number => {
    const id = `h-${node.heading.pos}`;
    const { icon, label } = splitHeadingIcon(node.heading.text);
    const graphNode: GraphNode = {
      id,
      x: 0,
      y: 0,
      label: label || node.heading.text.trim(),
      type: 'section',
      level: node.heading.level,
      pos: node.heading.pos,
      icon,
      category: 'section',
    };
    nodes.push(graphNode);
    depthOf.set(graphNode, depth);
    edges.push({ from: parentId, to: id });

    if (layout === 'outline') {
      graphNode.y = nextRow++ * rowStep;
      node.children.forEach((child) => place(child, id, depth + 1));
    } else if (node.children.length === 0) {
      graphNode.y = nextRow++ * rowStep;
    } else {
      const childYs = node.children.map((child) => place(child, id, depth + 1));
      graphNode.y = (childYs[0] + childYs[childYs.length - 1]) / 2;
    }
    return graphNode.y;
  };

  if (layout === 'outline') {
    nextRow = 1; // the note itself takes the first row
    roots.forEach((root) => place(root, 'root', 1));
    nodes.forEach((node) => {
      node.x =
        (depthOf.get(node) ?? 0) * indent + getNodeDimensions(node).width / 2;
    });
  } else {
    const rootYs = roots.map((root, i) => {
      if (i > 0) nextRow += 0.5;
      return place(root, 'root', 1);
    });
    nodes[0].y = (rootYs[0] + rootYs[rootYs.length - 1]) / 2;
    placeColumns(nodes, depthOf, columnGap);
  }

  // A safety net: nothing above should leave two nodes touching
  resolveOverlaps(nodes);

  // The canvas is the graph's own bounds plus a margin, so the default view
  // (and "organize") always shows every node.
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  nodes.forEach((node) => {
    const { width, height } = getNodeDimensions(node);
    minX = Math.min(minX, node.x - width / 2);
    maxX = Math.max(maxX, node.x + width / 2);
    minY = Math.min(minY, node.y - height / 2);
    maxY = Math.max(maxY, node.y + height / 2);
  });
  nodes.forEach((node) => {
    node.x += CANVAS_MARGIN - minX;
    node.y += CANVAS_MARGIN - minY;
  });
  const canvasWidth = Math.round(maxX - minX + CANVAS_MARGIN * 2);
  const canvasHeight = Math.round(maxY - minY + CANVAS_MARGIN * 2);

  const outgoingCounts: Record<string, number> = {};
  edges.forEach((edge) => {
    outgoingCounts[edge.from] = (outgoingCounts[edge.from] || 0) + 1;
  });
  nodes.forEach((n) => {
    n.outgoingCount = outgoingCounts[n.id] || 0;
  });

  return {
    nodes,
    edges,
    canvasWidth,
    canvasHeight,
    canvasSize: Math.max(canvasWidth, canvasHeight),
  };
};
