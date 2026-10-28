import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  GraphNode,
  GraphSettings,
  NodeDragState,
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

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Not remembered, but still applied.
    }
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

  return { settings, updateSetting, resetSettings };
};

/** A screen point in the coordinates of an SVG element's own space. */
const toLocal = (
  el: SVGGraphicsElement | null,
  clientX: number,
  clientY: number,
): { x: number; y: number } | null => {
  const ctm = el?.getScreenCTM();
  if (!ctm) return null;
  const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
  return { x: p.x, y: p.y };
};

const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));

/** Coalesces a stream of updates (pointer moves) into one per frame. */
const useFrameThrottle = () => {
  const frame = useRef<number | null>(null);
  const latest = useRef<(() => void) | null>(null);
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );
  return useCallback((update: () => void) => {
    latest.current = update;
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      latest.current?.();
    });
  }, []);
};

export interface GraphView {
  zoom: number;
  x: number;
  y: number;
}

const INITIAL_VIEW: GraphView = { zoom: 1, x: 0, y: 0 };

/**
 * Pan and zoom of the graph, in the SVG's viewBox units. The content is drawn
 * with `translate(c + pan) scale(zoom) translate(-c)` around the canvas
 * center `c`, so a content point `p` lands at `c + pan + zoom * (p - c)`.
 */
export const useGraphPanZoom = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  center: { x: number; y: number },
) => {
  const [view, setView] = useState<GraphView>(INITIAL_VIEW);
  const [isPanning, setIsPanning] = useState(false);
  const throttle = useFrameThrottle();
  const centerRef = useRef(center);
  useEffect(() => {
    centerRef.current = center;
  }, [center]);

  // Zoom keeping a given point (viewBox units) still on screen
  const zoomAt = useCallback(
    (point: { x: number; y: number }, nextZoom: (z: number) => number) => {
      setView((v) => {
        const c = centerRef.current;
        const zoom = clampZoom(nextZoom(v.zoom));
        const contentX = c.x + (point.x - c.x - v.x) / v.zoom;
        const contentY = c.y + (point.y - c.y - v.y) / v.zoom;
        return {
          zoom,
          x: point.x - c.x - zoom * (contentX - c.x),
          y: point.y - c.y - zoom * (contentY - c.y),
        };
      });
    },
    [],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const point = toLocal(svgRef.current, e.clientX, e.clientY);
      if (!point) return;
      zoomAt(point, (z) => z * Math.exp(-e.deltaY * 0.0015));
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [containerRef, svgRef, zoomAt]);

  const handleCanvasPointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (e.button !== 0) return;
      const start = toLocal(svgRef.current, e.clientX, e.clientY);
      if (!start) return;
      const startView = view;
      setIsPanning(true);

      const handleMove = (moveEvent: PointerEvent) => {
        throttle(() => {
          const point = toLocal(
            svgRef.current,
            moveEvent.clientX,
            moveEvent.clientY,
          );
          if (!point) return;
          setView({
            zoom: startView.zoom,
            x: startView.x + point.x - start.x,
            y: startView.y + point.y - start.y,
          });
        });
      };
      const handleUp = () => {
        setIsPanning(false);
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
      };
      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    },
    [svgRef, throttle, view],
  );

  const resetPanZoom = useCallback(() => setView(INITIAL_VIEW), []);
  const zoomIn = useCallback(
    () => zoomAt(centerRef.current, (z) => z * 1.25),
    [zoomAt],
  );
  const zoomOut = useCallback(
    () => zoomAt(centerRef.current, (z) => z / 1.25),
    [zoomAt],
  );

  return {
    view,
    isPanning,
    handleCanvasPointerDown,
    resetPanZoom,
    zoomIn,
    zoomOut,
  };
};

/**
 * Dragging nodes. Positions are read in the content group's own coordinates
 * (through its screen matrix), so a node stays under the pointer at any zoom
 * or pan; a press that never moves past a few pixels stays a click.
 */
export const useGraphNodeDrag = (
  contentRef: React.RefObject<SVGGElement | null>,
) => {
  const [overrides, setOverrides] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragRef = useRef<NodeDragState | null>(null);
  const throttle = useFrameThrottle();

  const handleNodePointerDown = useCallback(
    (node: GraphNode) => (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      const start = toLocal(contentRef.current, e.clientX, e.clientY);
      if (!start) return;
      dragRef.current = {
        id: node.id,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startX: node.x - start.x,
        startY: node.y - start.y,
        dragged: false,
      };

      const handleMove = (moveEvent: PointerEvent) => {
        const drag = dragRef.current;
        if (!drag) return;
        if (
          !drag.dragged &&
          Math.hypot(
            moveEvent.clientX - drag.startClientX,
            moveEvent.clientY - drag.startClientY,
          ) <= DRAG_THRESHOLD_PX
        ) {
          return;
        }
        if (!drag.dragged) {
          drag.dragged = true;
          setDraggingId(drag.id);
        }
        throttle(() => {
          const point = toLocal(
            contentRef.current,
            moveEvent.clientX,
            moveEvent.clientY,
          );
          if (!point) return;
          setOverrides((prev) => ({
            ...prev,
            [drag.id]: { x: point.x + drag.startX, y: point.y + drag.startY },
          }));
        });
      };
      const handleUp = () => {
        setDraggingId(null);
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
      };
      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    },
    [contentRef, throttle],
  );

  /** True when the click that just happened ended a drag, not a tap. */
  const wasDragged = useCallback((node: GraphNode) => {
    const drag = dragRef.current;
    if (drag?.id === node.id && drag.dragged) {
      dragRef.current = null;
      return true;
    }
    return false;
  }, []);

  const resetOverrides = useCallback(() => setOverrides({}), []);

  return {
    overrides,
    draggingId,
    handleNodePointerDown,
    wasDragged,
    resetOverrides,
  };
};
