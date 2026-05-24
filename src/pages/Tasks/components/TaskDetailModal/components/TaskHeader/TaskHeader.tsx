import { Box, IconButton } from '@mui/material';
import {
  Close as CloseIcon,
  OpenInFull as OpenInFullIcon,
  CloseFullscreen as CloseFullscreenIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { TASK_COLORS } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type { Task } from '@/redux/tasks/task.types';
import { sileo } from 'sileo';
import { headerContainerSx, headerIconButtonSx } from './TaskHeader.styles';

interface TaskHeaderProps {
  color: string;
  isFullScreen: boolean;
  setIsFullScreen: (b: boolean) => void;
  title: string;
  onClose: () => void;
  initialTask?: Task | null;
  handleDelete: () => Promise<void>;
}

export const TaskHeader = ({
  color,
  isFullScreen,
  setIsFullScreen,
  onClose,
  initialTask,
  handleDelete,
}: TaskHeaderProps) => {
  const isCustomColor = TASK_COLORS.includes(color);
  const iconSx = headerIconButtonSx(isCustomColor);

  return (
    <Box sx={headerContainerSx(isCustomColor, color)}>
      <Box display="flex" gap={1}>
        <IconButton
          size="small"
          onClick={() => setIsFullScreen(!isFullScreen)}
          sx={headerIconButtonSx(isCustomColor)}
        >
          {isFullScreen ? (
            <CloseFullscreenIcon sx={{ fontSize: 18 }} />
          ) : (
            <OpenInFullIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton size="small" onClick={onClose} sx={iconSx}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
        {initialTask && (
          <IconButton
            size="small"
            onClick={() => {
              sileo.warning({
                title: 'Delete Task',
                description: 'Are you sure you want to delete this task?',
                fill: 'var(--sileo-warning-bg)',
                button: {
                  title: 'Confirm',
                  onClick: () => {
                    sileo.promise(() => handleDelete(), {
                      loading: {
                        title: 'Deleting...',
                        fill: 'var(--sileo-update-bg)',
                      },
                      success: {
                        title: 'Task deleted successfully!',
                        duration: 4000,
                        fill: 'var(--sileo-delete-bg)',
                      },
                      error: {
                        title: 'Error deleting task',
                        fill: 'var(--sileo-error-bg)',
                      },
                    });
                    onClose();
                  },
                },
              });
            }}
            sx={{
              ...iconSx,
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
