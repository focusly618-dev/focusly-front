import React from 'react';
import { useTheme } from '@mui/material';
import type { GraphNode, GraphSettings } from '../NoteGraphView.types';
import {
  calculateNodeRadius,
  fontSizeForLevel,
  labelOffsetForLevel,
  truncate,
  truncateLenForLevel,
} from '../utils/graphLayout.utils';

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
  // Root and H1 keep distinct hues; deeper levels fade the same info color
  // so depth reads as "less prominent" without introducing new colors.
  const color =
    node.level === 0
      ? theme.palette.primary.main
      : theme.palette.info.main;
  const fillOpacity =
    node.level <= 1 ? 1 : Math.max(0.5, 1 - (node.level - 1) * 0.15);

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
            labelOffsetForLevel(node.level) * settings.nodeSize +
            14 * settings.labelSize
          }
          textAnchor="middle"
          fontSize={fontSizeForLevel(node.level) * settings.labelSize}
          fontWeight={isHovered ? 800 : node.level === 0 ? 700 : 600}
          fill={theme.palette.text.primary}
          style={{ transition: 'opacity 0.15s' }}
        >
          {truncate(node.label || 'Untitled', truncateLenForLevel(node.level))}
        </text>
      )}
      <circle
        cx={node.x}
        cy={node.y}
        r={radius}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={isHovered ? theme.palette.text.primary : 'none'}
        strokeWidth={isHovered ? 2 : 0}
        style={{ transition: 'r 0.1s' }}
      />
    </g>
  );
};
