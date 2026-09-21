import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
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

export interface UseProjectTasksOptions {
  projectId?: string | null;
  limit?: number;
  searchTerm?: string;
}

const formatDueDate = (
  dateStr?: string,
): { dueDate?: string; dueDateHighlight?: 'today' | 'tomorrow' | 'normal' } => {
  if (!dateStr) return {};
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow =
      d.getDate() === tomorrow.getDate() &&
      d.getMonth() === tomorrow.getMonth() &&
      d.getFullYear() === tomorrow.getFullYear();

    if (isToday) return { dueDate: 'Today', dueDateHighlight: 'today' };
    if (isTomorrow)
      return { dueDate: 'Tomorrow', dueDateHighlight: 'tomorrow' };

    const formatted = d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    return { dueDate: formatted, dueDateHighlight: 'normal' };
  } catch {
    return { dueDate: dateStr, dueDateHighlight: 'normal' };
  }
};

export const useProjectTasks = (options: UseProjectTasksOptions = {}) => {
  const { projectId, limit = 100, searchTerm } = options;
  const { user } = useAppSelector((state) => state.auth);
  const mutations = useTaskMutations();

  const { data, loading, error, refetch } = useQuery(GET_PROJECT_TASKS, {
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
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawTasks: any[] = useMemo(() => {
    return data?.result?.tasks || [];
  }, [data]);

  const tasks: ProjectTaskItemData[] = useMemo(() => {
    // Filtrar estrictamente solo las tareas que pertenecen a proyectos (excluir tareas globales sin proyecto)
    let projectOnlyTasks = rawTasks.filter((t) =>
      Boolean(t.project_id || t.project?.id || t.projectId),
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
        const notesMatch = t.notes_encrypted?.toLowerCase().includes(q);
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
      const { dueDate, dueDateHighlight } = formatDueDate(t.deadline);
      const isCompleted =
        t.status?.toLowerCase() === 'done' ||
        t.status?.toLowerCase() === 'completed';

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
        description: t.notes_encrypted || '',
        rawDeadline: t.deadline,
        modules: (t.tags || [])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((tg: any) => (typeof tg === 'string' ? tg : tg?.name))
          .filter(Boolean),
      };
    });
  }, [rawTasks, projectId, searchTerm]);

  return {
    tasks,
    loading,
    error,
    refetch,
    ...mutations,
  };
};
