import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  InputBase,
  useTheme,
  alpha,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { ProjectSubtaskItem } from './projectTasks.types';

export interface ProjectTaskSubtasksProps {
  subtasks: ProjectSubtaskItem[];
  onToggleSubtask?: (subtaskId: string) => void;
  onAddSubtask?: (title: string) => void;
  readOnly?: boolean;
}

export const ProjectTaskSubtasks: React.FC<ProjectTaskSubtasksProps> = ({
  subtasks,
  onToggleSubtask,
  onAddSubtask,
  readOnly = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [newStepTitle, setNewStepTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newStepTitle.trim()) {
      e.preventDefault();
      onAddSubtask?.(newStepTitle.trim());
      setNewStepTitle('');
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewStepTitle('');
    }
  };

  return (
    <Box
      sx={{
        pl: { xs: 3, sm: 6 },
        pr: 2,
        py: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: { xs: '20px', sm: '38px' },
          top: 0,
          bottom: '12px',
          width: '1px',
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      {subtasks.map((subtask) => {
        const isDone = subtask.completed;

        return (
          <Box
            key={subtask.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0.6,
              px: 1,
              borderRadius: '6px',
              transition: 'background-color 0.15s ease',
              '&:hover': {
                bgcolor: isDark
                  ? 'rgba(255, 255, 255, 0.02)'
                  : 'rgba(0, 0, 0, 0.02)',
              },
            }}
          >
            {/* Left: Checkbox + Title */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                minWidth: 0,
                flex: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={() => !readOnly && onToggleSubtask?.(subtask.id)}
                disabled={readOnly}
                sx={{
                  p: 0,
                  color: isDone
                    ? '#10b981'
                    : isDark
                      ? 'rgba(255, 255, 255, 0.4)'
                      : 'rgba(0, 0, 0, 0.4)',
                  '&:hover': {
                    color: isDone ? '#059669' : '#10b981',
                  },
                }}
              >
                {isDone ? (
                  <CheckCircleIcon sx={{ fontSize: 16 }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>

              <Typography
                sx={{
                  fontSize: '12.5px',
                  fontWeight: 500,
                  color: isDone
                    ? isDark
                      ? 'rgba(255, 255, 255, 0.35)'
                      : 'rgba(0, 0, 0, 0.38)'
                    : isDark
                      ? '#e4e4e7'
                      : '#27272a',
                  textDecoration: isDone ? 'line-through' : 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {subtask.title}
              </Typography>
            </Box>

            {/* Right: Duration + Status/Date Badge */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                flexShrink: 0,
                ml: 2,
              }}
            >
              {subtask.duration && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.4,
                    color: isDark
                      ? 'rgba(255, 255, 255, 0.35)'
                      : 'rgba(0, 0, 0, 0.4)',
                    fontSize: '11px',
                    fontWeight: 500,
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 12, opacity: 0.7 }} />
                  <span>{subtask.duration}</span>
                </Box>
              )}

              {subtask.dueBadge && (
                <Box
                  sx={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    px: '7px',
                    py: '1.5px',
                    borderRadius: '4px',
                    bgcolor:
                      subtask.dueBadge.toLowerCase() === 'completed'
                        ? alpha('#10b981', 0.12)
                        : subtask.dueBadge.toLowerCase() === 'today'
                          ? alpha('#10b981', 0.12)
                          : isDark
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.04)',
                    color:
                      subtask.dueBadge.toLowerCase() === 'completed'
                        ? '#10b981'
                        : subtask.dueBadge.toLowerCase() === 'today'
                          ? '#34d399'
                          : isDark
                            ? 'rgba(255, 255, 255, 0.55)'
                            : 'rgba(0, 0, 0, 0.55)',
                  }}
                >
                  {subtask.dueBadge}
                </Box>
              )}
            </Box>
          </Box>
        );
      })}

      {/* Add Step Input */}
      {!readOnly && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 0.5,
            px: 1,
            mt: 0.25,
            borderRadius: '6px',
            bgcolor: isAdding
              ? isDark
                ? 'rgba(255, 255, 255, 0.04)'
                : 'rgba(0, 0, 0, 0.03)'
              : 'transparent',
            border: isAdding
              ? `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
              : '1px dashed transparent',
            transition: 'all 0.15s ease',
            cursor: isAdding ? 'text' : 'pointer',
            '&:hover': !isAdding
              ? {
                  bgcolor: isDark
                    ? 'rgba(255, 255, 255, 0.02)'
                    : 'rgba(0, 0, 0, 0.02)',
                }
              : {},
          }}
          onClick={() => setIsAdding(true)}
        >
          <AddIcon
            sx={{
              fontSize: 15,
              color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
            }}
          />
          <InputBase
            placeholder="Add step... Press Enter"
            value={newStepTitle}
            onChange={(e) => setNewStepTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsAdding(true)}
            onBlur={() => {
              if (!newStepTitle.trim()) setIsAdding(false);
            }}
            fullWidth
            sx={{
              fontSize: '12px',
              color: isDark ? '#e4e4e7' : '#27272a',
              '& input::placeholder': {
                color: isDark
                  ? 'rgba(255, 255, 255, 0.35)'
                  : 'rgba(0, 0, 0, 0.38)',
                opacity: 1,
                fontSize: '12px',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};
