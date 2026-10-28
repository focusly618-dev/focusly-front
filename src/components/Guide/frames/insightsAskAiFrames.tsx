import { useTranslation } from 'react-i18next';
import { Box, alpha } from '@mui/material';
import { keyframes } from '@emotion/react';
import {
  AutoAwesome as SparkleIcon,
  Timer as TimerIcon,
  TaskAlt as TaskIcon,
  TrendingUp as TrendIcon,
  Bolt as EnergyIcon,
  FileDownload as ExportIcon,
  Psychology as StrategyIcon,
  Insights as AnalyzeIcon,
  EventAvailable as PlanIcon,
  Lightbulb as IdeaIcon,
} from '@mui/icons-material';
import { Bar, Check, MockWindow, Pill } from './primitives';
import { ACCENTS, enter, pulse } from './motion';

// ── Insights ────────────────────────────────────────────────────────────────

export const InsightsStatsFrame = () => {
  const { t } = useTranslation();
  const stats = [
    [TimerIcon, '6.5h', ACCENTS.blue],
    [TaskIcon, '18', ACCENTS.green],
    [EnergyIcon, '78%', ACCENTS.amber],
    [TrendIcon, '64%', ACCENTS.violet],
  ] as const;
  return (
    <MockWindow bodySx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Pill>{t('insightsHeader.periods.daily', 'Daily')}</Pill>
        <Pill active>{t('insightsHeader.periods.weekly', 'Weekly')}</Pill>
        <Pill>{t('insightsHeader.periods.monthly', 'Monthly')}</Pill>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1,
          flex: 1,
        }}
      >
        {stats.map(([Icon, value, color], i) => (
          <Box
            key={value}
            sx={(theme) => ({
              p: 1,
              borderRadius: '8px',
              border: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...enter(i),
            })}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '6px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: alpha(color, 0.14),
                }}
              >
                <Icon sx={{ fontSize: 13, color }} />
              </Box>
              <Bar w="45%" h={5} />
            </Box>
            <Box
              sx={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              {value}
            </Box>
          </Box>
        ))}
      </Box>
    </MockWindow>
  );
};

const drawLine = keyframes`
  from { stroke-dashoffset: 400; }
  to { stroke-dashoffset: 0; }
`;

export const InsightsTrendsFrame = () => (
  <MockWindow bodySx={{ display: 'flex', gap: 1.25, alignItems: 'stretch' }}>
    <Box
      sx={(theme) => ({
        flex: 1.6,
        borderRadius: '8px',
        border: `1px solid ${theme.palette.divider}`,
        p: 1,
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <Bar w="40%" h={5} tone={0.25} />
      <Box
        component="svg"
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
        sx={{ flex: 1, width: '100%', mt: 1, color: 'primary.main' }}
      >
        <path
          d="M0 80 L30 65 L60 70 L90 45 L120 50 L150 28 L200 18 L200 100 L0 100 Z"
          fill="currentColor"
          fillOpacity=".1"
        />
        {/* The trend line draws itself in */}
        <Box
          component="path"
          d="M0 80 L30 65 L60 70 L90 45 L120 50 L150 28 L200 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeDasharray="400"
          sx={{ animation: `${drawLine} 1.6s ease-out forwards` }}
        />
      </Box>
    </Box>
    <Box
      sx={(theme) => ({
        flex: 1,
        borderRadius: '8px',
        border: `1px solid ${theme.palette.divider}`,
        p: 1,
        display: 'grid',
        placeItems: 'center',
      })}
    >
      <Box component="svg" viewBox="0 0 42 42" sx={{ width: '75%' }}>
        {[
          [ACCENTS.blue, 45, 0],
          [ACCENTS.violet, 30, 45],
          [ACCENTS.amber, 25, 75],
        ].map(([color, pct, offset]) => (
          <circle
            key={color as string}
            cx="21"
            cy="21"
            r="15.9"
            fill="none"
            stroke={color as string}
            strokeWidth="6"
            strokeDasharray={`${pct} ${100 - (pct as number)}`}
            strokeDashoffset={25 - (offset as number)}
          />
        ))}
      </Box>
    </Box>
  </MockWindow>
);

/** Deterministic "activity" levels for the heatmap. */
const level = (i: number) => ((i * 37 + (i % 7) * 11) % 100) / 100;

export const InsightsActivityFrame = () => (
  <MockWindow bodySx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(18, 1fr)',
        gap: '3px',
      }}
    >
      {Array.from({ length: 18 * 5 }, (_, i) => (
        <Box
          key={i}
          sx={(theme) => ({
            aspectRatio: '1',
            borderRadius: '2px',
            bgcolor:
              level(i) < 0.2
                ? alpha(theme.palette.text.primary, 0.06)
                : alpha(theme.palette.primary.main, 0.2 + level(i) * 0.7),
          })}
        />
      ))}
    </Box>
    {/* Golden hours: when you focus best */}
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
        px: 0.5,
      }}
    >
      {[20, 35, 55, 90, 100, 70, 45, 30, 50, 40, 25, 15].map((h, i) => (
        <Box
          key={i}
          sx={(theme) => ({
            flex: 1,
            height: `${h}%`,
            borderRadius: '3px 3px 0 0',
            bgcolor:
              h >= 90 ? ACCENTS.amber : alpha(theme.palette.text.primary, 0.12),
            ...enter(i, 0.2),
          })}
        />
      ))}
    </Box>
  </MockWindow>
);

export const InsightsReportFrame = () => {
  const { t } = useTranslation();
  return (
    <MockWindow
      bodySx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        alignItems: 'center',
      }}
    >
      <Box sx={{ alignSelf: 'flex-end', display: 'flex', gap: 0.5 }}>
        <Pill>
          <ExportIcon />
          {t('insightsHeader.export', 'Export')}
        </Pill>
        <Pill active sx={{ animation: `${pulse} 2s ease-in-out infinite` }}>
          {t('insightsHeader.createReport', 'Create Report')}
        </Pill>
      </Box>
      <Box
        sx={(theme) => ({
          width: '52%',
          flex: 1,
          p: 1,
          borderRadius: '6px',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 10px 22px ${alpha('#000', 0.12)}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.6,
          ...enter(0, 0.3),
        })}
      >
        <Bar w="60%" h={7} tone={0.3} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '3px',
            height: 34,
            my: 0.5,
          }}
        >
          {[40, 65, 50, 85, 70, 95].map((h, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                height: `${h}%`,
                borderRadius: '2px',
                bgcolor: alpha(ACCENTS.blue, 0.5),
              }}
            />
          ))}
        </Box>
        {['90%', '75%', '85%'].map((w, i) => (
          <Bar key={i} w={w} h={4} />
        ))}
      </Box>
    </MockWindow>
  );
};

// ── Ask AI ──────────────────────────────────────────────────────────────────

const typing = keyframes`
  0%, 60%, 100% { opacity: 0.25; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-2px); }
`;

const Avatar = () => (
  <Box
    sx={(theme) => ({
      width: 20,
      height: 20,
      flexShrink: 0,
      borderRadius: '50%',
      display: 'grid',
      placeItems: 'center',
      bgcolor: alpha(theme.palette.primary.main, 0.14),
      color: 'primary.main',
    })}
  >
    <SparkleIcon sx={{ fontSize: 12 }} />
  </Box>
);

const Bubble = ({
  mine,
  children,
  i,
}: {
  mine?: boolean;
  children: React.ReactNode;
  i: number;
}) => (
  <Box
    sx={{
      display: 'flex',
      gap: 0.75,
      justifyContent: mine ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      ...enter(i),
    }}
  >
    {!mine && <Avatar />}
    <Box
      sx={(theme) => ({
        maxWidth: '72%',
        p: 1,
        borderRadius: mine ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
        bgcolor: mine
          ? alpha(theme.palette.primary.main, 0.14)
          : alpha(theme.palette.text.primary, 0.05),
        display: 'flex',
        flexDirection: 'column',
        gap: 0.6,
      })}
    >
      {children}
    </Box>
  </Box>
);

export const AskChatFrame = () => (
  <MockWindow
    bodySx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      justifyContent: 'flex-end',
    }}
  >
    <Bubble mine i={0}>
      <Bar w={120} h={5} tone={0.22} />
    </Bubble>
    <Bubble i={1}>
      <Bar w={170} h={5} tone={0.16} />
      <Bar w={140} h={5} tone={0.16} />
      <Bar w={90} h={5} tone={0.16} />
    </Bubble>
    <Bubble mine i={2}>
      <Bar w={90} h={5} tone={0.22} />
    </Bubble>
    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', ...enter(3) }}>
      <Avatar />
      <Box sx={{ display: 'flex', gap: '3px' }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              bgcolor: 'text.secondary',
              animation: `${typing} 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </Box>
    </Box>
  </MockWindow>
);

export const AskSuggestionsFrame = () => (
  <MockWindow
    bodySx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1.25,
    }}
  >
    <Avatar />
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 1,
        width: '88%',
      }}
    >
      {[
        [StrategyIcon, ACCENTS.violet],
        [AnalyzeIcon, ACCENTS.blue],
        [PlanIcon, ACCENTS.green],
        [IdeaIcon, ACCENTS.amber],
      ].map(([Icon, color], i) => {
        const I = Icon as typeof StrategyIcon;
        return (
          <Box
            key={i}
            sx={(theme) => ({
              p: 1,
              borderRadius: '8px',
              border: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              ...enter(i),
            })}
          >
            <I sx={{ fontSize: 16, color: color as string }} />
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Bar w="80%" h={5} tone={0.2} />
              <Bar w="55%" h={4} />
            </Box>
          </Box>
        );
      })}
    </Box>
  </MockWindow>
);

export const AskPlanFrame = () => {
  const { t } = useTranslation();
  return (
    <MockWindow bodySx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Bubble mine i={0}>
        <Bar w={130} h={5} tone={0.22} />
      </Bubble>
      <Bubble i={1}>
        <Bar w={150} h={5} tone={0.16} />
        {/* The plan: tasks Lumina proposes to create */}
        <Box
          sx={(theme) => ({
            mt: 0.5,
            p: 0.75,
            borderRadius: '7px',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.6,
            minWidth: 190,
          })}
        >
          {[ACCENTS.rose, ACCENTS.amber, ACCENTS.green].map((c, i) => (
            <Box
              key={c}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                ...enter(i, 0.4),
              }}
            >
              <Check />
              <Bar w="55%" h={5} tone={0.16} />
              <Box
                sx={{
                  ml: 'auto',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: c,
                }}
              />
            </Box>
          ))}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 0.25,
              ...enter(3, 0.4),
            }}
          >
            <Pill active>{t('guide.frames.confirm', 'Confirm')}</Pill>
          </Box>
        </Box>
      </Bubble>
    </MockWindow>
  );
};

export const AskHistoryFrame = () => (
  <MockWindow bodySx={{ display: 'flex', gap: 1.25 }}>
    <Box
      sx={{ width: '36%', display: 'flex', flexDirection: 'column', gap: 0.5 }}
    >
      {[0, 1, 2, 3].map((i) => (
        <Box
          key={i}
          sx={(theme) => ({
            p: '6px 7px',
            borderRadius: '6px',
            bgcolor:
              i === 0 ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            ...enter(i),
          })}
        >
          <Bar w="80%" h={5} tone={i === 0 ? 0.3 : 0.16} />
          <Bar w="45%" h={4} tone={0.07} />
        </Box>
      ))}
    </Box>
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        justifyContent: 'center',
      }}
    >
      <Bubble mine i={1}>
        <Bar w={90} h={5} tone={0.22} />
      </Bubble>
      <Bubble i={2}>
        <Bar w={120} h={5} tone={0.16} />
        <Bar w={80} h={5} tone={0.16} />
      </Bubble>
    </Box>
  </MockWindow>
);
