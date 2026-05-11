import { useDroppable } from '@dnd-kit/core';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import {
  DroppableArea,
  TaskPlaceholder,
  DropIndicator,
} from './BoardView.styles';
import { SortableTaskCard } from './SortableTaskCard.tsx';
import { Typography, Box } from '@mui/material';

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
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mb: isActive ? 2 : 1 }}
            >
              {isActive ? 'Release to drop here' : 'Drop tasks here'}
            </Typography>
            {isActive && <DropIndicator />}
          </Box>
        </TaskPlaceholder>
      )}
      {isActive && tasks.length > 0 && <DropIndicator />}
    </DroppableArea>
  );
};
