import React from 'react';
import { alpha, useTheme } from '@mui/material';
import type {
  GraphEdge,
  GraphNode,
  GraphSettings,
} from '../NoteGraphView.types';
import type { GraphView } from '../NoteGraphView.hooks';
import type { GraphLayout } from '../utils/graphLayout.utils';
import { GraphEdgeItem } from './GraphEdgeItem';
import { GraphNodeItem } from './GraphNodeItem';

interface GraphCanvasProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  contentRef: React.RefObject<SVGGElement | null>;
  canvasWidth: number;
  canvasHeight: number;
  view: GraphView;
  isPanning: boolean;
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeById: Map<string, GraphNode>;
  /** Nodes in focus (hovered and its neighbors, or search matches); null
   * when nothing is, so all are drawn alike. */
  focusIds: Set<string> | null;
  hoveredId: string | null;
  selectedNodeId: string | null;
  draggingId: string | null;
  settings: GraphSettings;
  layout: GraphLayout;
  onCanvasPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
  onNodePointerDown: (node: GraphNode) => (e: React.PointerEvent) => void;
  onNodeClick: (node: GraphNode) => void;
  onNodeDoubleClick: (node: GraphNode) => void;
  setHoveredId: (id: string | null) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  svgRef,
  contentRef,
  canvasWidth,
  canvasHeight,
  view,
  isPanning,
  nodes,
  edges,
  nodeById,
  focusIds,
  hoveredId,
  selectedNodeId,
  draggingId,
  settings,
  layout,
  onCanvasPointerDown,
  onNodePointerDown,
  onNodeClick,
  onNodeDoubleClick,
  setHoveredId,
}) => {
  const theme = useTheme();
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
      preserveAspectRatio="xMidYMid meet"
      onPointerDown={onCanvasPointerDown}
      style={{
        overflow: 'hidden',
        touchAction: 'none',
        userSelect: 'none',
        cursor: isPanning ? 'grabbing' : 'grab',
        display: 'block',
      }}
    >
      <defs>
        <pattern
          id="note-graph-dots"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="1.5"
            cy="1.5"
            r="1"
            fill={alpha(theme.palette.text.primary, 0.08)}
          />
        </pattern>
      </defs>

      {/* A faint dotted ground, larger than the canvas so panning never
          reaches its edge */}
      <rect
        x={-canvasWidth * 2}
        y={-canvasHeight * 2}
        width={canvasWidth * 5}
        height={canvasHeight * 5}
        fill="url(#note-graph-dots)"
      />

      <g
        ref={contentRef}
        transform={`translate(${cx + view.x}, ${cy + view.y}) scale(${view.zoom}) translate(${-cx}, ${-cy})`}
      >
        {edges.map((edge) => (
          <GraphEdgeItem
            key={`${edge.from}-${edge.to}`}
            edge={edge}
            nodeById={nodeById}
            highlightedId={hoveredId ?? selectedNodeId}
            focusIds={focusIds}
            settings={settings}
            layout={layout}
          />
        ))}

        {nodes.map((node) => (
          <GraphNodeItem
            key={node.id}
            node={node}
            isHovered={node.id === hoveredId}
            isSelected={node.id === selectedNodeId}
            isDragging={node.id === draggingId}
            dimmed={Boolean(focusIds) && !focusIds?.has(node.id)}
            onPointerDown={onNodePointerDown(node)}
            onClick={() => onNodeClick(node)}
            onDoubleClick={() => onNodeDoubleClick(node)}
            onMouseEnter={() => setHoveredId(node.id)}
            onMouseLeave={() => setHoveredId(null)}
          />
        ))}
      </g>
    </svg>
  );
};
