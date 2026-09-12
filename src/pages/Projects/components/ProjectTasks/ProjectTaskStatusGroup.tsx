import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  useTheme,
  Collapse,
  alpha,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { ProjectTaskItem } from './ProjectTaskItem';
import type {
  ProjectStatusConfig,
  ProjectTaskItemData,
} from './projectTasks.types';

export interface ProjectTaskStatusGroupProps {
  status: ProjectStatusConfig;
  tasks: ProjectTaskItemData[];
  onTaskClick?: (task: ProjectTaskItemData) => void;
  onToggleComplete?: (task: ProjectTaskItemData) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
  onAddTask?: (statusId: string, title: string) => void;
  defaultExpanded?: boolean;
}

export const ProjectTaskStatusGroup: React.FC<ProjectTaskStatusGroupProps> = ({
  status,
  tasks,
  onTaskClick,
  onToggleComplete,
  onToggleSubtask,
  onAddSubtask,
  onAddTask,
  defaultExpanded = true,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

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

  const isCompletedGroup =
    status.isCompleted || status.id.toLowerCase() === 'completed';

  return (
    <Box sx={{ mb: 2 }}>
      {/* ── Status Header Row ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 0.75,
          px: 1,
          mb: 0.75,
          borderRadius: '8px',
          userSelect: 'none',
          transition: 'background-color 0.15s ease',
          '&:hover': {
            bgcolor: isDark
              ? 'rgba(255, 255, 255, 0.02)'
              : 'rgba(0, 0, 0, 0.02)',
          },
        }}
      >
        {/* Left: Caret + Dot + Status Title + Count */}
        <Box
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
          }}
        >
          <IconButton
            size="small"
            sx={{
              p: '2px',
              color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            }}
          >
            {isExpanded ? (
              <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
            ) : (
              <KeyboardArrowRightIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>

          {/* Status Color Dot */}
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: status.dotColor || status.color,
              boxShadow: `0 0 6px ${alpha(status.dotColor || status.color, 0.6)}`,
            }}
          />

          {/* Status Name */}
          <Typography
            sx={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: isDark ? '#f4f4f5' : '#09090b',
              letterSpacing: '-0.01em',
            }}
          >
            {status.label}
          </Typography>

          {/* Task Count Badge */}
          <Box
            sx={{
              px: '6px',
              py: '1px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 600,
              bgcolor: isDark
                ? 'rgba(255, 255, 255, 0.07)'
                : 'rgba(0, 0, 0, 0.06)',
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              minWidth: 18,
              textAlign: 'center',
            }}
          >
            {tasks.length}
          </Box>
        </Box>

        {/* Right Action: Menu or "All clear" for completed */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isCompletedGroup && tasks.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: '#10b981',
                fontSize: '11.5px',
                fontWeight: 600,
                pr: 1,
              }}
            >
              <CheckIcon sx={{ fontSize: 14 }} />
              <span>All clear</span>
            </Box>
          )}

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchorEl(e.currentTarget);
            }}
            sx={{
              p: '3px',
              color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
              '&:hover': {
                color: isDark ? '#ffffff' : '#000000',
              },
            }}
          >
            <MoreHorizIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {/* ── Status Menu ── */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            bgcolor: isDark ? '#1a1b22' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            boxShadow: isDark
              ? '0 12px 32px rgba(0, 0, 0, 0.5)'
              : '0 8px 24px rgba(0, 0, 0, 0.1)',
            minWidth: 140,
            p: 0.5,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setIsExpanded(true);
            setIsAddingTask(true);
            setMenuAnchorEl(null);
          }}
          sx={{ fontSize: '12.5px', borderRadius: '6px', py: 0.75 }}
        >
          Add task to {status.label}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setIsExpanded(!isExpanded);
            setMenuAnchorEl(null);
          }}
          sx={{ fontSize: '12.5px', borderRadius: '6px', py: 0.75 }}
        >
          {isExpanded ? 'Collapse section' : 'Expand section'}
        </MenuItem>
      </Menu>

      {/* ── Tasks List (Collapsible) ── */}
      <Collapse in={isExpanded} timeout={200} unmountOnExit>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {tasks.map((task) => (
            <ProjectTaskItem
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
              onToggleComplete={onToggleComplete}
              onToggleSubtask={onToggleSubtask}
              onAddSubtask={onAddSubtask}
            />
          ))}

          {/* Quick Add Task Button / Input */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: '8px',
              bgcolor: isAddingTask
                ? isDark
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(0, 0, 0, 0.02)'
                : 'transparent',
              border: isAddingTask
                ? `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                : '1px dashed transparent',
              cursor: isAddingTask ? 'text' : 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': !isAddingTask
                ? {
                    bgcolor: isDark
                      ? 'rgba(255, 255, 255, 0.02)'
                      : 'rgba(0, 0, 0, 0.02)',
                  }
                : {},
            }}
            onClick={() => setIsAddingTask(true)}
          >
            <AddIcon
              sx={{
                fontSize: 16,
                color: isDark
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              }}
            />
            {isAddingTask ? (
              <InputBase
                autoFocus
                placeholder={`Add task to ${status.label}... (Press Enter)`}
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (!newTaskTitle.trim()) setIsAddingTask(false);
                }}
                fullWidth
                sx={{
                  fontSize: '13px',
                  color: isDark ? '#f4f4f5' : '#18181b',
                  '& input::placeholder': {
                    color: isDark
                      ? 'rgba(255, 255, 255, 0.35)'
                      : 'rgba(0, 0, 0, 0.4)',
                    opacity: 1,
                    fontSize: '13px',
                  },
                }}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: isDark
                    ? 'rgba(255, 255, 255, 0.38)'
                    : 'rgba(0, 0, 0, 0.42)',
                }}
              >
                Add task to {status.label}...{' '}
                <span style={{ opacity: 0.7 }}>(Press Enter)</span>
              </Typography>
            )}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};
