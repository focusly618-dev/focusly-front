import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Switch,
} from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
import { dialogActionsSx, saveButtonSx } from './TaskActions.styles';

import type { TaskActionsProps } from './TaskActions.types';

export const TaskActions = ({
  initialTask,
  handleUpdate,
  handleSave,
  loadingSave,
  isAIScheduleEnabled,
  setIsAIScheduleEnabled,
  isReadOnly,
  isDirty,
  handleImproveTask,
  disabled,
}: TaskActionsProps) => {
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
    <DialogActions sx={dialogActionsSx}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {setIsAIScheduleEnabled && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <AutoAwesomeIcon
              sx={{
                fontSize: 14,
                color: isAIScheduleEnabled ? '#7c3aed' : 'text.secondary',
                transition: 'color 0.3s ease',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: isAIScheduleEnabled ? '#7c3aed' : 'text.secondary',
                transition: 'color 0.3s ease',
              }}
            >
              Schedule with AI
            </Typography>
            <Switch
              size="small"
              checked={isAIScheduleEnabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIsAIScheduleEnabled(e.target.checked)
              }
              disabled={isReadOnly}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c3aed' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#7c3aed',
                },
              }}
            />
          </Box>
        )}
      </Box>
      {handleImproveTask && !isReadOnly && (
        <>
          <Button
            variant="outlined"
            onClick={handleOpenMenu}
            startIcon={<AutoAwesomeIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              mr: 1,
              borderColor: 'primary.light',
            }}
          >
            Improve with AI
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            PaperProps={{
              sx: { borderRadius: '10px', minWidth: '180px' },
            }}
          >
            <MenuItem onClick={() => handleOptionClick('subtasks')}>
              📋 Break into subtasks
            </MenuItem>
            <MenuItem onClick={() => handleOptionClick('estimate')}>
              ⏱️ Estimate Time
            </MenuItem>
            <MenuItem onClick={() => handleOptionClick('priority')}>
              🎯 Suggest Priority
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={() => handleOptionClick('all')}
              sx={{ fontWeight: 700, color: 'primary.main' }}
            >
              ✨ Apply All Improvements
            </MenuItem>
          </Menu>
        </>
      )}
      {isReadOnly || (initialTask && !isDirty) ? (
        <></>
      ) : (
        <Button
          disabled={disabled}
          onClick={initialTask ? handleUpdate : handleSave}
          variant="contained"
          sx={saveButtonSx}
        >
          {loadingSave ? (
            <CircularProgress size={24} color="inherit" />
          ) : initialTask ? (
            'Edit Task'
          ) : (
            'Create Task'
          )}
        </Button>
      )}
    </DialogActions>
  );
};
