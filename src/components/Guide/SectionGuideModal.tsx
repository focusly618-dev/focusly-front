import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
} from '@mui/icons-material';
import { fadeUp } from './frames/motion';
import { GUIDES, type GuideSection } from './guideContent';
import { KEYS } from './platformKeys';

interface SectionGuideModalProps {
  /** The section whose guide to show; null keeps it closed. */
  section: GuideSection | null;
  onClose: () => void;
}

/**
 * A section's guide: a centered dialog that pages through how that part of
 * Focusly works — a frame showing it, what it does, dots for the pages, and
 * back / next.
 */
export const SectionGuideModal = ({
  section,
  onClose,
}: SectionGuideModalProps) => (
  <Dialog
    open={section !== null}
    onClose={onClose}
    maxWidth={false}
    aria-labelledby="section-guide-title"
    aria-describedby="section-guide-body"
    PaperProps={{
      sx: {
        width: 640,
        maxWidth: 'calc(100vw - 32px)',
        m: 2,
        borderRadius: '18px',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        backgroundImage: 'none',
      },
    }}
  >
    {/* Mounted per opening, so each guide starts on its first page */}
    {section && (
      <GuidePages key={section} section={section} onClose={onClose} />
    )}
  </Dialog>
);

const GuidePages = ({
  section,
  onClose,
}: {
  section: GuideSection;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const steps = GUIDES[section];
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  const go = (to: number) =>
    setIndex(Math.max(0, Math.min(steps.length - 1, to)));
  const next = () => (isLast ? onClose() : go(index + 1));

  return (
    <Box
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') go(index - 1);
      }}
    >
      {/* The frame */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 220, sm: 290 },
          px: { xs: 2, sm: 4 },
          py: 3,
          display: 'grid',
          placeItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha(
            theme.palette.primary.main,
            theme.palette.mode === 'dark' ? 0.07 : 0.04,
          ),
          backgroundImage: `radial-gradient(${alpha(theme.palette.text.primary, 0.07)} 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
          // Motion off when the system asks for less: every frame lands
          // straight on its final state
          '@media (prefers-reduced-motion: reduce)': {
            '& *': {
              animationDuration: '0.01ms !important',
              animationIterationCount: '1 !important',
              animationDelay: '0s !important',
            },
          },
        }}
      >
        <Box
          key={step.id}
          sx={{
            width: '100%',
            height: '100%',
            display: 'grid',
            placeItems: 'center',
            animation: `${fadeUp} 0.35s ease-out`,
          }}
        >
          <step.Frame />
        </Box>
        <IconButton
          onClick={onClose}
          aria-label={t('guide.ui.close', 'Close guide')}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            color: 'text.secondary',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': { bgcolor: 'background.paper', color: 'text.primary' },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* What it does */}
      <Box
        key={`text-${step.id}`}
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          pt: 2.75,
          pb: 1,
          animation: `${fadeUp} 0.35s ease-out`,
        }}
      >
        <Typography
          sx={{
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'primary.main',
          }}
        >
          {t(`guide.${section}.label`)}
        </Typography>
        <Typography
          id="section-guide-title"
          sx={{
            fontSize: 20,
            fontWeight: 700,
            mt: 0.5,
            letterSpacing: '-0.01em',
          }}
        >
          {t(`guide.${section}.steps.${step.id}.title`, { mod: KEYS.mod })}
        </Typography>
        <Typography
          id="section-guide-body"
          sx={{
            fontSize: 14,
            lineHeight: 1.6,
            color: 'text.secondary',
            mt: 1,
            minHeight: { sm: '4.8em' },
          }}
        >
          {t(`guide.${section}.steps.${step.id}.body`, { mod: KEYS.mod })}
        </Typography>
      </Box>

      {/* Pages: back, a dot per page, next */}
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          pt: 1.5,
          pb: 2.5,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box>
          <Button
            onClick={() => go(index - 1)}
            startIcon={<BackIcon sx={{ fontSize: '16px !important' }} />}
            sx={{
              visibility: isFirst ? 'hidden' : 'visible',
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
            }}
          >
            {t('guide.ui.back', 'Back')}
          </Button>
        </Box>

        <Box
          role="tablist"
          aria-label={t('guide.ui.pages', 'Pages')}
          sx={{ display: 'flex', gap: 0.75 }}
        >
          {steps.map((s, i) => (
            <Box
              key={s.id}
              component="button"
              role="tab"
              aria-selected={i === index}
              aria-label={t('guide.ui.page', {
                current: i + 1,
                total: steps.length,
                defaultValue: 'Page {{current}} of {{total}}',
              })}
              onClick={() => go(i)}
              sx={{
                width: 8,
                height: 8,
                p: 0,
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                bgcolor:
                  i === index
                    ? 'primary.main'
                    : alpha(theme.palette.text.primary, 0.18),
                transform: i === index ? 'scale(1.25)' : 'none',
                transition: 'background-color 0.2s ease, transform 0.2s ease',
                '&:focus-visible': {
                  outline: `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: 2,
                },
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            disableElevation
            onClick={next}
            autoFocus
            // Focused on open: a plain outline, not MUI's pulsing ripple
            disableFocusRipple
            endIcon={
              isLast ? undefined : (
                <NextIcon sx={{ fontSize: '16px !important' }} />
              )
            }
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '9px',
              px: 2,
              '&.Mui-focusVisible': {
                outline: `2px solid ${alpha(theme.palette.primary.main, 0.45)}`,
                outlineOffset: 2,
              },
            }}
          >
            {isLast ? t('guide.ui.done', 'Got it') : t('guide.ui.next', 'Next')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
