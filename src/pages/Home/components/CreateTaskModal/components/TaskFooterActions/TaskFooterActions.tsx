import { Box, Button } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import {
  deleteButtonSx,
  cancelButtonSx,
  saveButtonSx,
} from '../../CreateTaskModal.styles';
import { useToast } from '@/components/ui/Toast/useToast';
import { useConfirm } from '@/components/ui/Confirm/useConfirm';
import type { Task } from '@/redux/tasks/task.types';

const footerActionsSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 1.5,
  px: 3,
  py: 2,
  borderTop: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
};

const deleteContainerSx = (show: boolean) => ({
  display: show ? 'flex' : 'none',
  flex: 1,
});

interface TaskFooterActionsProps {
  initialTask: Task | null | undefined;
  handleDelete: () => Promise<void>;
  onClose: () => void;
  handleUpdate: () => void;
  handleSave: () => void;
  loadingSave: boolean;
}

export const TaskFooterActions = ({
  initialTask,
  handleDelete,
  onClose,
  handleUpdate,
  handleSave,
  loadingSave,
}: TaskFooterActionsProps) => {
  const toast = useToast();
  const { confirm } = useConfirm();

  return (
    <Box sx={footerActionsSx}>
      <Box sx={deleteContainerSx(!!initialTask)}>
        <Button
          onClick={async () => {
            const ok = await confirm({
              title: 'Delete Task',
              description: 'Are you sure you want to delete this task? This action cannot be undone.',
              confirmText: 'Delete',
              severity: 'error',
            });

            if (ok) {
              try {
                await handleDelete();
                toast.success('Task deleted successfully!');
                onClose();
              } catch {
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
        onClick={initialTask ? handleUpdate : handleSave}
        variant="contained"
        sx={saveButtonSx}
      >
        {loadingSave ? (
          'Saving...'
        ) : initialTask ? (
          'Edit Task'
        ) : (
          'Create Task'
        )}
      </Button>
    </Box>
  );
};
