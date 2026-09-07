import { useState, useMemo, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
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
  EventAvailable as EventAvailableIcon,
  AccessTime as AccessTimeIcon,
  PauseCircleOutline as PauseCircleOutlineIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';

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
    id: 'Scheduled',
    title: 'Scheduled',
    color: '#8b5cf6',
    badge: '#581c87',
    Icon: EventAvailableIcon,
  },
  {
    id: 'Pending',
    title: 'Pending',
    color: '#a855f7',
    badge: '#581c87',
    Icon: AccessTimeIcon,
  },
  {
    id: 'Review',
    title: 'Review',
    color: '#06b6d4',
    badge: '#155e75',
    Icon: VisibilityIcon,
  },
  {
    id: 'On Hold',
    title: 'On Hold',
    color: '#ef4444',
    badge: '#991b1b',
    Icon: PauseCircleOutlineIcon,
  },
  {
    id: 'Done',
    title: 'Done',
    color: '#f43f5e',
    badge: '#881337',
    Icon: CheckCircleIcon,
  },
  {
    id: 'Backlog',
    title: 'Backlog',
    color: '#64748b',
    badge: '#334155',
    Icon: HistoryIcon,
  },
  {
    id: 'Archived',
    title: 'Archived',
    color: '#4b5563',
    badge: '#1f2937',
    Icon: ArchiveIcon,
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
    const grouped = COLUMNS.reduce(
      (acc, col) => {
        acc[col.id] = [];
        return acc;
      },
      {} as Record<ColumnId, TaskResponse[]>,
    );

    optimisticTasks.forEach((task) => {
      const status = (task.status || 'Todo') as ColumnId;
      if (grouped[status]) {
        grouped[status].push(task);
      } else {
        grouped['Todo']?.push(task);
      }
    });

    return grouped;
  }, [optimisticTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
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
                      ? `${column.color}26`
                      : column.badge,
                  color: (theme: Theme) =>
                    theme.palette.mode === 'dark' ? column.color : 'white',
                  borderRadius: '6px',
                  padding: '2px 8px',
                }}
              >
                {tasksByColumn[column.id]?.length || 0}
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
