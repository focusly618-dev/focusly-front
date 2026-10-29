import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, alpha } from '@mui/material';
import { keyframes } from '@emotion/react';
import { AutoAwesome as SparkleIcon } from '@mui/icons-material';
import {
  Bar,
  Block,
  Check,
  Key,
  MockWindow,
  Pill,
  Pointer,
} from './primitives';
import { ACCENTS, enter, pulse } from './motion';

const DAYS = 5;
const HOURS = 6;

/** A week grid: day headers, hour lines, and whatever blocks go on it. */
const WeekGrid = ({ children }: { children?: React.ReactNode }) => (
  <Box
    sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 0.75 }}
  >
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${DAYS}, 1fr)`,
        gap: 0.75,
      }}
    >
      {Array.from({ length: DAYS }, (_, i) => (
        <Bar
          key={i}
          w="45%"
          h={5}
          tone={i === 1 ? 0.35 : 0.12}
          sx={{ mx: 'auto' }}
        />
      ))}
    </Box>
    <Box
      sx={(theme) => ({
        flex: 1,
        position: 'relative',
        borderRadius: '6px',
        backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.06)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.06)} 1px, transparent 1px)`,
        backgroundSize: `${100 / DAYS}% ${100 / HOURS}%`,
        border: `1px solid ${theme.palette.divider}`,
      })}
    >
      {children}
    </Box>
  </Box>
);

/** Where a block sits on the week grid: day column and hour rows. */
const at = (day: number, fromHour: number, hours: number) => ({
  position: 'absolute' as const,
  left: `calc(${(day * 100) / DAYS}% + 3px)`,
  width: `calc(${100 / DAYS}% - 6px)`,
  top: `calc(${(fromHour * 100) / HOURS}% + 2px)`,
  height: `calc(${(hours * 100) / HOURS}% - 4px)`,
});

const WEEK = [
  { day: 0, from: 0.3, h: 1.6, c: ACCENTS.blue },
  { day: 1, from: 1, h: 2, c: ACCENTS.violet },
  { day: 2, from: 0.2, h: 1.2, c: ACCENTS.green },
  { day: 2, from: 3, h: 1.5, c: ACCENTS.amber },
  { day: 3, from: 2, h: 2.4, c: ACCENTS.blue },
  { day: 4, from: 0.6, h: 1.4, c: ACCENTS.rose },
];

const ViewSwitch = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
      <Pill>{t('calendar.day', 'Day')}</Pill>
      <Pill active>{t('calendar.week', 'Week')}</Pill>
      <Pill>{t('calendar.month', 'Month')}</Pill>
    </Box>
  );
};

export const CalendarOverviewFrame = () => (
  <MockWindow bodySx={{ display: 'flex', flexDirection: 'column' }}>
    <ViewSwitch />
    <Box sx={{ flex: 1, minHeight: 0 }}>
      <WeekGrid>
        {WEEK.map((b, i) => (
          <Block
            key={i}
            color={b.c}
            lines={2}
            sx={{ ...at(b.day, b.from, b.h), ...enter(i) }}
          />
        ))}
      </WeekGrid>
    </Box>
  </MockWindow>
);

const moveRight = keyframes`
  0%, 15% { transform: translateX(0); }
  55%, 100% { transform: translateX(calc(100% + 6px)); }
`;
const stretch = keyframes`
  0%, 55% { height: calc(${(1.4 * 100) / HOURS}% - 4px); }
  85%, 100% { height: calc(${(2.4 * 100) / HOURS}% - 4px); }
`;

export const CalendarBlocksFrame = () => (
  <MockWindow>
    <WeekGrid>
      <Block color={ACCENTS.green} sx={at(0, 3.4, 1.4)} />
      <Block color={ACCENTS.amber} sx={at(3, 0.4, 1.2)} />
      {/* Dragged a day over, then stretched */}
      <Box
        sx={{
          ...at(1, 1, 1.4),
          animation: `${moveRight} 3.2s ease-in-out infinite alternate, ${stretch} 3.2s ease-in-out infinite alternate`,
        }}
      >
        <Block
          color={ACCENTS.blue}
          lines={2}
          sx={{
            height: '100%',
            boxShadow: `0 6px 16px ${alpha(ACCENTS.blue, 0.35)}`,
          }}
        />
        <Pointer sx={{ right: 6, bottom: -6 }} />
      </Box>
      {/* A free slot: click to create */}
      <Box
        sx={(theme) => ({
          ...at(4, 3, 1.3),
          borderRadius: '5px',
          border: `1.5px dashed ${alpha(theme.palette.primary.main, 0.6)}`,
          display: 'grid',
          placeItems: 'center',
          color: 'primary.main',
          fontWeight: 700,
          animation: `${pulse} 1.8s ease-in-out infinite`,
        })}
      >
        +
      </Box>
    </WeekGrid>
  </MockWindow>
);

const slideIn = keyframes`
  0%, 20% { transform: translate(0, 0); opacity: 1; }
  70% { transform: translate(150%, 30%); opacity: 1; }
  100% { transform: translate(150%, 30%); opacity: 0; }
`;

export const CalendarAwaitedFrame = () => (
  <MockWindow bodySx={{ display: 'flex', gap: 1.25 }}>
    <Box
      sx={{
        width: '36%',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.75,
        p: 1,
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
      }}
    >
      <Bar w="60%" h={6} tone={0.3} sx={{ mb: 0.5 }} />
      {[ACCENTS.rose, ACCENTS.amber, ACCENTS.green, ACCENTS.blue].map(
        (c, i) => (
          <Box
            key={c}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              p: '5px 6px',
              borderRadius: '6px',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              ...(i === 0
                ? { animation: `${slideIn} 3s ease-in-out infinite`, zIndex: 2 }
                : enter(i)),
            }}
          >
            <Check />
            <Bar w="55%" h={5} />
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
        ),
      )}
    </Box>
    <Box sx={{ flex: 1 }}>
      <WeekGrid>
        <Block color={ACCENTS.violet} sx={at(0, 0.5, 1.5)} />
        <Block color={ACCENTS.blue} sx={at(3, 3, 1.6)} />
      </WeekGrid>
    </Box>
  </MockWindow>
);

export const CalendarAiFrame = () => {
  const { t } = useTranslation();
  return (
    <MockWindow bodySx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Pill active sx={{ animation: `${pulse} 2s ease-in-out infinite` }}>
          <SparkleIcon />
          {t('calendar.optimizeSchedule', 'Optimize Schedule')}
        </Pill>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <WeekGrid>
          <Block color={ACCENTS.blue} sx={at(0, 0.3, 1.2)} />
          <Block color={ACCENTS.blue} sx={at(3, 3.4, 1.2)} />
          {/* The draft Lumina proposes, before it's confirmed */}
          {[
            [1, 0.5, 1.4],
            [2, 2.2, 1.6],
            [4, 1, 1.3],
            [0, 3, 1.4],
          ].map(([day, from, h], i) => (
            <Block
              key={i}
              color={ACCENTS.violet}
              dashed
              sx={{ ...at(day, from, h), ...enter(i, 0.4) }}
            />
          ))}
        </WeekGrid>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 0.75,
          mt: 1,
          ...enter(5, 0.4),
        }}
      >
        <Pill>{t('calendar.discard', 'Discard')}</Pill>
        <Pill active>{t('calendar.confirmSchedule', 'Confirm')}</Pill>
      </Box>
    </MockWindow>
  );
};

/** A list of shortcuts: keys on the left, what they do on the right. */
export const ShortcutsFrame = ({
  rows,
}: {
  rows: { keys: string[]; label: string }[];
}) => (
  <MockWindow
    bodySx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 0.9,
      px: 2.5,
    }}
  >
    {rows.map((row, i) => (
      <Box
        key={row.label}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ...enter(i) }}
      >
        <Box sx={{ display: 'flex', gap: 0.5, minWidth: 128 }}>
          {row.keys.map((key) => (
            <Key key={key}>{key}</Key>
          ))}
        </Box>
        <Box sx={{ fontSize: 12.5, color: 'text.secondary' }}>{row.label}</Box>
      </Box>
    ))}
  </MockWindow>
);
