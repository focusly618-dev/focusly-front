import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  Typography,
} from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
import { dialogActionsSx, saveButtonSx } from './TaskActions.styles';
import { AISwitchContainer, StyledAISwitch } from '@/pages/Tasks/Tasks.styles';
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
}: TaskActionsProps) => {
  return (
    <DialogActions sx={dialogActionsSx}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {setIsAIScheduleEnabled && (
          <AISwitchContainer
            sx={{
              border: 'none',
              backgroundColor: 'transparent',
              p: 0,
              gap: 1,
              transform: 'none !important',
              boxShadow: 'none !important',
              '&:hover': {
                borderColor: 'transparent',
                boxShadow: 'none',
                transform: 'none',
              },
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
            <StyledAISwitch
              size="small"
              checked={isAIScheduleEnabled}
              onChange={(e) => setIsAIScheduleEnabled(e.target.checked)}
              disabled={isReadOnly}
            />
          </AISwitchContainer>
        )}
      </Box>
      {isReadOnly || (initialTask && !isDirty) ? (
        <></>
      ) : (
        <Button
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
