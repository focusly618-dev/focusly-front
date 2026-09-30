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
import { alpha, useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
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
  RadioButtonUnchecked as TodoIcon,
  CalendarToday as PlanningIcon,
  Visibility as ReviewIcon,
  AccessTime as PendingIcon,
  CheckCircleOutline as DoneIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const COLUMNS = [
  {
    id: 'Todo',
    title: 'To Do',
    color: '#008767',
    darkColor: '#10b981',
    Icon: TodoIcon,
  },
  {
    id: 'Planning',
    title: 'Planning',
    color: '#2563eb',
    darkColor: '#60a5fa',
    Icon: PlanningIcon,
  },
  {
    id: 'Review',
    title: 'In Review',
    color: '#0891b2',
    darkColor: '#22d3ee',
    Icon: ReviewIcon,
  },
  {
    id: 'Pending',
    title: 'Pending',
    color: '#d97706',
    darkColor: '#fbbf24',
    Icon: PendingIcon,
  },
  {
    id: 'Done',
    title: 'Done',
    color: '#059669',
    darkColor: '#34d399',
    Icon: DoneIcon,
  },
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getColumnTitle = (id: string, fallback: string, t: any) => {
  switch (id) {
    case 'Todo':
      return t('tasks.status.todo', fallback);
    case 'Planning':
      return t('tasks.status.planning', fallback);
    case 'Review':
      return t('tasks.status.review', fallback);
    case 'Pending':
      return t('tasks.status.pending', fallback);
    case 'Done':
      return t('tasks.status.done', fallback);
    default:
      return fallback;
  }
};

type ColumnId = (typeof COLUMNS)[number]['id'];

const mapToColumnStatus = (status?: string): ColumnId => {
  if (!status || status === 'Todo' || status === 'Backlog') return 'Todo';
  if (status === 'Planning' || status === 'Scheduled') return 'Planning';
  if (status === 'Review' || status === 'in_review') return 'Review';
  if (
    status === 'Pending' ||
    status === 'On Hold' ||
    status === 'in_progress' ||
    status === 'In Progress'
  ) {
    return 'Pending';
  }
  if (status === 'Done' || status === 'completed') return 'Done';
  return 'Todo';
};

interface BoardViewProps {
  tasks: TaskResponse[];
  updateTask: (
    taskId: string,
    data: TaskResponse,
    options?: { silent?: boolean },
  ) => void | Promise<void>;
  onTaskClick?: (task: TaskResponse) => void;
}

export const BoardView = ({
  tasks,
  updateTask,
  onTaskClick,
}: BoardViewProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
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
      const colId = mapToColumnStatus(task.status);
      grouped[colId]?.push(task);
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
    duration: 200,
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
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
      // Then sync with backend silently (no toast notification on drag-and-drop)
      updateTask(activeId, updatedTask, { silent: true });
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
        {COLUMNS.map((column) => {
          const colColor = isDark ? column.darkColor : column.color;

          return (
            <ColumnWrapper key={column.id}>
              <ColumnHeader borderColor={colColor}>
                <ColumnTitle>
                  <column.Icon sx={{ fontSize: 18, color: colColor }} />
                  {getColumnTitle(column.id, column.title, t)}
                </ColumnTitle>
                <TaskCountBadge
                  sx={{
                    backgroundColor: alpha(colColor, isDark ? 0.16 : 0.1),
                    color: colColor,
                    border: `1px solid ${alpha(colColor, isDark ? 0.25 : 0.15)}`,
                    borderRadius: '20px',
                    padding: '2px 8px',
                    fontWeight: 700,
                    fontSize: '11.5px',
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
          );
        })}
      </BoardContainer>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <Box
            sx={{
              transform: 'rotate(2deg)',
              cursor: 'grabbing',
              filter: isDark
                ? 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.85))'
                : 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.2))',
            }}
          >
            <SortableTaskCard task={activeTask} isOverlay />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
