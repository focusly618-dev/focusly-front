import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECT_GROUPS } from '../../Workspace/Workspace.graphql';
import type { ProjectGroupTypes } from '../../Workspace/workspace.types';
import type { ProjectOption } from '../components/CreateProjectTaskModal/CreateProjectTaskModal.types';

// Every project, most recently updated first, for project pickers. The folder
// grid's query can't feed one: it's paginated (8 per page), filtered by the
// grid's search and paused outside the projects tab.
export const useProjectOptions = () => {
  const { data, loading } = useQuery(GET_PROJECT_GROUPS, {
    fetchPolicy: 'cache-and-network',
  });

  const options: ProjectOption[] = useMemo(() => {
    const groups: ProjectGroupTypes[] = data?.projectGroups ?? [];
    return [...groups]
      .sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      })
      .map((g) => ({ id: g.id, name: g.name, color: g.color, emoji: g.emoji }));
  }, [data]);

  return { options, loading };
};
