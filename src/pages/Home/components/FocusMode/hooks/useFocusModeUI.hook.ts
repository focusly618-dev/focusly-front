import { useState, useEffect, useCallback } from 'react';
import type { ViewMode } from '../FocusMode.types';

/** The floating mini timer's footprint, to keep it on screen. */
export const MINI_MODE_SIZE = { width: 280, height: 44 };
const SCREEN_MARGIN = 12;

/** A mini timer position moved back inside the window, if it left it. */
const clampToWindow = (x: number, y: number) => ({
  x: Math.max(
    SCREEN_MARGIN,
    Math.min(x, window.innerWidth - MINI_MODE_SIZE.width - SCREEN_MARGIN),
  ),
  y: Math.max(
    SCREEN_MARGIN,
    Math.min(y, window.innerHeight - MINI_MODE_SIZE.height - SCREEN_MARGIN),
  ),
});

export const useFocusModeUI = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('focus_mode_view') as ViewMode) || 'full';
  });

  useEffect(() => {
    localStorage.setItem('focus_mode_view', viewMode);
  }, [viewMode]);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);

  /* Drag Logic */
  // Initial position: bottom right, clear of the edges
  const [position, setPosition] = useState<{ x: number; y: number }>(() =>
    clampToWindow(Infinity, window.innerHeight - MINI_MODE_SIZE.height - 24),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Its buttons are for clicking, not for grabbing it.
      if ((e.target as HTMLElement).closest('button')) return;
      e.preventDefault();
      setIsDragging(true);
      // Use the current translate position to calculate offset correctly
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position],
  );

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const updatePosition = () => {
        setPosition(
          clampToWindow(e.clientX - dragOffset.x, e.clientY - dragOffset.y),
        );
      };

      // Throttle updates with requestAnimationFrame
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDragging, dragOffset]);

  // Handle window resize to keep mini mode visible
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => clampToWindow(prev.x, prev.y));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    showExitConfirmation,
    setShowExitConfirmation,
    viewMode,
    setViewMode,
    isSessionCompleted,
    setIsSessionCompleted,
    position,
    handleMouseDown,
    isDragging,
  };
};
