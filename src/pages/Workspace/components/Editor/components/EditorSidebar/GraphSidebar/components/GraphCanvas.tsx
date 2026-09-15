import React from 'react';
import { useTheme } from '@mui/material';
import type {
  GraphEdge,
  GraphNode,
  GraphSettings,
  PanState,
} from '../NoteGraphView.types';
import { GraphEdgeItem } from './GraphEdgeItem';
import { GraphNodeItem } from './GraphNodeItem';

interface GraphCanvasProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  canvasWidth: number;
  canvasHeight: number;
  canvasSize?: number;
  zoom: number;
  zoomOrigin: string;
  pan: PanState;
  isPanning: boolean;
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeById: Map<string, GraphNode>;
  neighborIds: Set<string> | null;
  hoveredId: string | null;
  selectedNodeId: string | null;
  settings: GraphSettings;
  onCanvasPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
  onNodePointerDown: (node: GraphNode) => (e: React.PointerEvent) => void;
  onNodeClick: (node: GraphNode) => () => void;
  setHoveredId: (id: string | null) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  svgRef,
  canvasWidth,
  canvasHeight,
  zoom,
  pan,
  isPanning,
  nodes,
  edges,
  nodeById,
  neighborIds,
  hoveredId,
  selectedNodeId,
  settings,
  onCanvasPointerDown,
  onNodePointerDown,
  onNodeClick,
  setHoveredId,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    >
      <defs>
        <pattern
          id="note-graph-dots"
          x="0"
          y="0"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="2"
            cy="2"
            r="1.6"
            fill={isDark ? 'rgba(255, 255, 255, 0.18)' : '#94a3b8'}
          />
        </pattern>
      </defs>

      {/* Background with dotted grid */}
      <rect
        x={-canvasWidth * 2}
        y={-canvasHeight * 2}
        width={canvasWidth * 5}
        height={canvasHeight * 5}
        fill={isDark ? '#090d16' : '#f8fafc'}
      />
      <rect
        x={-canvasWidth * 2}
        y={-canvasHeight * 2}
        width={canvasWidth * 5}
        height={canvasHeight * 5}
        fill="url(#note-graph-dots)"
      />

      {/* Transformed content container for smooth pan and zoom */}
      <g
        transform={`translate(${canvasWidth / 2 + pan.x}, ${canvasHeight / 2 + pan.y}) scale(${zoom}) translate(${-canvasWidth / 2}, ${-canvasHeight / 2})`}
        style={{
          transition: isPanning ? 'none' : 'transform 0.05s linear',
        }}
      >
        {/* Render edges */}
        {edges.map((edge) => (
          <GraphEdgeItem
            key={`${edge.from}-${edge.to}`}
            edge={edge}
            nodeById={nodeById}
            selectedNodeId={selectedNodeId}
            neighborIds={neighborIds}
            settings={settings}
          />
        ))}

        {/* Render nodes */}
        {nodes.map((node) => {
          const active = !neighborIds || neighborIds.has(node.id);
          const isHovered = node.id === hoveredId;
          const isSelected = node.id === selectedNodeId;

          return (
            <GraphNodeItem
              key={node.id}
              node={node}
              isHovered={isHovered}
              isSelected={isSelected}
              active={active}
              settings={settings}
              onPointerDown={onNodePointerDown(node)}
              onClick={onNodeClick(node)}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
            />
          );
        })}
      </g>
    </svg>
  );
};
