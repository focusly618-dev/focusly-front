import { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  ViewListRounded as ViewListIcon,
  DashboardRounded as KanbanIcon,
  FlagOutlined as FlagIcon,
  PersonOutlineRounded as PersonIcon,
} from '@mui/icons-material';
import type { TasksControlsBarProps } from './TasksControlsBar.types';

export const TasksControlsBar = ({
  viewMode,
  searchTerm,
  setSearchTerm,
  setViewMode,
  activeFilterState,
  setPriorityFilter,
}: TasksControlsBarProps) => {
  const [priorityAnchor, setPriorityAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [assigneeAnchor, setAssigneeAnchor] = useState<null | HTMLElement>(
    null,
  );

  // Derive current priority label
  const currentPriorityString = activeFilterState?.priorities?.[0];
  const priorityDisplayLabel = currentPriorityString
    ? currentPriorityString === 'High'
      ? 'Alta'
      : currentPriorityString === 'Medium'
        ? 'Media'
        : currentPriorityString === 'Low'
          ? 'Baja'
          : currentPriorityString
    : 'Todas';

  const handleSelectPriority = (level: number | undefined) => {
    setPriorityAnchor(null);
    if (setPriorityFilter) {
      setPriorityFilter(level);
    }
  };

  return (
    <Box
      id="joyride-tasks-filters"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 0 16px 0',
        width: '100%',
        flexWrap: 'wrap',
        gap: 1.5,
        boxSizing: 'border-box',
      }}
    >
      {/* Left side: Search + Priority Filter + Responsables */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flex: 1,
          minWidth: '280px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search Input matching screenshot */}
        <TextField
          id="joyride-tasks-search"
          placeholder="Buscar tareas, etiquetas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ color: 'text.secondary', fontSize: 18, ml: 0.5 }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { xs: '100%', sm: 260, md: 300 },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              height: 38,
              fontSize: '13px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : '#ffffff',
              '& fieldset': {
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.1)'
                    : '#e5e7eb',
              },
              '&:hover fieldset': {
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.2)'
                    : '#d1d5db',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#008767',
                borderWidth: '1.5px',
              },
            },
          }}
        />

        {/* Priority Filter Dropdown Pill */}
        <Button
          onClick={(e) => setPriorityAnchor(e.currentTarget)}
          endIcon={
            <KeyboardArrowDownIcon
              sx={{ fontSize: 18, color: 'text.secondary' }}
            />
          }
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '13px',
            color:
              priorityDisplayLabel !== 'Todas' ? '#008767' : 'text.primary',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.03)'
                : '#ffffff',
            border: '1px solid',
            borderColor:
              priorityDisplayLabel !== 'Todas'
                ? '#008767'
                : (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.1)'
                      : '#e5e7eb',
            borderRadius: '8px',
            height: 38,
            px: 1.75,
            whiteSpace: 'nowrap',
            '&:hover': {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.06)'
                  : '#f9fafb',
            },
          }}
        >
          Prioridad: {priorityDisplayLabel}
        </Button>
        <Menu
          anchorEl={priorityAnchor}
          open={Boolean(priorityAnchor)}
          onClose={() => setPriorityAnchor(null)}
          PaperProps={{
            sx: {
              borderRadius: '10px',
              minWidth: '150px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              p: 0.5,
            },
          }}
        >
          <MenuItem
            onClick={() => handleSelectPriority(undefined)}
            selected={priorityDisplayLabel === 'Todas'}
            sx={{
              py: 0.8,
              px: 1.5,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: priorityDisplayLabel === 'Todas' ? 700 : 500,
            }}
          >
            Todas
          </MenuItem>
          <MenuItem
            onClick={() => handleSelectPriority(3)}
            selected={priorityDisplayLabel === 'Alta'}
            sx={{
              gap: 1.2,
              py: 0.8,
              px: 1.5,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: priorityDisplayLabel === 'Alta' ? 700 : 500,
            }}
          >
            <FlagIcon sx={{ fontSize: 16, color: '#dc2626' }} />
            Alta
          </MenuItem>
          <MenuItem
            onClick={() => handleSelectPriority(2)}
            selected={priorityDisplayLabel === 'Media'}
            sx={{
              gap: 1.2,
              py: 0.8,
              px: 1.5,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: priorityDisplayLabel === 'Media' ? 700 : 500,
            }}
          >
            <FlagIcon sx={{ fontSize: 16, color: '#d97706' }} />
            Media
          </MenuItem>
          <MenuItem
            onClick={() => handleSelectPriority(1)}
            selected={priorityDisplayLabel === 'Baja'}
            sx={{
              gap: 1.2,
              py: 0.8,
              px: 1.5,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: priorityDisplayLabel === 'Baja' ? 700 : 500,
            }}
          >
            <FlagIcon sx={{ fontSize: 16, color: '#16a34a' }} />
            Baja
          </MenuItem>
        </Menu>

        {/* Responsables Dropdown Pill */}
        <Button
          onClick={(e) => setAssigneeAnchor(e.currentTarget)}
          endIcon={
            <KeyboardArrowDownIcon
              sx={{ fontSize: 18, color: 'text.secondary' }}
            />
          }
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '13px',
            color: 'text.primary',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.03)'
                : '#ffffff',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.1)'
                : '#e5e7eb',
            borderRadius: '8px',
            height: 38,
            px: 1.75,
            whiteSpace: 'nowrap',
            '&:hover': {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.06)'
                  : '#f9fafb',
            },
          }}
        >
          Responsables
        </Button>
        <Menu
          anchorEl={assigneeAnchor}
          open={Boolean(assigneeAnchor)}
          onClose={() => setAssigneeAnchor(null)}
          PaperProps={{
            sx: {
              borderRadius: '10px',
              minWidth: '160px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              p: 0.5,
            },
          }}
        >
          <MenuItem
            onClick={() => setAssigneeAnchor(null)}
            sx={{
              gap: 1.2,
              py: 0.8,
              px: 1.5,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <PersonIcon sx={{ fontSize: 16, color: '#008767' }} />
            Todos los responsables
          </MenuItem>
        </Menu>
      </Box>

      {/* Right side: Segmented Lista / Kanban Toggle */}
      <Box
        id="joyride-tasks-view-toggle"
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.04)'
              : '#f3f4f6',
          p: '3px',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.08)'
              : '#e5e7eb',
        }}
      >
        <Button
          size="small"
          onClick={() => setViewMode('list')}
          startIcon={<ViewListIcon sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '12.5px',
            borderRadius: '6px',
            px: 1.5,
            height: 32,
            minWidth: 'auto',
            bgcolor:
              viewMode === 'list'
                ? (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.14)'
                      : '#ffffff'
                : 'transparent',
            color: viewMode === 'list' ? 'text.primary' : 'text.secondary',
            boxShadow:
              viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            '&:hover': {
              bgcolor:
                viewMode === 'list'
                  ? (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.18)'
                        : '#ffffff'
                  : 'rgba(0,0,0,0.04)',
            },
          }}
        >
          Lista
        </Button>
        <Button
          size="small"
          onClick={() => setViewMode('board')}
          startIcon={<KanbanIcon sx={{ fontSize: 17 }} />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '12.5px',
            borderRadius: '6px',
            px: 1.5,
            height: 32,
            minWidth: 'auto',
            bgcolor:
              viewMode === 'board'
                ? (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.14)'
                      : '#ffffff'
                : 'transparent',
            color: viewMode === 'board' ? 'text.primary' : 'text.secondary',
            boxShadow:
              viewMode === 'board' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            '&:hover': {
              bgcolor:
                viewMode === 'board'
                  ? (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.18)'
                        : '#ffffff'
                  : 'rgba(0,0,0,0.04)',
            },
          }}
        >
          Kanban
        </Button>
      </Box>
    </Box>
  );
};
