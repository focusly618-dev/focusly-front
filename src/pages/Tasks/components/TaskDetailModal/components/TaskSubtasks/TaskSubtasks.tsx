import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  InputBase,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  CheckCircleRounded as CheckedIcon,
  RadioButtonUncheckedRounded as UncheckedIcon,
  DeleteOutlineRounded as DeleteIcon,
  AutoAwesomeRounded as SparklesIcon,
  FormatListBulletedRounded as SubtasksIcon,
  AddRounded as AddIcon,
  KeyboardArrowDownRounded as ArrowDownIcon,
  KeyboardArrowUpRounded as ArrowUpIcon,
} from '@mui/icons-material';
import type { Subtask } from '@/redux/tasks/task.types';
import {
  subtasksContainerSx,
  subtasksHeaderSx,
  subtaskCountBadgeSx,
  progressBarContainerSx,
  subtaskItemSx,
  subtaskInputFormSx,
  aiButtonSx,
} from './TaskSubtasks.styles';

interface TaskSubtasksProps {
  subtasks: Subtask[];
  onAddSubtask: (title: string) => void;
  onToggleSubtask: (id: string) => void;
  onRemoveSubtask: (id: string) => void;
  onUpdateSubtask?: (id: string, title: string) => void;
  onImproveWithAI?: () => void;
  isReadOnly?: boolean;
}

export const TaskSubtasks: React.FC<TaskSubtasksProps> = ({
  subtasks = [],
  onAddSubtask,
  onToggleSubtask,
  onRemoveSubtask,
  onUpdateSubtask,
  onImproveWithAI,
  isReadOnly = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const total = subtasks.length;
  const completedCount = subtasks.filter((s) => s.completed).length;
  const progressPercent =
    total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const allCompleted = total > 0 && completedCount === total;

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddSubtask(newTitle.trim());
    setNewTitle('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleStartEdit = (subtask: Subtask) => {
    if (isReadOnly) return;
    setEditingId(subtask.id);
    setEditingTitle(subtask.title);
  };

  const handleSaveEdit = (id: string) => {
    if (editingTitle.trim() && onUpdateSubtask) {
      onUpdateSubtask(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <Box sx={subtasksContainerSx}>
      {/* Header */}
      <Box sx={subtasksHeaderSx}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <SubtasksIcon
            sx={{
              fontSize: 18,
              color: 'text.secondary',
              mr: 1,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Subtasks
            {total > 0 && (
              <Box component="span" sx={subtaskCountBadgeSx(allCompleted)}>
                {completedCount}/{total}
              </Box>
            )}
          </Typography>

          <IconButton
            size="small"
            sx={{ ml: 0.5, p: 0.25, color: 'text.secondary' }}
          >
            {isExpanded ? (
              <ArrowUpIcon sx={{ fontSize: 16 }} />
            ) : (
              <ArrowDownIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {onImproveWithAI && !isReadOnly && (
            <Tooltip title="Break task into actionable steps using Lumina AI">
              <Button
                size="small"
                variant="outlined"
                onClick={onImproveWithAI}
                sx={aiButtonSx}
                startIcon={
                  <SparklesIcon sx={{ fontSize: '13px !important' }} />
                }
              >
                Break down with AI
              </Button>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Animated Progress Bar */}
      {total > 0 && (
        <Box sx={progressBarContainerSx}>
          <Box
            sx={{
              width: `${progressPercent}%`,
              height: '100%',
              borderRadius: 2,
              background: allCompleted
                ? 'linear-gradient(90deg, #10b981, #059669)'
                : 'linear-gradient(90deg, #6366f1, #3b82f6)',
              transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </Box>
      )}

      {/* Subtasks List */}
      <Collapse in={isExpanded} timeout="auto">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.7 }}>
          {subtasks.map((subtask) => {
            const isEditing = editingId === subtask.id;

            return (
              <Box key={subtask.id} sx={subtaskItemSx(subtask.completed)}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1,
                    minWidth: 0,
                    mr: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    disabled={isReadOnly}
                    onClick={() => onToggleSubtask(subtask.id)}
                    sx={{
                      p: 0.4,
                      mr: 1,
                      color: subtask.completed ? '#10b981' : 'text.secondary',
                      transition: 'transform 0.15s ease, color 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.15)',
                        color: subtask.completed ? '#059669' : 'primary.main',
                      },
                    }}
                  >
                    {subtask.completed ? (
                      <CheckedIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <UncheckedIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>

                  {isEditing ? (
                    <InputBase
                      autoFocus
                      fullWidth
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(subtask.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      onBlur={() => handleSaveEdit(subtask.id)}
                      sx={{
                        fontSize: '13px',
                        py: 0,
                        px: 0.5,
                        borderRadius: '4px',
                        border: '1px solid',
                        borderColor: 'primary.main',
                      }}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      onDoubleClick={() => handleStartEdit(subtask)}
                      sx={{
                        fontSize: '13px',
                        color: subtask.completed
                          ? 'text.secondary'
                          : 'text.primary',
                        textDecoration: subtask.completed
                          ? 'line-through'
                          : 'none',
                        opacity: subtask.completed ? 0.65 : 1,
                        cursor: isReadOnly ? 'default' : 'pointer',
                        transition: 'opacity 0.2s ease',
                        wordBreak: 'break-word',
                        userSelect: 'none',
                      }}
                    >
                      {subtask.title}
                    </Typography>
                  )}
                </Box>

                {/* Hover Actions */}
                {!isReadOnly && (
                  <Box
                    className="subtask-actions"
                    sx={{
                      opacity: 0,
                      visibility: 'hidden',
                      transition: 'opacity 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Tooltip title="Delete subtask">
                      <IconButton
                        size="small"
                        onClick={() => onRemoveSubtask(subtask.id)}
                        sx={{
                          p: 0.3,
                          color: 'text.secondary',
                          '&:hover': { color: 'error.main' },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            );
          })}

          {/* Quick Add Form */}
          {!isReadOnly && (
            <Box sx={subtaskInputFormSx}>
              <AddIcon
                sx={{
                  fontSize: 16,
                  color: 'text.secondary',
                  opacity: 0.7,
                }}
              />
              <InputBase
                inputRef={inputRef}
                fullWidth
                placeholder="Add a step... (Press Enter)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{
                  fontSize: '13px',
                  color: 'text.primary',
                }}
              />
              {newTitle.trim() && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleAdd}
                  sx={{
                    textTransform: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    px: 1.2,
                    py: 0.2,
                    minWidth: 0,
                    boxShadow: 'none',
                  }}
                >
                  Add
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};
