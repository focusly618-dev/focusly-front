import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  CenterFocusStrong as FitIcon,
  OpenInFull as FullscreenIcon,
  CloseFullscreen as CloseFullscreenIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  SubdirectoryArrowLeft as JumpIcon,
} from '@mui/icons-material';
import type { GraphNode, NoteGraphViewProps } from './NoteGraphView.types';
import {
  buildGraph,
  nodeText,
  type GraphLayout,
} from './utils/graphLayout.utils';
import {
  useGraphNodeDrag,
  useGraphPanZoom,
  useGraphSettings,
} from './NoteGraphView.hooks';
import { GraphCanvas } from './components/GraphCanvas';

/**
 * The note's headings as a graph you can move around: the canvas is the
 * whole view, with a few quiet controls floating over it.
 */
export const NoteGraphView: React.FC<NoteGraphViewProps> = ({
  rootLabel,
  headings,
  markdownContent = '',
  rootIcon,
  onJump,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const svgRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [jumped, setJumped] = useState(false);

  const { settings } = useGraphSettings();

  // A wide view gets the left-to-right map; a narrow one (the sidebar) the
  // indented outline, which stays legible at its width.
  const [layout, setLayout] = useState<GraphLayout>('outline');
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setLayout(width >= height * 1.1 ? 'tree' : 'outline');
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const {
    nodes: baseNodes,
    edges,
    canvasWidth,
    canvasHeight,
  } = useMemo(
    () =>
      buildGraph(
        rootLabel,
        headings,
        settings.spacing,
        markdownContent,
        rootIcon,
        layout,
      ),
    [rootLabel, headings, settings.spacing, markdownContent, rootIcon, layout],
  );

  const center = useMemo(
    () => ({ x: canvasWidth / 2, y: canvasHeight / 2 }),
    [canvasWidth, canvasHeight],
  );
  const {
    view,
    isPanning,
    handleCanvasPointerDown,
    resetPanZoom,
    zoomIn,
    zoomOut,
  } = useGraphPanZoom(svgRef, containerRef, center);

  const {
    overrides,
    draggingId,
    handleNodePointerDown,
    wasDragged,
    resetOverrides,
  } = useGraphNodeDrag(contentRef);

  const nodes = useMemo(
    () =>
      baseNodes.map((node) =>
        overrides[node.id] ? { ...node, ...overrides[node.id] } : node,
      ),
    [baseNodes, overrides],
  );
  const nodeById = useMemo(
    () => new Map(nodes.map((node) => [node.id, node])),
    [nodes],
  );
  const selectedNode = selectedId ? (nodeById.get(selectedId) ?? null) : null;

  // In focus: the hovered node and its neighbors, else the search matches
  const focusIds = useMemo(() => {
    if (hoveredId && !draggingId) {
      const ids = new Set([hoveredId]);
      edges.forEach((edge) => {
        if (edge.from === hoveredId) ids.add(edge.to);
        if (edge.to === hoveredId) ids.add(edge.from);
      });
      return ids;
    }
    const query = searchQuery.trim().toLowerCase();
    if (!query) return null;
    return new Set(
      nodes
        .filter((node) => node.label.toLowerCase().includes(query))
        .map((node) => node.id),
    );
  }, [hoveredId, draggingId, edges, searchQuery, nodes]);

  const jumpTo = (node: GraphNode) => {
    onJump(node.pos ?? 0, node.label);
    setJumped(true);
    setTimeout(() => setJumped(false), 1600);
  };

  const handleNodeClick = (node: GraphNode) => {
    if (wasDragged(node)) return;
    setSelectedId((current) => (current === node.id ? null : node.id));
  };

  // Back to the computed layout, every node in view
  const organize = () => {
    resetOverrides();
    resetPanZoom();
  };

  // Moved nodes and the view belong to the layout they were made in
  useEffect(() => {
    resetOverrides();
    resetPanZoom();
  }, [layout, resetOverrides, resetPanZoom]);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  // The floating controls: small, solid, with a hairline border
  const floatingSx = {
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: '10px',
    boxShadow: `0 1px 3px ${alpha('#000', 0.06)}`,
  } as const;
  const controlSx = {
    width: 28,
    height: 28,
    borderRadius: '7px',
    color: 'text.secondary',
    '& svg': { fontSize: 16 },
    '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
  } as const;

  const controls = [
    {
      key: 'out',
      label: t('workspaceEditor.graph.zoomOut', 'Alejar'),
      icon: <RemoveIcon />,
      onClick: zoomOut,
    },
    {
      key: 'in',
      label: t('workspaceEditor.graph.zoomIn', 'Acercar'),
      icon: <AddIcon />,
      onClick: zoomIn,
    },
    {
      key: 'fit',
      label: t('workspaceEditor.graph.organize', 'Organizar y ver todo'),
      icon: <FitIcon />,
      onClick: organize,
    },
    {
      key: 'full',
      label: isFullscreen
        ? t(
            'workspaceEditor.graph.exitFullscreen',
            'Salir de pantalla completa',
          )
        : t('workspaceEditor.graph.fullscreen', 'Pantalla completa'),
      icon: isFullscreen ? <CloseFullscreenIcon /> : <FullscreenIcon />,
      onClick: () => setIsFullscreen((prev) => !prev),
    },
  ];

  return (
    <Box
      ref={containerRef}
      onDoubleClick={resetPanZoom}
      sx={{
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 1400 : 1,
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* The canvas starts under the floating toolbar, so the graph's top
          is never hidden behind it */}
      <Box sx={{ position: 'absolute', top: 52, left: 0, right: 0, bottom: 0 }}>
        <GraphCanvas
          svgRef={svgRef}
          contentRef={contentRef}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          view={view}
          isPanning={isPanning}
          nodes={nodes}
          edges={edges}
          nodeById={nodeById}
          focusIds={focusIds}
          hoveredId={hoveredId}
          selectedNodeId={selectedId}
          draggingId={draggingId}
          settings={settings}
          layout={layout}
          onCanvasPointerDown={handleCanvasPointerDown}
          onNodePointerDown={handleNodePointerDown}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={jumpTo}
          setHoveredId={setHoveredId}
        />
      </Box>

      {/* Top: search on the left, view controls on the right */}
      <Box
        onDoubleClick={(e) => e.stopPropagation()}
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          right: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          pointerEvents: 'none',
          '& > *': { pointerEvents: 'auto' },
        }}
      >
        <Box
          sx={{
            ...floatingSx,
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            height: 32,
            px: 1,
            minWidth: 0,
            width: 200,
          }}
        >
          <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <InputBase
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('workspaceEditor.graph.search', 'Buscar sección')}
            inputProps={{
              'aria-label': t('workspaceEditor.graph.search', 'Buscar sección'),
            }}
            sx={{ flex: 1, minWidth: 0, fontSize: '12.5px' }}
          />
          {searchQuery && (
            <IconButton
              size="small"
              onClick={() => setSearchQuery('')}
              aria-label={t('common.clear', 'Limpiar')}
              sx={{ p: 0.25, color: 'text.secondary' }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          )}
        </Box>

        <Box
          sx={{
            ...floatingSx,
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            p: '1px',
            flexShrink: 0,
          }}
        >
          {controls.map((control, i) => (
            <React.Fragment key={control.key}>
              {i === 2 && (
                <Divider orientation="vertical" flexItem sx={{ my: 0.75 }} />
              )}
              <Tooltip title={control.label}>
                <IconButton
                  onClick={control.onClick}
                  aria-label={control.label}
                  sx={controlSx}
                >
                  {control.icon}
                </IconButton>
              </Tooltip>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Bottom: the selected node and a way to it in the note */}
      {selectedNode && (
        <Box
          onDoubleClick={(e) => e.stopPropagation()}
          sx={{
            ...floatingSx,
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: 'calc(100% - 24px)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            pl: 1.5,
            pr: 0.5,
            height: 36,
          }}
        >
          <Typography
            noWrap
            sx={{ fontSize: '12.5px', fontWeight: 600, minWidth: 0 }}
          >
            {selectedNode.icon ? `${selectedNode.icon} ` : ''}
            {nodeText(selectedNode)}
          </Typography>
          <Button
            size="small"
            onClick={() => jumpTo(selectedNode)}
            startIcon={jumped ? <CheckIcon /> : <JumpIcon />}
            sx={{
              flexShrink: 0,
              height: 26,
              px: 1,
              borderRadius: '7px',
              textTransform: 'none',
              fontSize: '12px',
              fontWeight: 600,
              color: jumped ? 'success.main' : 'primary.main',
              '& .MuiButton-startIcon': { mr: 0.5 },
              '& svg': { fontSize: '15px !important' },
            }}
          >
            {jumped
              ? t('workspaceEditor.graph.jumpDone', 'Listo')
              : t('workspaceEditor.graph.goToSection', 'Ir a la sección')}
          </Button>
          <IconButton
            onClick={() => setSelectedId(null)}
            aria-label={t('common.close', 'Cerrar')}
            sx={{ ...controlSx, width: 26, height: 26 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      {headings.length === 0 && (
        <Typography
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            px: 2,
            textAlign: 'center',
            fontSize: '12px',
            color: alpha(theme.palette.text.secondary, 0.9),
            pointerEvents: 'none',
          }}
        >
          {t(
            'workspaceEditor.graph.emptyHint',
            'Agrega títulos (# Sección) a la nota para ver su estructura',
          )}
        </Typography>
      )}
    </Box>
  );
};
