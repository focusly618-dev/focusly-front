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
  useTheme,
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
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const statusLabel = t(status.labelKey, { defaultValue: status.label });
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const groupId = `project-status-${status.id}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTaskTitle.trim()) {
      e.preventDefault();
      onAddTask?.(status.id, newTaskTitle.trim());
      // Stays open for the next one; Esc or leaving it empty closes it.
      setNewTaskTitle('');
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
      setNewTaskTitle('');
    }
  };

  return (
    <Box component="section" aria-labelledby={`${groupId}-title`}>
      {/* ── Section Header Row Inside Unified Table ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          px: { xs: 1.5, sm: 2.25 },
          py: 0.9,
          bgcolor: isDark
            ? 'rgba(255, 255, 255, 0.015)'
            : 'rgba(248, 250, 252, 0.75)',
          borderBottom: '1px solid',
          borderColor: 'divider',
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
            py: 0.35,
            px: 0.5,
            borderRadius: '6px',
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
              boxShadow: `0 0 6px ${alpha(status.dotColor, 0.5)}`,
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
              fontWeight: 700,
              bgcolor: alpha(status.dotColor, isDark ? 0.18 : 0.12),
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

      {/* ── Tasks + Inline Quick Add Row ── */}
      <Collapse in={isExpanded} timeout={200} unmountOnExit>
        <Box id={groupId} sx={{ display: 'flex', flexDirection: 'column' }}>
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

          {/* Quick add row inside the table */}
          {!selectionMode &&
            (isAddingTask ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  px: { xs: 1.5, sm: 2.5 },
                  py: 0.9,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: isDark
                    ? 'rgba(255, 255, 255, 0.02)'
                    : 'rgba(0, 135, 103, 0.03)',
                }}
              >
                <AddIcon sx={{ fontSize: 16, color: '#008767' }} />
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
                  width: '100%',
                  justifyContent: 'flex-start',
                  gap: 1,
                  px: { xs: 1.5, sm: 2.5 },
                  py: 0.9,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  color: 'text.secondary',
                  fontSize: '12.5px',
                  fontWeight: 550,
                  transition: 'background-color 0.12s ease, color 0.12s ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'text.primary',
                  },
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
