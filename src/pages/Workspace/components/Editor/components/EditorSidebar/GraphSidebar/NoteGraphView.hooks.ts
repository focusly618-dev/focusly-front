import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  GraphNode,
  GraphSettings,
  NodeDragState,
  PanState,
} from './NoteGraphView.types';
import { DEFAULT_SETTINGS } from './NoteGraphView.types';
import {
  DRAG_THRESHOLD_PX,
  SETTINGS_STORAGE_KEY,
  ZOOM_MAX,
  ZOOM_MIN,
} from './utils/graphLayout.utils';

export const loadSettings = (): GraphSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const useGraphSettings = () => {
  const [settings, setSettings] = useState<GraphSettings>(loadSettings);
  const [settingsAnchor, setSettingsAnchor] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = useCallback(
    <K extends keyof GraphSettings>(key: K, value: GraphSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    settingsAnchor,
    setSettingsAnchor,
    updateSetting,
    resetSettings,
  };
};

export const useGraphPanZoom = (
  containerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const [zoom, setZoom] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const [pan, setPan] = useState<PanState>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panRef = useRef<{
    startClientX: number;
    startClientY: number;
    startPanX: number;
    startPanY: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      setZoomOrigin(
        `${((e.clientX - rect.left) / rect.width) * 100}% ${((e.clientY - rect.top) / rect.height) * 100}%`,
      );
      setZoom((z) =>
        Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z - e.deltaY * 0.0015)),
      );
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [containerRef]);

  const handleCanvasPointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      panRef.current = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
      };
      setIsPanning(true);

      const handleMove = (moveEvent: PointerEvent) => {
        const drag = panRef.current;
        if (!drag) return;
        const dxPx = moveEvent.clientX - drag.startClientX;
        const dyPx = moveEvent.clientY - drag.startClientY;
        setPan({
          x: drag.startPanX + dxPx / zoom,
          y: drag.startPanY + dyPx / zoom,
        });
      };

      const handleUp = () => {
        panRef.current = null;
        setIsPanning(false);
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    },
    [pan.x, pan.y, zoom],
  );

  const resetPanZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  return {
    zoom,
    zoomOrigin,
    pan,
    isPanning,
    handleCanvasPointerDown,
    resetPanZoom,
  };
};

export const useGraphNodeDrag = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  canvasSize: number,
  onJump: (pos: number) => void,
) => {
  const [overrides, setOverrides] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const dragRef = useRef<NodeDragState | null>(null);

  const handleNodePointerDown = useCallback(
    (node: GraphNode) => (e: React.PointerEvent) => {
      e.stopPropagation();
      dragRef.current = {
        id: node.id,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startX: node.x,
        startY: node.y,
        dragged: false,
      };

      const handleMove = (moveEvent: PointerEvent) => {
        const drag = dragRef.current;
        const svg = svgRef.current;
        if (!drag || !svg) return;
        const rect = svg.getBoundingClientRect();
        const scale = canvasSize / rect.width;
        const dxPx = moveEvent.clientX - drag.startClientX;
        const dyPx = moveEvent.clientY - drag.startClientY;
        if (!drag.dragged && Math.hypot(dxPx, dyPx) > DRAG_THRESHOLD_PX) {
          drag.dragged = true;
        }
        setOverrides((prev) => ({
          ...prev,
          [drag.id]: {
            x: drag.startX + dxPx * scale,
            y: drag.startY + dyPx * scale,
          },
        }));
      };

      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    },
    [canvasSize, svgRef],
  );

  const handleNodeClick = useCallback(
    (node: GraphNode) => () => {
      if (dragRef.current?.id === node.id && dragRef.current.dragged) {
        dragRef.current = null;
        return;
      }
      if (node.pos !== null) onJump(node.pos);
    },
    [onJump],
  );

  const resetOverrides = useCallback(() => {
    setOverrides({});
  }, []);

  return {
    overrides,
    handleNodePointerDown,
    handleNodeClick,
    resetOverrides,
  };
};
