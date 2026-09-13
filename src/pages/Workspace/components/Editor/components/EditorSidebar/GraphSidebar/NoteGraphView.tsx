import React, { useMemo, useRef, useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Divider,
  Button,
  InputBase,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  CenterFocusStrong as CenterFocusStrongIcon,
  OpenInFull as FullscreenIcon,
  CloseFullscreen as CloseFullscreenIcon,
  Search as SearchIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  ArrowBack as ArrowBackIcon,
  KeyboardArrowDown as CollapseIcon,
  KeyboardArrowUp as ExpandIcon,
  AutoAwesome as AutoAwesomeIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import type {
  GraphFilterCategory,
  GraphNode,
  NoteGraphViewProps,
} from './NoteGraphView.types';
import { buildGraph } from './utils/graphLayout.utils';
import {
  useGraphNodeDrag,
  useGraphPanZoom,
  useGraphSettings,
} from './NoteGraphView.hooks';
import { GraphCanvas } from './components/GraphCanvas';

export const NoteGraphView: React.FC<NoteGraphViewProps> = ({
  rootLabel,
  headings,
  markdownContent = '',
  rootIcon,
  onJump,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<GraphFilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false);

  const { settings, resetSettings } = useGraphSettings();

  const {
    zoom,
    zoomOrigin,
    pan,
    isPanning,
    handleCanvasPointerDown,
    resetPanZoom,
    zoomIn,
    zoomOut,
  } = useGraphPanZoom(containerRef);

  const {
    nodes: baseNodes,
    edges: baseEdges,
    canvasWidth,
    canvasHeight,
    canvasSize,
  } = useMemo(
    () =>
      buildGraph(
        rootLabel,
        headings,
        settings.spacing,
        markdownContent,
        rootIcon,
      ),
    [rootLabel, headings, settings.spacing, markdownContent, rootIcon],
  );

  // Default selected node: first section node or document root
  const defaultSelectedId = useMemo(() => {
    const firstSection = baseNodes.find((n) => n.type === 'section');
    return firstSection?.id || baseNodes[0]?.id || null;
  }, [baseNodes]);

  const effectiveSelectedNodeId = selectedNodeId || defaultSelectedId;

  const { overrides, handleNodePointerDown, handleNodeClick, resetOverrides } =
    useGraphNodeDrag(svgRef, canvasWidth, () => {
      // Drag overrides position without triggering jump
    });

  // Apply drag overrides
  const allNodes = useMemo(
    () =>
      baseNodes.map((node) =>
        overrides[node.id] ? { ...node, ...overrides[node.id] } : node,
      ),
    [baseNodes, overrides],
  );

  // Filter nodes based on category pill
  const filteredNodes = useMemo(() => {
    return allNodes.filter((node) => {
      if (activeFilter === 'sections') {
        return node.type === 'document' || node.type === 'section';
      }
      if (activeFilter === 'sources') {
        return node.type === 'source' || node.type === 'document';
      }
      if (activeFilter === 'concepts') {
        return node.type === 'concept' || node.type === 'document';
      }
      return true;
    });
  }, [allNodes, activeFilter]);

  // Highlight or filter based on search
  const visibleNodes = useMemo(() => {
    if (!searchQuery.trim()) return filteredNodes;
    const q = searchQuery.toLowerCase();
    return filteredNodes.filter((node) => node.label.toLowerCase().includes(q));
  }, [filteredNodes, searchQuery]);

  const nodeById = useMemo(
    () => new Map(allNodes.map((node) => [node.id, node])),
    [allNodes],
  );

  // Selected node object
  const selectedNode = useMemo(() => {
    return nodeById.get(effectiveSelectedNodeId || '') || allNodes[0] || null;
  }, [nodeById, effectiveSelectedNodeId, allNodes]);

  // Edges filtered
  const visibleEdges = useMemo(() => {
    const visibleIds = new Set(visibleNodes.map((n) => n.id));
    return baseEdges.filter(
      (edge) => visibleIds.has(edge.from) && visibleIds.has(edge.to),
    );
  }, [baseEdges, visibleNodes]);

  const neighborIds = useMemo(() => {
    // Only apply neighbor focus dimming when actively hovering a node!
    if (!hoveredId) return null;
    const set = new Set([hoveredId]);
    baseEdges.forEach((edge) => {
      if (edge.from === hoveredId) set.add(edge.to);
      if (edge.to === hoveredId) set.add(edge.from);
    });
    return set;
  }, [hoveredId, baseEdges]);

  const handleSelectNode = (node: GraphNode) => {
    setSelectedNodeId(node.id);
  };

  const [jumpFeedback, setJumpFeedback] = useState<string | null>(null);

  const handleJumpToSelected = () => {
    if (!selectedNode) return;
    setJumpFeedback(selectedNode.label);
    onJump(selectedNode.pos ?? 0, selectedNode.label);
    setTimeout(() => {
      setJumpFeedback(null);
    }, 2800);
  };

  const [isOrganizing, setIsOrganizing] = useState(false);

  const handleOrganizeLayout = () => {
    setIsOrganizing(true);
    resetOverrides();
    resetPanZoom();
    setTimeout(() => {
      setIsOrganizing(false);
    }, 550);
  };

  const handleResetAll = () => {
    resetOverrides();
    resetSettings();
    resetPanZoom();
  };

  // Node type label for inspector
  const getNodeTypeLabel = (node: GraphNode | null) => {
    if (!node) return 'Sección';
    if (node.type === 'document') return 'Documento Raíz';
    if (node.label.toLowerCase().includes('recurso'))
      return 'Recurso / Base de datos';
    if (node.type === 'source') return 'Fuente Externa / Base de datos';
    if (node.type === 'concept') return 'Concepto Clave';
    return 'Sección del Documento';
  };

  // Outgoing connections description
  const getOutgoingLabel = (node: GraphNode | null) => {
    if (!node) return '0 conexiones';
    const outgoing = baseEdges.filter((e) => e.from === node.id);
    const sources = outgoing.filter((e) => {
      const target = nodeById.get(e.to);
      return target?.type === 'source';
    }).length;

    if (sources > 0) {
      return `${outgoing.length} conexiones (${sources} fuentes)`;
    }
    return `${outgoing.length} conexiones activas`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 1400 : 1,
        bgcolor: isDark ? '#090d16' : '#ffffff',
      }}
    >
      {/* Top Bar: Controls & Filters */}
      <Box
        sx={{
          px: 2,
          pt: 1.75,
          pb: 1.25,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : '#ffffff',
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        {/* Row 1: Left Pill Toolbar & Right Category Pills */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {/* Left Pill Toolbar: Zoom in, Zoom out, Fit, Fullscreen */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '10px',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#e2e8f0',
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
              p: '2px 4px',
              gap: 0.25,
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <IconButton
              size="small"
              onClick={zoomIn}
              sx={{ p: 0.5, color: 'text.secondary' }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={zoomOut}
              sx={{ p: 0.5, color: 'text.secondary' }}
            >
              <RemoveIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 0.25, my: 0.75, height: 14 }}
            />

            <IconButton
              size="small"
              onClick={resetPanZoom}
              title="Centrar vista"
              sx={{ p: 0.5, color: 'text.secondary' }}
            >
              <CenterFocusStrongIcon sx={{ fontSize: 15 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleOrganizeLayout}
              title="Organizar y estructurar grafo"
              sx={{
                p: 0.5,
                color: isOrganizing ? '#4f46e5' : 'text.secondary',
                transition: 'color 0.2s ease',
              }}
            >
              <AutoAwesomeIcon
                sx={{
                  fontSize: 15,
                  transform: isOrganizing
                    ? 'rotate(180deg) scale(1.15)'
                    : 'none',
                  transition: 'transform 0.4s ease',
                }}
              />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setIsFullscreen((prev) => !prev)}
              sx={{ p: 0.5, color: 'text.secondary' }}
            >
              {isFullscreen ? (
                <CloseFullscreenIcon sx={{ fontSize: 15 }} />
              ) : (
                <FullscreenIcon sx={{ fontSize: 15 }} />
              )}
            </IconButton>
          </Box>

          {/* Right Category Filter Pills */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              overflowX: 'auto',
            }}
          >
            <Button
              onClick={() => setActiveFilter('all')}
              size="small"
              sx={{
                px: 1.5,
                py: 0.4,
                borderRadius: '9999px',
                fontSize: '11.5px',
                fontWeight: activeFilter === 'all' ? 700 : 600,
                textTransform: 'none',
                minWidth: 0,
                bgcolor:
                  activeFilter === 'all'
                    ? '#4f46e5'
                    : isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : '#f1f5f9',
                color:
                  activeFilter === 'all'
                    ? '#ffffff'
                    : isDark
                      ? '#94a3b8'
                      : '#475569',
                '&:hover': {
                  bgcolor:
                    activeFilter === 'all'
                      ? '#4338ca'
                      : isDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : '#e2e8f0',
                },
              }}
            >
              Todos ({allNodes.length})
            </Button>

            <Button
              onClick={() => setActiveFilter('sections')}
              size="small"
              sx={{
                px: 1.5,
                py: 0.4,
                borderRadius: '9999px',
                fontSize: '11.5px',
                fontWeight: activeFilter === 'sections' ? 700 : 600,
                textTransform: 'none',
                minWidth: 0,
                bgcolor:
                  activeFilter === 'sections'
                    ? '#4f46e5'
                    : isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : '#f1f5f9',
                color:
                  activeFilter === 'sections'
                    ? '#ffffff'
                    : isDark
                      ? '#94a3b8'
                      : '#475569',
                '&:hover': {
                  bgcolor:
                    activeFilter === 'sections'
                      ? '#4338ca'
                      : isDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : '#e2e8f0',
                },
              }}
            >
              Secciones
            </Button>

            <Button
              onClick={() => setActiveFilter('sources')}
              size="small"
              sx={{
                px: 1.5,
                py: 0.4,
                borderRadius: '9999px',
                fontSize: '11.5px',
                fontWeight: activeFilter === 'sources' ? 700 : 600,
                textTransform: 'none',
                minWidth: 0,
                bgcolor:
                  activeFilter === 'sources'
                    ? '#4f46e5'
                    : isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : '#f1f5f9',
                color:
                  activeFilter === 'sources'
                    ? '#ffffff'
                    : isDark
                      ? '#94a3b8'
                      : '#475569',
                '&:hover': {
                  bgcolor:
                    activeFilter === 'sources'
                      ? '#4338ca'
                      : isDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : '#e2e8f0',
                },
              }}
            >
              Fuentes
            </Button>

            <Button
              onClick={() => setActiveFilter('concepts')}
              size="small"
              sx={{
                px: 1.5,
                py: 0.4,
                borderRadius: '9999px',
                fontSize: '11.5px',
                fontWeight: activeFilter === 'concepts' ? 700 : 600,
                textTransform: 'none',
                minWidth: 0,
                bgcolor:
                  activeFilter === 'concepts'
                    ? '#4f46e5'
                    : isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : '#f1f5f9',
                color:
                  activeFilter === 'concepts'
                    ? '#ffffff'
                    : isDark
                      ? '#94a3b8'
                      : '#475569',
                '&:hover': {
                  bgcolor:
                    activeFilter === 'concepts'
                      ? '#4338ca'
                      : isDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : '#e2e8f0',
                },
              }}
            >
              Conceptos
            </Button>
          </Box>
        </Box>

        {/* Row 2: Search Input */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
            borderRadius: '10px',
            px: 1.25,
            py: 0.4,
            gap: 1,
          }}
        >
          <SearchIcon
            sx={{
              fontSize: 18,
              color: 'text.secondary',
              flexShrink: 0,
            }}
          />
          <InputBase
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar nodos..."
            fullWidth
            sx={{
              fontSize: '13px',
              color: 'text.primary',
              '& input': { p: 0 },
            }}
          />
        </Box>
      </Box>

      {/* Main Graph Canvas Area */}
      <Box
        ref={containerRef}
        onDoubleClick={resetPanZoom}
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Floating "Organizar" button in Canvas */}
        <Button
          id="btn-organize-graph"
          variant="contained"
          size="small"
          onClick={handleOrganizeLayout}
          startIcon={
            <AutoAwesomeIcon
              sx={{
                fontSize: 16,
                transform: isOrganizing ? 'rotate(180deg) scale(1.15)' : 'none',
                transition: 'transform 0.4s ease',
              }}
            />
          }
          sx={{
            position: 'absolute',
            top: 14,
            left: 14,
            zIndex: 15,
            borderRadius: '12px',
            px: 1.8,
            py: 0.65,
            bgcolor: isDark ? 'rgba(79, 70, 229, 0.92)' : '#4f46e5',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.2px',
            textTransform: 'none',
            boxShadow: isDark
              ? '0 4px 16px rgba(79, 70, 229, 0.5), 0 2px 6px rgba(0,0,0,0.35)'
              : '0 4px 14px rgba(79, 70, 229, 0.3), 0 2px 4px rgba(79, 70, 229, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: isDark
              ? 'rgba(165, 180, 252, 0.35)'
              : 'rgba(255, 255, 255, 0.35)',
            '&:hover': {
              bgcolor: isDark ? '#4338ca' : '#4338ca',
              transform: 'translateY(-1px)',
              boxShadow: isDark
                ? '0 6px 20px rgba(79, 70, 229, 0.65)'
                : '0 6px 18px rgba(79, 70, 229, 0.4)',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
            transition: 'all 0.15s ease',
          }}
        >
          Organizar
        </Button>

        <GraphCanvas
          svgRef={svgRef}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          canvasSize={canvasSize}
          zoom={zoom}
          zoomOrigin={zoomOrigin}
          pan={pan}
          isPanning={isPanning}
          nodes={visibleNodes}
          edges={visibleEdges}
          nodeById={nodeById}
          neighborIds={neighborIds}
          hoveredId={hoveredId}
          selectedNodeId={effectiveSelectedNodeId}
          settings={settings}
          onCanvasPointerDown={handleCanvasPointerDown}
          onNodePointerDown={handleNodePointerDown}
          onNodeClick={(node) => () => {
            handleSelectNode(node);
            handleNodeClick(node)();
          }}
          setHoveredId={setHoveredId}
        />

        {/* Helpful guide hint when note has no headings yet */}
        {headings.length === 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 18,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: isDark
                ? 'rgba(15, 23, 42, 0.88)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(0, 0, 0, 0.08)',
              borderRadius: '12px',
              px: 2,
              py: 0.9,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              pointerEvents: 'none',
              zIndex: 8,
              maxWidth: '85%',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 16, color: '#6366f1' }} />
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'text.secondary',
                whiteSpace: 'nowrap',
              }}
            >
              Escribe encabezados (# Sección) en tu nota para ramificar el grafo
              en vivo
            </Typography>
          </Box>
        )}

        {/* Floating Action Pill on Bottom Right: Undo / Redo */}
        <Box
          sx={{
            position: 'absolute',
            bottom: isInspectorCollapsed ? '64px' : '174px',
            right: 18,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '9999px',
            bgcolor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(51, 65, 85, 0.9)',
            backdropFilter: 'blur(8px)',
            p: '3px 6px',
            gap: 0.25,
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            zIndex: 10,
            transition: 'bottom 0.25s ease',
          }}
        >
          <IconButton
            size="small"
            onClick={handleResetAll}
            title="Restaurar posiciones y zoom"
            sx={{ color: '#ffffff', p: 0.6 }}
          >
            <UndoIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={resetPanZoom}
            title="Centrar vista"
            sx={{ color: '#ffffff', p: 0.6 }}
          >
            <RedoIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Bottom Node Inspector Card */}
        {isInspectorCollapsed ? (
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 14,
              right: 14,
              bgcolor: isDark
                ? 'rgba(15, 23, 42, 0.94)'
                : 'rgba(255, 255, 255, 0.95)',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#e2e8f0',
              boxShadow: isDark
                ? '0 8px 24px rgba(0,0,0,0.5)'
                : '0 8px 20px rgba(15, 23, 42, 0.12)',
              px: 1.5,
              py: 0.6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
              zIndex: 20,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minWidth: 0,
                cursor: 'pointer',
              }}
              onClick={() => setIsInspectorCollapsed(false)}
            >
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: '7px',
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  flexShrink: 0,
                }}
              >
                {selectedNode?.icon || '📚'}
              </Box>
              <Typography
                noWrap
                sx={{
                  fontWeight: 800,
                  fontSize: '12.5px',
                  color: 'text.primary',
                }}
              >
                {selectedNode?.label}
              </Typography>
              <Box
                sx={{
                  px: 0.9,
                  py: 0.2,
                  borderRadius: '9999px',
                  bgcolor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#eef2ff',
                  color: '#4f46e5',
                  fontSize: '10px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {selectedNode?.outgoingCount || 3} conex.
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                flexShrink: 0,
              }}
            >
              <Button
                size="small"
                onClick={handleJumpToSelected}
                endIcon={
                  jumpFeedback ? (
                    <CheckIcon sx={{ fontSize: 13 }} />
                  ) : (
                    <ArrowBackIcon sx={{ fontSize: 13 }} />
                  )
                }
                sx={{
                  height: '28px',
                  px: 1.25,
                  borderRadius: '9999px',
                  bgcolor: jumpFeedback ? '#10b981' : '#4f46e5',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '11px',
                  textTransform: 'none',
                  boxShadow: jumpFeedback
                    ? '0 2px 10px rgba(16, 185, 129, 0.4)'
                    : 'none',
                  '&:hover': {
                    bgcolor: jumpFeedback ? '#059669' : '#4338ca',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {jumpFeedback ? '¡Listo!' : 'Saltar'}
              </Button>
              <IconButton
                size="small"
                onClick={() => setIsInspectorCollapsed(false)}
                title="Expandir detalles"
                sx={{ color: 'text.secondary', p: 0.4 }}
              >
                <ExpandIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              bgcolor: isDark ? 'rgba(15, 23, 42, 0.95)' : '#ffffff',
              borderRadius: '16px',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#e2e8f0',
              boxShadow: isDark
                ? '0 12px 30px rgba(0,0,0,0.6)'
                : '0 12px 28px rgba(15, 23, 42, 0.12)',
              p: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.25,
              zIndex: 20,
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Card Header: Avatar Icon, Title, Subtitle, Status Chip & Minimize Button */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  minWidth: 0,
                }}
              >
                {/* Squircle Avatar */}
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '9px',
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  {selectedNode?.icon || '📚'}
                </Box>

                {/* Title & Subtitle */}
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    noWrap
                    sx={{
                      fontWeight: 800,
                      fontSize: '13.5px',
                      color: 'text.primary',
                      lineHeight: 1.2,
                    }}
                  >
                    {selectedNode?.label || 'Recursos Clave & Dónde Buscar'}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{
                      fontWeight: 500,
                      fontSize: '11px',
                      color: 'text.secondary',
                      mt: 0.15,
                    }}
                  >
                    {selectedNode?.subtitle || 'Sección del Documento'}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  flexShrink: 0,
                }}
              >
                {/* Status Chip */}
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: '9999px',
                    bgcolor:
                      selectedNode?.statusColor === 'green'
                        ? isDark
                          ? 'rgba(16, 185, 129, 0.2)'
                          : '#ecfdf5'
                        : selectedNode?.statusColor === 'blue'
                          ? isDark
                            ? 'rgba(59, 130, 246, 0.2)'
                            : '#eff6ff'
                          : isDark
                            ? 'rgba(245, 158, 11, 0.2)'
                            : '#fef3c7',
                    color:
                      selectedNode?.statusColor === 'green'
                        ? '#10b981'
                        : selectedNode?.statusColor === 'blue'
                          ? '#3b82f6'
                          : '#b45309',
                    fontSize: '10.5px',
                    fontWeight: 750,
                  }}
                >
                  {selectedNode?.status || 'En progreso'}
                </Box>

                <IconButton
                  size="small"
                  onClick={() => setIsInspectorCollapsed(true)}
                  title="Minimizar panel"
                  sx={{ color: 'text.secondary', p: 0.5 }}
                >
                  <CollapseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>

            {/* 2-Box Info Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 1,
              }}
            >
              {/* Box 1: Tipo de nodo */}
              <Box
                sx={{
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
                  borderRadius: '9px',
                  p: '6px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.2,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '9.5px',
                    fontWeight: 600,
                    color: 'text.secondary',
                  }}
                >
                  Tipo de nodo:
                </Typography>
                <Typography
                  noWrap
                  sx={{
                    fontSize: '11.5px',
                    fontWeight: 750,
                    color: 'text.primary',
                  }}
                >
                  {getNodeTypeLabel(selectedNode)}
                </Typography>
              </Box>

              {/* Box 2: Enlaces salientes */}
              <Box
                sx={{
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
                  borderRadius: '9px',
                  p: '6px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.2,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '9.5px',
                    fontWeight: 600,
                    color: 'text.secondary',
                  }}
                >
                  Enlaces salientes:
                </Typography>
                <Typography
                  noWrap
                  sx={{
                    fontSize: '11.5px',
                    fontWeight: 750,
                    color: '#4f46e5',
                  }}
                >
                  {getOutgoingLabel(selectedNode)}
                </Typography>
              </Box>
            </Box>

            {/* Action Button: Saltar al párrafo en el documento ← */}
            <Button
              fullWidth
              onClick={handleJumpToSelected}
              endIcon={
                jumpFeedback ? (
                  <CheckIcon sx={{ fontSize: 16 }} />
                ) : (
                  <ArrowBackIcon sx={{ fontSize: 15 }} />
                )
              }
              sx={{
                height: '40px',
                borderRadius: '10px',
                bgcolor: jumpFeedback ? '#10b981' : '#4f46e5',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '12.5px',
                textTransform: 'none',
                boxShadow: jumpFeedback
                  ? '0 4px 14px rgba(16, 185, 129, 0.45)'
                  : '0 3px 10px rgba(79, 70, 229, 0.25)',
                '&:hover': {
                  bgcolor: jumpFeedback ? '#059669' : '#4338ca',
                  boxShadow: jumpFeedback
                    ? '0 6px 18px rgba(16, 185, 129, 0.55)'
                    : '0 5px 14px rgba(79, 70, 229, 0.35)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {jumpFeedback
                ? '¡Párrafo localizado y resaltado en documento!'
                : 'Saltar al párrafo en el documento'}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
