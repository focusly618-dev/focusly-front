import React from 'react';
import { useTheme } from '@mui/material';
import type {
  GraphEdge,
  GraphNode,
  GraphSettings,
} from '../NoteGraphView.types';
import {
  calculateCurvedPath,
  getNodeDimensions,
} from '../utils/graphLayout.utils';

interface GraphEdgeItemProps {
  edge: GraphEdge;
  nodeById: Map<string, GraphNode>;
  selectedNodeId: string | null;
  neighborIds: Set<string> | null;
  settings: GraphSettings;
}

export const GraphEdgeItem: React.FC<GraphEdgeItemProps> = ({
  edge,
  nodeById,
  selectedNodeId,
  neighborIds,
  settings,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const from = nodeById.get(edge.from);
  const to = nodeById.get(edge.to);

  if (!from || !to) return null;

  const isConnectedToSelected =
    Boolean(selectedNodeId) &&
    (edge.from === selectedNodeId || edge.to === selectedNodeId);

  const active =
    !neighborIds || (neighborIds.has(edge.from) && neighborIds.has(edge.to));

  // Determine stroke color
  let strokeColor = edge.color;

  if (to.type === 'source' || from.type === 'source') {
    strokeColor = isDark ? '#34d399' : '#059669';
  } else if (to.type === 'concept' || from.type === 'concept') {
    strokeColor = isDark ? '#60a5fa' : '#2563eb';
  } else if (isConnectedToSelected) {
    strokeColor = isDark ? '#c7d2fe' : '#312e81';
  } else if (!strokeColor) {
    strokeColor = isDark ? '#818cf8' : '#4f46e5';
  }

  const isDashed =
    !isConnectedToSelected && to.type !== 'source' && to.type !== 'concept';
  const strokeWidth =
    (isConnectedToSelected ? 3.2 : 2.2) * settings.linkThickness;

  const fromSize = getNodeDimensions(from, from.id === selectedNodeId);
  const toSize = getNodeDimensions(to, to.id === selectedNodeId);
  const pathData = calculateCurvedPath(from, to, fromSize, toSize);

  return (
    <path
      d={pathData}
      fill="none"
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeDasharray={isDashed ? '7 4' : undefined}
      strokeLinecap="round"
      opacity={active ? 1 : 0.4}
      style={{
        filter: isConnectedToSelected
          ? isDark
            ? 'drop-shadow(0 0 5px rgba(199, 210, 254, 0.75))'
            : 'drop-shadow(0 0 4px rgba(79, 70, 229, 0.5))'
          : undefined,
        transition:
          'stroke 0.2s ease, opacity 0.2s ease, stroke-width 0.2s ease',
      }}
    />
  );
};
