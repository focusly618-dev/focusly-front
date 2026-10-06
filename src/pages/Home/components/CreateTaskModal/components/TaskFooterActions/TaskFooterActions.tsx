import { Box, Button, CircularProgress, DialogActions } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { confirmTaskDeletion } from '@/services/confirmTaskDeletion';
import {
  dialogActionsSx,
  cancelButtonSx,
  saveButtonSx,
  deleteButtonSx,
} from '../../CreateTaskModal.styles';
import type { Task } from '@/redux/tasks/task.types';

interface TaskFooterActionsProps {
  initialTask?: Task | null;
  onClose: () => void;
  handleSave: () => void;
  handleUpdate: () => void;
  /** Resolves false when the task couldn't be deleted. */
  handleDelete: () => Promise<boolean | void>;
  loadingSave: boolean;
  disabled?: boolean;
}

export const TaskFooterActions = ({
  initialTask,
  onClose,
  handleSave,
  handleUpdate,
  handleDelete,
  loadingSave,
  disabled,
}: TaskFooterActionsProps) => (
  <DialogActions sx={dialogActionsSx}>
    <Box
      display={initialTask ? 'flex' : 'none'}
      sx={{ flex: 1 }}
      justifyContent="flex-start"
    >
      <Button
        onClick={() => confirmTaskDeletion(handleDelete, onClose)}
        variant="contained"
        disableElevation
        sx={deleteButtonSx}
      >
        <DeleteIcon sx={{ fontSize: 18 }} />
        Delete
      </Button>
    </Box>
    <Button onClick={onClose} sx={cancelButtonSx}>
      Cancel
    </Button>
    <Button
      disabled={disabled}
      onClick={
        initialTask && initialTask.user_id !== 'google-user'
          ? handleUpdate
          : handleSave
      }
      variant="contained"
      sx={saveButtonSx}
    >
      {loadingSave ? (
        <CircularProgress size={24} color="inherit" />
      ) : initialTask && initialTask.user_id !== 'google-user' ? (
        'Save Changes'
      ) : (
        'Create Task'
      )}
    </Button>
  </DialogActions>
);
