import React from 'react';
import { useTheme } from '@mui/material';
import type {
  GraphEdge,
  GraphNode,
  GraphSettings,
} from '../NoteGraphView.types';
import { calculateTrimmedEdgeTarget } from '../utils/graphLayout.utils';

interface GraphEdgeItemProps {
  edge: GraphEdge;
  nodeById: Map<string, GraphNode>;
  neighborIds: Set<string> | null;
  settings: GraphSettings;
}

export const GraphEdgeItem: React.FC<GraphEdgeItemProps> = ({
  edge,
  nodeById,
  neighborIds,
  settings,
}) => {
  const theme = useTheme();
  const from = nodeById.get(edge.from);
  const to = nodeById.get(edge.to);

  if (!from || !to) return null;

  const active =
    !neighborIds || (neighborIds.has(edge.from) && neighborIds.has(edge.to));

  const targetRadius = to.level === 0 ? 17 : 12;
  const { trimmedX, trimmedY } = calculateTrimmedEdgeTarget(
    from,
    to,
    targetRadius,
    settings.nodeSize,
  );

  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={settings.showArrows ? trimmedX : to.x}
      y2={settings.showArrows ? trimmedY : to.y}
      stroke={
        active && neighborIds
          ? theme.palette.primary.main
          : theme.palette.divider
      }
      strokeWidth={
        (active && neighborIds ? 1.75 : 1.25) * settings.linkThickness
      }
      opacity={active ? 1 : 0.25}
      markerEnd={settings.showArrows ? 'url(#note-graph-arrow)' : undefined}
      style={{ transition: 'opacity 0.15s, stroke 0.15s' }}
    />
  );
};
