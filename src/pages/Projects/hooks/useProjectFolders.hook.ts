import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_PROJECT_GROUPS_PAGINATED,
  CREATE_PROJECT_GROUP,
  UPDATE_PROJECT_GROUP,
  DELETE_PROJECT_GROUP,
} from '../../Workspace/Workspace.graphql';
import type { ProjectSortOption } from '../../Workspace/components/Library/components/WorkspaceLibraryHeader';
import type { ProjectGroupTypes } from '../../Workspace/workspace.types';
import { sileo } from '@/utils';

const GROUP_LIMIT = 8;

export type { ProjectSortOption };

export const useProjectFolders = () => {
  const [groupPage, setGroupPage] = useState(1);
  const [folderSearchTerm, setFolderSearchTerm] = useState('');
  const [projectSortBy, setProjectSortBy] =
    useState<ProjectSortOption>('recent');
  const [projectColorFilter, setProjectColorFilter] = useState<string>('all');

  const {
    data: projectGroupsData,
    loading: loadingGroups,
    refetch: refetchPaginatedGroups,
  } = useQuery(GET_PROJECT_GROUPS_PAGINATED, {
    variables: {
      limit: GROUP_LIMIT,
      offset: (groupPage - 1) * GROUP_LIMIT,
      search: folderSearchTerm.trim() || undefined,
    },
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
  const totalGroupPages = Math.max(1, Math.ceil(totalGroups / GROUP_LIMIT));

  // Client-side filtering & sorting
  const filteredGroups = useMemo(() => {
    let list = [...rawGroups];

    if (folderSearchTerm.trim()) {
      const q = folderSearchTerm.toLowerCase();
      list = list.filter((g) => g.name.toLowerCase().includes(q));
    }

    if (projectColorFilter !== 'all') {
      list = list.filter(
        (g) => g.color?.toLowerCase() === projectColorFilter.toLowerCase(),
      );
    }

    return list;
  }, [rawGroups, folderSearchTerm, projectColorFilter, projectSortBy]);

  return {
    state: {
      groupPage,
      totalGroupPages,
      folderSearchTerm,
      projectSortBy,
      projectColorFilter,
      loading: loadingGroups,
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
      setFolderSearchTerm,
      setProjectSortBy: (sort: ProjectSortOption) => setProjectSortBy(sort),
      setProjectColorFilter,
      createFolder,
      updateFolder,
      deleteFolder,
      refetchPaginatedGroups,
    },
  };
};
