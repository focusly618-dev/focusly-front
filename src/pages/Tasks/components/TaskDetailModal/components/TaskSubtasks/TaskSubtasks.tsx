import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  InputBase,
  Tooltip,
  Skeleton,
} from '@mui/material';
import {
  Check as CheckIcon,
  DeleteOutlineRounded as DeleteIcon,
  AutoAwesomeRounded as SparklesIcon,
  AddRounded as AddIcon,
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
  isLoading?: boolean;
}

export const TaskSubtasks: React.FC<TaskSubtasksProps> = ({
  subtasks = [],
  onAddSubtask,
  onToggleSubtask,
  onRemoveSubtask,
  onUpdateSubtask,
  onImproveWithAI,
  isReadOnly = false,
  isLoading = false,
}) => {
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
    if (isReadOnly || (isLoading && !subtask.title)) return;
    setEditingId(subtask.id);
    setEditingTitle(subtask.title || '');
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Subtareas
          </Typography>
          {total > 0 && (
            <Box component="span" sx={subtaskCountBadgeSx(allCompleted)}>
              {completedCount}/{total}
            </Box>
          )}
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {onImproveWithAI && !isReadOnly && (
            <Tooltip title="Desglosar tarea en pasos con Lumina IA">
              <Button
                size="small"
                variant="outlined"
                onClick={onImproveWithAI}
                disabled={isLoading}
                sx={aiButtonSx}
                startIcon={
                  <SparklesIcon sx={{ fontSize: '13px !important' }} />
                }
              >
                Desglosar con IA
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
                : 'linear-gradient(90deg, #008767, #2dd4bf)',
              transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </Box>
      )}

      {/* Subtasks List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                {/* Custom Square Checkbox */}
                <Box
                  onClick={() =>
                    !isReadOnly &&
                    !(isLoading && !subtask.title) &&
                    onToggleSubtask(subtask.id)
                  }
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: '4px',
                    mr: 1.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isReadOnly ? 'default' : 'pointer',
                    transition: 'all 0.15s ease',
                    bgcolor: subtask.completed ? '#008767' : 'transparent',
                    border: '1.5px solid',
                    borderColor: subtask.completed
                      ? '#008767'
                      : (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.3)'
                            : 'rgba(0, 0, 0, 0.25)',
                    '&:hover': {
                      borderColor: '#008767',
                      bgcolor: subtask.completed
                        ? '#007357'
                        : 'rgba(0, 135, 103, 0.08)',
                    },
                  }}
                >
                  {subtask.completed && (
                    <CheckIcon
                      sx={{ fontSize: 13, color: '#ffffff', strokeWidth: 1.5 }}
                    />
                  )}
                </Box>

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
                      fontSize: '13.5px',
                      py: 0,
                      px: 0.5,
                      borderRadius: '4px',
                      border: '1px solid',
                      borderColor: '#008767',
                    }}
                  />
                ) : isLoading && !subtask.title ? (
                  <Skeleton
                    variant="text"
                    width="65%"
                    height={20}
                    sx={{ borderRadius: '4px' }}
                  />
                ) : (
                  <Typography
                    variant="body2"
                    onDoubleClick={() => !isLoading && handleStartEdit(subtask)}
                    sx={{
                      fontSize: '13.5px',
                      color: subtask.completed
                        ? 'text.secondary'
                        : 'text.primary',
                      textDecoration: subtask.completed
                        ? 'line-through'
                        : 'none',
                      opacity: subtask.completed ? 0.65 : 1,
                      cursor: isReadOnly || isLoading ? 'default' : 'pointer',
                      transition: 'opacity 0.2s ease',
                      wordBreak: 'break-word',
                      userSelect: 'none',
                    }}
                  >
                    {subtask.title}
                  </Typography>
                )}
              </Box>

              {/* Delete Icon Button on right */}
              {!isReadOnly && (
                <Tooltip title="Eliminar subtarea">
                  <IconButton
                    size="small"
                    disabled={isLoading}
                    onClick={() => onRemoveSubtask(subtask.id)}
                    sx={{
                      p: 0.5,
                      color: 'text.secondary',
                      '&:hover': { color: 'error.main' },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
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
                opacity: isLoading ? 0.35 : 0.7,
              }}
            />
            <InputBase
              inputRef={inputRef}
              fullWidth
              placeholder={isLoading ? 'Cargando...' : 'Añadir un paso...'}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isReadOnly || isLoading}
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
                disabled={isLoading}
                sx={{
                  textTransform: 'none',
                  fontSize: '11px',
                  fontWeight: 600,
                  bgcolor: '#008767',
                  '&:hover': { bgcolor: '#007357' },
                  px: 1.5,
                  py: 0.3,
                  minWidth: 0,
                  boxShadow: 'none',
                  borderRadius: '6px',
                }}
              >
                Añadir
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
