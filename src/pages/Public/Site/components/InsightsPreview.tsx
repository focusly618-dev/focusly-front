import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useSiteContent } from '../content';
import { FONT_HEADING, FONT_MONO, useSiteTokens } from '../tokens';
import { useReducedMotion } from '../hooks';

// Sample week shown in the preview (labeled "Datos de ejemplo").
const BARS = [3.2, 4.1, 2.5, 3.8, 2.9, 1.2, 0.8];
const HOUR_WEIGHTS = [0.3, 0.75, 0.95, 0.85, 0.5, 0.3, 0.45, 0.4];
const DAY_WEIGHTS = [1, 0.9, 0.95, 0.8, 0.7];
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/** Counts from 0 to 1 over 600 ms the first time `ref` scrolls into view. */
const useCountUp = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (reduced) {
          setProgress(1);
          return;
        }
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / 600);
          setProgress(easeOut(p));
          if (p < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return { ref, progress };
};

export const InsightsPreview = () => {
  const t = useSiteTokens();
  const { c, lang } = useSiteContent();
  const ins = c.insights;
  const { ref, progress: p } = useCountUp();
  const num = (value: number, digits: number) =>
    new Intl.NumberFormat(lang, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value * p);

  const metrics = [
    { label: ins.focusHours, val: `${num(18.5, 1)} ${ins.hoursUnit}` },
    { label: ins.tasksDone, val: num(42, 0) },
    { label: ins.energy, val: `${num(78, 0)}/100` },
    { label: ins.golden, val: p > 0.5 ? '9:00–11:30' : '—' },
  ];
  const mix = (pct: number) =>
    `color-mix(in oklab, ${t.brand} ${pct}%, ${t.surface2})`;

  return (
    <Box
      ref={ref}
      sx={{
        flex: '1.7 1 520px',
        minWidth: 0,
        bgcolor: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: '18px',
        p: 2.5,
        boxShadow: t.shadow,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <Box component="span" sx={{ fontWeight: 600 }}>
          {ins.week}
        </Box>
        <Box
          component="span"
          sx={{
            fontFamily: FONT_MONO,
            fontSize: 11.5,
            color: t.muted,
            border: `1px dashed ${t.border}`,
            px: 1,
            py: '3px',
            borderRadius: '6px',
          }}
        >
          {ins.sample}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 1.5,
        }}
      >
        {metrics.map((m) => (
          <Box
            key={m.label}
            sx={{
              bgcolor: t.surface2,
              borderRadius: '12px',
              p: 1.75,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            <Box component="span" sx={{ fontSize: 12.5, color: t.muted }}>
              {m.label}
            </Box>
            <Box
              component="span"
              sx={{
                fontFamily: FONT_HEADING,
                fontWeight: 600,
                fontSize: 26,
                lineHeight: 1.15,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {m.val}
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 1.5 }}>
        <Box
          sx={{
            flex: '1 1 240px',
            border: `1px solid ${t.border}`,
            borderRadius: '12px',
            p: 1.75,
          }}
        >
          <Box sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
            {ins.barsTitle}
          </Box>
          <Box
            sx={{
              height: 130,
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1,
            }}
          >
            {BARS.map((value, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 0.75,
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: `${(value / 4.1) * 100 * p}%`,
                    borderRadius: '6px 6px 2px 2px',
                    bgcolor: i === 1 ? t.brand : mix(55),
                  }}
                />
                <Box component="span" sx={{ fontSize: 11, color: t.muted }}>
                  {ins.days[i]}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            flex: '1 1 240px',
            border: `1px solid ${t.border}`,
            borderRadius: '12px',
            p: 1.75,
          }}
        >
          <Box sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
            {ins.heatmapTitle}
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: 0.5,
            }}
          >
            {DAY_WEIGHTS.flatMap((day, d) =>
              HOUR_WEIGHTS.map((hour, j) => (
                <Box
                  key={`${d}-${j}`}
                  sx={{
                    aspectRatio: '1',
                    borderRadius: '4px',
                    bgcolor: mix(Math.round(hour * day * 100 * p)),
                    outline:
                      j >= 1 && j <= 3 ? `1.5px solid ${t.brandText}` : 'none',
                    outlineOffset: '1px',
                    transition: 'background-color 400ms ease-out',
                  }}
                />
              )),
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              mt: 1.25,
              fontSize: 12,
              color: t.muted,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 10,
                height: 10,
                borderRadius: '3px',
                outline: `1.5px solid ${t.brandText}`,
                outlineOffset: '1px',
              }}
            />
            {ins.goldenLegend}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
