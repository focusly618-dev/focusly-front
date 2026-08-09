import React, { useMemo, useRef, useState } from 'react';
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import type { NoteGraphViewProps } from './NoteGraphView.types';
import { buildGraph } from './utils/graphLayout.utils';
import {
  useGraphNodeDrag,
  useGraphPanZoom,
  useGraphSettings,
} from './NoteGraphView.hooks';
import { GraphCanvas } from './components/GraphCanvas';
import { GraphSettingsMenu } from './components/GraphSettingsMenu';

export const NoteGraphView: React.FC<NoteGraphViewProps> = ({
  rootLabel,
  headings,
  onJump,
}) => {
  const theme = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const {
    settings,
    settingsAnchor,
    setSettingsAnchor,
    updateSetting,
    resetSettings,
  } = useGraphSettings();

  const {
    zoom,
    zoomOrigin,
    pan,
    isPanning,
    handleCanvasPointerDown,
    resetPanZoom,
  } = useGraphPanZoom(containerRef);

  const {
    nodes: baseNodes,
    edges,
    canvasSize,
  } = useMemo(
    () => buildGraph(rootLabel, headings, settings.spacing),
    [rootLabel, headings, settings.spacing],
  );

  const { overrides, handleNodePointerDown, handleNodeClick, resetOverrides } =
    useGraphNodeDrag(svgRef, canvasSize, onJump);

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

  const neighborIds = useMemo(() => {
    if (!hoveredId) return null;
    const set = new Set([hoveredId]);
    edges.forEach((edge) => {
      if (edge.from === hoveredId) set.add(edge.to);
      if (edge.to === hoveredId) set.add(edge.from);
    });
    return set;
  }, [hoveredId, edges]);

  const handleResetAll = () => {
    resetOverrides();
    resetSettings();
    resetPanZoom();
  };

  return (
    <Box>
      <Box
        ref={containerRef}
        onDoubleClick={resetPanZoom}
        sx={{
          position: 'relative',
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Tooltip title="Graph settings">
          <IconButton
            size="small"
            onClick={(e) => setSettingsAnchor(e.currentTarget)}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              zIndex: 1,
              color: 'text.secondary',
              bgcolor: theme.palette.background.paper,
              '&:hover': { bgcolor: theme.palette.action.hover },
            }}
          >
            <MoreVertIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <GraphCanvas
          svgRef={svgRef}
          canvasSize={canvasSize}
          zoom={zoom}
          zoomOrigin={zoomOrigin}
          pan={pan}
          isPanning={isPanning}
          nodes={nodes}
          edges={edges}
          nodeById={nodeById}
          neighborIds={neighborIds}
          hoveredId={hoveredId}
          settings={settings}
          onCanvasPointerDown={handleCanvasPointerDown}
          onNodePointerDown={handleNodePointerDown}
          onNodeClick={handleNodeClick}
          setHoveredId={setHoveredId}
        />
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', textAlign: 'center', mt: 1.5 }}
      >
        Add a # title to this note to connect it here.
      </Typography>

      <GraphSettingsMenu
        anchorEl={settingsAnchor}
        settings={settings}
        onClose={() => setSettingsAnchor(null)}
        onUpdateSetting={updateSetting}
        onResetAll={handleResetAll}
      />
    </Box>
  );
};
