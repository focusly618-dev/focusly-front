import { useTranslation } from 'react-i18next';
import { Box, alpha } from '@mui/material';
import { keyframes } from '@emotion/react';
import {
  AutoAwesome as SparkleIcon,
  Search as SearchIcon,
  Flag as FlagIcon,
  Schedule as ClockIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { Bar, Check, MockWindow, Pill } from './primitives';
import { ACCENTS, enter, growX, pulse } from './motion';

const PRIORITY = [ACCENTS.rose, ACCENTS.amber, ACCENTS.green, ACCENTS.amber];

/** A task row: checkbox, title, priority dot and duration. */
const TaskRow = ({
  i,
  done,
  highlight,
  w = '55%',
}: {
  i: number;
  done?: boolean;
  highlight?: boolean;
  w?: string;
}) => (
  <Box
    sx={(theme) => ({
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      p: '6px 8px',
      borderRadius: '7px',
      border: `1px solid ${highlight ? alpha(theme.palette.primary.main, 0.45) : theme.palette.divider}`,
      bgcolor: highlight
        ? alpha(theme.palette.primary.main, 0.06)
        : 'background.paper',
      ...enter(i),
    })}
  >
    <Check done={done} />
    <Bar w={w} h={5} tone={done ? 0.06 : 0.14} />
    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: PRIORITY[i % PRIORITY.length],
        }}
      />
      <Box sx={{ fontSize: 10, color: 'text.secondary', fontWeight: 600 }}>
        {['30m', '1h', '15m', '2h'][i % 4]}
      </Box>
    </Box>
  </Box>
);

export const TasksListsFrame = () => {
  const { t } = useTranslation();
  return (
    <MockWindow
      bodySx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}
    >
      <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
        <Pill>{t('nav.inbox', 'Inbox')}</Pill>
        <Pill active>{t('nav.today', 'Today')}</Pill>
        <Pill>{t('nav.upcoming', 'Upcoming')}</Pill>
      </Box>
      <TaskRow i={0} />
      <TaskRow i={1} w="45%" />
      <TaskRow i={2} done w="60%" />
      <TaskRow i={3} w="40%" />
    </MockWindow>
  );
};

export const TasksCreateFrame = () => {
  const { t } = useTranslation();
  return (
    <MockWindow bodySx={{ display: 'grid', placeItems: 'center' }}>
      <Box
        sx={(theme) => ({
          width: '78%',
          p: 1.5,
          borderRadius: '10px',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 8px 24px ${alpha('#000', 0.12)}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        })}
      >
        {/* The title being typed */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Bar
            w="62%"
            h={8}
            tone={0.3}
            sx={{
              transformOrigin: 'left',
              animation: `${growX} 1.6s steps(14) infinite alternate`,
            }}
          />
          <Box
            sx={{
              width: 1.5,
              height: 12,
              bgcolor: 'primary.main',
              animation: `${pulse} 1s step-end infinite`,
            }}
          />
        </Box>
        <Bar w="85%" h={5} />
        <Box
          sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', ...enter(1, 0.3) }}
        >
          <Pill active color={ACCENTS.rose}>
            <FlagIcon />
            {t('tasks.priority.high', 'High')}
          </Pill>
          <Pill>
            <ClockIcon />
            1h
          </Pill>
          <Pill>
            <CalendarIcon />
            <Bar w={26} h={4} />
          </Pill>
        </Box>
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', ...enter(2, 0.3) }}
        >
          <Box
            sx={{
              px: 1.25,
              py: 0.5,
              borderRadius: '6px',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontSize: 10.5,
              fontWeight: 700,
            }}
          >
            {t('tasks.createTask', 'Create task')}
          </Box>
        </Box>
      </Box>
    </MockWindow>
  );
};

const crossColumn = keyframes`
  0%, 20% { transform: translate(0, 0); }
  60%, 100% { transform: translate(calc(100% + 8px), 28px); }
`;

export const TasksBoardFrame = () => {
  const { t } = useTranslation();
  const columns = [
    t('tasks.status.todo', 'To Do'),
    t('tasks.status.review', 'In Review'),
    t('tasks.status.done', 'Done'),
  ];
  return (
    <MockWindow
      bodySx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1,
      }}
    >
      {columns.map((title, col) => (
        <Box
          key={title}
          sx={(theme) => ({
            p: 0.75,
            borderRadius: '8px',
            bgcolor: alpha(theme.palette.text.primary, 0.03),
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
            position: 'relative',
          })}
        >
          <Box
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: 'text.secondary',
              px: 0.25,
            }}
          >
            {title}
          </Box>
          {Array.from({ length: col === 1 ? 1 : 2 }, (_, i) => (
            <Box
              key={i}
              sx={(theme) => ({
                p: 0.75,
                borderRadius: '6px',
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                ...(col === 0 && i === 0
                  ? {
                      zIndex: 2,
                      boxShadow: `0 6px 14px ${alpha('#000', 0.15)}`,
                      animation: `${crossColumn} 3s ease-in-out infinite alternate`,
                    }
                  : {}),
              })}
            >
              <Bar w="80%" h={5} tone={0.16} />
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: PRIORITY[(col + i) % 4],
                  }}
                />
                <Bar w="40%" h={4} />
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </MockWindow>
  );
};

export const TasksFilterFrame = () => {
  const { t } = useTranslation();
  return (
    <MockWindow
      bodySx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}
    >
      <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
        <Box
          sx={(theme) => ({
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            height: 26,
            px: 1,
            borderRadius: '7px',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          })}
        >
          <SearchIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Bar
            w="30%"
            h={6}
            tone={0.3}
            sx={{
              transformOrigin: 'left',
              animation: `${growX} 1.2s steps(8) forwards`,
            }}
          />
        </Box>
        <Pill active>{t('tasks.controls.priority', 'Priority')}</Pill>
        <Pill>{t('tasks.controls.assignees', 'Assignees')}</Pill>
      </Box>
      <TaskRow i={0} highlight />
      <Box
        sx={{
          opacity: 0.4,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
        }}
      >
        <TaskRow i={1} w="45%" />
        <TaskRow i={2} w="35%" />
      </Box>
    </MockWindow>
  );
};

const shuffle = (from: number, to: number) => keyframes`
  0%, 25% { transform: translateY(${from}px); }
  65%, 100% { transform: translateY(${to}px); }
`;

export const TasksAiFrame = () => {
  const { t } = useTranslation();
  // Rows trade places, as the list gets reordered by importance
  const moves = [shuffle(0, 70), shuffle(0, -35), shuffle(0, -35)];
  return (
    <MockWindow
      bodySx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.25 }}>
        <Pill
          active
          color={ACCENTS.violet}
          sx={{ animation: `${pulse} 2s ease-in-out infinite` }}
        >
          <SparkleIcon />
          {t('tasks.header.aiOrganize', 'AI Organize')}
        </Pill>
      </Box>
      {[2, 0, 1].map((p, i) => (
        <Box
          key={i}
          sx={{ animation: `${moves[i]} 3.4s ease-in-out infinite alternate` }}
        >
          <TaskRow i={p} w={['50%', '42%', '58%'][i]} />
        </Box>
      ))}
    </MockWindow>
  );
};
