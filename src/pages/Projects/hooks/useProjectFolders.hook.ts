import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_PROJECT_GROUPS_PAGINATED,
  CREATE_PROJECT_GROUP,
  UPDATE_PROJECT_GROUP,
  DELETE_PROJECT_GROUP,
} from '../../Workspace/Workspace.graphql';
import { GET_TASKS } from '@/pages/Tasks/Tasks.graphql';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setProjectTab } from '@/redux/tasks/task.slice';
import type { ProjectTab } from '@/redux/tasks/task.types';
import type { ProjectSortOption } from '../../Workspace/components/Library/components/WorkspaceLibraryHeader';
import type { ProjectGroupTypes } from '../../Workspace/workspace.types';
import { sileo } from '@/utils';

const GROUP_LIMIT = 8;

export type { ProjectSortOption };

export const useProjectFolders = () => {
  const dispatch = useAppDispatch();
  const activeProjectTab = useAppSelector(
    (state) => state.task.projectTab || 'projects',
  );
  const user = useAppSelector((state) => state.auth.user);

  const [groupPage, setGroupPage] = useState(1);
  const [folderSearchTerm, setFolderSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [projectSortBy, setProjectSortBy] =
    useState<ProjectSortOption>('recent');
  const [projectColorFilter, setProjectColorFilter] = useState<string>('all');

  useEffect(() => {
    const delay = folderSearchTerm.trim() ? 500 : 0;
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(folderSearchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [folderSearchTerm]);

  const {
    data: projectGroupsData,
    loading: loadingGroups,
    refetch: refetchPaginatedGroups,
  } = useQuery(GET_PROJECT_GROUPS_PAGINATED, {
    variables: {
      limit: GROUP_LIMIT,
      offset: (groupPage - 1) * GROUP_LIMIT,
      search: debouncedSearchTerm.trim() || undefined,
    },
    skip: activeProjectTab !== 'projects',
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const {
    data: tasksData,
    loading: loadingTasks,
    refetch: refetchTasks,
  } = useQuery(GET_TASKS, {
    variables: {
      userId: user?.id || '',
      filters: {
        searchTerm: debouncedSearchTerm.trim() || undefined,
      },
      limit: 100,
      offset: 0,
    },
    skip: activeProjectTab !== 'tasks' || !user?.id,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });
  // Mutations
  const [createGroupMutation, { loading: creatingGroup }] = useMutation(
    CREATE_PROJECT_GROUP,
    {
      refetchQueries: ['GetProjectGroupsPaginated', 'GetProjectGroups'],
    },
  );

  const [updateGroupMutation, { loading: updatingGroup }] = useMutation(
    UPDATE_PROJECT_GROUP,
    {
      refetchQueries: ['GetProjectGroupsPaginated', 'GetProjectGroups'],
    },
  );

  const [deleteGroupMutation, { loading: deletingGroup }] = useMutation(
    DELETE_PROJECT_GROUP,
    {
      refetchQueries: ['GetProjectGroupsPaginated', 'GetProjectGroups'],
    },
  );

  const createFolder = async (
    name: string,
    color: string,
    emoji = 'filled',
  ) => {
    if (!name.trim()) return null;
    try {
      const res = await createGroupMutation({
        variables: {
          input: {
            name: name.trim(),
            color,
            emoji,
          },
        },
      });
      sileo.success({
        title: 'Folder created',
        description: `Folder "${name}" was created successfully.`,
        duration: 3000,
      });
      return res.data?.createProjectGroup;
    } catch (err) {
      console.error('Error creating project folder:', err);
      sileo.error({
        title: 'Error',
        description: 'Failed to create folder.',
        duration: 3000,
      });
      throw err;
    }
  };

  const updateFolder = async (
    id: string,
    input: { name?: string; color?: string; emoji?: string },
  ) => {
    try {
      const res = await updateGroupMutation({
        variables: {
          input: { id, ...input },
        },
      });
      sileo.success({
        title: 'Folder updated',
        description: 'Folder customized successfully.',
        duration: 3000,
      });
      return res.data?.updateProjectGroup;
    } catch (err) {
      console.error('Error updating project folder:', err);
      sileo.error({
        title: 'Error',
        description: 'Failed to update folder.',
        duration: 3000,
      });
      throw err;
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      await deleteGroupMutation({
        variables: { id },
      });
      sileo.success({
        title: 'Folder deleted',
        description: 'Folder has been removed.',
        duration: 3000,
      });
      return true;
    } catch (err) {
      console.error('Error deleting project folder:', err);
      sileo.error({
        title: 'Error',
        description: 'Failed to delete folder.',
        duration: 3000,
      });
      throw err;
    }
  };

  const rawGroups: ProjectGroupTypes[] = useMemo(
    () => projectGroupsData?.result?.projectGroups || [],
    [projectGroupsData],
  );
  const totalGroups = projectGroupsData?.result?.totalCount ?? rawGroups.length;

  const rawTasks = useMemo(
    () => tasksData?.result?.tasks || tasksData?.tasks || [],
    [tasksData],
  );
  const totalTasks = tasksData?.result?.totalCount ?? rawTasks.length;

  const currentTotal = activeProjectTab === 'tasks' ? totalTasks : totalGroups;
  const totalGroupPages = Math.max(1, Math.ceil(currentTotal / GROUP_LIMIT));

  // Client-side filtering
  const filteredGroups = useMemo(() => {
    let list = [...rawGroups];

    if (debouncedSearchTerm.trim()) {
      const q = debouncedSearchTerm.toLowerCase();
      list = list.filter((g) => g.name.toLowerCase().includes(q));
    }

    if (projectColorFilter !== 'all') {
      list = list.filter(
        (g) => g.color?.toLowerCase() === projectColorFilter.toLowerCase(),
      );
    }

    return list;
  }, [rawGroups, debouncedSearchTerm, projectColorFilter]);

  interface SearchableTask {
    title?: string;
    notes_encrypted?: string;
    tags?: Array<string | { name?: string }>;
  }

  const filteredTasks = useMemo(() => {
    let list = [...rawTasks];
    if (debouncedSearchTerm.trim()) {
      const q = debouncedSearchTerm.trim().toLowerCase();
      list = list.filter((t: SearchableTask) => {
        const titleMatch = t.title?.toLowerCase().includes(q);
        const notesMatch = t.notes_encrypted?.toLowerCase().includes(q);
        const tagMatch = t.tags?.some((tg: string | { name?: string }) =>
          (typeof tg === 'string' ? tg : tg?.name)?.toLowerCase().includes(q),
        );
        return Boolean(titleMatch || notesMatch || tagMatch);
      });
    }
    return list;
  }, [rawTasks, debouncedSearchTerm]);

  return {
    state: {
      activeProjectTab,
      groupPage,
      totalGroupPages,
      folderSearchTerm,
      debouncedSearchTerm,
      projectSortBy,
      projectColorFilter,
      loading: activeProjectTab === 'tasks' ? loadingTasks : loadingGroups,
      loadingGroups,
      loadingTasks,
      isMutating: creatingGroup || updatingGroup || deletingGroup,
    },
    data: {
      groups: filteredGroups,
      allGroups: filteredGroups,
      rawGroups,
      totalGroups,
      tasks: filteredTasks,
      rawTasks,
      totalTasks,
    },
    actions: {
      setGroupPage,
      setFolderSearchTerm: (term: string) => {
        setFolderSearchTerm(term);
        setGroupPage(1);
      },
      setActiveProjectTab: (tab: ProjectTab) => {
        dispatch(setProjectTab(tab));
        setGroupPage(1);
      },
      setProjectSortBy: (sort: ProjectSortOption) => setProjectSortBy(sort),
      setProjectColorFilter,
      createFolder,
      updateFolder,
      deleteFolder,
      refetchPaginatedGroups,
      refetchTasks,
      refetch: () => {
        if (activeProjectTab === 'tasks') {
          return refetchTasks();
        }
        return refetchPaginatedGroups();
      },
    },
  };
};
