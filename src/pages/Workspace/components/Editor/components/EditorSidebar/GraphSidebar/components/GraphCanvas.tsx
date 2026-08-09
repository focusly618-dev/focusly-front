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
  canvasSize: number;
  zoom: number;
  zoomOrigin: string;
  pan: PanState;
  isPanning: boolean;
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeById: Map<string, GraphNode>;
  neighborIds: Set<string> | null;
  hoveredId: string | null;
  settings: GraphSettings;
  onCanvasPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
  onNodePointerDown: (node: GraphNode) => (e: React.PointerEvent) => void;
  onNodeClick: (node: GraphNode) => () => void;
  setHoveredId: (id: string | null) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  svgRef,
  canvasSize,
  zoom,
  zoomOrigin,
  pan,
  isPanning,
  nodes,
  edges,
  nodeById,
  neighborIds,
  hoveredId,
  settings,
  onCanvasPointerDown,
  onNodePointerDown,
  onNodeClick,
  setHoveredId,
}) => {
  const theme = useTheme();

  return (
    <svg
      ref={svgRef}
      width="100%"
      viewBox={`0 0 ${canvasSize} ${canvasSize}`}
      onPointerDown={onCanvasPointerDown}
      style={{
        overflow: 'visible',
        touchAction: 'none',
        userSelect: 'none',
        cursor: isPanning ? 'grabbing' : 'grab',
        transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
        transformOrigin: zoomOrigin,
        transition: isPanning ? 'none' : 'transform 0.05s linear',
      }}
    >
      <defs>
        <marker
          id="note-graph-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill={theme.palette.text.secondary} />
        </marker>
      </defs>

      {edges.map((edge) => (
        <GraphEdgeItem
          key={`${edge.from}-${edge.to}`}
          edge={edge}
          nodeById={nodeById}
          neighborIds={neighborIds}
          settings={settings}
        />
      ))}

      {nodes.map((node) => {
        const active = !neighborIds || neighborIds.has(node.id);
        const isHovered = node.id === hoveredId;

        return (
          <GraphNodeItem
            key={node.id}
            node={node}
            isHovered={isHovered}
            active={active}
            settings={settings}
            onPointerDown={onNodePointerDown(node)}
            onClick={onNodeClick(node)}
            onMouseEnter={() => setHoveredId(node.id)}
            onMouseLeave={() => setHoveredId(null)}
          />
        );
      })}
    </svg>
  );
};
