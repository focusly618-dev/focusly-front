import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  ButtonBase,
  Collapse,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import { ProjectTaskItem } from './ProjectTaskItem';
import type {
  ProjectStatusConfig,
  ProjectTaskItemData,
  ProjectTaskStatusId,
} from './projectTasks.types';

export interface ProjectTaskStatusGroupProps {
  status: ProjectStatusConfig;
  tasks: ProjectTaskItemData[];
  showProject?: boolean;
  onTaskClick?: (task: ProjectTaskItemData) => void;
  onToggleComplete?: (task: ProjectTaskItemData) => void;
  onChangeStatus?: (
    task: ProjectTaskItemData,
    status: ProjectTaskStatusId,
  ) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
  /** An empty title asks for the full task form. */
  onAddTask?: (statusId: string, title: string) => void;
  defaultExpanded?: boolean;
  selectionMode?: boolean;
  isSelected?: (taskId: string) => boolean;
  onToggleSelect?: (task: ProjectTaskItemData) => void;
}

export const ProjectTaskStatusGroup: React.FC<ProjectTaskStatusGroupProps> = ({
  status,
  tasks,
  showProject,
  onTaskClick,
  onToggleComplete,
  onChangeStatus,
  onToggleSubtask,
  onAddSubtask,
  onAddTask,
  defaultExpanded = true,
  selectionMode = false,
  isSelected,
  onToggleSelect,
}) => {
  const { t } = useTranslation();
  const statusLabel = t(status.labelKey, { defaultValue: status.label });
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const groupId = `project-status-${status.id}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTaskTitle.trim()) {
      e.preventDefault();
      onAddTask?.(status.id, newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAddingTask(false);
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
      setNewTaskTitle('');
    }
  };

  return (
    <Box component="section" aria-labelledby={`${groupId}-title`}>
      {/* ── Header ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          mb: 0.75,
        }}
      >
        <ButtonBase
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          aria-controls={groupId}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 0.5,
            px: 0.75,
            borderRadius: '8px',
            '&:hover': { bgcolor: 'action.hover' },
            '&.Mui-focusVisible': { outline: '2px solid #008767' },
          }}
        >
          <KeyboardArrowDownIcon
            sx={{
              fontSize: 18,
              color: 'text.secondary',
              transition: 'transform 0.15s ease',
              transform: isExpanded ? 'none' : 'rotate(-90deg)',
            }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: status.dotColor,
              boxShadow: `0 0 6px ${alpha(status.dotColor, 0.6)}`,
            }}
          />
          <Typography
            id={`${groupId}-title`}
            component="h3"
            sx={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: 'text.primary',
              letterSpacing: '-0.01em',
            }}
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
              fontWeight: 650,
              bgcolor: alpha(status.dotColor, 0.14),
              color: status.dotColor,
              minWidth: 20,
              textAlign: 'center',
            }}
          >
            {tasks.length}
          </Box>
        </ButtonBase>

        {!selectionMode && (
          <Tooltip title={t('projectTasks.addTo', { status: statusLabel })}>
            <IconButton
              size="small"
              aria-label={t('projectTasks.addTo', { status: statusLabel })}
              onClick={() => {
                setIsExpanded(true);
                setIsAddingTask(true);
              }}
              sx={{ p: '3px', color: 'text.secondary', borderRadius: '6px' }}
            >
              <AddIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* ── Tasks ── */}
      <Collapse in={isExpanded} timeout={200} unmountOnExit>
        <Box
          id={groupId}
          sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          {tasks.map((task) => (
            <ProjectTaskItem
              key={task.id}
              task={task}
              showProject={showProject}
              onTaskClick={onTaskClick}
              onToggleComplete={onToggleComplete}
              onChangeStatus={onChangeStatus}
              onToggleSubtask={onToggleSubtask}
              onAddSubtask={onAddSubtask}
              selectionMode={selectionMode}
              selected={isSelected?.(task.id)}
              onToggleSelect={onToggleSelect}
            />
          ))}

          {/* Quick add */}
          {!selectionMode &&
            (isAddingTask ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.75,
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <AddIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
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
                  sx={{ fontSize: '13px' }}
                />
              </Box>
            ) : (
              <ButtonBase
                onClick={() => setIsAddingTask(true)}
                sx={{
                  justifyContent: 'flex-start',
                  gap: 1,
                  px: 2,
                  py: 0.85,
                  borderRadius: '10px',
                  color: 'text.secondary',
                  fontSize: '13px',
                  fontWeight: 500,
                  '&:hover': { bgcolor: 'action.hover' },
                  '&.Mui-focusVisible': { outline: '2px solid #008767' },
                }}
              >
                <AddIcon sx={{ fontSize: 16 }} />
                {t('projectTasks.addTo', { status: statusLabel })}
              </ButtonBase>
            ))}
        </Box>
      </Collapse>
    </Box>
  );
};
