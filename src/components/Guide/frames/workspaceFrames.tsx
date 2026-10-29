import { useTranslation } from 'react-i18next';
import { Box, alpha } from '@mui/material';
import {
  Folder as FolderIcon,
  Search as SearchIcon,
  ViewModule as GalleryIcon,
  GridView as GridIcon,
  ViewList as ListIcon,
  Link as LinkIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Bar, Check, Key, MockWindow, Pill } from './primitives';
import { ACCENTS, enter, pulse } from './motion';
import { KEYS, combo } from '../platformKeys';

const COVERS = [
  ACCENTS.violet,
  ACCENTS.sky,
  ACCENTS.amber,
  ACCENTS.green,
  ACCENTS.rose,
  ACCENTS.blue,
];
const EMOJI = ['📘', '🚀', '🧠', '📊', '🎯', '📝'];

/** A document card: cover strip, icon and two lines of title. */
const DocCard = ({ i, compact }: { i: number; compact?: boolean }) => (
  <Box
    sx={(theme) => ({
      borderRadius: '8px',
      border: `1px solid ${theme.palette.divider}`,
      overflow: 'hidden',
      bgcolor: 'background.paper',
      ...enter(i),
    })}
  >
    <Box
      sx={{ height: compact ? 12 : 22, bgcolor: alpha(COVERS[i % 6], 0.45) }}
    />
    <Box sx={{ p: 0.75, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Box
        sx={{
          fontSize: compact ? 11 : 13,
          lineHeight: 1,
          mt: compact ? -1 : -1.5,
        }}
      >
        {EMOJI[i % 6]}
      </Box>
      <Bar w="75%" h={5} tone={0.18} />
      <Bar w="50%" h={4} />
    </Box>
  </Box>
);

export const WorkspacesDocsFrame = () => (
  <MockWindow
    bodySx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      alignContent: 'start',
    }}
  >
    {COVERS.map((_, i) => (
      <DocCard key={i} i={i} />
    ))}
  </MockWindow>
);

export const WorkspacesProjectsFrame = () => (
  <MockWindow bodySx={{ display: 'flex', gap: 1.25 }}>
    <Box
      sx={{ width: '38%', display: 'flex', flexDirection: 'column', gap: 0.5 }}
    >
      {[ACCENTS.violet, ACCENTS.amber, ACCENTS.green, ACCENTS.sky].map(
        (c, i) => (
          <Box
            key={c}
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              p: '5px 7px',
              borderRadius: '6px',
              bgcolor:
                i === 0
                  ? alpha(theme.palette.primary.main, 0.08)
                  : 'transparent',
              ...enter(i),
            })}
          >
            <FolderIcon sx={{ fontSize: 15, color: c }} />
            <Bar w="55%" h={5} tone={i === 0 ? 0.3 : 0.14} />
            <Box sx={{ ml: 'auto', fontSize: 10, color: 'text.secondary' }}>
              {[4, 2, 7, 1][i]}
            </Box>
          </Box>
        ),
      )}
    </Box>
    <Box
      sx={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 0.75,
        alignContent: 'start',
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <DocCard key={i} i={i} compact />
      ))}
    </Box>
  </MockWindow>
);

export const WorkspacesCreateFrame = () => {
  const { t } = useTranslation();
  return (
    <MockWindow bodySx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Bar w="30%" h={7} tone={0.3} />
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            height: 22,
            borderRadius: '6px',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            fontSize: 10.5,
            fontWeight: 700,
            boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.18)}`,
            animation: `${pulse} 2s ease-in-out infinite`,
            '& svg': { fontSize: 13 },
          })}
        >
          <AddIcon />
          {t('workspaceLibrary.newWorkspace', 'New workspace')}
        </Box>
      </Box>
      {/* Templates to start from */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          flex: 1,
        }}
      >
        {['📋', '🗓️', '🧪'].map((icon, i) => (
          <Box
            key={icon}
            sx={(theme) => ({
              borderRadius: '8px',
              border: `1px dashed ${theme.palette.divider}`,
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
              ...enter(i, 0.3),
            })}
          >
            <Box sx={{ fontSize: 18 }}>{icon}</Box>
            <Bar w="70%" h={5} tone={0.2} />
            <Bar w="90%" h={4} />
            <Bar w="60%" h={4} />
          </Box>
        ))}
      </Box>
    </MockWindow>
  );
};

export const WorkspacesLinkFrame = () => (
  <MockWindow bodySx={{ display: 'flex', gap: 1.25 }}>
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <Box sx={{ fontSize: 16 }}>🚀</Box>
      <Bar w="55%" h={8} tone={0.3} />
      {['90%', '80%', '86%', '60%', '75%'].map((w, i) => (
        <Bar key={i} w={w} h={5} />
      ))}
    </Box>
    <Box
      sx={(theme) => ({
        width: '42%',
        p: 1,
        borderRadius: '8px',
        border: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.75,
      })}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: 'text.secondary',
        }}
      >
        <LinkIcon sx={{ fontSize: 13 }} />
        <Bar w="50%" h={5} tone={0.25} />
      </Box>
      {[true, false, false].map((done, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            ...enter(i, 0.3),
          }}
        >
          <Check done={done} color={ACCENTS.green} />
          <Bar w="70%" h={5} tone={done ? 0.07 : 0.16} />
        </Box>
      ))}
    </Box>
  </MockWindow>
);

export const WorkspacesFindFrame = () => (
  <MockWindow bodySx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
      <Box
        sx={(theme) => ({
          flex: 1,
          height: 26,
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1,
          borderRadius: '7px',
          border: `1px solid ${theme.palette.divider}`,
        })}
      >
        <SearchIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
        <Bar w="35%" h={5} />
        <Box
          sx={{ ml: 'auto', transform: 'scale(0.8)', transformOrigin: 'right' }}
        >
          <Key>{combo(KEYS.mod, 'K')}</Key>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 0.25 }}>
        <Pill active>
          <GalleryIcon />
        </Pill>
        <Pill>
          <GridIcon />
        </Pill>
        <Pill>
          <ListIcon />
        </Pill>
      </Box>
    </Box>
    <Box
      sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}
    >
      {[0, 1, 2].map((i) => (
        <DocCard key={i} i={i + 2} />
      ))}
    </Box>
  </MockWindow>
);
