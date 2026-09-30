import { useState } from 'react';
import {
  Box,
  Typography,
  Popover,
  Stack,
  MenuItem,
  Tooltip,
  alpha,
} from '@mui/material';
import type { Theme } from '@mui/material';
import {
  getStatusIcon,
  getCategoryIcon,
  STATUS_LIST,
  CATEGORY_LIST,
} from '../TaskIcons';
import {
  PASTEL_COLORS,
  getColorName,
  isColorDark,
} from '../../CreateTaskModal.utils';
import type { TaskStatus } from '@/redux/tasks/task.types';
import { surfaceColor } from '@/context';
import { PriorityBadge, PRIORITY_OPTIONS } from '@/components/ui';

interface TaskPopoversProps {
  // Status
  statusAnchor: HTMLElement | null;
  setStatusAnchor: (el: HTMLElement | null) => void;
  setStatus: (s: TaskStatus) => void;
  // Priority
  priorityAnchor: HTMLElement | null;
  setPriorityAnchor: (el: HTMLElement | null) => void;
  setPriority: (p: string) => void;
  // Category
  categoryAnchor: HTMLElement | null;
  setCategoryAnchor: (el: HTMLElement | null) => void;
  setCategory: (c: string) => void;
  // Color
  colorAnchor: HTMLElement | null;
  setColorAnchor: (el: HTMLElement | null) => void;
  color: string;
  setColor: (c: string) => void;
}

const popoverPaperSx = {
  borderRadius: '12px',
  mt: 1,
  backgroundColor: (theme: Theme) =>
    surfaceColor(
      theme,
      'rgba(26, 31, 43, 0.95)',
      'rgba(42, 42, 44, 0.95)',
      'background.paper',
    ),
  border: '1px solid',
  borderColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'divider',
  color: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '#e0e2e9' : 'text.primary',
  boxShadow: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? '0 10px 30px rgba(0,0,0,0.4)'
      : '0 8px 32px rgba(0,0,0,0.1)',
  backdropFilter: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'blur(16px)' : 'none',
  WebkitBackdropFilter: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'blur(16px)' : 'none',
};

export const TaskPopovers = ({
  statusAnchor,
  setStatusAnchor,
  setStatus,
  priorityAnchor,
  setPriorityAnchor,
  setPriority,
  categoryAnchor,
  setCategoryAnchor,
  setCategory,
  colorAnchor,
  setColorAnchor,
  color,
  setColor,
}: TaskPopoversProps) => {
  const [colorFilter, setColorFilter] = useState<'all' | 'pastel' | 'solid'>(
    'all',
  );

  return (
    <>
      {/* Status Popover */}
      <Popover
        open={Boolean(statusAnchor)}
        anchorEl={statusAnchor}
        onClose={() => setStatusAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: popoverPaperSx }}
      >
        <Stack sx={{ p: 1, minWidth: '180px' }}>
          {STATUS_LIST.map((s) => (
            <MenuItem
              key={s}
              onClick={() => {
                setStatus(s as TaskStatus);
                setStatusAnchor(null);
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                {getStatusIcon(s, 18)}
                <Typography variant="body2" fontWeight={500}>
                  {s}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Stack>
      </Popover>

      {/* Priority Popover */}
      <Popover
        open={Boolean(priorityAnchor)}
        anchorEl={priorityAnchor}
        onClose={() => setPriorityAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: popoverPaperSx }}
      >
        <Stack sx={{ p: 1, minWidth: '160px' }}>
          {PRIORITY_OPTIONS.map((pOpt) => (
            <MenuItem
              key={pOpt.id}
              onClick={() => {
                setPriority(pOpt.id);
                setPriorityAnchor(null);
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                <PriorityBadge priority={pOpt.id} size={24} />
                <Typography variant="body2" fontWeight={500}>
                  {pOpt.label}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Stack>
      </Popover>

      {/* Category Popover */}
      <Popover
        open={Boolean(categoryAnchor)}
        anchorEl={categoryAnchor}
        onClose={() => setCategoryAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: popoverPaperSx }}
      >
        <Stack sx={{ p: 1, minWidth: '180px' }}>
          {CATEGORY_LIST.map((c) => (
            <MenuItem
              key={c}
              onClick={() => {
                setCategory(c);
                setCategoryAnchor(null);
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                {getCategoryIcon(c, 18)}
                <Typography variant="body2" fontWeight={500}>
                  {c}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Stack>
      </Popover>

      {/* Color Popover */}
      <Popover
        open={Boolean(colorAnchor)}
        anchorEl={colorAnchor}
        onClose={() => setColorAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{
          sx: {
            ...popoverPaperSx,
            borderRadius: '16px',
            p: 1.75,
            minWidth: 260,
            maxWidth: 290,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
            px: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Color de la tarea
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: color || 'transparent',
                border: '1px solid',
                borderColor: 'divider',
              }}
            />
            <Typography
              sx={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {getColorName(color) || 'Personalizado'}
            </Typography>
          </Box>
        </Box>

        {/* Category Classification Chips */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            mb: 1.5,
            px: 0.5,
          }}
        >
          {[
            {
              id: 'all' as const,
              label: 'Todos',
              count: 45,
              dot: 'linear-gradient(135deg, #BAE6FD, #FBCFE8, #A7F3D0)',
            },
            {
              id: 'pastel' as const,
              label: 'Pasteles',
              count: 25,
              dot: '#BAE6FD',
            },
            {
              id: 'solid' as const,
              label: 'Sólidos',
              count: 20,
              dot: '#1D4ED8',
            },
          ].map((cat) => {
            const isActive = colorFilter === cat.id;
            return (
              <Box
                key={cat.id}
                onClick={() => setColorFilter(cat.id)}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.6,
                  px: 1,
                  py: 0.4,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isActive ? 'primary.main' : 'divider',
                  bgcolor: (t) =>
                    isActive
                      ? alpha(t.palette.primary.main, 0.12)
                      : t.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.04)'
                        : 'rgba(0,0,0,0.03)',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: (t) =>
                      isActive
                        ? alpha(t.palette.primary.main, 0.18)
                        : t.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(0,0,0,0.06)',
                    color: 'text.primary',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: cat.dot,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  }}
                />
                {cat.label} ({cat.count})
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            maxHeight: 340,
            overflowY: 'auto',
            pr: 0.5,
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.15)',
              borderRadius: '4px',
            },
          }}
        >
          {/* Pasteles Section */}
          {(colorFilter === 'all' || colorFilter === 'pastel') && (
            <>
              <Typography
                sx={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  mb: 1,
                  px: 0.5,
                }}
              >
                Tonos Pasteles
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: 1.2,
                  justifyItems: 'center',
                  mb: 2,
                }}
              >
                {PASTEL_COLORS.filter((c) => c.category === 'pastel').map(
                  (item) => {
                    const isSelected =
                      color?.toUpperCase() === item.value.toUpperCase();
                    return (
                      <Tooltip
                        key={item.value}
                        title={item.name}
                        arrow
                        placement="top"
                      >
                        <Box
                          onClick={() => {
                            setColor(item.value);
                            setColorAnchor(null);
                          }}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: item.value,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: isSelected
                              ? '2px solid'
                              : '1.5px solid rgba(0,0,0,0.1)',
                            borderColor: isSelected
                              ? 'text.primary'
                              : 'rgba(0,0,0,0.1)',
                            boxShadow: isSelected
                              ? '0 0 0 2px rgba(0,0,0,0.15)'
                              : '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.15s ease',
                            transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                            '&:hover': {
                              transform: 'scale(1.16)',
                              boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
                            },
                          }}
                        >
                          {isSelected && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: isColorDark(item.value)
                                  ? '#ffffff'
                                  : '#0f172a',
                                opacity: 0.9,
                              }}
                            />
                          )}
                        </Box>
                      </Tooltip>
                    );
                  },
                )}
              </Box>
            </>
          )}

          {/* Sólidos Section */}
          {(colorFilter === 'all' || colorFilter === 'solid') && (
            <>
              <Typography
                sx={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  mb: 1,
                  px: 0.5,
                }}
              >
                Tonos Sólidos
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: 1.2,
                  justifyItems: 'center',
                  pb: 0.5,
                }}
              >
                {PASTEL_COLORS.filter((c) => c.category === 'solid').map(
                  (item) => {
                    const isSelected =
                      color?.toUpperCase() === item.value.toUpperCase();
                    return (
                      <Tooltip
                        key={item.value}
                        title={item.name}
                        arrow
                        placement="top"
                      >
                        <Box
                          onClick={() => {
                            setColor(item.value);
                            setColorAnchor(null);
                          }}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: item.value,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: isSelected
                              ? '2px solid'
                              : '1.5px solid rgba(0,0,0,0.1)',
                            borderColor: isSelected
                              ? 'text.primary'
                              : 'rgba(0,0,0,0.1)',
                            boxShadow: isSelected
                              ? '0 0 0 2px rgba(0,0,0,0.15)'
                              : '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.15s ease',
                            transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                            '&:hover': {
                              transform: 'scale(1.16)',
                              boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
                            },
                          }}
                        >
                          {isSelected && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: isColorDark(item.value)
                                  ? '#ffffff'
                                  : '#0f172a',
                                opacity: 0.9,
                              }}
                            />
                          )}
                        </Box>
                      </Tooltip>
                    );
                  },
                )}
              </Box>
            </>
          )}
        </Box>
      </Popover>
    </>
  );
};
