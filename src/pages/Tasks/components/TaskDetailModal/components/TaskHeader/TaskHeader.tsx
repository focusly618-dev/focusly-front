import { Box, IconButton, Typography, Switch } from '@mui/material';
import {
  Close as CloseIcon,
  OpenInFull as OpenInFullIcon,
  CloseFullscreen as CloseFullscreenIcon,
  SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
  ArrowForwardIos,
} from '@mui/icons-material';
import { GeminiIcon } from '@/components/ui/GeminiIcon';
import { GeminiAIToggle } from '@/components/ui/GeminiSwitch';
import { TASK_COLORS } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type { Task } from '@/redux/tasks/task.types';
import {
  headerContainerSx,
  headerIconButtonSx,
  parentTaskContainerSx,
  parentTaskTypographySx,
  subtaskTypographySx
} from './TaskHeader.styles';

interface TaskHeaderProps {
  color: string;
  isFullScreen: boolean;
  setIsFullScreen: (b: boolean) => void;
  parentTask?: Task;
  title: string;
  onClose: () => void;
  useAI: boolean;
  setUseAI: (v: boolean) => void;
}

export const TaskHeader = ({
  color,
  isFullScreen,
  setIsFullScreen,
  parentTask,
  title,
  onClose,
  useAI,
  setUseAI,
}: TaskHeaderProps) => {
  const isCustomColor = TASK_COLORS.includes(color);

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
        {parentTask && (
          <Box sx={parentTaskContainerSx}>
            <Typography variant="body1" sx={parentTaskTypographySx(isCustomColor)}>
              <SubdirectoryArrowRightIcon sx={{ fontSize: 14, color: isCustomColor ? 'rgba(255,255,255,0.7)' : 'text.secondary' }} />
              {parentTask.title}
            </Typography>
            <IconButton size="small" disabled sx={{ padding: 0 }}>
              <ArrowForwardIos sx={{ fontSize: 10, color: isCustomColor ? 'rgba(255,255,255,0.7)' : 'text.secondary' }} />
            </IconButton>
            <Typography variant="body2" sx={subtaskTypographySx(isCustomColor)}>
              {title.length === 0 ? 'New SubTask' : title}
            </Typography>
          </Box>
        )}
      </Box>
      <Box display="flex" alignItems="center" gap={2}>
        <Box display="flex" alignItems="center" gap={1} sx={{ 
          bgcolor: isCustomColor ? 'rgba(255,255,255,0.15)' : 'rgba(155, 114, 203, 0.08)',
          px: 1.5,
          py: 0.5,
          borderRadius: '20px',
          border: '1px solid',
          borderColor: isCustomColor ? 'rgba(255,255,255,0.3)' : 'rgba(155, 114, 203, 0.2)',
        }}>
          <Typography variant="caption" sx={{ 
            fontWeight: 600, 
            fontSize: '11px',
            color: isCustomColor ? '#fff' : '#9B72CB',
          }}>
            Schedule with AI
          </Typography>
          <GeminiAIToggle
            checked={useAI}
            onChange={(e) => setUseAI(e.target.checked)}
          />
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={headerIconButtonSx(isCustomColor)}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
};
