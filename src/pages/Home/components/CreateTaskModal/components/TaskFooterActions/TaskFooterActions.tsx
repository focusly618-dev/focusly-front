import { Box, Button, CircularProgress, DialogActions } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { useConfirm } from '@/components/ui/Confirm/ConfirmContext';
import { dialogActionsSx, cancelButtonSx, saveButtonSx, deleteButtonSx } from '../../CreateTaskModal.styles';
import type { Task } from '@/redux/tasks/task.types';

interface TaskFooterActionsProps {
  initialTask?: Task | null;
  onClose: () => void;
  handleSave: () => void;
  handleUpdate: () => void;
  handleDelete: () => Promise<void>;
  loadingSave: boolean;
}

export const TaskFooterActions = ({
  initialTask,
  onClose,
  handleSave,
  handleUpdate,
  handleDelete,
  loadingSave,
}: TaskFooterActionsProps) => {
  const toast = useToast();
  const { confirm } = useConfirm();
  return (
    <DialogActions sx={dialogActionsSx}>
      <Box display={initialTask ? 'flex' : 'none'} sx={{ flex: 1 }} justifyContent="flex-start">
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
      <Button onClick={onClose} sx={cancelButtonSx}>
        Cancel
      </Button>
      <Button
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
};
