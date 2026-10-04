import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  AvatarGroup,
  Box,
  Checkbox,
  Collapse,
  IconButton,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import { ProjectTaskSubtasks } from './ProjectTaskSubtasks';
import { ProjectStatusMenu } from './ProjectStatusMenu';
import {
  PriorityBadge,
  getPriorityConfig,
  ModernFolderOutlinedIcon,
  ModernFolderFilledIcon,
  isCustomEmoji,
} from '@/components/ui';
import type {
  ProjectTaskItemData,
  ProjectTaskStatusId,
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
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
  /** Selection mode: the row toggles selection instead of opening. */
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (task: ProjectTaskItemData) => void;
}

// Desktop columns, aligned across rows (every width but the title's is
// fixed): check · title · [project] · due · priority · estimate · actions.
const columns = (showProject: boolean) =>
  showProject
    ? '28px minmax(0, 1fr) 150px 92px 96px 52px 60px'
    : '28px minmax(0, 1fr) 92px 96px 52px 60px';

const ProjectChip = ({ task }: { task: ProjectTaskItemData }) => {
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
          gap: '4px',
          maxWidth: '100%',
          px: '7px',
          py: '2px',
          borderRadius: '5px',
          fontSize: '11px',
          fontWeight: 600,
          color,
          bgcolor: alpha(color, isDark ? 0.15 : 0.08),
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

const DueChip = ({ task }: { task: ProjectTaskItemData }) => {
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
          gap: '3px',
          fontSize: '11px',
          fontWeight: 600,
          px: '7px',
          py: '2px',
          borderRadius: '5px',
          whiteSpace: 'nowrap',
          bgcolor: color ? alpha(color, 0.14) : 'action.hover',
          color: color ?? 'text.secondary',
          border: '1px solid',
          borderColor: color ? alpha(color, 0.3) : 'divider',
        }}
      >
        <EventOutlinedIcon sx={{ fontSize: 12 }} />
        {task.dueDate}
      </Box>
    </Tooltip>
  );
};

/** Icon and name on desktop; just the icon where space is short. */
const PriorityChip = ({
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
        px: '6px',
        py: '2px',
        borderRadius: '5px',
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
  onToggleSubtask,
  onAddSubtask,
  selectionMode = false,
  selected = false,
  onToggleSelect,
}) => {
  const { t } = useTranslation();
  const [isSubtasksExpanded, setIsSubtasksExpanded] = useState(false);
  const [statusAnchor, setStatusAnchor] = useState<HTMLElement | null>(null);

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
        gap: '4px',
        px: '6px',
        py: '2px',
        borderRadius: '5px',
        font: 'inherit',
        fontSize: '11px',
        fontWeight: 600,
        cursor: 'pointer',
        flexShrink: 0,
        color: completedSubtasks > 0 ? '#10b981' : 'text.secondary',
        bgcolor:
          completedSubtasks > 0 ? alpha('#10b981', 0.12) : 'action.hover',
        border: '1px solid',
        borderColor: completedSubtasks > 0 ? alpha('#10b981', 0.25) : 'divider',
        '&:focus-visible': { outline: '2px solid #008767' },
      }}
    >
      <FormatListBulletedIcon sx={{ fontSize: 12 }} />
      {t('tasks.subtasksCount', {
        completed: completedSubtasks,
        total: subtasks.length,
        defaultValue: `${completedSubtasks}/${subtasks.length}`,
      })}
      <KeyboardArrowDownIcon
        sx={{
          fontSize: 14,
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
          bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
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
        borderRadius: '10px',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: selected ? '#008767' : 'divider',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          borderColor: selected ? '#008767' : 'action.disabled',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? 'none'
              : '0 2px 8px rgba(15, 23, 42, 0.06)',
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
            xs: '28px minmax(0, 1fr) auto',
            md: columns(showProject),
          },
          alignItems: 'center',
          columnGap: { xs: 1, sm: 1.5 },
          px: { xs: 1.25, sm: 2 },
          py: 1.1,
          cursor: 'pointer',
          borderRadius: '10px',
          '&:focus-visible': {
            outline: '2px solid #008767',
            outlineOffset: -2,
          },
        }}
      >
        {/* Complete (or select) */}
        {selectionMode ? (
          <Checkbox
            size="small"
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggleSelect?.(task)}
            sx={{ p: 0.25, '&.Mui-checked': { color: '#008767' } }}
            slotProps={{ input: { 'aria-label': task.title } }}
          />
        ) : (
          <IconButton
            size="small"
            aria-label={
              isDone
                ? t('projectTasks.markNotDone')
                : t('projectTasks.markDone')
            }
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete?.(task);
            }}
            sx={{
              p: 0.25,
              color: isDone ? '#10b981' : 'text.disabled',
              '&:hover': { color: '#10b981' },
            }}
          >
            {isDone ? (
              <CheckCircleIcon sx={{ fontSize: 19 }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 19 }} />
            )}
          </IconButton>
        )}

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
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <DueChip task={task} />
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <PriorityChip task={task} />
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
          {!selectionMode && onChangeStatus && (
            <Tooltip title={t('projectTasks.changeStatus')}>
              <IconButton
                size="small"
                aria-label={t('projectTasks.changeStatus')}
                aria-haspopup="menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setStatusAnchor(e.currentTarget);
                }}
                sx={{ p: 0.5, color: 'text.secondary' }}
              >
                <MoreHorizIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

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

/** Column titles over the rows, on screens wide enough for columns. */
export const ProjectTaskColumns: React.FC<{ showProject?: boolean }> = ({
  showProject = true,
}) => {
  const { t } = useTranslation();
  const label = (text: string, align: 'left' | 'right' = 'left') => (
    <Typography
      component="span"
      sx={{
        fontSize: '10.5px',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'text.secondary',
        textAlign: align,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </Typography>
  );
  return (
    <Box
      aria-hidden
      sx={{
        display: { xs: 'none', md: 'grid' },
        gridTemplateColumns: columns(showProject),
        columnGap: 1.5,
        alignItems: 'center',
        px: 2,
        border: '1px solid transparent',
        mb: 0.5,
      }}
    >
      <span />
      {label(t('projectTasks.columns.task'))}
      {showProject && label(t('projectTasks.columns.project'))}
      {label(t('projectTasks.columns.due'))}
      {label(t('projectTasks.columns.priority'))}
      {label(t('projectTasks.columns.estimate'), 'right')}
      <span />
    </Box>
  );
};
