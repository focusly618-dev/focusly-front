import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SortIcon from '@mui/icons-material/Sort';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { isCustomEmoji } from '@/components/ui';
import { formatDuration } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type { ProjectOption } from '../CreateProjectTaskModal/CreateProjectTaskModal.types';
import {
  hasActiveFilters,
  type ProjectTaskFilters,
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
  /** Given in the all-projects view: lets the user narrow to one. */
  projects?: ProjectOption[];
  /** The "Select" button, at the end of the filters row. */
  selectAction?: React.ReactNode;
}

/** Progress, quick filters and ordering for the project tasks view. */
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
  projects,
  selectAction,
}) => {
  const { t } = useTranslation();
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2.5 }}>
      {/* ── Progress ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 2 },
          px: 2,
          py: 1.25,
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
            flex: '1 1 220px',
            minWidth: 0,
          }}
        >
          <Typography sx={{ fontSize: '13px', fontWeight: 650 }} noWrap>
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
              flex: 1,
              maxWidth: 160,
              height: 6,
              borderRadius: 3,
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
            gap: 1,
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
      </Box>

      {/* ── Filters and order ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
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

        <Box sx={{ flex: 1 }} />

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
  );
};
