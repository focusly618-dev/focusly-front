import React from 'react';
import { alpha, useTheme } from '@mui/material';
import type { GraphNode } from '../NoteGraphView.types';
import { getNodeDimensions, nodeText } from '../utils/graphLayout.utils';

interface GraphNodeItemProps {
  node: GraphNode;
  isHovered: boolean;
  isSelected: boolean;
  isDragging: boolean;
  dimmed: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onClick: () => void;
  onDoubleClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * A node as a quiet pill: its heading (or the note's title, for the root),
 * led by the heading's own emoji or a dot whose strength tells its depth.
 */
export const GraphNodeItem: React.FC<GraphNodeItemProps> = ({
  node,
  isHovered,
  isSelected,
  isDragging,
  dimmed,
  onPointerDown,
  onClick,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const theme = useTheme();
  const { primary, text, background } = theme.palette;
  const isRoot = node.level === 0;
  const { width, height } = getNodeDimensions(node);
  const x = node.x - width / 2;
  const y = node.y - height / 2;
  const fontFamily = theme.typography.fontFamily;

  const stroke = isSelected
    ? primary.main
    : isHovered
      ? alpha(text.primary, 0.32)
      : isRoot
        ? alpha(primary.main, 0.45)
        : alpha(text.primary, 0.14);

  // Depth: H1 in the accent, deeper levels progressively quieter
  const dotColor =
    node.level <= 1
      ? primary.main
      : node.level === 2
        ? alpha(primary.main, 0.55)
        : alpha(text.primary, 0.3);

  return (
    <g
      data-node-id={node.id}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onDoubleClick={(e) => {
        // A double click on a node opens its section, not "fit view"
        e.stopPropagation();
        onDoubleClick();
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      opacity={dimmed ? 0.35 : 1}
      style={{
        cursor: isDragging ? 'grabbing' : 'pointer',
        transition: 'opacity 0.15s ease',
      }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={height / 2}
        fill={
          isSelected
            ? alpha(primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08)
            : background.paper
        }
        stroke={stroke}
        strokeWidth={isSelected ? 1.5 : 1}
        style={{
          filter:
            isHovered || isDragging
              ? `drop-shadow(0 4px 10px ${alpha('#000', 0.12)})`
              : undefined,
          transition: 'stroke 0.15s ease, fill 0.15s ease',
        }}
      />
      {node.icon ? (
        <text
          x={x + 15}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={isRoot ? 15 : 13}
        >
          {node.icon}
        </text>
      ) : (
        <circle cx={x + 13} cy={node.y} r={isRoot ? 4 : 3} fill={dotColor} />
      )}
      <text
        x={x + (node.icon ? 28 : 23)}
        y={node.y}
        dominantBaseline="central"
        fontSize={isRoot ? 13 : 12}
        fontWeight={isRoot || node.level === 1 ? 600 : 500}
        fill={node.level >= 3 ? text.secondary : text.primary}
        style={{ fontFamily }}
      >
        {nodeText(node)}
      </text>
      <title>{node.label}</title>
    </g>
  );
};
