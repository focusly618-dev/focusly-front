import React from 'react';
import { alpha, useTheme } from '@mui/material';
import type {
  GraphEdge,
  GraphNode,
  GraphSettings,
} from '../NoteGraphView.types';
import {
  calculateCurvedPath,
  calculateElbowPath,
  getNodeDimensions,
  type GraphLayout,
} from '../utils/graphLayout.utils';

interface GraphEdgeItemProps {
  edge: GraphEdge;
  nodeById: Map<string, GraphNode>;
  /** The hovered (or else selected) node: its links are drawn in color. */
  highlightedId: string | null;
  focusIds: Set<string> | null;
  settings: GraphSettings;
  layout: GraphLayout;
}

/** A thin, quiet link; the hovered or selected node's links stand out. */
export const GraphEdgeItem: React.FC<GraphEdgeItemProps> = ({
  edge,
  nodeById,
  highlightedId,
  focusIds,
  settings,
  layout,
}) => {
  const theme = useTheme();
  const from = nodeById.get(edge.from);
  const to = nodeById.get(edge.to);
  if (!from || !to) return null;

  const highlighted =
    highlightedId !== null &&
    (edge.from === highlightedId || edge.to === highlightedId);
  const dimmed =
    Boolean(focusIds) && !(focusIds?.has(edge.from) && focusIds.has(edge.to));

  return (
    <path
      d={(layout === 'outline' ? calculateElbowPath : calculateCurvedPath)(
        from,
        to,
        getNodeDimensions(from),
        getNodeDimensions(to),
      )}
      fill="none"
      stroke={
        highlighted
          ? alpha(theme.palette.primary.main, 0.7)
          : alpha(theme.palette.text.primary, 0.18)
      }
      strokeWidth={(highlighted ? 1.6 : 1.2) * settings.linkThickness}
      strokeLinecap="round"
      opacity={dimmed ? 0.35 : 1}
      style={{ transition: 'stroke 0.15s ease, opacity 0.15s ease' }}
    />
  );
};
