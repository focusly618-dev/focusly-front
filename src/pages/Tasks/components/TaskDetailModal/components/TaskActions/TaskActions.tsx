import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
import { dialogActionsSx, saveButtonSx } from './TaskActions.styles';

import type { TaskActionsProps } from './TaskActions.types';

export const TaskActions = ({
  initialTask,
  handleUpdate,
  handleSave,
  loadingSave,
  isReadOnly,
  isDirty,
  handleImproveTask,
  disabled,
  onClose,
}: TaskActionsProps) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (
    option: 'subtasks' | 'estimate' | 'priority' | 'all',
  ) => {
    handleCloseMenu();
    if (handleImproveTask) {
      handleImproveTask(option);
    }
  };
  return (
    <DialogActions
      sx={{
        ...dialogActionsSx,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 2,
      }}
    >
      {/* Left side: Mejorar con IA */}
      <Box>
        {handleImproveTask && !isReadOnly && (
          <>
            <Button
              variant="outlined"
              onClick={handleOpenMenu}
              startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '13px',
                color: '#008767',
                borderColor: 'rgba(0, 135, 103, 0.3)',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(0, 135, 103, 0.15)'
                    : 'rgba(0, 135, 103, 0.05)',
                '&:hover': {
                  borderColor: '#008767',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(0, 135, 103, 0.25)'
                      : 'rgba(0, 135, 103, 0.12)',
                },
              }}
            >
              {t('tasks.createProjectTaskModal.aiBreakdown', 'Mejorar con IA')}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleCloseMenu}
              PaperProps={{
                sx: { borderRadius: '12px', minWidth: '190px' },
              }}
            >
              <MenuItem onClick={() => handleOptionClick('subtasks')}>
                📋{' '}
                {t(
                  'tasks.createProjectTaskModal.subtasks',
                  'Desglosar subtareas',
                )}
              </MenuItem>
              <MenuItem onClick={() => handleOptionClick('estimate')}>
                ⏱️ {t('tasks.properties.estimatedDuration', 'Estimar tiempo')}
              </MenuItem>
              <MenuItem onClick={() => handleOptionClick('priority')}>
                🎯 {t('tasks.properties.priority', 'Sugerir prioridad')}
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem
                onClick={() => handleOptionClick('all')}
                sx={{ fontWeight: 700, color: '#008767' }}
              >
                ✨{' '}
                {t(
                  'tasks.createProjectTaskModal.aiBreakdown',
                  'Aplicar todas las mejoras',
                )}
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      {/* Right side: Cancelar & Crear Tarea */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '13.5px',
            px: 2,
            borderRadius: '10px',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          {t('common.cancel', 'Cancelar')}
        </Button>

        {isReadOnly || (initialTask && !isDirty) ? (
          <></>
        ) : (
          <Button
            disabled={disabled}
            onClick={
              initialTask && initialTask.user_id !== 'google-user'
                ? handleUpdate
                : handleSave
            }
            variant="contained"
            sx={{
              ...saveButtonSx,
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: 600,
              px: 2.5,
              py: 0.8,
              bgcolor: '#008767',
              '&:hover': { bgcolor: '#007357' },
            }}
          >
            {loadingSave ? (
              <CircularProgress size={20} color="inherit" />
            ) : initialTask && initialTask.user_id !== 'google-user' ? (
              t('tasks.createProjectTaskModal.saveChanges', 'Guardar Cambios')
            ) : (
              t('tasks.createProjectTaskModal.createTask', 'Crear Tarea')
            )}
          </Button>
        )}
      </Box>
    </DialogActions>
  );
};
