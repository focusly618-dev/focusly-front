import { useTranslation } from 'react-i18next';
import { Box, alpha } from '@mui/material';
import { keyframes } from '@emotion/react';
import {
  AutoAwesome as SparkleIcon,
  TaskAlt as TaskIcon,
  ShortText as SummaryIcon,
  Spellcheck as GrammarIcon,
  Translate as TranslateIcon,
  Toc as OutlineIcon,
  Hub as GraphIcon,
  BarChart as StatsIcon,
} from '@mui/icons-material';
import { Arrow, Bar, Check, Key, MockWindow } from './primitives';
import { ACCENTS, enter, pulse } from './motion';
import { KEYS, combo } from '../platformKeys';

const mono = '"JetBrains Mono", ui-monospace, monospace';

export const EditorMarkdownFrame = () => {
  const { t } = useTranslation();
  return (
    <MockWindow bodySx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      {/* What you type… */}
      <Box
        sx={(theme) => ({
          flex: 1,
          p: 1.25,
          borderRadius: '8px',
          bgcolor: alpha(theme.palette.text.primary, 0.04),
          fontFamily: mono,
          fontSize: 11,
          lineHeight: 1.9,
          color: 'text.secondary',
          whiteSpace: 'pre',
        })}
      >
        {t(
          'guide.frames.markdownSample',
          '## Plan\n- [ ] Review\n- [x] Design\n**Key**',
        )}
      </Box>
      <Arrow />
      {/* …and how it reads */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          ...enter(0, 0.3),
        }}
      >
        <Bar w="55%" h={10} tone={0.4} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            sx={{
              width: 11,
              height: 11,
              borderRadius: '3px',
              border: '1.5px solid',
              borderColor: 'text.disabled',
            }}
          />
          <Bar w="50%" h={6} tone={0.18} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            sx={{
              width: 11,
              height: 11,
              borderRadius: '3px',
              bgcolor: 'primary.main',
            }}
          />
          <Bar w="45%" h={6} tone={0.08} />
        </Box>
        <Bar w="35%" h={7} tone={0.45} />
      </Box>
    </MockWindow>
  );
};

/** A labeled tile for one kind of special block. */
const Tile = ({
  i,
  label,
  children,
}: {
  i: number;
  label: string;
  children: React.ReactNode;
}) => (
  <Box
    sx={(theme) => ({
      borderRadius: '8px',
      border: `1px solid ${theme.palette.divider}`,
      p: 0.75,
      display: 'flex',
      flexDirection: 'column',
      gap: 0.5,
      minHeight: 0,
      ...enter(i),
    })}
  >
    <Box sx={{ flex: 1, minHeight: 0, display: 'grid', placeItems: 'center' }}>
      {children}
    </Box>
    <Box
      sx={{
        fontSize: 9.5,
        fontWeight: 700,
        color: 'text.secondary',
        textAlign: 'center',
        fontFamily: mono,
      }}
    >
      {label}
    </Box>
  </Box>
);

export const EditorBlocksFrame = () => (
  <MockWindow
    bodySx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(2, 1fr)',
      gap: 0.75,
    }}
  >
    <Tile i={0} label="```js">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.4,
          width: '80%',
        }}
      >
        <Bar w="70%" h={4} color={ACCENTS.violet} tone={0.6} />
        <Bar w="90%" h={4} color={ACCENTS.sky} tone={0.6} />
        <Bar w="50%" h={4} color={ACCENTS.amber} tone={0.6} />
      </Box>
    </Tile>
    <Tile i={1} label="```mermaid">
      <Box
        component="svg"
        viewBox="0 0 60 40"
        sx={{ width: '80%', height: '100%' }}
      >
        <rect
          x="20"
          y="2"
          width="20"
          height="10"
          rx="2"
          fill="none"
          stroke="currentColor"
          opacity=".6"
        />
        <rect
          x="4"
          y="28"
          width="20"
          height="10"
          rx="2"
          fill="none"
          stroke="currentColor"
          opacity=".6"
        />
        <rect
          x="36"
          y="28"
          width="20"
          height="10"
          rx="2"
          fill="none"
          stroke="currentColor"
          opacity=".6"
        />
        <path
          d="M30 12v8M30 20H14v8M30 20h16v8"
          fill="none"
          stroke="currentColor"
          opacity=".45"
        />
      </Box>
    </Tile>
    <Tile i={2} label="$$ math $$">
      <Box
        sx={{
          fontFamily: 'KaTeX_Main, "Times New Roman", serif',
          fontSize: 15,
          fontStyle: 'italic',
        }}
      >
        ∫ x² dx
      </Box>
    </Tile>
    <Tile i={3} label="| table |">
      <Box
        sx={(theme) => ({
          width: '80%',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          border: `1px solid ${theme.palette.divider}`,
          '& > div': {
            height: 8,
            borderRight: `1px solid ${theme.palette.divider}`,
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          '& > div:nth-of-type(-n+3)': {
            bgcolor: alpha(theme.palette.text.primary, 0.08),
          },
        })}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <Box key={i} />
        ))}
      </Box>
    </Tile>
    <Tile i={4} label="```geojson">
      <Box
        component="svg"
        viewBox="0 0 60 40"
        sx={{ width: '80%', height: '100%', color: 'primary.main' }}
      >
        <path
          d="M10 30 L22 8 L44 12 L50 30 Z"
          fill="currentColor"
          fillOpacity=".18"
          stroke="currentColor"
        />
        <circle cx="30" cy="20" r="2.5" fill="currentColor" />
      </Box>
    </Tile>
    <Tile i={5} label="<details>">
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '80%' }}
      >
        <Box sx={{ fontSize: 10, color: 'text.secondary' }}>▸</Box>
        <Bar w="75%" h={5} tone={0.25} />
      </Box>
    </Tile>
  </MockWindow>
);

export const EditorAiFrame = () => (
  <MockWindow>
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 0.9, width: '62%' }}
    >
      <Bar w="50%" h={9} tone={0.35} />
      <Bar w="95%" h={5} />
      {/* The selected paragraph */}
      <Box
        sx={(theme) => ({
          p: '4px',
          borderRadius: '4px',
          bgcolor: alpha(theme.palette.primary.main, 0.16),
          display: 'flex',
          flexDirection: 'column',
          gap: 0.6,
        })}
      >
        <Bar w="100%" h={5} tone={0.2} />
        <Bar w="70%" h={5} tone={0.2} />
      </Box>
      <Bar w="85%" h={5} />
      <Bar w="60%" h={5} />
    </Box>
    {/* Right-click menu */}
    <Box
      sx={(theme) => ({
        position: 'absolute',
        top: 34,
        left: '50%',
        width: 150,
        p: 0.5,
        borderRadius: '8px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        boxShadow: `0 10px 24px ${alpha('#000', 0.18)}`,
        ...enter(0, 0.4),
      })}
    >
      {[
        [TaskIcon, ACCENTS.violet],
        [SummaryIcon, ACCENTS.blue],
        [GrammarIcon, ACCENTS.rose],
        [TranslateIcon, ACCENTS.sky],
      ].map(([Icon, color], i) => {
        const I = Icon as typeof TaskIcon;
        return (
          <Box
            key={i}
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              p: '4px 6px',
              borderRadius: '5px',
              bgcolor:
                i === 0
                  ? alpha(theme.palette.text.primary, 0.05)
                  : 'transparent',
            })}
          >
            <I sx={{ fontSize: 13, color: color as string }} />
            <Bar w={['70%', '55%', '65%', '50%'][i]} h={5} tone={0.16} />
          </Box>
        );
      })}
    </Box>
    {/* Lumina, a keystroke away */}
    <Box
      sx={(theme) => ({
        position: 'absolute',
        right: 12,
        bottom: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1,
        py: 0.5,
        borderRadius: '999px',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
        color: 'primary.main',
        fontSize: 11,
        fontWeight: 700,
        animation: `${pulse} 2.2s ease-in-out infinite`,
      })}
    >
      <SparkleIcon sx={{ fontSize: 13 }} />
      Lumina
      <Box sx={{ transform: 'scale(0.75)', transformOrigin: 'right' }}>
        <Key>{combo(KEYS.mod, 'J')}</Key>
      </Box>
    </Box>
  </MockWindow>
);

const draw = keyframes`
  from { stroke-dashoffset: 120; }
  to { stroke-dashoffset: 0; }
`;

export const EditorCanvasFrame = () => (
  <MockWindow bodySx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <Bar w="60%" h={6} />
      {/* The canvas, as a card in the note */}
      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          p: 0.75,
          borderRadius: '8px',
          border: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Box
          sx={{
            width: 22,
            height: 22,
            borderRadius: '6px',
            bgcolor: alpha(ACCENTS.sky, 0.14),
            display: 'grid',
            placeItems: 'center',
            fontSize: 12,
          }}
        >
          🧠
        </Box>
        <Bar w="40%" h={5} tone={0.25} />
        <Box
          sx={{
            ml: 'auto',
            px: 0.75,
            py: 0.25,
            borderRadius: '5px',
            bgcolor: alpha(ACCENTS.sky, 0.14),
            color: ACCENTS.sky,
            fontSize: 9,
            fontWeight: 700,
          }}
        >
          ›
        </Box>
      </Box>
      <Bar w="85%" h={5} />
    </Box>
    <Arrow />
    {/* …and the drawing it opens */}
    <Box
      sx={(theme) => ({
        flex: 1.1,
        alignSelf: 'stretch',
        borderRadius: '8px',
        border: `1px solid ${theme.palette.divider}`,
        backgroundImage: `radial-gradient(${alpha(theme.palette.text.primary, 0.12)} 1px, transparent 1px)`,
        backgroundSize: '12px 12px',
        display: 'grid',
        placeItems: 'center',
      })}
    >
      <Box
        component="svg"
        viewBox="0 0 120 80"
        sx={{ width: '85%', color: 'text.primary' }}
      >
        {[
          <rect key="a" x="8" y="10" width="36" height="22" rx="4" />,
          <ellipse key="b" cx="92" cy="22" rx="20" ry="12" />,
          <path key="c" d="M44 21 C60 21 60 22 72 22" />,
          <rect key="d" x="40" y="52" width="40" height="20" rx="4" />,
          <path key="e" d="M26 32 C26 46 40 50 40 60" />,
        ].map((shape, i) => (
          <g
            key={i}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.6}
            strokeWidth={1.4}
            strokeDasharray={120}
            style={{
              animation: `${draw} 1.2s ease-out ${0.2 + i * 0.25}s both`,
            }}
          >
            {shape}
          </g>
        ))}
      </Box>
    </Box>
  </MockWindow>
);

export const EditorSidebarFrame = () => (
  <MockWindow bodySx={{ display: 'flex', gap: 1.25 }}>
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <Bar w="50%" h={9} tone={0.35} />
      {['90%', '80%', '85%'].map((w, i) => (
        <Bar key={i} w={w} h={5} />
      ))}
      <Bar w="40%" h={7} tone={0.28} sx={{ mt: 0.5 }} />
      {['75%', '88%'].map((w, i) => (
        <Bar key={i} w={w} h={5} />
      ))}
    </Box>
    <Box
      sx={(theme) => ({
        width: '44%',
        borderRadius: '8px',
        border: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      })}
    >
      <Box
        sx={{
          display: 'flex',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {[OutlineIcon, GraphIcon, StatsIcon].map((Icon, i) => (
          <Box
            key={i}
            sx={(theme) => ({
              flex: 1,
              py: 0.5,
              display: 'grid',
              placeItems: 'center',
              color: i === 1 ? 'primary.main' : 'text.disabled',
              borderBottom:
                i === 1
                  ? `2px solid ${theme.palette.primary.main}`
                  : '2px solid transparent',
            })}
          >
            <Icon sx={{ fontSize: 14 }} />
          </Box>
        ))}
      </Box>
      {/* The note's headings as a small map */}
      <Box
        component="svg"
        viewBox="0 0 100 80"
        sx={{ flex: 1, width: '100%', color: 'text.primary' }}
      >
        <g fill="none" stroke="currentColor" strokeOpacity={0.22}>
          <path d="M26 40 C36 40 36 18 46 18" />
          <path d="M26 40 C36 40 36 40 46 40" />
          <path d="M26 40 C36 40 36 62 46 62" />
          <path d="M74 18 C80 18 80 12 84 12" />
          <path d="M74 18 C80 18 80 26 84 26" />
        </g>
        {[
          [6, 34, 20, true],
          [46, 13, 28],
          [46, 35, 28],
          [46, 57, 28],
          [84, 8, 12],
          [84, 22, 12],
        ].map(([x, y, w, root], i) => (
          <Box component="g" key={i} sx={enter(i)}>
            <rect
              x={x as number}
              y={y as number}
              width={w as number}
              height={10}
              rx={5}
              fill="none"
              stroke={root ? ACCENTS.green : 'currentColor'}
              strokeOpacity={root ? 0.8 : 0.3}
            />
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 0.75,
          pb: 0.75,
        }}
      >
        <Check done color={ACCENTS.green} />
        <Bar w="60%" h={4} />
      </Box>
    </Box>
  </MockWindow>
);
