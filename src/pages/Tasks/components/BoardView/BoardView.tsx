import { useState, useMemo, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  type DropAnimation,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import type { Theme } from '@mui/material/styles';
import {
  BoardContainer,
  ColumnTitle,
  ColumnHeader,
  TaskCountBadge,
  ColumnWrapper,
} from './BoardView.styles';
import { BoardColumn } from './BoardColumn.tsx';
import { SortableTaskCard } from './SortableTaskCard.tsx';
import {
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

// Define the 4 columns requested
const COLUMNS = [
  {
    id: 'Todo',
    title: 'To Do',
    color: '#3b82f6',
    badge: '#1e3a8a',
    Icon: RadioButtonUncheckedIcon,
  },
  {
    id: 'Planning',
    title: 'Planning',
    color: '#eab308',
    badge: '#713f12',
    Icon: AssignmentIcon,
  },
  {
    id: 'Pending',
    title: 'Pending',
    color: '#a855f7',
    badge: '#581c87',
    Icon: AccessTimeIcon,
  },
  {
    id: 'Done',
    title: 'Done',
    color: '#f43f5e',
    badge: '#881337',
    Icon: CheckCircleIcon,
  },
] as const;

type ColumnId = (typeof COLUMNS)[number]['id'];

interface BoardViewProps {
  tasks: TaskResponse[];
  updateTask: (taskId: string, data: TaskResponse) => void | Promise<void>;
  onTaskClick?: (task: TaskResponse) => void;
}

export const BoardView = ({
  tasks,
  updateTask,
  onTaskClick,
}: BoardViewProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  // Optimistic tasks state - updates immediately on drag
  const [optimisticTasks, setOptimisticTasks] = useState<TaskResponse[]>(tasks);

  // Sync optimisticTasks with prop when tasks change externally
  useEffect(() => {
    setOptimisticTasks(tasks);
  }, [tasks]);

  // Group optimistic tasks by column for immediate UI feedback
  const tasksByColumn = useMemo(() => {
    const grouped = {
      Todo: [] as TaskResponse[],
      Planning: [] as TaskResponse[],
      Pending: [] as TaskResponse[],
      Done: [] as TaskResponse[],
    };

    optimisticTasks.forEach((task) => {
      const status = task.status;
      if (
        status === 'Planning' ||
        status === 'Pending' ||
        status === 'Done' ||
        status === 'Todo'
      ) {
        grouped[status].push(task);
      } else {
        grouped['Todo'].push(task);
      }
    });

    return grouped;
  }, [optimisticTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require moving 5px before drag starts (helps prevent accidental drags when clicking)
      },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Faster drop animation configuration
  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
    duration: 200, // Faster animation (200ms instead of default 250ms)
    easing: 'cubic-bezier(0.2, 0, 0, 1)', // Smooth easing
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = optimisticTasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const activeColumnId = activeTask.status;
    let overColumnId = overId as ColumnId;

    // If we drop over a task instead of a column directly, find the column of that task
    if (activeId !== overId) {
      const overTask = optimisticTasks.find((t) => t.id === overId);
      if (overTask && Object.keys(tasksByColumn).includes(overTask.status)) {
        overColumnId = overTask.status as ColumnId;
      }
    }

    if (!overColumnId) return;

    if (activeColumnId !== overColumnId) {
      // Optimistic update - update UI immediately
      const updatedTask = { ...activeTask, status: overColumnId };
      setOptimisticTasks((prev) =>
        prev.map((t) => (t.id === activeId ? updatedTask : t)),
      );
      // Then sync with backend
      updateTask(activeId, updatedTask);
    }
  };

  const activeTask = useMemo(
    () => optimisticTasks.find((t) => t.id === activeId),
    [activeId, optimisticTasks],
  );

  console.log(COLUMNS);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <BoardContainer>
        {COLUMNS.map((column) => (
          <ColumnWrapper key={column.id}>
            <ColumnHeader borderColor={column.color}>
              <ColumnTitle>
                <column.Icon sx={{ fontSize: 18, color: column.color }} />
                {column.title}
              </ColumnTitle>
              <TaskCountBadge
                sx={{
                  backgroundColor: (theme: Theme) =>
                    theme.palette.mode === 'dark'
                      ? column.id === 'Todo'
                        ? 'rgba(59, 130, 246, 0.15)'
                        : column.id === 'Planning'
                          ? 'rgba(234, 179, 8, 0.15)'
                          : column.id === 'Pending'
                            ? 'rgba(168, 85, 247, 0.15)'
                            : 'rgba(244, 63, 94, 0.15)'
                      : column.badge,
                  color: (theme: Theme) =>
                    theme.palette.mode === 'dark' ? column.color : 'white',
                  borderRadius: '6px',
                  padding: '2px 8px',
                }}
              >
                {tasksByColumn[column.id].length}
              </TaskCountBadge>
            </ColumnHeader>

            <SortableContext
              items={tasksByColumn[column.id].map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <BoardColumn
                id={column.id}
                tasks={tasksByColumn[column.id]}
                onTaskClick={onTaskClick}
                activeId={activeId}
              />
            </SortableContext>
          </ColumnWrapper>
        ))}
      </BoardContainer>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? <SortableTaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};
