import type { HeadingItem } from '../markdownHeadings';
import type { GraphEdge, GraphNode } from '../NoteGraphView.types';

export const SETTINGS_STORAGE_KEY = 'workspace_graph_settings';
export const DRAG_THRESHOLD_PX = 4;
export const ZOOM_MIN = 0.6;
export const ZOOM_MAX = 3.5;

export const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

export const baseRadiusFor = (titleCount: number): number =>
  Math.min(150 + Math.max(0, titleCount - 4) * 16, 260);

export const baseRadiusForLevel = (level: number): number =>
  level === 0 ? 17 : Math.max(6, 12 - (level - 1) * 1.8);

export const getHeadingIcon = (text: string, level: number): string => {
  // Check if starts with emoji
  const emojiMatch = text.match(
    /^([\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])/u,
  );
  if (emojiMatch) return emojiMatch[1];

  const lower = text.toLowerCase();
  if (
    lower.includes('objetivo') ||
    lower.includes('meta') ||
    lower.includes('goal') ||
    lower.includes('contexto')
  )
    return '🎯';
  if (
    lower.includes('estructura') ||
    lower.includes('sección') ||
    lower.includes('secciones') ||
    lower.includes('outline')
  )
    return '📑';
  if (
    lower.includes('paso') ||
    lower.includes('inmediato') ||
    lower.includes('acción') ||
    lower.includes('quickstart')
  )
    return '🚀';
  if (
    lower.includes('recurso') ||
    lower.includes('fuente') ||
    lower.includes('buscar') ||
    lower.includes('referencia') ||
    lower.includes('docs')
  )
    return '📚';
  if (
    lower.includes('criterio') ||
    lower.includes('fin') ||
    lower.includes('complet') ||
    lower.includes('done') ||
    lower.includes('check')
  )
    return '✅';
  if (
    lower.includes('pregunta') ||
    lower.includes('investig') ||
    lower.includes('faq') ||
    lower.includes('duda')
  )
    return '💡';
  if (
    lower.includes('resumen') ||
    lower.includes('intro') ||
    lower.includes('portada')
  )
    return '📖';
  if (lower.includes('nota') || lower.includes('idea')) return '📌';

  if (level === 1) return '📄';
  if (level === 2) return '📁';
  if (level === 3) return '🔹';
  return '•';
};

export const getNodeDimensions = (
  node: { type?: string; label: string },
  isSelected = false,
): { width: number; height: number } => {
  if (node.type === 'document') {
    return { width: 185, height: 54 };
  }
  if (node.type === 'source' || node.type === 'concept') {
    const width = Math.max(95, Math.min(135, node.label.length * 9.5 + 24));
    return { width, height: 30 };
  }
  if (isSelected) {
    return { width: 195, height: 52 };
  }
  const width = Math.max(145, Math.min(205, node.label.length * 8.5 + 46));
  return { width, height: 40 };
};

export const calculateCurvedPath = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  fromSize: { width: number; height: number } = { width: 180, height: 40 },
  toSize: { width: number; height: number } = { width: 180, height: 40 },
): string => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  let startX = from.x;
  let startY = from.y;
  let endX = to.x;
  let endY = to.y;

  // Determine if horizontal flow or vertical flow
  if (Math.abs(dx) >= Math.abs(dy) * 0.6) {
    // Horizontal connection
    if (dx > 0) {
      startX = from.x + fromSize.width / 2;
      endX = to.x - toSize.width / 2;
    } else {
      startX = from.x - fromSize.width / 2;
      endX = to.x + toSize.width / 2;
    }
    const rawDist = endX - startX;
    const dist = Math.abs(rawDist) < 20 ? (dx >= 0 ? 30 : -30) : rawDist;
    const cp1x = startX + dist * 0.45;
    const cp2x = endX - dist * 0.45;
    return `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;
  } else {
    // Vertical connection (e.g. downward to Criterios)
    if (dy > 0) {
      startY = from.y + fromSize.height / 2;
      endY = to.y - toSize.height / 2;
    } else {
      startY = from.y - fromSize.height / 2;
      endY = to.y + toSize.height / 2;
    }
    const rawDist = endY - startY;
    const dist = Math.abs(rawDist) < 20 ? (dy >= 0 ? 30 : -30) : rawDist;
    const cp1y = startY + dist * 0.45;
    const cp2y = endY - dist * 0.45;
    return `M ${startX} ${startY} C ${startX} ${cp1y}, ${endX} ${cp2y}, ${endX} ${endY}`;
  }
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
  spacing = 1,
  rootIcon?: string,
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

  const totalLeaves = roots.reduce((sum, r) => sum + countLeaves(r), 0);
  const maxLevel = Math.max(...roots.map(maxLevelOf));
  const baseRadius = baseRadiusFor(totalLeaves) * spacing;
  const ringStep = 90 * spacing;
  const maxRadius = baseRadius + (maxLevel - 1) * ringStep;
  const canvasSize = Math.max(400, maxRadius * 2 + 160);
  const center = canvasSize / 2;

  const nodes: GraphNode[] = [
    {
      id: 'root',
      x: center,
      y: center,
      label: rootLabel || 'Esta nota',
      type: 'document',
      level: 0,
      pos: null,
      icon: rootIcon || '📄',
      subtitle: 'Documento Principal',
      status: 'Activo',
      statusColor: 'indigo',
    },
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
    const cleanText = node.heading.text.trim();
    const icon = getHeadingIcon(cleanText, node.heading.level);

    nodes.push({
      id,
      x,
      y,
      label: cleanText,
      type: 'section',
      level: node.heading.level,
      pos: node.heading.pos,
      icon,
      subtitle: 'Sección del Documento',
      status: cleanText.includes('✅') ? 'Completado' : 'En progreso',
      statusColor: cleanText.includes('✅') ? 'green' : 'amber',
      category: 'section',
    });

    edges.push({
      from: parentId,
      to: id,
    });

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
    canvasWidth: canvasSize,
    canvasHeight: canvasSize,
    canvasSize,
  };
};

export const calculateNodeRadius = (
  level: number,
  isHovered: boolean,
  nodeSize: number,
): number => (level === 0 ? 20 : 12) * nodeSize + (isHovered ? 2 : 0);

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
