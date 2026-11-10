import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  AvatarGroup,
  Box,
  ButtonBase,
  Checkbox,
  Collapse,
  IconButton,
  Tooltip,
  Typography,
  alpha,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import AdjustRoundedIcon from '@mui/icons-material/AdjustRounded';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import { surfaceColor } from '@/context';
import { ProjectTaskSubtasks } from './ProjectTaskSubtasks';
import { ProjectStatusMenu } from './ProjectStatusMenu';
import {
  PriorityBadge,
  getPriorityConfig,
  ModernFolderOutlinedIcon,
  ModernFolderFilledIcon,
  isCustomEmoji,
} from '@/components/ui';
import {
  DEFAULT_PROJECT_STATUSES,
  findProjectStatus,
  type ProjectTaskItemData,
  type ProjectTaskStatusId,
} from './projectTasks.types';

export interface ProjectTaskItemProps {
  task: ProjectTaskItemData;
  /** Show which project the task belongs to (the all-projects view). */
  showProject?: boolean;
  onTaskClick?: (task: ProjectTaskItemData) => void;
  onToggleComplete?: (task: ProjectTaskItemData) => void;
  onChangeStatus?: (
    task: ProjectTaskItemData,
    status: ProjectTaskStatusId,
  ) => void;
  onDeleteTask?: (task: ProjectTaskItemData) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
  /** Selection mode: the row toggles selection instead of opening. */
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (task: ProjectTaskItemData) => void;
}

// Desktop columns, aligned across rows:
// check · title · [project] · status · priority · due · estimate · actions
const columns = (showProject: boolean) =>
  showProject
    ? '32px minmax(0, 1fr) 148px 132px 104px 104px 52px 52px'
    : '32px minmax(0, 1fr) 132px 108px 108px 52px 52px';

export const ProjectChip = ({ task }: { task: ProjectTaskItemData }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const name = task.project?.name || task.projectName;
  if (!name) return null;
  const color = task.project?.color || task.projectColor || '#7c3aed';
  const emoji = task.project?.emoji || task.projectEmoji;
  return (
    <Tooltip title={`${t('projectTasks.columns.project')}: ${name}`}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          maxWidth: '100%',
          px: '8px',
          py: '2.5px',
          borderRadius: '6px',
          fontSize: '11.5px',
          fontWeight: 600,
          color,
          bgcolor: alpha(color, isDark ? 0.16 : 0.09),
          border: `1px solid ${alpha(color, isDark ? 0.3 : 0.2)}`,
          lineHeight: 1.4,
          minWidth: 0,
        }}
      >
        {isCustomEmoji(emoji) ? (
          <span style={{ fontSize: '11px', lineHeight: 1 }}>{emoji}</span>
        ) : emoji === 'filled' ? (
          <ModernFolderFilledIcon sx={{ fontSize: 13, color }} />
        ) : (
          <ModernFolderOutlinedIcon sx={{ fontSize: 13, color }} />
        )}
        <Box
          component="span"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </Box>
      </Box>
    </Tooltip>
  );
};

export const StatusChip = ({
  task,
  onClick,
  ariaLabel,
}: {
  task: ProjectTaskItemData;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  ariaLabel?: string;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const config =
    findProjectStatus(task.status) ??
    DEFAULT_PROJECT_STATUSES.find((s) => s.id === 'todo') ??
    DEFAULT_PROJECT_STATUSES[0];
  const label = t(`projectTasks.statusBadge.${config.id}`, {
    defaultValue: config.label,
  });

  return (
    <ButtonBase
      component="button"
      type="button"
      disabled={!onClick}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      aria-label={
        ariaLabel ||
        `${t('projectTasks.columns.status', { defaultValue: 'Status' })}: ${label}`
      }
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        px: '9px',
        py: '3px',
        borderRadius: '999px',
        fontSize: '11.5px',
        fontWeight: 650,
        whiteSpace: 'nowrap',
        color: config.color,
        bgcolor: alpha(config.color, isDark ? 0.16 : 0.1),
        border: `1px solid ${alpha(config.color, isDark ? 0.32 : 0.22)}`,
        transition: 'all 0.15s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              bgcolor: alpha(config.color, isDark ? 0.24 : 0.16),
              borderColor: alpha(config.color, 0.45),
            }
          : {},
      }}
    >
      <Box
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: config.dotColor,
          flexShrink: 0,
        }}
      />
      <span>{label}</span>
    </ButtonBase>
  );
};

export const DueChip = ({ task }: { task: ProjectTaskItemData }) => {
  const { t } = useTranslation();
  if (!task.dueDate) return null;
  const color =
    task.dueDateHighlight === 'overdue'
      ? '#ef4444'
      : task.dueDateHighlight === 'today'
        ? '#10b981'
        : undefined;
  return (
    <Tooltip
      title={
        task.dueDateHighlight === 'overdue' ? t('tasks.dates.overdue') : ''
      }
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11.5px',
          fontWeight: 600,
          px: '7px',
          py: '2px',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
          bgcolor: color ? alpha(color, 0.12) : 'transparent',
          color: color ?? 'text.secondary',
          border: color ? `1px solid ${alpha(color, 0.28)}` : 'none',
        }}
      >
        <EventOutlinedIcon sx={{ fontSize: 13, opacity: 0.85 }} />
        {task.dueDate}
      </Box>
    </Tooltip>
  );
};

/** Icon and name on desktop; just the icon where space is short. */
export const PriorityChip = ({
  task,
  compact,
}: {
  task: ProjectTaskItemData;
  compact?: boolean;
}) => {
  const { t } = useTranslation();
  if (!task.priority || task.priority === 'None') return null;
  const config = getPriorityConfig(task.priority);
  const label = t(`tasks.priority.${task.priority.toLowerCase()}`, {
    defaultValue: config.label,
  });
  if (compact) {
    return (
      <Tooltip title={label}>
        <Box sx={{ display: 'inline-flex' }} aria-label={label}>
          <PriorityBadge priority={task.priority} size={16} />
        </Box>
      </Tooltip>
    );
  }
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        px: '7px',
        py: '2px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        bgcolor: alpha(config.color, 0.12),
        color: config.color,
        border: `1px solid ${alpha(config.color, 0.25)}`,
      }}
    >
      <PriorityBadge priority={task.priority} size={14} />
      {label}
    </Box>
  );
};

export const ProjectTaskItem: React.FC<ProjectTaskItemProps> = ({
  task,
  showProject = true,
  onTaskClick,
  onToggleComplete,
  onChangeStatus,
  onDeleteTask,
  onToggleSubtask,
  onAddSubtask,
  selectionMode = false,
  selected = false,
  onToggleSelect,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isSubtasksExpanded, setIsSubtasksExpanded] = useState(false);
  const [statusAnchor, setStatusAnchor] = useState<HTMLElement | null>(null);
  const [actionAnchor, setActionAnchor] = useState<HTMLElement | null>(null);

  const subtasks = task.subtasks ?? [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const isDone = Boolean(task.completed) || task.status === 'completed';

  const activate = () =>
    selectionMode ? onToggleSelect?.(task) : onTaskClick?.(task);

  const subtasksToggle = subtasks.length > 0 && (
    <Box
      component="button"
      type="button"
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSubtasksExpanded((v) => !v);
      }}
      aria-expanded={isSubtasksExpanded}
      aria-label={t('projectTasks.toggleSubtasks')}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.8,
        px: '6px',
        py: '2px',
        borderRadius: '5px',
        font: 'inherit',
        cursor: 'pointer',
        border: 'none',
        bgcolor: 'transparent',
        flexShrink: 0,
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 5,
          borderRadius: 3,
          bgcolor: (thm) => surfaceColor(thm, '#2a2c36', '#3A3A3A', '#e5e7eb'),
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: `${Math.round((completedSubtasks / subtasks.length) * 100)}%`,
            height: '100%',
            bgcolor: (thm) =>
              thm.palette.mode === 'dark' ? '#2dd4bf' : '#008767',
            borderRadius: 3,
            transition: 'width 0.3s ease',
          }}
        />
      </Box>
      <Typography
        sx={{
          fontSize: '11.5px',
          color: (thm) => (thm.palette.mode === 'dark' ? '#8a8f98' : '#6b7280'),
          fontWeight: 600,
          fontFamily: 'monospace',
        }}
      >
        {completedSubtasks}/{subtasks.length}
      </Typography>
      <KeyboardArrowDownIcon
        sx={{
          fontSize: 14,
          color: 'text.secondary',
          transition: 'transform 0.15s ease',
          transform: isSubtasksExpanded ? 'rotate(180deg)' : 'none',
        }}
      />
    </Box>
  );

  const workspaceChip = task.workspaceTitle && (
    <Tooltip
      title={`${t('projectTasks.linkedDocument')}: ${task.workspaceTitle}`}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          minWidth: 0,
          maxWidth: 160,
          px: '6px',
          py: '2px',
          borderRadius: '5px',
          fontSize: '11px',
          fontWeight: 600,
          color: 'info.main',
          bgcolor: (thm) => alpha(thm.palette.info.main, 0.1),
          flexShrink: 1,
        }}
      >
        <DescriptionOutlinedIcon sx={{ fontSize: 13, flexShrink: 0 }} />
        <Box
          component="span"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {task.workspaceTitle}
        </Box>
      </Box>
    </Tooltip>
  );

  return (
    <Box
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        borderLeft: task.color
          ? `3.5px solid ${task.color}`
          : '3.5px solid transparent',
        bgcolor: selected
          ? alpha('#008767', isDark ? 0.12 : 0.06)
          : task.color
            ? alpha(task.color, isDark ? 0.08 : 0.04)
            : 'background.paper',
        transition: 'all 0.12s ease',
        '&:hover': {
          bgcolor: selected
            ? alpha('#008767', isDark ? 0.16 : 0.09)
            : task.color
              ? alpha(task.color, isDark ? 0.14 : 0.08)
              : isDark
                ? 'rgba(255, 255, 255, 0.025)'
                : 'rgba(15, 23, 42, 0.02)',
        },
      }}
    >
      <Box
        role="button"
        tabIndex={0}
        aria-label={task.title}
        onClick={activate}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
          }
        }}
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '32px minmax(0, 1fr) auto',
            md: columns(showProject),
          },
          alignItems: 'center',
          columnGap: { xs: 1, sm: 1.5 },
          px: { xs: 1.5, sm: 2.25 },
          py: 1.15,
          cursor: 'pointer',
          '&:focus-visible': {
            outline: '2px solid #008767',
            outlineOffset: -2,
          },
        }}
      >
        {/* Complete (or select) */}
        <Box
          className="checkbox-cell"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (selectionMode) {
              onToggleSelect?.(task);
            } else {
              onToggleComplete?.(task);
            }
          }}
        >
          <Checkbox
            size="small"
            checked={Boolean(selectionMode ? selected : isDone)}
            onChange={(e) => {
              e.stopPropagation();
              if (selectionMode) {
                onToggleSelect?.(task);
              } else {
                onToggleComplete?.(task);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            slotProps={{ input: { 'aria-label': task.title } }}
            icon={
              <Box
                sx={{
                  width: 17,
                  height: 17,
                  borderRadius: '4px',
                  border: (thm) =>
                    thm.palette.mode === 'dark'
                      ? '1.5px solid #3a3d48'
                      : '1.5px solid #d1d5db',
                  bgcolor: 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#008767',
                  },
                }}
              />
            }
            checkedIcon={
              <Box
                sx={{
                  width: 17,
                  height: 17,
                  borderRadius: '4px',
                  bgcolor: '#008767',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckIcon sx={{ fontSize: 13, color: '#ffffff' }} />
              </Box>
            }
            sx={{
              padding: 0,
            }}
          />
        </Box>

        {/* Title, with its details underneath on small screens */}
        <Box sx={{ minWidth: 0 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}
          >
            <Typography
              noWrap
              sx={{
                fontSize: '13.5px',
                fontWeight: 550,
                color: isDone ? 'text.disabled' : 'text.primary',
                textDecoration: isDone ? 'line-through' : 'none',
                minWidth: 0,
                flex: '0 1 auto',
              }}
            >
              {task.title}
            </Typography>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 0.75,
                minWidth: 0,
              }}
            >
              {subtasksToggle}
              {workspaceChip}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 0.75,
              mt: 0.6,
              minWidth: 0,
            }}
          >
            {showProject && <ProjectChip task={task} />}
            <StatusChip
              task={task}
              onClick={
                !selectionMode && onChangeStatus
                  ? (e) => setStatusAnchor(e.currentTarget)
                  : undefined
              }
            />
            <DueChip task={task} />
            <PriorityChip task={task} compact />
            {subtasksToggle}
            {workspaceChip}
          </Box>
        </Box>

        {/* Desktop columns */}
        {showProject && (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, minWidth: 0 }}>
            <ProjectChip task={task} />
          </Box>
        )}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, minWidth: 0 }}>
          <StatusChip
            task={task}
            ariaLabel={t('projectTasks.changeStatus')}
            onClick={
              !selectionMode && onChangeStatus
                ? (e) => setStatusAnchor(e.currentTarget)
                : undefined
            }
          />
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <PriorityChip task={task} />
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <DueChip task={task} />
        </Box>
        <Typography
          sx={{
            display: { xs: 'none', md: 'block' },
            fontSize: '11.5px',
            fontWeight: 500,
            color: 'text.secondary',
            textAlign: 'right',
          }}
        >
          {task.duration}
        </Typography>

        {/* Actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 0.5,
          }}
        >
          {task.attendees && task.attendees.length > 0 && (
            <Tooltip
              title={t('projectTasks.attendees', {
                names: task.attendees.map((a) => a.name).join(', '),
              })}
            >
              <AvatarGroup
                max={3}
                aria-label={t('projectTasks.attendees', {
                  names: task.attendees.map((a) => a.name).join(', '),
                })}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 22,
                    height: 22,
                    fontSize: '10px',
                    fontWeight: 700,
                  },
                }}
              >
                {task.attendees.map((attendee) => (
                  <Avatar
                    key={attendee.name}
                    src={attendee.avatarUrl}
                    sx={{
                      bgcolor: attendee.color || '#0d9488',
                      color: '#ffffff',
                    }}
                  >
                    {attendee.initials}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Tooltip>
          )}
          {!selectionMode && (
            <Tooltip
              title={t('tasks.columns.actions', { defaultValue: 'Acciones' })}
            >
              <IconButton
                size="small"
                aria-label={t('tasks.columns.actions', {
                  defaultValue: 'Acciones',
                })}
                aria-haspopup="menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setActionAnchor(e.currentTarget);
                }}
                sx={{
                  p: 0.5,
                  color: 'text.secondary',
                  borderRadius: '6px',
                  '&:hover': {
                    bgcolor: (thm) =>
                      thm.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.06)'
                        : '#f3f4f6',
                    color: 'text.primary',
                  },
                }}
              >
                <MoreHorizIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Row Contextual Action Menu */}
      <Menu
        anchorEl={actionAnchor}
        open={Boolean(actionAnchor)}
        onClose={() => setActionAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            minWidth: '180px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            p: 0.5,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setActionAnchor(null);
            onTaskClick?.(task);
          }}
          sx={{ gap: 1.2, py: 0.8, borderRadius: '6px' }}
        >
          <ListItemIcon sx={{ minWidth: 'auto', color: 'text.secondary' }}>
            <EditOutlinedIcon sx={{ fontSize: 17 }} />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{ fontSize: '13px', fontWeight: 500 }}
          >
            {t('tasks.actions.editTask', { defaultValue: 'Editar tarea' })}
          </ListItemText>
        </MenuItem>

        {onChangeStatus && (
          <MenuItem
            onClick={() => {
              const anchor = actionAnchor;
              setActionAnchor(null);
              if (anchor) setStatusAnchor(anchor);
            }}
            sx={{ gap: 1.2, py: 0.8, borderRadius: '6px' }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', color: 'text.secondary' }}>
              <SyncAltIcon sx={{ fontSize: 17 }} />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ fontSize: '13px', fontWeight: 500 }}
            >
              {t('projectTasks.changeStatus', {
                defaultValue: 'Cambiar estado',
              })}
            </ListItemText>
          </MenuItem>
        )}

        {onDeleteTask && <Divider sx={{ my: 0.5 }} />}

        {onDeleteTask && (
          <MenuItem
            onClick={() => {
              setActionAnchor(null);
              onDeleteTask(task);
            }}
            sx={{
              gap: 1.2,
              py: 0.8,
              borderRadius: '6px',
              color: 'error.main',
              '&:hover': {
                bgcolor: (thm) =>
                  thm.palette.mode === 'dark'
                    ? 'rgba(239, 68, 68, 0.12)'
                    : 'rgba(239, 68, 68, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', color: 'inherit' }}>
              <DeleteOutlineRoundedIcon sx={{ fontSize: 17 }} />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'inherit',
              }}
            >
              {t('tasks.actions.deleteTask', {
                defaultValue: 'Eliminar tarea',
              })}
            </ListItemText>
          </MenuItem>
        )}
      </Menu>

      <ProjectStatusMenu
        anchorEl={statusAnchor}
        onClose={() => setStatusAnchor(null)}
        current={task.status}
        onSelect={(status) => onChangeStatus?.(task, status)}
      />

      {subtasks.length > 0 && (
        <Collapse in={isSubtasksExpanded} timeout={180} unmountOnExit>
          <ProjectTaskSubtasks
            subtasks={subtasks}
            onToggleSubtask={(subId) => onToggleSubtask?.(task.id, subId)}
            onAddSubtask={(title) => onAddSubtask?.(task.id, title)}
          />
        </Collapse>
      )}
    </Box>
  );
};

export interface ProjectTaskColumnsProps {
  showProject?: boolean;
  selectionMode?: boolean;
  onToggleSelectAll?: () => void;
  isAllSelected?: boolean;
  isSomeSelected?: boolean;
}

/** Column titles header at the top of the unified table card. */
export const ProjectTaskColumns: React.FC<ProjectTaskColumnsProps> = ({
  showProject = true,
  onToggleSelectAll,
  isAllSelected = false,
  isSomeSelected = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const colHeader = (
    text: string,
    icon?: React.ReactNode,
    align: 'left' | 'right' = 'left',
  ) => (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        gap: 0.6,
        fontSize: '11.5px',
        fontWeight: 650,
        color: 'text.secondary',
        textAlign: align,
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      <span>{text}</span>
    </Box>
  );

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'grid' },
        gridTemplateColumns: columns(showProject),
        columnGap: 1.5,
        alignItems: 'center',
        px: 2.25,
        py: 1.15,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: onToggleSelectAll ? 'pointer' : 'default',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelectAll?.();
        }}
      >
        <Checkbox
          checked={isAllSelected}
          indeterminate={isSomeSelected}
          onChange={(e) => {
            e.stopPropagation();
            onToggleSelectAll?.();
          }}
          onClick={(e) => e.stopPropagation()}
          size="small"
          inputProps={{
            'aria-label': t('selection.selectAll', {
              defaultValue: 'Seleccionar todo',
            }),
          }}
          icon={
            <Box
              sx={{
                width: 17,
                height: 17,
                borderRadius: '4px',
                border: (thm) =>
                  thm.palette.mode === 'dark'
                    ? '1.5px solid #3a3d48'
                    : '1.5px solid #d1d5db',
                bgcolor: 'transparent',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: '#008767',
                },
              }}
            />
          }
          checkedIcon={
            <Box
              sx={{
                width: 17,
                height: 17,
                borderRadius: '4px',
                bgcolor: '#008767',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckIcon sx={{ fontSize: 13, color: '#ffffff' }} />
            </Box>
          }
          indeterminateIcon={
            <Box
              sx={{
                width: 17,
                height: 17,
                borderRadius: '4px',
                bgcolor: '#008767',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 9,
                  height: 2,
                  bgcolor: '#ffffff',
                  borderRadius: '1px',
                }}
              />
            </Box>
          }
          sx={{ padding: 0 }}
        />
      </Box>
      {colHeader(t('projectTasks.columns.task'))}
      {showProject &&
        colHeader(
          t('projectTasks.columns.project'),
          <GridViewOutlinedIcon sx={{ fontSize: 13.5, opacity: 0.75 }} />,
        )}
      {colHeader(
        t('projectTasks.columns.status', { defaultValue: 'Status' }),
        <AdjustRoundedIcon sx={{ fontSize: 13.5, opacity: 0.75 }} />,
      )}
      {colHeader(
        t('projectTasks.columns.priority'),
        <FlagOutlinedIcon sx={{ fontSize: 13.5, opacity: 0.75 }} />,
      )}
      {colHeader(
        t('projectTasks.columns.due'),
        <EventOutlinedIcon sx={{ fontSize: 13.5, opacity: 0.75 }} />,
      )}
      {colHeader(t('projectTasks.columns.estimate'), undefined, 'right')}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 0.5 }}>
        <FilterListRoundedIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
      </Box>
    </Box>
  );
};
