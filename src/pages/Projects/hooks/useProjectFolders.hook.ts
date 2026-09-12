import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_PROJECT_GROUPS,
  GET_PROJECT_GROUPS_PAGINATED,
  CREATE_PROJECT_GROUP,
  UPDATE_PROJECT_GROUP,
  DELETE_PROJECT_GROUP,
} from '../../Workspace/Workspace.graphql';
import type { ProjectGroupTypes } from '../../Workspace/types/workspace.types';
import { sileo } from '@/utils';

const GROUP_LIMIT = 8;

export type ProjectSortOption =
  | 'updated-desc'
  | 'updated-asc'
  | 'name-asc'
  | 'name-desc'
  | 'notes-count';

export const useProjectFolders = () => {
  const [groupPage, setGroupPage] = useState(1);
  const [folderSearchTerm, setFolderSearchTerm] = useState('');
  const [projectSortBy, setProjectSortBy] =
    useState<ProjectSortOption>('updated-desc');
  const [projectColorFilter, setProjectColorFilter] = useState<string>('all');

  // Queries
  const {
    data: projectGroupsData,
    loading: loadingGroups,
    refetch: refetchPaginatedGroups,
  } = useQuery(GET_PROJECT_GROUPS_PAGINATED, {
    variables: {
      limit: GROUP_LIMIT,
      offset: (groupPage - 1) * GROUP_LIMIT,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const {
    data: allProjectGroupsData,
    loading: loadingAllGroups,
    refetch: refetchAllGroups,
  } = useQuery(GET_PROJECT_GROUPS, {
    fetchPolicy: 'cache-and-network',
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
  const allGroups: ProjectGroupTypes[] = useMemo(
    () => allProjectGroupsData?.projectGroups || [],
    [allProjectGroupsData],
  );
  const totalGroups = projectGroupsData?.result?.totalCount ?? rawGroups.length;
  const totalGroupPages = Math.max(1, Math.ceil(totalGroups / GROUP_LIMIT));

  // Client-side filtering & sorting
  const filteredGroups = useMemo(() => {
    let list = [...(folderSearchTerm ? allGroups : rawGroups)];

    if (folderSearchTerm.trim()) {
      const q = folderSearchTerm.toLowerCase();
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
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'notes-count': {
          const aCount = a.workspaces?.length ?? 0;
          const bCount = b.workspaces?.length ?? 0;
          return bCount - aCount;
        }
        case 'updated-asc': {
          const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return aDate - bDate;
        }
        case 'updated-desc':
        default: {
          const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return bDate - aDate;
        }
      }
    });

    return list;
  }, [
    rawGroups,
    allGroups,
    folderSearchTerm,
    projectColorFilter,
    projectSortBy,
  ]);

  return {
    state: {
      groupPage,
      totalGroupPages,
      folderSearchTerm,
      projectSortBy,
      projectColorFilter,
      loading: loadingGroups || loadingAllGroups,
      isMutating: creatingGroup || updatingGroup || deletingGroup,
    },
    data: {
      groups: filteredGroups,
      allGroups,
      rawGroups,
      totalGroups,
    },
    actions: {
      setGroupPage,
      setFolderSearchTerm,
      setProjectSortBy,
      setProjectColorFilter,
      createFolder,
      updateFolder,
      deleteFolder,
      refetchPaginatedGroups,
      refetchAllGroups,
    },
  };
};
