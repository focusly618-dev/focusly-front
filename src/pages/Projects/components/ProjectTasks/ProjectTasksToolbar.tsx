import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  LinearProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SortIcon from '@mui/icons-material/Sort';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import { isCustomEmoji } from '@/components/ui';
import { formatDuration } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type { ProjectOption } from '../CreateProjectTaskModal/CreateProjectTaskModal.types';
import {
  DEFAULT_PROJECT_STATUSES,
  type ProjectStatusConfig,
} from './projectTasks.types';
import {
  hasActiveFilters,
  type ProjectTaskFilters,
  type ProjectTaskLayout,
  type ProjectTaskSort,
  type ProjectTasksSummary,
} from './projectTaskFilters';

const BRAND = '#008767';

const SORTS: ProjectTaskSort[] = ['dueDate', 'priority', 'title', 'recent'];

export interface ProjectTasksToolbarProps {
  summary: ProjectTasksSummary;
  /** Tasks loaded so far and in total (the list loads in pages). */
  loadedCount: number;
  totalCount: number;
  filters: ProjectTaskFilters;
  onFiltersChange: (filters: ProjectTaskFilters) => void;
  sort: ProjectTaskSort;
  onSortChange: (sort: ProjectTaskSort) => void;
  showEmptyStatuses: boolean;
  onShowEmptyStatusesChange: (value: boolean) => void;
  /** Live counts per status id across the active task set. */
  statusCounts?: Record<string, number>;
  /** Current layout ('list' table or 'kanban' board). */
  layout?: ProjectTaskLayout;
  onLayoutChange?: (layout: ProjectTaskLayout) => void;
  /** Given in the all-projects view: lets the user narrow to one. */
  projects?: ProjectOption[];
  /** The "Select" button, at the end of the filters row. */
  selectAction?: React.ReactNode;
}

/** Progress, status filter pills, view switcher, quick filters and ordering. */
export const ProjectTasksToolbar: React.FC<ProjectTasksToolbarProps> = ({
  summary,
  loadedCount,
  totalCount,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  showEmptyStatuses,
  onShowEmptyStatusesChange,
  statusCounts = {},
  layout = 'list',
  onLayoutChange,
  projects,
  selectAction,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [sortAnchor, setSortAnchor] = useState<HTMLElement | null>(null);
  const [projectAnchor, setProjectAnchor] = useState<HTMLElement | null>(null);

  const percent = summary.total
    ? Math.round((summary.completed / summary.total) * 100)
    : 0;
  const selectedProject = projects?.find((p) => p.id === filters.projectId);
  const toggle = (key: 'overdue' | 'noDate' | 'highPriority') =>
    onFiltersChange({ ...filters, [key]: !filters[key] });

  const chipSx = { fontWeight: 600, fontSize: '12px', borderRadius: '8px' };
  const filterChip = (
    key: 'overdue' | 'noDate' | 'highPriority',
    label: string,
  ) => (
    <Chip
      size="small"
      label={label}
      clickable
      onClick={() => toggle(key)}
      color={filters[key] ? 'primary' : 'default'}
      variant={filters[key] ? 'filled' : 'outlined'}
      icon={filters[key] ? <CheckIcon /> : undefined}
      aria-pressed={filters[key]}
      sx={chipSx}
    />
  );

  // Show the core workflow statuses in the pill bar plus any status that has tasks.
  const pillStatuses: ProjectStatusConfig[] = DEFAULT_PROJECT_STATUSES.filter(
    (status) =>
      showEmptyStatuses ||
      status.alwaysVisible ||
      status.id === 'planning' ||
      status.id === 'scheduled' ||
      status.id === 'in_review' ||
      (statusCounts[status.id] ?? 0) > 0 ||
      filters.status === status.id,
  );

  const isAllStatuses = !filters.status;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
      {/* ── Status Filter Pills + List / Kanban Switcher ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.25,
        }}
      >
        <Box
          role="group"
          aria-label={t('projectTasks.statusFilterGroup', {
            defaultValue: 'Filter by status',
          })}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.85,
            minWidth: 0,
          }}
        >
          {/* "All" Pill */}
          <ButtonBase
            onClick={() => onFiltersChange({ ...filters, status: null })}
            aria-pressed={isAllStatuses}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.85,
              px: 1.5,
              py: 0.65,
              borderRadius: '999px',
              fontSize: '12.5px',
              fontWeight: isAllStatuses ? 700 : 600,
              border: '1px solid',
              borderColor: isAllStatuses
                ? alpha(BRAND, isDark ? 0.5 : 0.35)
                : 'divider',
              bgcolor: isAllStatuses
                ? alpha(BRAND, isDark ? 0.18 : 0.12)
                : 'background.paper',
              color: isAllStatuses ? BRAND : 'text.secondary',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: isAllStatuses
                  ? alpha(BRAND, isDark ? 0.24 : 0.16)
                  : 'action.hover',
              },
            }}
          >
            <span>
              {t('projectTasks.statusTab.all', { defaultValue: 'All' })}
            </span>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 20,
                height: 18,
                px: 0.65,
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700,
                bgcolor: isAllStatuses
                  ? BRAND
                  : isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(15, 23, 42, 0.06)',
                color: isAllStatuses ? '#ffffff' : 'text.secondary',
              }}
            >
              {summary.total}
            </Box>
          </ButtonBase>

          {pillStatuses.map((status) => {
            const active = filters.status === status.id;
            const count = statusCounts[status.id] ?? 0;
            const label = t(`projectTasks.statusTab.${status.id}`, {
              defaultValue: status.label,
            });
            return (
              <ButtonBase
                key={status.id}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    status: active ? null : status.id,
                  })
                }
                aria-pressed={active}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.4,
                  py: 0.65,
                  borderRadius: '999px',
                  fontSize: '12.5px',
                  fontWeight: active ? 700 : 600,
                  border: '1px solid',
                  borderColor: active
                    ? alpha(status.color, isDark ? 0.55 : 0.4)
                    : 'divider',
                  bgcolor: active
                    ? alpha(status.color, isDark ? 0.18 : 0.12)
                    : 'background.paper',
                  color: active ? status.color : 'text.secondary',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: active
                      ? alpha(status.color, isDark ? 0.24 : 0.16)
                      : 'action.hover',
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: status.dotColor,
                    flexShrink: 0,
                  }}
                />
                <span>{label}</span>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 20,
                    height: 18,
                    px: 0.65,
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    bgcolor: active
                      ? status.color
                      : alpha(status.color, isDark ? 0.16 : 0.1),
                    color: active ? '#ffffff' : status.color,
                  }}
                >
                  {count}
                </Box>
              </ButtonBase>
            );
          })}
        </Box>

        {/* List | Kanban View Switcher */}
        {onLayoutChange && (
          <Box
            role="group"
            aria-label={t('projectTasks.viewMode.label', {
              defaultValue: 'Task view layout',
            })}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              p: '3px',
              borderRadius: '10px',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f1f5f9',
            }}
          >
            {(
              [
                {
                  id: 'list' as const,
                  label: t('projectTasks.viewMode.list', {
                    defaultValue: 'List',
                  }),
                  Icon: FormatListBulletedRoundedIcon,
                },
                {
                  id: 'kanban' as const,
                  label: t('projectTasks.viewMode.kanban', {
                    defaultValue: 'Kanban',
                  }),
                  Icon: ViewKanbanOutlinedIcon,
                },
              ] as const
            ).map(({ id, label, Icon }) => {
              const isSelected = layout === id;
              return (
                <ButtonBase
                  key={id}
                  onClick={() => onLayoutChange(id)}
                  aria-pressed={isSelected}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.6,
                    px: 1.35,
                    py: 0.55,
                    borderRadius: '7px',
                    fontSize: '12.5px',
                    fontWeight: isSelected ? 700 : 600,
                    color: isSelected ? 'text.primary' : 'text.secondary',
                    bgcolor: isSelected ? 'background.paper' : 'transparent',
                    boxShadow: isSelected
                      ? isDark
                        ? '0 1px 3px rgba(0,0,0,0.4)'
                        : '0 1px 3px rgba(15, 23, 42, 0.08)'
                      : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon sx={{ fontSize: 15 }} />
                  <span>{label}</span>
                </ButtonBase>
              );
            })}
          </Box>
        )}
      </Box>

      {/* ── Compact Progress & Quick Filters Bar ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 1.5 },
          px: 2,
          py: 1.1,
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            flex: '0 1 auto',
            minWidth: 180,
          }}
        >
          <Typography sx={{ fontSize: '12.5px', fontWeight: 650 }} noWrap>
            {t('projectTasks.summary.completed', {
              done: summary.completed,
              total: summary.total,
            })}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={percent}
            aria-label={t('projectTasks.summary.progress', { percent })}
            sx={{
              width: 96,
              height: 6,
              borderRadius: 3,
              // The default track is a tint of the brand: read as progress
              bgcolor: 'action.selected',
              '& .MuiLinearProgress-bar': { bgcolor: BRAND },
            }}
          />
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: BRAND }}>
            {percent}%
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.75,
          }}
        >
          {summary.remainingMinutes > 0 && (
            <Chip
              size="small"
              icon={<TimerOutlinedIcon />}
              label={t('projectTasks.summary.remaining', {
                time: formatDuration(summary.remainingMinutes),
              })}
              variant="outlined"
              sx={chipSx}
            />
          )}
          {summary.overdue > 0 && (
            <Chip
              size="small"
              icon={<WarningAmberRoundedIcon />}
              label={t('projectTasks.summary.overdue', {
                count: summary.overdue,
              })}
              color="error"
              variant={filters.overdue ? 'filled' : 'outlined'}
              clickable
              onClick={() => toggle('overdue')}
              aria-pressed={filters.overdue}
              sx={chipSx}
            />
          )}
          {loadedCount < totalCount && (
            <Typography variant="caption" color="text.secondary">
              {t('projectTasks.summary.loaded', {
                loaded: loadedCount,
                total: totalCount,
              })}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.75,
            ml: 'auto',
          }}
        >
          {projects && projects.length > 1 && (
            <>
              <Chip
                size="small"
                clickable
                icon={
                  selectedProject && isCustomEmoji(selectedProject.emoji) ? (
                    <Box component="span" sx={{ pl: 0.5 }}>
                      {selectedProject.emoji}
                    </Box>
                  ) : (
                    <FolderOutlinedIcon />
                  )
                }
                label={
                  <Box
                    component="span"
                    sx={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    {selectedProject?.name ?? t('projectTasks.allProjects')}
                    <KeyboardArrowDownIcon sx={{ fontSize: 16, ml: 0.25 }} />
                  </Box>
                }
                onClick={(e) => setProjectAnchor(e.currentTarget)}
                color={selectedProject ? 'primary' : 'default'}
                variant={selectedProject ? 'filled' : 'outlined'}
                aria-haspopup="menu"
                sx={{ ...chipSx, maxWidth: 240 }}
              />
              <Menu
                anchorEl={projectAnchor}
                open={Boolean(projectAnchor)}
                onClose={() => setProjectAnchor(null)}
                slotProps={{
                  paper: { sx: { borderRadius: '10px', maxHeight: 360 } },
                }}
              >
                {[
                  { id: null, name: t('projectTasks.allProjects') },
                  ...projects,
                ].map((project) => (
                  <MenuItem
                    key={project.id ?? 'all'}
                    selected={project.id === filters.projectId}
                    onClick={() => {
                      setProjectAnchor(null);
                      onFiltersChange({ ...filters, projectId: project.id });
                    }}
                    sx={{ fontSize: '13px', gap: 1 }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        flexShrink: 0,
                        bgcolor:
                          'color' in project && project.color
                            ? project.color
                            : 'transparent',
                      }}
                    />
                    <Box component="span" sx={{ flex: 1 }}>
                      {project.name}
                    </Box>
                    {project.id === filters.projectId && (
                      <ListItemIcon sx={{ minWidth: 0 }}>
                        <CheckIcon sx={{ fontSize: 16 }} />
                      </ListItemIcon>
                    )}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
          {filterChip('overdue', t('projectTasks.filters.overdue'))}
          {filterChip('noDate', t('projectTasks.filters.noDate'))}
          {filterChip('highPriority', t('projectTasks.filters.highPriority'))}
          {hasActiveFilters(filters) && (
            <Button
              size="small"
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  status: null,
                  overdue: false,
                  noDate: false,
                  highPriority: false,
                })
              }
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              {t('projectTasks.filters.clear')}
            </Button>
          )}

          <Chip
            size="small"
            label={t('projectTasks.showEmptyStatuses')}
            clickable
            onClick={() => onShowEmptyStatusesChange(!showEmptyStatuses)}
            color={showEmptyStatuses ? 'primary' : 'default'}
            variant={showEmptyStatuses ? 'filled' : 'outlined'}
            icon={showEmptyStatuses ? <CheckIcon /> : undefined}
            aria-pressed={showEmptyStatuses}
            sx={chipSx}
          />
          <Button
            size="small"
            startIcon={<SortIcon sx={{ fontSize: 18 }} />}
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
            onClick={(e) => setSortAnchor(e.currentTarget)}
            aria-haspopup="menu"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '12.5px',
              color: 'text.secondary',
              borderRadius: '8px',
            }}
          >
            {t(`projectTasks.sort.${sort}`)}
          </Button>
          {selectAction}
          <Menu
            anchorEl={sortAnchor}
            open={Boolean(sortAnchor)}
            onClose={() => setSortAnchor(null)}
            slotProps={{ paper: { sx: { borderRadius: '10px' } } }}
          >
            {SORTS.map((option) => (
              <MenuItem
                key={option}
                selected={option === sort}
                onClick={() => {
                  setSortAnchor(null);
                  onSortChange(option);
                }}
                sx={{ fontSize: '13px', gap: 1 }}
              >
                <Box component="span" sx={{ flex: 1 }}>
                  {t(`projectTasks.sort.${option}`)}
                </Box>
                {option === sort && <CheckIcon sx={{ fontSize: 16 }} />}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};
