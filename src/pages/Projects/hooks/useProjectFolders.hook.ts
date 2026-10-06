import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  GET_PROJECT_GROUPS_PAGINATED,
  CREATE_PROJECT_GROUP,
  UPDATE_PROJECT_GROUP,
  DELETE_PROJECT_GROUP,
} from '../../Workspace/Workspace.graphql';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setProjectTab } from '@/redux/tasks/task.slice';
import type { ProjectTab } from '@/redux/tasks/task.types';
import type { ProjectSortOption } from '../../Workspace/components/Library/components/WorkspaceLibraryHeader';
import type { ProjectGroupTypes } from '../../Workspace/workspace.types';
import { notify } from '@/utils';

const GROUP_LIMIT = 8;

export type { ProjectSortOption };

export const useProjectFolders = () => {
  const { t } = useTranslation();
  const apolloClient = useApolloClient();
  const dispatch = useAppDispatch();
  const activeProjectTab = useAppSelector(
    (state) => state.task.projectTab || 'projects',
  );

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

  // No refetchQueries here: deleteFolders refetches once after the whole batch.
  const [deleteGroupMutation, { loading: deletingGroup }] =
    useMutation(DELETE_PROJECT_GROUP);

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
      notify.success({
        title: 'Folder created',
        description: `Folder "${name}" was created successfully.`,
        duration: 3000,
      });
      return res.data?.createProjectGroup;
    } catch (err) {
      console.error('Error creating project folder:', err);
      notify.error({
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
      notify.success({
        title: 'Folder updated',
        description: 'Folder customized successfully.',
        duration: 3000,
      });
      return res.data?.updateProjectGroup;
    } catch (err) {
      console.error('Error updating project folder:', err);
      notify.error({
        title: 'Error',
        description: 'Failed to update folder.',
        duration: 3000,
      });
      throw err;
    }
  };

  const deleteFolders = async (ids: string[]) => {
    if (!ids.length) return 0;

    const results = await Promise.allSettled(
      ids.map((id) => deleteGroupMutation({ variables: { id } })),
    );
    const failed = results.filter(
      (r): r is PromiseRejectedResult => r.status === 'rejected',
    );
    const deletedCount = ids.length - failed.length;
    failed.forEach((r) =>
      console.error('Error deleting project folder:', r.reason),
    );

    if (deletedCount > 0) {
      // The backend deletes a project's workspaces along with it, so refresh
      // the workspace lists too.
      await apolloClient.refetchQueries({
        include: [
          'GetProjectGroupsPaginated',
          'GetProjectGroups',
          'GetWorkspacesPaginated',
        ],
      });

      // Step back if the current page no longer exists.
      const previousTotal = projectGroupsData?.result?.totalCount ?? 0;
      const remainingPages = Math.max(
        1,
        Math.ceil((previousTotal - deletedCount) / GROUP_LIMIT),
      );
      if (groupPage > remainingPages) setGroupPage(remainingPages);

      notify.success({
        title: t('workspaceLibrary.toast.projectsDeleted', {
          count: deletedCount,
        }),
        duration: 3000,
      });
    }

    if (failed.length > 0) {
      notify.error({
        title: 'Error',
        description: t('workspaceLibrary.toast.projectsDeleteFailed', {
          count: failed.length,
        }),
        duration: 3000,
      });
      if (deletedCount === 0) throw failed[0].reason;
    }

    return deletedCount;
  };

  const rawGroups: ProjectGroupTypes[] = useMemo(() => {
    const groups = projectGroupsData?.result?.projectGroups || [];
    return [...groups].sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [projectGroupsData]);
  const totalGroups = projectGroupsData?.result?.totalCount ?? rawGroups.length;

  const totalGroupPages = Math.max(1, Math.ceil(totalGroups / GROUP_LIMIT));

  // Client-side filtering & sorting
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

    list.sort((a, b) => {
      switch (projectSortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'notes-count': {
          const aCount = a.workspaceCount ?? a.workspaces?.length ?? 0;
          const bCount = b.workspaceCount ?? b.workspaces?.length ?? 0;
          return bCount - aCount;
        }
        case 'recent':
        default: {
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return dateB - dateA;
        }
      }
    });

    return list;
  }, [rawGroups, debouncedSearchTerm, projectColorFilter, projectSortBy]);

  return {
    state: {
      activeProjectTab,
      groupPage,
      totalGroupPages,
      folderSearchTerm,
      debouncedSearchTerm,
      projectSortBy,
      projectColorFilter,
      loading: loadingGroups,
      loadingGroups,
      isMutating: creatingGroup || updatingGroup || deletingGroup,
    },
    data: {
      groups: filteredGroups,
      allGroups: filteredGroups,
      rawGroups,
      totalGroups,
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
      deleteFolders,
      refetchPaginatedGroups,
      refetch: refetchPaginatedGroups,
    },
  };
};
