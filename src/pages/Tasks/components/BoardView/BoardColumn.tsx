import { useDroppable } from '@dnd-kit/core';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import {
  DroppableArea,
  TaskPlaceholder,
  DropIndicator,
} from './BoardView.styles';
import { SortableTaskCard } from './SortableTaskCard.tsx';
import { Typography, Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

interface BoardColumnProps {
  id: string;
  tasks: TaskResponse[];
  onTaskClick?: (task: TaskResponse) => void;
  activeId?: string | null;
}

export const BoardColumn = ({
  id,
  tasks,
  onTaskClick,
  activeId,
}: BoardColumnProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const isActive = isOver && activeId;

  return (
    <DroppableArea ref={setNodeRef} isOver={isOver}>
      {isActive && <DropIndicator />}
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <SortableTaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick?.(task)}
            isDropTarget={isOver && !activeId}
          />
        ))
      ) : (
        <TaskPlaceholder isActive={!!isActive}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              userSelect: 'none',
              width: '100%',
            }}
          >
            {isActive ? (
              <FileDownloadOutlinedIcon
                sx={{
                  fontSize: 28,
                  color: isDark ? '#10b981' : '#008767',
                  mb: 0.75,
                  animation: 'dropBounce 1s infinite',
                  '@keyframes dropBounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-4px)' },
                  },
                }}
              />
            ) : (
              <InboxOutlinedIcon
                sx={{
                  fontSize: 28,
                  color: isDark ? '#5a5e6a' : '#94a3b8',
                  mb: 0.75,
                  opacity: 0.85,
                }}
              />
            )}

            <Typography
              variant="body2"
              sx={{
                color: isActive
                  ? isDark
                    ? '#34d399'
                    : '#008767'
                  : isDark
                    ? '#8A8F98'
                    : '#64748b',
                fontSize: '13px',
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              {isActive
                ? t('tasks.board.releaseToDrop', 'Soltar aquí')
                : t('tasks.board.dropTasksHere', 'Drop tasks here')}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: isDark ? '#5a5e6a' : '#94a3b8',
                fontSize: '11px',
                mt: 0.4,
              }}
            >
              {isActive
                ? t('tasks.board.dropToColumn', 'Asignar a esta columna')
                : t('tasks.board.dragBetweenColumns', 'Arrastra tareas aquí')}
            </Typography>

            {isActive && (
              <DropIndicator
                sx={{
                  width: '60px',
                  mt: 1.5,
                  backgroundColor: isDark ? '#10b981' : '#008767',
                }}
              />
            )}
          </Box>
        </TaskPlaceholder>
      )}
      {isActive && tasks.length > 0 && <DropIndicator />}
    </DroppableArea>
  );
};
