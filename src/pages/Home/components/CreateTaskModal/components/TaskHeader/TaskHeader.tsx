import { Box, IconButton } from '@mui/material';
import {
  Close as CloseIcon,
  OpenInFull as OpenInFullIcon,
  CloseFullscreen as CloseFullscreenIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { headerIconSx } from '../../CreateTaskModal.styles';
import { TASK_COLORS } from '../../CreateTaskModal.utils';
import type { Task } from '@/redux/tasks/task.types';
import { confirmTaskDeletion } from '@/services/confirmTaskDeletion';

interface TaskHeaderProps {
  color: string;
  isFullScreen: boolean;
  setIsFullScreen: (v: boolean) => void;
  onClose: () => void;
  initialTask?: Task | null;
  /** Resolves false when the task couldn't be deleted. */
  handleDelete: () => Promise<boolean | void>;
}

export const TaskHeader = ({
  color,
  isFullScreen,
  setIsFullScreen,
  onClose,
  handleDelete,
  initialTask,
}: TaskHeaderProps) => {
  const hasColor = TASK_COLORS.includes(color);

  const iconSx = {
    ...headerIconSx,
    color: hasColor ? '#1e293b' : 'primary.main',
    '&:hover': {
      backgroundColor: hasColor ? 'rgba(0, 0, 0, 0.08)' : 'action.hover',
    },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 3,
        ...(hasColor ? { pt: 1, pb: 20, margin: '15px' } : { pt: 2, pb: 1 }),
        color: hasColor ? '#1e293b' : 'text.secondary',
        backgroundColor: hasColor ? color : 'transparent',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
      }}
    >
      <Box display="flex" gap={1}>
        <IconButton
          size="small"
          onClick={() => setIsFullScreen(!isFullScreen)}
          sx={iconSx}
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
            onClick={() => confirmTaskDeletion(handleDelete, onClose)}
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
