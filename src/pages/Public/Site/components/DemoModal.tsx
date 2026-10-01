import { useEffect } from 'react';
import { Box, ButtonBase } from '@mui/material';
import { useSiteContent } from '../content';
import { FONT_MONO, LUMINA } from '../tokens';
import { SiteIcon } from '../icons';
import { useBodyScrollLock, useReducedMotion } from '../hooks';

/** 60-second demo video modal (the video itself is still to be produced). */
export const DemoModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { c } = useSiteContent();
  const reduced = useReducedMotion();
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-label={c.demoModal.aria}
      onClick={onClose}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        bgcolor: 'rgba(0,0,0,.66)',
        display: 'grid',
        placeItems: 'center',
        p: 2.5,
        opacity: open ? 1 : 0,
        visibility: open ? 'visible' : 'hidden',
        transition: 'opacity 200ms ease-out, visibility 200ms',
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'relative',
          width: 'min(960px, 100%)',
          borderRadius: '16px',
          overflow: 'hidden',
          bgcolor: '#0b0c0f',
          transform: open || reduced ? 'none' : 'translateY(8px) scale(.98)',
          transition: 'transform 200ms ease-out',
        }}
      >
        <ButtonBase
          aria-label={c.demoModal.close}
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,.12)',
            color: '#ffffff',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1,
          }}
        >
          <SiteIcon name="close" size={22} />
        </ButtonBase>
        <Box
          sx={{
            aspectRatio: '16/9',
            background:
              'repeating-linear-gradient(135deg,rgba(255,255,255,.04) 0 10px,transparent 10px 20px)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Box
            component="span"
            sx={{
              fontFamily: FONT_MONO,
              fontSize: 13,
              color: LUMINA.muted,
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            video demo · 60 s
            <br />
            MP4/WebM + póster · subtítulos es/en/ja
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
