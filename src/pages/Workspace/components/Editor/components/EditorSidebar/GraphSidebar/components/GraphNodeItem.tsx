import React from 'react';
import { useTheme } from '@mui/material';
import type { GraphNode, GraphSettings } from '../NoteGraphView.types';
import { getNodeDimensions, truncate } from '../utils/graphLayout.utils';

interface GraphNodeItemProps {
  node: GraphNode;
  isHovered: boolean;
  isSelected: boolean;
  active: boolean;
  settings: GraphSettings;
  onPointerDown: (e: React.PointerEvent) => void;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const getIconBadgeTheme = (icon: string, label: string, isDark: boolean) => {
  const l = (label || '').toLowerCase();
  if (l.includes('objetivo') || icon === '🎯') {
    return {
      bgcolor: isDark ? 'rgba(239, 68, 68, 0.25)' : '#fee2e2',
      borderColor: '#fca5a5',
      color: '#dc2626',
    };
  }
  if (l.includes('estructura') || icon === '📑') {
    return {
      bgcolor: isDark ? 'rgba(139, 92, 246, 0.25)' : '#ede9fe',
      borderColor: '#c4b5fd',
      color: '#7c3aed',
    };
  }
  if (l.includes('paso') || icon === '🚀') {
    return {
      bgcolor: isDark ? 'rgba(249, 115, 22, 0.25)' : '#ffedd5',
      borderColor: '#fed7aa',
      color: '#ea580c',
    };
  }
  if (l.includes('criterio') || icon === '✅') {
    return {
      bgcolor: isDark ? 'rgba(16, 185, 129, 0.25)' : '#dcfce7',
      borderColor: '#86efac',
      color: '#16a34a',
    };
  }
  if (l.includes('recurso') || icon === '📚') {
    return {
      bgcolor: isDark ? 'rgba(99, 102, 241, 0.25)' : '#e0e7ff',
      borderColor: '#a5b4fc',
      color: '#4f46e5',
    };
  }
  if (l.includes('pregunta') || icon === '💡') {
    return {
      bgcolor: isDark ? 'rgba(234, 179, 8, 0.25)' : '#fef9c3',
      borderColor: '#fde047',
      color: '#ca8a04',
    };
  }
  if (l.includes('portada') || icon === '📖') {
    return {
      bgcolor: isDark ? 'rgba(14, 165, 233, 0.25)' : '#e0f2fe',
      borderColor: '#7dd3fc',
      color: '#0284c7',
    };
  }
  return {
    bgcolor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#f1f5f9',
    borderColor: isDark ? 'rgba(255, 255, 255, 0.18)' : '#cbd5e1',
    color: isDark ? '#cbd5e1' : '#475569',
  };
};

export const GraphNodeItem: React.FC<GraphNodeItemProps> = ({
  node,
  isHovered,
  isSelected,
  active,
  onPointerDown,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { width, height } = getNodeDimensions(node, isSelected);

  const posX = node.x - width / 2;
  const posY = node.y - height / 2;

  const isDocument = node.level === 0 || node.type === 'document';
  const isSource = node.type === 'source';
  const isConcept = node.type === 'concept';
  const isSelectedSection =
    !isDocument && !isSource && !isConcept && isSelected;
  const isRegularSection =
    !isDocument && !isSource && !isConcept && !isSelected;

  const badgeTheme = getIconBadgeTheme(
    node.icon || '',
    node.label || '',
    isDark,
  );

  return (
    <g
      id={`node-${node.id}`}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      opacity={active ? 1 : 0.45}
      style={{
        cursor: 'grab',
        userSelect: 'none',
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* 1. Document Root Node */}
      {isDocument && (
        <>
          <rect
            x={posX}
            y={posY}
            width={width}
            height={height}
            rx={14}
            fill={isDark ? '#1e293b' : '#ffffff'}
            stroke="#6366f1"
            strokeWidth={2}
            style={{
              filter: isDark
                ? 'drop-shadow(0 0 14px rgba(99, 102, 241, 0.5))'
                : 'drop-shadow(0 4px 12px rgba(99, 102, 241, 0.22))',
            }}
          />
          <rect
            x={posX + 10}
            y={posY + (height - 30) / 2}
            width={30}
            height={30}
            rx={8}
            fill="#6366f1"
          />
          <text
            x={posX + 25}
            y={posY + height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="16"
          >
            {node.icon || '📄'}
          </text>
          <text
            x={posX + 48}
            y={posY + 19}
            fill="#6366f1"
            fontSize="9"
            fontWeight="800"
            letterSpacing="0.8"
            dominantBaseline="central"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            DOCUMENTO
          </text>
          <text
            x={posX + 48}
            y={posY + 35}
            fill={isDark ? '#f8fafc' : '#0f172a'}
            fontSize="12.5"
            fontWeight="700"
            dominantBaseline="central"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {truncate(node.label || 'Documento', 14)}
          </text>
        </>
      )}

      {/* 2. Selected Section Node */}
      {isSelectedSection && (
        <>
          <rect
            x={posX}
            y={posY}
            width={width}
            height={height}
            rx={14}
            fill={isDark ? '#1e293b' : '#ffffff'}
            stroke="#4f46e5"
            strokeWidth={2.5}
            style={{
              filter: isDark
                ? 'drop-shadow(0 0 16px rgba(79, 70, 229, 0.6))'
                : 'drop-shadow(0 4px 14px rgba(79, 70, 229, 0.3))',
            }}
          />
          <rect
            x={posX + 10}
            y={posY + 9}
            width={22}
            height={22}
            rx={6}
            fill={badgeTheme.bgcolor}
            stroke={badgeTheme.borderColor}
            strokeWidth={1}
          />
          <text
            x={posX + 21}
            y={posY + 20}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="13"
          >
            {node.icon || '📚'}
          </text>
          <text
            x={posX + 38}
            y={posY + 20}
            fill="#4f46e5"
            fontSize="12.5"
            fontWeight="800"
            dominantBaseline="central"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {truncate(node.label || '', 14)}
          </text>
          <circle
            cx={posX + width - 14}
            cy={posY + 20}
            r={4}
            fill="#10b981"
            style={{ filter: 'drop-shadow(0 0 4px #10b981)' }}
          />
          <text
            x={posX + 12}
            y={posY + 39}
            fill={isDark ? '#94a3b8' : '#64748b'}
            fontSize="9.5"
            fontWeight="600"
            dominantBaseline="central"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {truncate(node.subtitle || 'Sección activa', 24)}
          </text>
        </>
      )}

      {/* 3. Regular Section Node */}
      {isRegularSection && (
        <>
          <rect
            x={posX}
            y={posY}
            width={width}
            height={height}
            rx={12}
            fill={isDark ? '#1e293b' : '#ffffff'}
            stroke={isHovered ? '#6366f1' : isDark ? '#334155' : '#cbd5e1'}
            strokeWidth={isHovered ? 2 : 1.5}
            style={{
              filter: isHovered
                ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))'
                : 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))',
            }}
          />
          <rect
            x={posX + 8}
            y={posY + (height - 24) / 2}
            width={24}
            height={24}
            rx={7}
            fill={badgeTheme.bgcolor}
            stroke={badgeTheme.borderColor}
            strokeWidth={1}
          />
          <text
            x={posX + 20}
            y={posY + height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="13"
          >
            {node.icon || '📑'}
          </text>
          <text
            x={posX + 38}
            y={posY + height / 2}
            fill={isDark ? '#f8fafc' : '#1e293b'}
            fontSize="12"
            fontWeight="700"
            dominantBaseline="central"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {truncate(node.label || '', 15)}
          </text>
        </>
      )}

      {/* 4. Source Badge */}
      {isSource && (
        <>
          <rect
            x={posX}
            y={posY}
            width={width}
            height={height}
            rx={15}
            fill={isDark ? 'rgba(16, 185, 129, 0.22)' : '#dcfce7'}
            stroke="#10b981"
            strokeWidth={1.5}
          />
          <text
            x={posX + width / 2}
            y={posY + height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill={isDark ? '#34d399' : '#047857'}
            fontSize="11"
            fontWeight="700"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {truncate(node.label || '', 14)}
          </text>
        </>
      )}

      {/* 5. Concept Badge */}
      {isConcept && (
        <>
          <rect
            x={posX}
            y={posY}
            width={width}
            height={height}
            rx={15}
            fill={isDark ? 'rgba(59, 130, 246, 0.22)' : '#dbeafe'}
            stroke="#3b82f6"
            strokeWidth={1.5}
          />
          <text
            x={posX + width / 2}
            y={posY + height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill={isDark ? '#60a5fa' : '#1d4ed8'}
            fontSize="11"
            fontWeight="700"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {truncate(node.label || '', 14)}
          </text>
        </>
      )}
    </g>
  );
};
