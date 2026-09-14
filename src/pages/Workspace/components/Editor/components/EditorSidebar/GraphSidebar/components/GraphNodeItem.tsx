import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import type { GraphNode, GraphSettings } from '../NoteGraphView.types';
import { getNodeDimensions } from '../utils/graphLayout.utils';

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
  const l = label.toLowerCase();
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

  const badgeTheme = getIconBadgeTheme(node.icon || '', node.label, isDark);

  return (
    <foreignObject
      x={posX}
      y={posY}
      width={width}
      height={height}
      style={{
        overflow: 'visible',
        opacity: active ? 1 : 0.45,
        transition: 'opacity 0.2s, transform 0.15s ease',
      }}
    >
      <Box
        onPointerDown={onPointerDown}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        sx={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          cursor: 'grab',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.15s ease',
          '&:active': { cursor: 'grabbing' },
          ...(node.type === 'document' && {
            borderRadius: '14px',
            bgcolor: isDark ? '#1e293b' : '#ffffff',
            border: '2px solid #6366f1',
            boxShadow: isDark
              ? '0 0 20px rgba(99, 102, 241, 0.5), 0 4px 12px rgba(0,0,0,0.4)'
              : '0 0 16px rgba(99, 102, 241, 0.3), 0 4px 12px rgba(99, 102, 241, 0.15)',
            px: 1.5,
            py: 0.75,
            gap: 1.25,
          }),
          ...(node.type === 'section' &&
            isSelected && {
              borderRadius: '14px',
              bgcolor: isDark ? '#1e293b' : '#ffffff',
              border: '2.5px solid #4f46e5',
              boxShadow: isDark
                ? '0 0 22px rgba(79, 70, 229, 0.6), 0 6px 16px rgba(0,0,0,0.5)'
                : '0 0 18px rgba(79, 70, 229, 0.4), 0 4px 12px rgba(79, 70, 229, 0.2)',
              px: 1.5,
              py: 0.75,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }),
          ...(node.type === 'section' &&
            !isSelected && {
              borderRadius: '12px',
              bgcolor: isDark ? '#1e293b' : '#ffffff',
              border: '1.5px solid',
              borderColor: isHovered
                ? '#6366f1'
                : isDark
                  ? '#334155'
                  : '#cbd5e1',
              boxShadow: isHovered
                ? '0 6px 16px rgba(0, 0, 0, 0.12)'
                : '0 3px 10px rgba(0, 0, 0, 0.07)',
              px: 1.25,
              py: 0.5,
              gap: 1,
            }),
          ...(node.type === 'source' && {
            borderRadius: '9999px',
            bgcolor: isDark ? 'rgba(16, 185, 129, 0.22)' : '#dcfce7',
            border: '1.5px solid #10b981',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
            justifyContent: 'center',
            px: 1.5,
          }),
          ...(node.type === 'concept' && {
            borderRadius: '9999px',
            bgcolor: isDark ? 'rgba(59, 130, 246, 0.22)' : '#dbeafe',
            border: '1.5px solid #3b82f6',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
            justifyContent: 'center',
            px: 1.5,
          }),
        }}
      >
        {/* Document Root Node Content */}
        {node.type === 'document' && (
          <>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '8px',
                bgcolor: '#6366f1',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(99, 102, 241, 0.4)',
              }}
            >
              {node.icon || '📄'}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  letterSpacing: '0.8px',
                  color: '#6366f1',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                }}
              >
                DOCUMENTO
              </Typography>
              <Typography
                noWrap
                sx={{
                  fontSize: '12.5px',
                  fontWeight: 800,
                  color: isDark ? '#f8fafc' : '#0f172a',
                  lineHeight: 1.25,
                }}
              >
                {node.label}
              </Typography>
            </Box>
          </>
        )}

        {/* Selected Section Node Content */}
        {node.type === 'section' && isSelected && (
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: '6px',
                    bgcolor: badgeTheme.bgcolor,
                    border: `1px solid ${badgeTheme.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    flexShrink: 0,
                  }}
                >
                  {node.icon || '📚'}
                </Box>
                <Typography
                  noWrap
                  sx={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#4f46e5',
                    lineHeight: 1.2,
                  }}
                >
                  {node.label}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#10b981',
                  flexShrink: 0,
                  boxShadow: '0 0 8px #10b981',
                }}
              />
            </Box>
            <Typography
              sx={{
                fontSize: '10px',
                color: isDark ? '#94a3b8' : '#64748b',
                mt: 0.35,
                fontWeight: 600,
              }}
            >
              {node.subtitle || '3 conexiones activas'}
            </Typography>
          </Box>
        )}

        {/* Regular Section Node Content */}
        {node.type === 'section' && !isSelected && (
          <>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '7px',
                bgcolor: badgeTheme.bgcolor,
                border: `1px solid ${badgeTheme.borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                flexShrink: 0,
              }}
            >
              {node.icon || '📑'}
            </Box>
            <Typography
              noWrap
              sx={{
                fontSize: '12.5px',
                fontWeight: 750,
                color: isDark ? '#f8fafc' : '#1e293b',
                minWidth: 0,
              }}
            >
              {node.label}
            </Typography>
          </>
        )}

        {/* Source Badge Content */}
        {node.type === 'source' && (
          <Typography
            noWrap
            sx={{
              fontSize: '11.5px',
              fontWeight: 800,
              color: isDark ? '#34d399' : '#047857',
              textAlign: 'center',
              lineHeight: 1,
            }}
          >
            {node.label}
          </Typography>
        )}

        {/* Concept Badge Content */}
        {node.type === 'concept' && (
          <Typography
            noWrap
            sx={{
              fontSize: '11.5px',
              fontWeight: 800,
              color: isDark ? '#60a5fa' : '#1d4ed8',
              textAlign: 'center',
              lineHeight: 1,
            }}
          >
            {node.label}
          </Typography>
        )}
      </Box>
    </foreignObject>
  );
};
