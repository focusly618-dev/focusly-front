import { useApolloClient } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { TaskBar } from '@/pages/Home/components/Sidebar/types/Sidebar.types';

/** Opens what a plan created, the same way the app's own links do. */
export const usePlanNavigation = () => {
  const [, setSearchParams] = useSearchParams();
  return {
    openWorkspace: (id: string) =>
      setSearchParams({ tab: TaskBar.Workspace, workspaceId: id }),
    openProject: (id: string) =>
      setSearchParams({ tab: TaskBar.Workspace, groupId: id }),
    openTask: (id: string) =>
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('taskId', id);
        return next;
      }),
    /** A project's tasks, by status (its "Tasks" view). */
    openProjectTasks: (id: string) =>
      setSearchParams({ tab: TaskBar.Workspace, groupId: id, view: 'tasks' }),
    openTasks: () => setSearchParams({ tab: TaskBar.Tasks }),
    /** The calendar on a day (or its week). */
    openCalendar: (date: Date, view: 'day' | 'week' = 'day') =>
      setSearchParams({
        tab: TaskBar.DailyPlan,
        v: view,
        d: format(date, 'yyyy-MM-dd'),
      }),
  };
};

/**
 * The title of a workspace the app already loaded, by id (from Apollo's
 * cache); null when it isn't there.
 */
export const useWorkspaceTitleLookup = () => {
  const client = useApolloClient();
  return (id: string): string | null => {
    const cache = client.cache.extract() as Record<
      string,
      { id?: string; title?: string; __typename?: string }
    >;
    for (const entry of Object.values(cache)) {
      if (entry?.id === id && typeof entry.title === 'string') {
        return entry.title;
      }
    }
    return null;
  };
};
