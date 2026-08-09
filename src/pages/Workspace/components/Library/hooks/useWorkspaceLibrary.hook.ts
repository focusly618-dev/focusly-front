import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_WORKSPACES,
  UPDATE_WORKSPACE,
  GET_PROJECT_GROUPS,
  GET_PROJECT_GROUPS_PAGINATED,
} from '../../../Workspace.graphql';
import type { WorkspaceTypes } from '../../../types/workspace.types';
import { sileo } from '@/utils';

const LIMIT = 8;
const GROUP_LIMIT = 8;

export const useWorkspaceLibrary = (selectedGroupId: string | null = null) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'workspace'>('workspace');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceTypes | null>(null);
  const [showPaletteInMenu, setShowPaletteInMenu] = useState(false);
  const [page, setPage] = useState(1);
  const [groupPage, setGroupPage] = useState(1);
  const [prevSearch, setPrevSearch] = useState(searchTerm);
  const [prevGroupId, setPrevGroupId] = useState(selectedGroupId);

  // Changing the search term or active folder invalidates the current page
  // of results — land back on page 1 rather than showing a page number
  // that may not exist for the new filter.
  if (searchTerm !== prevSearch || selectedGroupId !== prevGroupId) {
    setPrevSearch(searchTerm);
    setPrevGroupId(selectedGroupId);
    setPage(1);
  }

  // Queries
  const { data, loading, error } = useQuery(GET_WORKSPACES, {
    variables: {
      search: searchTerm,
      projectId: selectedGroupId || undefined,
      limit: LIMIT,
      offset: (page - 1) * LIMIT,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const { data: projectGroupsData } = useQuery(GET_PROJECT_GROUPS_PAGINATED, {
    variables: {
      limit: GROUP_LIMIT,
      offset: (groupPage - 1) * GROUP_LIMIT,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  // Separate, unpaginated fetch — the "All Folders" modal needs every group
  // to search/browse through, not just the current page shown in the root
  // grid.
  const { data: allProjectGroupsData } = useQuery(GET_PROJECT_GROUPS, {
    fetchPolicy: 'cache-and-network',
  });

  // Mutations
  const [updateWorkspace] = useMutation(UPDATE_WORKSPACE, {
    refetchQueries: ['GetWorkspacesPaginated'],
  });

  // Handlers
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    workspace: WorkspaceTypes,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedWorkspace(workspace);
    setShowPaletteInMenu(false);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWorkspace(null);
    setShowPaletteInMenu(false);
  };

  const handleSetBackground = async (color: string) => {
    if (!selectedWorkspace) return;
    try {
      await updateWorkspace({
        variables: {
          updateWorkspaceInput: {
            id: selectedWorkspace.id,
            background_color: color,
            card_show_background: true,
          },
        },
      });
      sileo.success({
        title: 'Background updated',
        description: `Workspace background updated successfully.`,
        fill: 'var(--sileo-update-bg)',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error setting background:', err);
    }
    handleMenuClose();
  };

  const handleRemoveBackground = async () => {
    if (!selectedWorkspace) return;
    try {
      await updateWorkspace({
        variables: {
          updateWorkspaceInput: {
            id: selectedWorkspace.id,
            background_color: 'none',
            card_show_background: false,
          },
        },
      });
      sileo.success({
        title: 'Background removed',
        description: 'Workspace background has been reset.',
        fill: 'var(--sileo-delete-bg)',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error removing background:', err);
    }
    handleMenuClose();
  };

  const handleUnlinkTask = async (workspace: WorkspaceTypes) => {
    try {
      await updateWorkspace({
        variables: {
          updateWorkspaceInput: {
            id: workspace.id,
            taskId: null,
          },
        },
      });
      sileo.success({
        title: 'Task unlinked',
        description: 'The task association has been removed.',
        fill: 'var(--sileo-update-bg)',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error unlinking task:', err);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Derived data
  const workspaces = data?.result?.workspaces || [];
  const totalWorkspaces = data?.result?.totalCount ?? workspaces.length;
  const totalPages = Math.max(1, Math.ceil(totalWorkspaces / LIMIT));

  const projectGroups = projectGroupsData?.result?.projectGroups || [];
  const totalGroups =
    projectGroupsData?.result?.totalCount ?? projectGroups.length;
  const totalGroupPages = Math.max(1, Math.ceil(totalGroups / GROUP_LIMIT));

  return {
    state: {
      searchTerm,
      selectedGroupId,
      searchMode,
      anchorEl,
      selectedWorkspace,
      showPaletteInMenu,
      page,
      totalPages,
      groupPage,
      totalGroupPages,
    },
    actions: {
      setSearchTerm,
      setSearchMode,
      handleMenuOpen,
      handleMenuClose,
      handleSetBackground,
      handleRemoveBackground,
      handleUnlinkTask,
      handleClearSearch,
      setShowPaletteInMenu,
      setPage,
      setGroupPage,
    },
    data: {
      workspaces,
      projectGroups,
      allProjectGroups: allProjectGroupsData?.projectGroups || [],
      totalWorkspaces,
      loading,
      error,
    },
  };
};
