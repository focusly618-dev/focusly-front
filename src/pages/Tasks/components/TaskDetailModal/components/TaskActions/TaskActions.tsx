import { Box, Button, CircularProgress, DialogActions } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import {
  dialogActionsSx,
  deleteButtonSx,
  saveButtonSx,
  deleteContainerSx,
} from './TaskActions.styles';
import { useToast } from '@/components/ui/Toast/useToast';
import { useConfirm } from '@/components/ui/Confirm/useConfirm';
import type { Task } from '@/redux/tasks/task.types';

interface TaskActionsProps {
  initialTask: Task | null | undefined;
  handleDelete: () => Promise<void>;
  onClose: () => void;
  handleUpdate: () => void;
  handleSave: () => void;
  loadingSave: boolean;
}

export const TaskActions = ({
  initialTask,
  handleDelete,
  onClose,
  handleUpdate,
  handleSave,
  loadingSave,
}: TaskActionsProps) => {
  const toast = useToast();
  const { confirm } = useConfirm();
  return (
    <DialogActions sx={dialogActionsSx}>
      <Box sx={deleteContainerSx(!!initialTask)}>
        <Button
          onClick={async () => {
            const ok = await confirm({
              title: 'Delete Task',
              description: 'Are you sure you want to delete this task? This action cannot be undone.',
              confirmText: 'Delete',
              severity: 'error'
            });

            if (ok) {
              try {
                await handleDelete();
                toast.success('Task deleted successfully!');
                onClose();
              } catch (error) {
                toast.error('Error deleting task');
              }
            }
          }}
          variant="contained"
          disableElevation
          sx={deleteButtonSx}
        >
          <DeleteIcon sx={{ fontSize: 18 }} />
          Delete
        </Button>
      </Box>
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
    </DialogActions>
  );
};
