import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Box, useTheme } from '@mui/material';
import { LuminaAnimatedFace } from '../LuminaAnimatedFace';
import type { LuminaOrbProps } from './LuminaOrb.types';

export const LuminaOrb: React.FC<LuminaOrbProps> = ({
  state = 'thinking',
  size = 98,
  className,
  sx,
  primaryColor,
  secondaryColor,
}) => {
  const theme = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasWebGPU, setHasWebGPU] = useState<boolean>(() => {
    return (
      typeof navigator !== 'undefined' &&
      'gpu' in navigator &&
      !!(navigator as unknown as { gpu?: unknown }).gpu
    );
  });

  const resolvedPrimary = primaryColor || theme.palette.primary.main;
  const resolvedSecondary = secondaryColor || theme.palette.primary.light;
  const currentMode = theme.palette.mode || 'dark';

  // Check WebGPU availability at mount
  useEffect(() => {
    if (
      typeof navigator === 'undefined' ||
      !(navigator as unknown as { gpu?: unknown }).gpu
    ) {
      setHasWebGPU(false);
    }
  }, []);

  const syncState = useCallback((targetState: string) => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

    try {
      const win = iframe.contentWindow as unknown as {
        liquidOrb?: { setState: (s: string) => void };
      };
      if (win.liquidOrb && typeof win.liquidOrb.setState === 'function') {
        win.liquidOrb.setState(targetState);
      }
    } catch {
      // Ignore cross-origin issues
    }

    try {
      iframe.contentWindow.postMessage(
        { type: 'SET_ORB_STATE', state: targetState },
        '*',
      );
    } catch {
      // Ignore errors
    }
  }, []);

  const syncTheme = useCallback(
    (primary: string, secondary: string, mode: string) => {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;

      try {
        const win = iframe.contentWindow as unknown as {
          liquidOrb?: { setTheme: (p: string, s: string, m: string) => void };
        };
        if (win.liquidOrb && typeof win.liquidOrb.setTheme === 'function') {
          win.liquidOrb.setTheme(primary, secondary, mode);
        }
      } catch {
        // Ignore cross-origin issues
      }

      try {
        iframe.contentWindow.postMessage(
          { type: 'SET_ORB_THEME', primary, secondary, mode },
          '*',
        );
      } catch {
        // Ignore errors
      }
    },
    [],
  );

  // Synchronize state on prop change or iframe load
  useEffect(() => {
    if (isLoaded) {
      syncState(state);
    }
  }, [state, isLoaded, syncState]);

  // Synchronize dynamic theme / color changes
  useEffect(() => {
    if (isLoaded) {
      syncTheme(resolvedPrimary, resolvedSecondary, currentMode);
    }
  }, [resolvedPrimary, resolvedSecondary, currentMode, isLoaded, syncTheme]);

  const handleIframeLoad = () => {
    setIsLoaded(true);
    syncTheme(resolvedPrimary, resolvedSecondary, currentMode);
    syncState(state);
  };

  // Initial iframe src parameterized with current theme colors so it renders correctly on first paint
  const iframeSrc = useMemo(() => {
    const params = new URLSearchParams({
      primary: resolvedPrimary,
      secondary: resolvedSecondary,
      mode: currentMode,
      state,
    });
    return `/lumina-orb.html?${params.toString()}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Graceful fallback to LuminaAnimatedFace when WebGPU is unavailable
  if (!hasWebGPU) {
    return (
      <LuminaAnimatedFace
        size={size}
        primaryColor={resolvedPrimary}
        secondaryColor={resolvedSecondary}
      />
    );
  }

  return (
    <Box
      className={className}
      sx={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: '50%',
        overflow: 'hidden',
        lineHeight: 0,
        ...sx,
      }}
    >
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        title="Lumina AI Orb"
        onLoad={handleIframeLoad}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          pointerEvents: 'none',
          background: 'transparent',
          display: 'block',
        }}
      />
    </Box>
  );
};

export default LuminaOrb;
