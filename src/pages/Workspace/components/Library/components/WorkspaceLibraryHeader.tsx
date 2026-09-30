import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  Tooltip,
  Tabs,
  Tab,
  alpha,
  lighten,
  darken,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  GridViewOutlined as GridViewIcon,
  FormatListBulleted as FormatListBulletedIcon,
  SortByAlpha as SortByAlphaIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  Palette as PaletteIcon,
  Check as CheckIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import {
  LibraryHeader,
  HeaderTitle,
  StyledTextField,
} from '../WorkspaceLibrary.styles';
import { LibrarySearchHeader } from './LibrarySearchHeader';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setProjectTab } from '@/redux/tasks/task.slice';
import type { ProjectTab } from '@/redux/tasks/task.types';

export type ProjectSortOption =
  | 'recent'
  | 'name-asc'
  | 'name-desc'
  | 'notes-count';

export interface WorkspaceLibraryHeaderProps {
  isInsideFolder: boolean;
  activeGroupName?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  folderSearchTerm: string;
  onFolderSearchChange: (value: string) => void;
  onClearFolderSearch: () => void;
  viewMode: 'gallery' | 'list' | 'grid';
  onViewModeChange: (mode: 'gallery' | 'list' | 'grid') => void;
  projectSortBy: ProjectSortOption;
  onProjectSortChange: (sort: ProjectSortOption) => void;
  projectColorFilter: string;
  onProjectColorFilterChange: (color: string) => void;
  noteSortBy: 'recent' | 'title-asc' | 'title-desc';
  onNoteSortChange: (sort: 'recent' | 'title-asc' | 'title-desc') => void;
  noteFilterType: 'all' | 'linked-task' | 'has-cover';
  onNoteFilterChange: (type: 'all' | 'linked-task' | 'has-cover') => void;
  onCreate?: () => void;
  onCreateTask?: () => void;
  onCreateProject?: () => void;
  hasMultipleWorkspaces?: boolean;
  projectTab?: ProjectTab;
  onProjectTabChange?: (tab: ProjectTab) => void;
}

const PROJECT_COLORS = [
  { name: 'All', value: 'all' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Slate', value: '#475569' },
];

export const WorkspaceLibraryHeader: React.FC<WorkspaceLibraryHeaderProps> = ({
  isInsideFolder,
  activeGroupName,
  searchTerm,
  onSearchChange,
  onClearSearch,
  folderSearchTerm,
  onFolderSearchChange,
  onClearFolderSearch,
  viewMode,
  onViewModeChange,
  projectSortBy,
  onProjectSortChange,
  projectColorFilter,
  onProjectColorFilterChange,
  noteSortBy,
  onNoteSortChange,
  noteFilterType,
  onNoteFilterChange,
  onCreateTask,
  onCreateProject,
  projectTab,
  onProjectTabChange,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const dispatch = useAppDispatch();
  const reduxProjectTab = useAppSelector(
    (state) => state.task.projectTab || 'projects',
  );
  const activeProjectTab =
    onProjectTabChange && projectTab !== undefined
      ? projectTab
      : reduxProjectTab;

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: ProjectTab,
  ) => {
    dispatch(setProjectTab(newValue));
    if (onProjectTabChange) {
      onProjectTabChange(newValue);
    }
  };

  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };

  return (
    <>
      <LibraryHeader sx={{ mb: isInsideFolder ? 3 : 2 }}>
        <Box>
          <HeaderTitle
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: '28px',
              color: 'text.primary',
              letterSpacing: '-0.02em',
            }}
          >
            {isInsideFolder ? activeGroupName : t('nav.projects', 'Proyectos')}
          </HeaderTitle>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' },
            flexWrap: 'wrap',
          }}
        >
          {isInsideFolder ? (
            <LibrarySearchHeader
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              onClearSearch={onClearSearch}
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              noteSortBy={noteSortBy}
              onNoteSortChange={onNoteSortChange}
              noteFilterType={noteFilterType}
              onNoteFilterChange={onNoteFilterChange}
            />
          ) : (
            <Box display="flex" alignItems="center" gap={1.25} flexWrap="wrap">
              <StyledTextField
                placeholder={
                  activeProjectTab === 'projects'
                    ? t('projects.searchProjects', 'Buscar proyectos...')
                    : t('projects.searchTasks', 'Buscar tareas...')
                }
                value={folderSearchTerm}
                onChange={(e) => onFolderSearchChange(e.target.value)}
                size="small"
                sx={{
                  width: '240px',
                  flex: { xs: 1, sm: 'none' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    height: '38px',
                    bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon
                      sx={{ color: 'text.secondary', mr: 0.75, fontSize: 18 }}
                    />
                  ),
                  endAdornment: folderSearchTerm ? (
                    <IconButton
                      size="small"
                      sx={{ color: 'text.secondary', p: 0.5 }}
                      onClick={onClearFolderSearch}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <Box
                      sx={{
                        bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6',
                        color: 'text.secondary',
                        fontSize: '11px',
                        fontWeight: 600,
                        px: 0.8,
                        py: 0.2,
                        borderRadius: '4px',
                        border: `1px solid ${
                          isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'
                        }`,
                        userSelect: 'none',
                      }}
                    >
                      ⌘K
                    </Box>
                  ),
                }}
              />
              <Tabs
                value={activeProjectTab}
                onChange={handleTabChange}
                sx={{
                  minHeight: 38,
                  height: 38,
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                  p: '3px',
                  borderRadius: '10px',
                  border: `1px solid ${
                    isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB'
                  }`,
                  '& .MuiTabs-indicator': {
                    display: 'none',
                  },
                  '& .MuiTabs-flexContainer': {
                    gap: '3px',
                    height: '100%',
                  },
                  '& .MuiTab-root': {
                    minHeight: 32,
                    height: 32,
                    padding: '4px 12px',
                    borderRadius: '7px',
                    fontSize: '12.5px',
                    fontWeight: 500,
                    textTransform: 'none',
                    color: 'text.secondary',
                    transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                    whiteSpace: 'nowrap',
                    '&.Mui-selected': {
                      color: isDark ? '#ffffff' : '#111827',
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#F3F4F6',
                      fontWeight: 600,
                    },
                    '&:hover': {
                      color: 'text.primary',
                    },
                  },
                }}
              >
                <Tab
                  value="projects"
                  label={t('projects.tabs.viewProjects', 'Ver proyectos')}
                  icon={<GridViewIcon sx={{ fontSize: 16 }} />}
                  iconPosition="start"
                />
                <Tab
                  value="tasks"
                  label={t(
                    'projects.tabs.viewTasks',
                    'Ver tareas de los proyectos',
                  )}
                  icon={<FormatListBulletedIcon sx={{ fontSize: 16 }} />}
                  iconPosition="start"
                />
              </Tabs>

              <Tooltip title={t('projects.sort.title', 'Filtrar y Ordenar')}>
                <IconButton
                  size="small"
                  onClick={handleOpenFilterMenu}
                  sx={{
                    border: `1px solid ${
                      isDark ? 'rgba(255,255,255,0.12)' : '#E5E7EB'
                    }`,
                    borderRadius: '8px',
                    p: 0.5,
                    width: '38px',
                    height: '38px',
                    color: filterMenuAnchor ? 'primary.main' : 'text.secondary',
                    bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#F9FAFB',
                    },
                  }}
                >
                  <SortByAlphaIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>

              {activeProjectTab === 'projects'
                ? onCreateProject && (
                    <Button
                      id="header-create-project-btn"
                      onClick={onCreateProject}
                      variant="contained"
                      startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '13px',
                        px: 2,
                        height: '38px',
                        boxShadow: 'none',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        bgcolor: '#008767',
                        color: '#ffffff',
                        '&:hover': { bgcolor: '#007357' },
                      }}
                    >
                      {t('createProjectModal.create', 'Nuevo Proyecto')}
                    </Button>
                  )
                : onCreateTask && (
                    <Button
                      id="header-create-task-btn"
                      onClick={onCreateTask}
                      variant="contained"
                      startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '13px',
                        px: 2,
                        height: '38px',
                        boxShadow: 'none',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        bgcolor: '#008767',
                        color: '#ffffff',
                        '&:hover': { bgcolor: '#007357' },
                      }}
                    >
                      {t('tasks.createTask', 'Nueva Tarea')}
                    </Button>
                  )}

              {/* Filter & Sort Menu for Projects */}
              <Menu
                anchorEl={filterMenuAnchor}
                open={Boolean(filterMenuAnchor)}
                onClose={handleCloseFilterMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    borderRadius: '12px',
                    mt: 1,
                    minWidth: 200,
                    p: 1,
                    boxShadow: isDark
                      ? '0 8px 24px rgba(0,0,0,0.5)'
                      : '0 8px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    fontWeight: 700,
                    color: 'text.secondary',
                    display: 'block',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontSize: '11px',
                  }}
                >
                  Sort Projects
                </Typography>

                <MenuItem
                  selected={projectSortBy === 'recent'}
                  onClick={() => {
                    onProjectSortChange('recent');
                    handleCloseFilterMenu();
                  }}
                  sx={{ borderRadius: '8px', fontSize: '13px', py: 0.8 }}
                >
                  <ListItemIcon sx={{ minWidth: '32px !important' }}>
                    <AccessTimeIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('projects.sort.recent', 'Recently Updated')}
                  />
                  {projectSortBy === 'recent' && (
                    <CheckIcon fontSize="small" sx={{ fontSize: 16 }} />
                  )}
                </MenuItem>

                <MenuItem
                  selected={projectSortBy === 'name-asc'}
                  onClick={() => {
                    onProjectSortChange('name-asc');
                    handleCloseFilterMenu();
                  }}
                  sx={{ borderRadius: '8px', fontSize: '13px', py: 0.8 }}
                >
                  <ListItemIcon sx={{ minWidth: '32px !important' }}>
                    <SortByAlphaIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('projects.sort.nameAsc', 'Name (A to Z)')}
                  />
                  {projectSortBy === 'name-asc' && (
                    <CheckIcon fontSize="small" sx={{ fontSize: 16 }} />
                  )}
                </MenuItem>

                <MenuItem
                  selected={projectSortBy === 'notes-count'}
                  onClick={() => {
                    onProjectSortChange('notes-count');
                    handleCloseFilterMenu();
                  }}
                  sx={{ borderRadius: '8px', fontSize: '13px', py: 0.8 }}
                >
                  <ListItemIcon sx={{ minWidth: '32px !important' }}>
                    <DescriptionIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('projects.sort.mostNotes', 'Most Notes')}
                  />
                  {projectSortBy === 'notes-count' && (
                    <CheckIcon fontSize="small" sx={{ fontSize: 16 }} />
                  )}
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                <Typography
                  variant="caption"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    fontWeight: 700,
                    color: 'text.secondary',
                    display: 'block',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontSize: '11px',
                  }}
                >
                  {t('projects.sort.filterByColor', 'Filter by Color')}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.8,
                    px: 1,
                    py: 0.5,
                    flexWrap: 'wrap',
                  }}
                >
                  {PROJECT_COLORS.map((c) => {
                    const isSelected = projectColorFilter === c.value;
                    return (
                      <Tooltip key={c.value} title={c.name}>
                        <Box
                          onClick={() => {
                            onProjectColorFilterChange(c.value);
                            handleCloseFilterMenu();
                          }}
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            bgcolor:
                              c.value === 'all' ? 'text.secondary' : c.value,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: isSelected ? '2px solid #fff' : 'none',
                            boxShadow: isSelected
                              ? '0 0 0 2px #7c3aed'
                              : 'none',
                            transition: 'transform 0.15s ease',
                            '&:hover': {
                              transform: 'scale(1.15)',
                            },
                          }}
                        >
                          {c.value === 'all' && (
                            <PaletteIcon sx={{ fontSize: 12, color: '#fff' }} />
                          )}
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              </Menu>
            </Box>
          )}
        </Box>
      </LibraryHeader>

      {/* ── Filter pills bar (below title row) ── */}
      {/* ── Filter pills bar (below title row) ── */}
      {!isInsideFolder && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 3,
            overflowX: 'auto',
            py: 0.5,
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '13px',
              fontWeight: 600,
              mr: 0.5,
              flexShrink: 0,
            }}
          >
            {t('projects.filterBy', 'Filtrar por:')}
          </Typography>

          {PROJECT_COLORS.map((c) => {
            const isSelected = projectColorFilter === c.value;
            const chipColor =
              c.value === 'all' ? theme.palette.primary.main : c.value;

            return (
              <Box
                key={c.value}
                onClick={() => onProjectColorFilterChange(c.value)}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.45,
                  height: '30px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isSelected
                    ? isDark
                      ? lighten(chipColor, 0.25)
                      : chipColor
                    : isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : '#E5E7EB',
                  bgcolor: isSelected
                    ? alpha(chipColor, isDark ? 0.22 : 0.12)
                    : isDark
                      ? 'rgba(255, 255, 255, 0.04)'
                      : '#FFFFFF',
                  color: isSelected
                    ? isDark
                      ? lighten(chipColor, 0.4)
                      : darken(chipColor, 0.15)
                    : 'text.secondary',
                  fontSize: '12px',
                  fontWeight: isSelected ? 700 : 500,
                  transition: 'all 0.18s ease',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected
                    ? `0 2px 6px ${alpha(chipColor, 0.25)}`
                    : 'none',
                  '&:hover': {
                    bgcolor: isSelected
                      ? alpha(chipColor, isDark ? 0.28 : 0.18)
                      : isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : '#F9FAFB',
                    borderColor: isSelected
                      ? isDark
                        ? lighten(chipColor, 0.35)
                        : chipColor
                      : isDark
                        ? 'rgba(255, 255, 255, 0.2)'
                        : '#D1D5DB',
                    color: isDark ? '#ffffff' : '#0f172a',
                  },
                }}
              >
                {c.value === 'all' ? (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, #7c3aed, #3b82f6, #10b981, #f59e0b, #f43f5e)',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: c.value,
                      boxShadow: `0 0 0 1.5px ${alpha(c.value, 0.3)}`,
                    }}
                  />
                )}
                {c.name === 'All' ? t('common.all', 'Todos') : c.name}
              </Box>
            );
          })}

          {/* Limpiar filtros */}
          {projectColorFilter !== 'all' && (
            <Button
              size="small"
              onClick={() => {
                onProjectSortChange('recent');
                onProjectColorFilterChange('all');
                onClearFolderSearch();
              }}
              sx={{
                color: 'text.disabled',
                textTransform: 'none',
                fontSize: '12px',
                fontWeight: 600,
                ml: 0.5,
                p: '3px 8px',
                borderRadius: '8px',
                minWidth: 'auto',
                flexShrink: 0,
                '&:hover': {
                  color: 'error.main',
                  bgcolor: alpha('#ef4444', 0.08),
                },
              }}
            >
              {t('projects.sort.resetFilters', 'Limpiar')}
            </Button>
          )}
        </Box>
      )}

      {/* ── Note filter chips inside folder ── */}
      {isInsideFolder && onNoteFilterChange && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 3,
            overflowX: 'auto',
            py: 0.5,
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '13px',
              fontWeight: 600,
              mr: 0.5,
              flexShrink: 0,
            }}
          >
            {t('projects.filterBy', 'Filtrar por:')}
          </Typography>

          {[
            {
              id: 'all' as const,
              label: t('common.all', 'Todos'),
              dot: '#6366f1',
            },
            {
              id: 'has-cover' as const,
              label: t(
                'workspaceLibrary.filters.hasCover',
                'Con portada / color',
              ),
              dot: '#ec4899',
            },
            {
              id: 'linked-task' as const,
              label: t(
                'workspaceLibrary.filters.linkedTask',
                'Con tareas vinculadas',
              ),
              dot: '#10b981',
            },
          ].map((item) => {
            const isSelected = noteFilterType === item.id;
            return (
              <Box
                key={item.id}
                onClick={() => onNoteFilterChange(item.id)}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.45,
                  height: '30px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isSelected
                    ? 'primary.main'
                    : isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : '#E5E7EB',
                  bgcolor: isSelected
                    ? alpha(theme.palette.primary.main, isDark ? 0.22 : 0.12)
                    : isDark
                      ? 'rgba(255, 255, 255, 0.04)'
                      : '#FFFFFF',
                  color: isSelected ? 'primary.main' : 'text.secondary',
                  fontSize: '12px',
                  fontWeight: isSelected ? 700 : 500,
                  transition: 'all 0.18s ease',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: isSelected
                      ? alpha(theme.palette.primary.main, isDark ? 0.28 : 0.18)
                      : isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : '#F9FAFB',
                    color: isDark ? '#ffffff' : '#0f172a',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    bgcolor: item.dot,
                  }}
                />
                {item.label}
              </Box>
            );
          })}

          {noteFilterType !== 'all' && (
            <Button
              size="small"
              onClick={() => onNoteFilterChange('all')}
              sx={{
                color: 'text.disabled',
                textTransform: 'none',
                fontSize: '12px',
                fontWeight: 600,
                ml: 0.5,
                p: '3px 8px',
                borderRadius: '8px',
                minWidth: 'auto',
                flexShrink: 0,
                '&:hover': {
                  color: 'error.main',
                  bgcolor: alpha('#ef4444', 0.08),
                },
              }}
            >
              {t('projects.sort.resetFilters', 'Limpiar')}
            </Button>
          )}
        </Box>
      )}
    </>
  );
};
