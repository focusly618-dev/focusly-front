import React from 'react';
import { useTheme } from '@mui/material';
import type { GraphNode, GraphSettings } from '../NoteGraphView.types';
import { calculateNodeRadius, truncate } from '../utils/graphLayout.utils';

interface GraphNodeItemProps {
  node: GraphNode;
  isHovered: boolean;
  active: boolean;
  settings: GraphSettings;
  onPointerDown: (e: React.PointerEvent) => void;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const GraphNodeItem: React.FC<GraphNodeItemProps> = ({
  node,
  isHovered,
  active,
  settings,
  onPointerDown,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const theme = useTheme();
  const showLabel = settings.showLabels || isHovered;
  const radius = calculateNodeRadius(node.level, isHovered, settings.nodeSize);
  const color =
    node.level === 0 ? theme.palette.primary.main : theme.palette.info.main;

  return (
    <g
      onPointerDown={onPointerDown}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      opacity={active ? 1 : 0.3}
      style={{
        cursor: node.pos !== null ? 'grab' : 'default',
        transition: 'opacity 0.15s',
      }}
    >
      {showLabel && (
        <text
          x={node.x}
          y={
            node.y +
            (node.level === 0 ? 22 : 18) * settings.nodeSize +
            14 * settings.labelSize
          }
          textAnchor="middle"
          fontSize={(node.level === 0 ? 14.5 : 13) * settings.labelSize}
          fontWeight={isHovered ? 800 : node.level === 0 ? 700 : 600}
          fill={theme.palette.text.primary}
          style={{ transition: 'opacity 0.15s' }}
        >
          {truncate(node.label || 'Untitled', node.level === 0 ? 22 : 20)}
        </text>
      )}
      <circle
        cx={node.x}
        cy={node.y}
        r={radius}
        fill={color}
        stroke={isHovered ? theme.palette.text.primary : 'none'}
        strokeWidth={isHovered ? 2 : 0}
        style={{ transition: 'r 0.1s' }}
      />
    </g>
  );
};
