import type { HeadingItem } from '../markdownHeadings';
import type { GraphEdge, GraphNode } from '../NoteGraphView.types';

export const SETTINGS_STORAGE_KEY = 'workspace_graph_settings';
export const DRAG_THRESHOLD_PX = 4;
export const ZOOM_MIN = 0.6;
export const ZOOM_MAX = 3.5;

export const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

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
  node: { type: string; label: string },
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

export const buildGraph = (
  rootLabel: string,
  headings: HeadingItem[],
  spacing = 1,
  markdownContent = '',
  rootIcon?: string,
): {
  nodes: GraphNode[];
  edges: GraphEdge[];
  canvasWidth: number;
  canvasHeight: number;
  canvasSize: number;
} => {
  const effectiveHeadings = headings;

  const canvasWidth = 1440;
  const canvasHeight = 920;
  const center = { x: 700, y: 460 };

  const nodes: GraphNode[] = [
    {
      id: 'root',
      x: center.x,
      y: center.y,
      label: rootLabel || 'Esta nota',
      type: 'document',
      level: 0,
      pos: 0,
      icon: rootIcon || '📄',
      subtitle: 'Documento Principal',
      status: 'Activo',
      statusColor: 'indigo',
    },
  ];

  const edges: GraphEdge[] = [];

  // Parse links or sub-items from markdown content under headings
  const parseSectionLinks = (headingPos: number, nextPos: number) => {
    if (!markdownContent) return [];
    const sectionText = markdownContent.slice(headingPos, nextPos);
    const links: { label: string; url: string; pos: number }[] = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match: RegExpExecArray | null;
    while ((match = linkRegex.exec(sectionText)) !== null) {
      links.push({
        label: match[1].trim(),
        url: match[2].trim(),
        pos: headingPos + match.index,
      });
    }
    return links;
  };

  // Pre-configured coordinate offsets for zero-crossing planar layout
  const presetPositions: Record<string, { x: number; y: number }> = {
    '🎯 Objetivo & Contexto': { x: 340, y: 260 },
    '📑 Estructura & Secciones': { x: 340, y: 560 },
    '1. Portada': { x: 80, y: 480 },
    '2. Preguntas Inv.': { x: 80, y: 640 },
    '🚀 Primer Paso Inmediato': { x: 1060, y: 260 },
    '📚 Recursos Clave': { x: 1060, y: 560 },
    '✅ Criterios de Finalización': { x: 700, y: 780 },
  };

  const roots = buildHeadingTree(effectiveHeadings);

  const placeDynamicNode = (
    node: HeadingTreeNode,
    parentId: string,
    index: number,
    total: number,
  ) => {
    const heading = node.heading;
    const cleanText = heading.text.trim();
    const id = `h-${heading.pos}-${cleanText.replace(/\s+/g, '_')}`;
    const icon = getHeadingIcon(cleanText, heading.level);

    let posXY = presetPositions[cleanText];
    if (!posXY) {
      if (parentId === 'root') {
        // Symmetrical dual-sided layout: split into left and right wings
        const isRight = index % 2 === 0;
        const wingIndex = Math.floor(index / 2);
        const totalWing = Math.max(1, Math.ceil(total / 2));
        const verticalSpan = 480 * spacing;
        const startY = center.y - verticalSpan / 2;
        const stepY = totalWing > 1 ? verticalSpan / (totalWing - 1) : 0;
        const y = startY + wingIndex * stepY;
        const x = isRight ? center.x + 360 * spacing : center.x - 360 * spacing;
        posXY = { x, y };
      } else {
        // Sub-heading: place outward on same wing as parent
        const parentNode = nodes.find((n) => n.id === parentId);
        const parentX = parentNode?.x ?? center.x;
        const parentY = parentNode?.y ?? center.y;
        const isRight = parentX >= center.x;
        const subX = isRight ? parentX + 270 : parentX - 270;

        const childSpacing = 85;
        const childStartY = parentY - ((total - 1) * childSpacing) / 2;
        const subY = childStartY + index * childSpacing;
        posXY = { x: subX, y: subY };
      }
    }

    // Check for child links in markdown
    const nextHeading = effectiveHeadings.find((h) => h.pos > heading.pos);
    const links = parseSectionLinks(
      heading.pos,
      nextHeading ? nextHeading.pos : markdownContent.length,
    );

    const totalSubItems = links.length + node.children.length;

    nodes.push({
      id,
      x: posXY.x,
      y: posXY.y,
      label: cleanText,
      type: 'section',
      level: heading.level,
      pos: heading.pos,
      icon,
      subtitle:
        totalSubItems > 0
          ? `${totalSubItems} ${totalSubItems === 1 ? 'conexión' : 'conexiones'}`
          : 'Sección del Documento',
      status: cleanText.includes('✅') ? 'Completado' : 'En progreso',
      statusColor: cleanText.includes('✅') ? 'green' : 'amber',
      category: 'section',
    });

    edges.push({
      from: parentId,
      to: id,
      dashed: true,
    });

    if (links.length > 0) {
      const isParentRight = posXY.x >= center.x;
      const sX = isParentRight ? posXY.x + 270 : posXY.x - 270;
      const childCount = links.length;
      const startLinkY = posXY.y - ((childCount - 1) * 50) / 2;

      links.forEach((link, lIndex) => {
        const sourceId = `src-${id}-${lIndex}`;
        const sY = startLinkY + lIndex * 50;

        nodes.push({
          id: sourceId,
          x: sX,
          y: sY,
          label: link.label,
          type: 'source',
          level: heading.level + 1,
          pos: link.pos,
          url: link.url,
          icon: '🌐',
          subtitle: 'Fuente Externa / Enlace',
          status: 'Referencia',
          statusColor: 'green',
          tagColor: '#10b981',
          category: 'source',
        });

        edges.push({
          from: id,
          to: sourceId,
          color: '#10b981',
        });
      });
    }

    // Place heading children (sub-headings)
    node.children.forEach((child, cIndex) => {
      placeDynamicNode(child, id, cIndex, node.children.length);
    });
  };

  roots.forEach((rootNode, i) => {
    placeDynamicNode(rootNode, 'root', i, roots.length);
  });

  // Calculate outgoing count for each node
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
