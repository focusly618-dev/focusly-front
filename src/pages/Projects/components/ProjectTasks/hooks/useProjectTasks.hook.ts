import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { GET_PROJECT_TASKS } from '@/pages/Tasks/Tasks.graphql';
import { formatDuration } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import {
  useTaskMutations,
  mapStatusFromBackend,
  mapPriorityFromBackend,
} from './useTaskMutations.hook';
import type {
  ProjectTaskItemData,
  ProjectSubtaskItem,
} from '../projectTasks.types';
import { getCalendarDay, getDueDateHighlight } from '../projectTaskDates';

export interface UseProjectTasksOptions {
  projectId?: string | null;
  limit?: number;
  searchTerm?: string;
}

export const useProjectTasks = (options: UseProjectTasksOptions = {}) => {
  const { projectId, limit = 100, searchTerm } = options;
  // Named so the task callbacks below (which use `t`) don't shadow it.
  const { t: translate, i18n } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const mutations = useTaskMutations();

  const { data, loading, error, refetch, fetchMore } = useQuery(
    GET_PROJECT_TASKS,
    {
      variables: {
        userId: user?.id || '',
        filters: {
          ...(projectId ? { project_id: projectId } : { has_project: true }),
          searchTerm: searchTerm?.trim() || undefined,
        },
        limit,
        offset: 0,
      },
      skip: !user?.id,
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawTasks: any[] = useMemo(() => {
    return data?.result?.tasks || [];
  }, [data]);

  // Tasks come in pages; the rest load on demand instead of being cut off.
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const totalCount: number = data?.result?.totalCount ?? rawTasks.length;
  const hasMore = rawTasks.length < totalCount;

  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: { offset: rawTasks.length },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult?.result) return prev;
          const seen = new Set(
            (prev.result?.tasks ?? []).map((t: { id: string }) => t.id),
          );
          return {
            ...prev,
            result: {
              ...fetchMoreResult.result,
              tasks: [
                ...(prev.result?.tasks ?? []),
                ...fetchMoreResult.result.tasks.filter(
                  (t: { id: string }) => !seen.has(t.id),
                ),
              ],
            },
          };
        },
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const tasks: ProjectTaskItemData[] = useMemo(() => {
    const formatDueDate = (raw: string | undefined, completed: boolean) => {
      const day = getCalendarDay(raw);
      if (!day) return {};
      let highlight = getDueDateHighlight(raw);
      // A finished task isn't late.
      if (completed && highlight === 'overdue') highlight = 'normal';
      if (highlight === 'today') {
        return {
          dueDate: translate('tasks.dates.today'),
          dueDateHighlight: highlight,
        };
      }
      if (highlight === 'tomorrow') {
        return {
          dueDate: translate('tasks.dates.tomorrow'),
          dueDateHighlight: highlight,
        };
      }
      return {
        dueDate: day.toLocaleDateString(i18n.language, {
          month: 'short',
          day: 'numeric',
        }),
        dueDateHighlight: highlight,
      };
    };

    // Filtrar estrictamente solo las tareas que pertenecen a proyectos (excluir tareas globales sin proyecto)
    // Archived tasks are out of the user's way everywhere else; the status
    // groups have no place for them (they used to land in "To Do").
    let projectOnlyTasks = rawTasks.filter(
      (t) =>
        Boolean(t.project_id || t.project?.id || t.projectId) &&
        t.status?.toLowerCase() !== 'archived',
    );

    // Si se especifica un proyecto, filtrar únicamente por ese proyecto
    if (projectId) {
      projectOnlyTasks = projectOnlyTasks.filter(
        (t) =>
          t.project_id === projectId ||
          t.project?.id === projectId ||
          t.projectId === projectId,
      );
    }

    if (searchTerm?.trim()) {
      const q = searchTerm.trim().toLowerCase();
      projectOnlyTasks = projectOnlyTasks.filter((t) => {
        const titleMatch = t.title?.toLowerCase().includes(q);
        const notesMatch = t.notes?.toLowerCase().includes(q);
        const tagMatch = t.tags?.some((tg: string | { name?: string }) =>
          (typeof tg === 'string' ? tg : tg?.name)?.toLowerCase().includes(q),
        );
        const projectNameMatch = (t.project?.name || t.projectName)
          ?.toLowerCase()
          .includes(q);
        return Boolean(
          titleMatch || notesMatch || tagMatch || projectNameMatch,
        );
      });
    }

    return projectOnlyTasks.map((t) => {
      const isCompleted =
        t.status?.toLowerCase() === 'done' ||
        t.status?.toLowerCase() === 'completed';
      const { dueDate, dueDateHighlight } = formatDueDate(
        t.deadline,
        isCompleted,
      );

      const subtasks: ProjectSubtaskItem[] = (t.subtasks || []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (s: any) => ({
          id: s.id,
          title: s.title,
          completed: Boolean(s.completed),
          duration: s.estimate_timer
            ? formatDuration(s.estimate_timer)
            : undefined,
          dueBadge: s.completed ? 'Completed' : undefined,
          estimateTimer: s.estimate_timer ?? null,
          completedAt: s.completed_at ?? null,
        }),
      );

      const collaborator = t.collaborators?.[0];
      const assignee = collaborator
        ? {
            name: collaborator.name || 'User',
            initials: (collaborator.name || 'U')
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2),
            avatarUrl: collaborator.avatar,
          }
        : undefined;

      const project = t.project
        ? {
            id: t.project.id,
            name: t.project.name,
            color: t.project.color,
            emoji: t.project.emoji,
          }
        : t.project_id
          ? {
              id: t.project_id,
              name: 'Project',
            }
          : undefined;

      return {
        id: t.id,
        title: t.title,
        status: mapStatusFromBackend(t.status),
        priority: mapPriorityFromBackend(t.priority_level),
        tag: t.tags?.[0]?.name,
        duration: t.estimate_timer
          ? formatDuration(t.estimate_timer)
          : undefined,
        dueDate,
        dueDateHighlight,
        completed: isCompleted,
        subtasks,
        assignee,
        project,
        projectId: t.project_id || t.project?.id,
        workspaceId: t.workspace_id || t.workspace?.id,
        workspaceTitle: t.workspace?.title,
        description: t.notes || '',
        rawDeadline: t.deadline,
        estimateMinutes: t.estimate_timer || 0,
        createdAt: t.created_at,
        modules: (t.tags || [])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((tg: any) => (typeof tg === 'string' ? tg : tg?.name))
          .filter(Boolean),
      };
    });
  }, [rawTasks, projectId, searchTerm, translate, i18n.language]);

  return {
    tasks,
    totalCount,
    loading,
    error,
    refetch,
    hasMore,
    loadMore,
    isLoadingMore,
    ...mutations,
  };
};
