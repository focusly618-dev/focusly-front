import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  Clear as ClearIcon,
  NearMeOutlined as JumpIcon,
  Search as SearchIcon,
  TocOutlined as TocIcon,
} from '@mui/icons-material';
import { getHeadingPath, type HeadingItem } from './markdownHeadings';

interface NoteOutlineListProps {
  headings: HeadingItem[];
  onJump: (pos: number, label?: string) => void;
  documentTitle?: string;
}

export const NoteOutlineList = ({
  headings,
  onJump,
  documentTitle = 'Documento',
}: NoteOutlineListProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPos, setSelectedPos] = useState<number | null>(() => {
    return headings.length > 0 ? headings[0].pos : null;
  });

  // Effective selected heading: fall back to first if current selected is no longer in headings
  const activeHeading = useMemo(() => {
    if (selectedPos != null) {
      const found = headings.find((h) => h.pos === selectedPos);
      if (found) return found;
    }
    return headings[0] || null;
  }, [headings, selectedPos]);

  // Contextual breadcrumb path for active heading
  const currentPath = useMemo(() => {
    if (!activeHeading) return [];
    return getHeadingPath(headings, activeHeading.pos);
  }, [headings, activeHeading]);

  // Filtered headings by search query
  const filteredHeadings = useMemo(() => {
    if (!searchQuery.trim()) return headings;
    const query = searchQuery.toLowerCase();
    return headings.filter((h) => h.text.toLowerCase().includes(query));
  }, [headings, searchQuery]);

  const handleItemClick = (h: HeadingItem) => {
    setSelectedPos(h.pos);
    onJump(h.pos, h.text);
  };

  if (headings.length === 0) {
    return (
      <Box
        sx={{
          py: 4,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 1.5,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '10px',
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
          }}
        >
          <TocIcon sx={{ fontSize: 24 }} />
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: '13.5px' }}>
          Sin encabezados en esta nota
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontSize: '12px', maxWidth: 260 }}
        >
          Agrega títulos usando sintaxis markdown (<code># Título</code> o{' '}
          <code>## Sección</code>) para construir el índice de navegación.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* Search Input */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
          borderRadius: '10px',
          px: 1.25,
          py: 0.5,
          gap: 1,
        }}
      >
        <SearchIcon
          sx={{ fontSize: 17, color: 'text.secondary', flexShrink: 0 }}
        />
        <InputBase
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar en el índice..."
          fullWidth
          sx={{
            fontSize: '12.5px',
            color: 'text.primary',
            '& input': { p: 0 },
          }}
        />
        {searchQuery && (
          <IconButton
            size="small"
            onClick={() => setSearchQuery('')}
            sx={{ p: 0.25, color: 'text.secondary' }}
          >
            <ClearIcon sx={{ fontSize: 15 }} />
          </IconButton>
        )}
      </Box>

      {/* Contextual Location Card (Shows where the selected heading is in the document hierarchy) */}
      {activeHeading && (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: 'text.secondary',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Ubicación en el documento
            </Typography>
            <Tooltip title="Saltar a esta sección en el editor">
              <Button
                size="small"
                startIcon={<JumpIcon sx={{ fontSize: 13 }} />}
                onClick={() => onJump(activeHeading.pos, activeHeading.text)}
                sx={{
                  textTransform: 'none',
                  fontSize: '11px',
                  fontWeight: 600,
                  py: 0.1,
                  px: 0.75,
                  minWidth: 0,
                  color: 'primary.main',
                }}
              >
                Ir a sección
              </Button>
            </Tooltip>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 0.5,
            }}
          >
            <Chip
              label={documentTitle}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '11px',
                height: 22,
                fontWeight: 500,
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
              }}
            />
            {currentPath.map((item, idx) => {
              const isCurrent = idx === currentPath.length - 1;
              return (
                <Box
                  key={item.pos}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <ChevronRightIcon
                    sx={{ fontSize: 13, color: 'text.disabled' }}
                  />
                  <Chip
                    label={item.text || 'Sin título'}
                    size="small"
                    onClick={() => handleItemClick(item)}
                    sx={{
                      fontSize: '11px',
                      height: 22,
                      fontWeight: isCurrent ? 700 : 500,
                      bgcolor: isCurrent
                        ? isDark
                          ? 'rgba(37, 99, 235, 0.2)'
                          : 'rgba(37, 99, 235, 0.1)'
                        : isDark
                          ? 'rgba(255, 255, 255, 0.05)'
                          : '#ffffff',
                      color: isCurrent ? 'primary.main' : 'text.secondary',
                      border: '1px solid',
                      borderColor: isCurrent ? 'primary.main' : 'divider',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Headings Tree List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {filteredHeadings.length === 0 ? (
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', py: 1.5, textAlign: 'center' }}
          >
            No se encontraron secciones para "{searchQuery}"
          </Typography>
        ) : (
          filteredHeadings.map((h) => {
            const isSelected = activeHeading?.pos === h.pos;
            const indentPadding = Math.max(0, (h.level - 1) * 14);

            return (
              <Box
                key={h.pos}
                onClick={() => handleItemClick(h)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  pl: `${indentPadding + 8}px`,
                  pr: 1.25,
                  py: 0.75,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  bgcolor: isSelected
                    ? isDark
                      ? 'rgba(37, 99, 235, 0.12)'
                      : 'rgba(37, 99, 235, 0.08)'
                    : 'transparent',
                  border: '1px solid',
                  borderColor: isSelected
                    ? isDark
                      ? 'rgba(37, 99, 235, 0.3)'
                      : 'rgba(37, 99, 235, 0.2)'
                    : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isSelected
                      ? isDark
                        ? 'rgba(37, 99, 235, 0.18)'
                        : 'rgba(37, 99, 235, 0.12)'
                      : 'action.hover',
                  },
                }}
              >
                {/* Level badge */}
                <Box
                  sx={{
                    px: 0.6,
                    py: 0.1,
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    bgcolor:
                      h.level === 1
                        ? isDark
                          ? 'rgba(37, 99, 235, 0.25)'
                          : 'rgba(37, 99, 235, 0.12)'
                        : isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : '#e2e8f0',
                    color: h.level === 1 ? 'primary.main' : 'text.secondary',
                    flexShrink: 0,
                  }}
                >
                  H{h.level}
                </Box>

                <Typography
                  noWrap
                  sx={{
                    fontSize: h.level === 1 ? '13px' : '12px',
                    fontWeight: isSelected ? 700 : h.level === 1 ? 600 : 500,
                    color: isSelected
                      ? 'primary.main'
                      : h.level === 1
                        ? 'text.primary'
                        : 'text.secondary',
                  }}
                >
                  {h.text || 'Sin título'}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};
