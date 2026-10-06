import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import {
  CloseRounded as CloseIcon,
  RemoveRounded as MinimizeIcon,
  OpenInFull as OpenInFullIcon,
  DeleteOutlineRounded as DeleteIcon,
  InfoOutlined as InfoIcon,
  PaletteOutlined as PaletteIcon,
} from '@mui/icons-material';
import type { Task } from '@/redux/tasks/task.types';
import { confirmTaskDeletion } from '@/services/confirmTaskDeletion';
import { headerContainerSx, headerIconButtonSx } from './TaskHeader.styles';
import { isTaskCustomColor, isColorDark } from '../../TaskDetailModal.utils';

interface TaskHeaderProps {
  color: string;
  isFullScreen: boolean;
  setIsFullScreen: (b: boolean) => void;
  title: string;
  onClose: () => void;
  initialTask?: Task | null;
  /** Resolves false when the task couldn't be deleted. */
  handleDelete: () => Promise<boolean | void>;
  isReadOnly?: boolean;
  onOpenColorPicker?: (el: HTMLElement) => void;
}

export const TaskHeader = ({
  color,
  isFullScreen,
  setIsFullScreen,
  onClose,
  initialTask,
  handleDelete,
  isReadOnly,
  onOpenColorPicker,
}: TaskHeaderProps) => {
  const hasCustomColor = isTaskCustomColor(color);
  const isDark = hasCustomColor && isColorDark(color);
  const iconSx = headerIconButtonSx(hasCustomColor, color);
  const badgeTextColor = hasCustomColor
    ? isDark
      ? '#ffffff'
      : '#0f172a'
    : '#008767';
  const badgeBg = hasCustomColor
    ? isDark
      ? 'rgba(255, 255, 255, 0.18)'
      : 'rgba(0, 0, 0, 0.12)'
    : undefined;

  return (
    <Box sx={headerContainerSx(hasCustomColor, color, isFullScreen)}>
      {/* Eyebrow badge on the left */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
          ...(hasCustomColor
            ? {
                px: 1.2,
                py: 0.5,
                borderRadius: '20px',
                backgroundColor: badgeBg,
                backdropFilter: 'blur(8px)',
              }
            : {
                py: 0.5,
              }),
        }}
      >
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            bgcolor: badgeTextColor,
            boxShadow: hasCustomColor
              ? 'none'
              : '0 0 6px rgba(0, 135, 103, 0.4)',
          }}
        />
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: badgeTextColor,
          }}
        >
          {initialTask ? 'Detalles de Tarea' : 'Nueva Tarea'}
        </Typography>
      </Box>

      {/* Right controls: Background selector, Minimize, Close, Delete */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        {/* Background / Wallpaper color picker button */}
        {!isReadOnly && onOpenColorPicker && (
          <Tooltip title="Color de fondo de la tarea" arrow>
            <IconButton
              size="small"
              onClick={(e) => onOpenColorPicker(e.currentTarget)}
              sx={{
                ...iconSx,
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                p: 0.5,
                px: 0.8,
              }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  bgcolor: hasCustomColor ? color : '#008767',
                  border: hasCustomColor
                    ? '1.5px solid rgba(0,0,0,0.3)'
                    : '1.5px solid white',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.2)',
                }}
              />
              <PaletteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}

        {initialTask && !initialTask.is_owner && (
          <Tooltip title="Esta tarea no puede ser modificada porque no eres el propietario">
            <IconButton size="small" sx={iconSx}>
              <InfoIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}

        {/* Minimize / Fullscreen button */}
        <Tooltip title={isFullScreen ? 'Restaurar tamaño' : 'Maximizar'} arrow>
          <IconButton
            size="small"
            onClick={() => setIsFullScreen(!isFullScreen)}
            sx={iconSx}
          >
            {isFullScreen ? (
              <MinimizeIcon sx={{ fontSize: 18 }} />
            ) : (
              <OpenInFullIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Tooltip>

        {/* Close Button */}
        <Tooltip title="Cerrar" arrow>
          <IconButton size="small" onClick={onClose} sx={iconSx}>
            <CloseIcon sx={{ fontSize: 19 }} />
          </IconButton>
        </Tooltip>

        {/* Delete Button */}
        {!isReadOnly && initialTask && (
          <Tooltip title="Eliminar tarea" arrow>
            <IconButton
              size="small"
              onClick={() => confirmTaskDeletion(handleDelete, onClose)}
              sx={{
                ...iconSx,
                '&:hover': {
                  bgcolor: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};
