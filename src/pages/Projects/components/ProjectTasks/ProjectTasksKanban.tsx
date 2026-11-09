import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  ButtonBase,
  Checkbox,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { ProjectStatusMenu } from './ProjectStatusMenu';
import { DueChip, PriorityChip, ProjectChip } from './ProjectTaskItem';
import type {
  ProjectStatusConfig,
  ProjectTaskItemData,
  ProjectTaskStatusId,
} from './projectTasks.types';
import { tasksInStatus, visibleStatuses } from './projectTaskFilters';

export interface ProjectTasksKanbanProps {
  tasks: ProjectTaskItemData[];
  showEmptyStatuses?: boolean;
  showProject?: boolean;
  onTaskClick?: (task: ProjectTaskItemData) => void;
  onToggleComplete?: (task: ProjectTaskItemData) => void;
  onChangeStatus?: (
    task: ProjectTaskItemData,
    status: ProjectTaskStatusId,
  ) => void;
  onAddTask?: (statusId: string, title: string) => void;
  selectionMode?: boolean;
  isSelected?: (taskId: string) => boolean;
  onToggleSelect?: (task: ProjectTaskItemData) => void;
}

const KanbanCard: React.FC<{
  task: ProjectTaskItemData;
  showProject?: boolean;
  onTaskClick?: (task: ProjectTaskItemData) => void;
  onToggleComplete?: (task: ProjectTaskItemData) => void;
  onChangeStatus?: (
    task: ProjectTaskItemData,
    status: ProjectTaskStatusId,
  ) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (task: ProjectTaskItemData) => void;
}> = ({
  task,
  showProject = true,
  onTaskClick,
  onToggleComplete,
  onChangeStatus,
  selectionMode = false,
  selected = false,
  onToggleSelect,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [statusAnchor, setStatusAnchor] = useState<HTMLElement | null>(null);
  const isDone = Boolean(task.completed) || task.status === 'completed';
  const subtasks = task.subtasks ?? [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;

  const activate = () =>
    selectionMode ? onToggleSelect?.(task) : onTaskClick?.(task);

  return (
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
        p: 1.5,
        borderRadius: '10px',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: selected ? '#008767' : 'divider',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          borderColor: selected ? '#008767' : 'action.disabled',
          boxShadow: isDark
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(15, 23, 42, 0.06)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        {selectionMode ? (
          <Checkbox
            size="small"
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggleSelect?.(task)}
            sx={{ p: 0.25, mt: -0.25, '&.Mui-checked': { color: '#008767' } }}
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
              mt: -0.1,
              color: isDone ? '#10b981' : 'text.disabled',
              '&:hover': { color: '#10b981' },
            }}
          >
            {isDone ? (
              <CheckCircleIcon sx={{ fontSize: 18 }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        )}

        <Typography
          sx={{
            flex: 1,
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: 1.35,
            color: isDone ? 'text.disabled' : 'text.primary',
            textDecoration: isDone ? 'line-through' : 'none',
            wordBreak: 'break-word',
          }}
        >
          {task.title}
        </Typography>

        {!selectionMode && onChangeStatus && (
          <Tooltip title={t('projectTasks.changeStatus')}>
            <IconButton
              size="small"
              aria-label={t('projectTasks.changeStatus')}
              onClick={(e) => {
                e.stopPropagation();
                setStatusAnchor(e.currentTarget);
              }}
              sx={{ p: 0.25, mt: -0.25, color: 'text.secondary' }}
            >
              <MoreHorizIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 0.65,
        }}
      >
        {showProject && <ProjectChip task={task} />}
        <PriorityChip task={task} />
        <DueChip task={task} />
        {subtasks.length > 0 && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              px: '6px',
              py: '2px',
              borderRadius: '5px',
              fontSize: '10.5px',
              fontWeight: 600,
              color: completedSubtasks > 0 ? '#10b981' : 'text.secondary',
              bgcolor:
                completedSubtasks > 0 ? alpha('#10b981', 0.12) : 'action.hover',
            }}
          >
            <FormatListBulletedIcon sx={{ fontSize: 12 }} />
            {`${completedSubtasks}/${subtasks.length}`}
          </Box>
        )}
        {task.workspaceTitle && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              maxWidth: 140,
              px: '6px',
              py: '2px',
              borderRadius: '5px',
              fontSize: '10.5px',
              fontWeight: 600,
              color: 'info.main',
              bgcolor: (thm) => alpha(thm.palette.info.main, 0.1),
            }}
          >
            <DescriptionOutlinedIcon sx={{ fontSize: 12, flexShrink: 0 }} />
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
        )}
      </Box>

      <ProjectStatusMenu
        anchorEl={statusAnchor}
        onClose={() => setStatusAnchor(null)}
        current={task.status}
        onSelect={(status) => onChangeStatus?.(task, status)}
      />
    </Box>
  );
};

const KanbanColumn: React.FC<{
  status: ProjectStatusConfig;
  tasks: ProjectTaskItemData[];
  showProject?: boolean;
  onTaskClick?: (task: ProjectTaskItemData) => void;
  onToggleComplete?: (task: ProjectTaskItemData) => void;
  onChangeStatus?: (
    task: ProjectTaskItemData,
    status: ProjectTaskStatusId,
  ) => void;
  onAddTask?: (statusId: string, title: string) => void;
  selectionMode?: boolean;
  isSelected?: (taskId: string) => boolean;
  onToggleSelect?: (task: ProjectTaskItemData) => void;
}> = ({
  status,
  tasks,
  showProject,
  onTaskClick,
  onToggleComplete,
  onChangeStatus,
  onAddTask,
  selectionMode,
  isSelected,
  onToggleSelect,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const statusLabel = t(status.labelKey, { defaultValue: status.label });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTaskTitle.trim()) {
      e.preventDefault();
      onAddTask?.(status.id, newTaskTitle.trim());
      setNewTaskTitle('');
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
      setNewTaskTitle('');
    }
  };

  return (
    <Box
      component="section"
      sx={{
        flex: '0 0 280px',
        minWidth: 280,
        maxWidth: 320,
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: isDark ? 'rgba(255, 255, 255, 0.015)' : '#f8fafc',
        p: 1.25,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        alignSelf: 'flex-start',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 0.5,
          py: 0.25,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: status.dotColor,
            }}
          />
          <Typography
            component="h3"
            sx={{ fontSize: '13px', fontWeight: 700, color: 'text.primary' }}
          >
            {statusLabel}
          </Typography>
          <Box
            component="span"
            sx={{
              px: '7px',
              py: '1px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 700,
              bgcolor: alpha(status.dotColor, 0.14),
              color: status.dotColor,
            }}
          >
            {tasks.length}
          </Box>
        </Box>

        {!selectionMode && (
          <IconButton
            size="small"
            aria-label={t('projectTasks.addTo', { status: statusLabel })}
            onClick={() => setIsAddingTask(true)}
            sx={{ p: '3px', color: 'text.secondary', borderRadius: '6px' }}
          >
            <AddIcon sx={{ fontSize: 17 }} />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            showProject={showProject}
            onTaskClick={onTaskClick}
            onToggleComplete={onToggleComplete}
            onChangeStatus={onChangeStatus}
            selectionMode={selectionMode}
            selected={isSelected?.(task.id)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </Box>

      {!selectionMode &&
        (isAddingTask ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.25,
              py: 0.75,
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <AddIcon sx={{ fontSize: 15, color: '#008767' }} />
            <InputBase
              autoFocus
              fullWidth
              placeholder={t('projectTasks.quickAddPlaceholder', {
                status: statusLabel,
              })}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (!newTaskTitle.trim()) setIsAddingTask(false);
              }}
              inputProps={{
                'aria-label': t('projectTasks.addTo', {
                  status: statusLabel,
                }),
              }}
              sx={{ fontSize: '12.5px' }}
            />
          </Box>
        ) : (
          <ButtonBase
            onClick={() => setIsAddingTask(true)}
            sx={{
              justifyContent: 'flex-start',
              gap: 0.75,
              px: 1,
              py: 0.7,
              borderRadius: '8px',
              color: 'text.secondary',
              fontSize: '12.5px',
              fontWeight: 550,
              '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
            {t('projectTasks.addTo', { status: statusLabel })}
          </ButtonBase>
        ))}
    </Box>
  );
};

export const ProjectTasksKanban: React.FC<ProjectTasksKanbanProps> = ({
  tasks,
  showEmptyStatuses = false,
  showProject = true,
  ...handlers
}) => (
  <Box
    sx={{
      display: 'flex',
      gap: 1.75,
      overflowX: 'auto',
      pb: 1.5,
      alignItems: 'flex-start',
    }}
  >
    {visibleStatuses(tasks, showEmptyStatuses).map((status) => (
      <KanbanColumn
        key={status.id}
        status={status}
        tasks={tasksInStatus(tasks, status)}
        showProject={showProject}
        {...handlers}
      />
    ))}
  </Box>
);
