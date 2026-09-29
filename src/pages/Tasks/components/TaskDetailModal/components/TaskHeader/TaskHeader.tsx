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
import { sileo } from '@/utils';
import { headerContainerSx, headerIconButtonSx } from './TaskHeader.styles';

interface TaskHeaderProps {
  color: string;
  isFullScreen: boolean;
  setIsFullScreen: (b: boolean) => void;
  title: string;
  onClose: () => void;
  initialTask?: Task | null;
  handleDelete: () => Promise<void>;
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
  return (
    <Box sx={headerContainerSx}>
      {/* Eyebrow badge on the left */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            bgcolor: '#008767',
            boxShadow: '0 0 6px rgba(0, 135, 103, 0.4)',
          }}
        />
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#008767',
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
                ...headerIconButtonSx,
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
                  bgcolor: color || '#008767',
                  border: '1.5px solid white',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.2)',
                }}
              />
              <PaletteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}

        {initialTask && !initialTask.is_owner && (
          <Tooltip title="Esta tarea no puede ser modificada porque no eres el propietario">
            <IconButton size="small" sx={headerIconButtonSx}>
              <InfoIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}

        {/* Minimize / Fullscreen button */}
        <Tooltip title={isFullScreen ? 'Restaurar tamaño' : 'Maximizar'} arrow>
          <IconButton
            size="small"
            onClick={() => setIsFullScreen(!isFullScreen)}
            sx={headerIconButtonSx}
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
          <IconButton size="small" onClick={onClose} sx={headerIconButtonSx}>
            <CloseIcon sx={{ fontSize: 19 }} />
          </IconButton>
        </Tooltip>

        {/* Delete Button */}
        {!isReadOnly && initialTask && (
          <Tooltip title="Eliminar tarea" arrow>
            <IconButton
              size="small"
              onClick={() => {
                sileo.warning({
                  title: 'Eliminar Tarea',
                  description:
                    '¿Estás seguro de que deseas eliminar esta tarea?',
                  fill: 'var(--sileo-warning-bg)',
                  button: {
                    title: 'Confirmar',
                    onClick: () => {
                      sileo.promise(() => handleDelete(), {
                        loading: {
                          title: 'Eliminando...',
                          fill: 'var(--sileo-update-bg)',
                        },
                        success: {
                          title: '¡Tarea eliminada con éxito!',
                          duration: 4000,
                          fill: 'var(--sileo-delete-bg)',
                        },
                        error: {
                          title: 'Error al eliminar tarea',
                          fill: 'var(--sileo-error-bg)',
                        },
                      });
                      onClose();
                    },
                  },
                });
              }}
              sx={{
                ...headerIconButtonSx,
                '&:hover': {
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
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
