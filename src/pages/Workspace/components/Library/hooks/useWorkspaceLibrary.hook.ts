import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_WORKSPACES,
  UPDATE_WORKSPACE,
  GET_PROJECT_GROUPS,
  GET_TOTAL_WORKSPACES,
} from '../../../Workspace.graphql';
import type { WorkspaceTypes } from '../../../types/workspace.types';
import { sileo } from '@/utils';

const LIMIT = 24;

export const useWorkspaceLibrary = (selectedGroupId: string | null = null) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'workspace'>('workspace');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceTypes | null>(null);
  const [showPaletteInMenu, setShowPaletteInMenu] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [prevSearch, setPrevSearch] = useState(searchTerm);
  const [prevGroupId, setPrevGroupId] = useState(selectedGroupId);

  if (searchTerm !== prevSearch || selectedGroupId !== prevGroupId) {
    setPrevSearch(searchTerm);
    setPrevGroupId(selectedGroupId);
    setHasMore(true);
  }

  // Queries
  const { data, loading, error, fetchMore } = useQuery(GET_WORKSPACES, {
    variables: {
      search: searchTerm,
      groupId: selectedGroupId || undefined,
      limit: LIMIT,
      offset: 0,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [prevData, setPrevData] = useState(data);
  if (data !== prevData) {
    setPrevData(data);
    if (data?.workspaces && data.workspaces.length < LIMIT) {
      setHasMore(false);
    }
  }

  const { data: projectGroupsData } = useQuery(GET_PROJECT_GROUPS, {
    fetchPolicy: 'cache-and-network',
  });
  const { data: totalWorkspacesData } = useQuery(GET_TOTAL_WORKSPACES);

  // Mutations
  const [updateWorkspace] = useMutation(UPDATE_WORKSPACE, {
    refetchQueries: ['GetWorkspaces'],
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

  const loadMore = async () => {
    if (loading || !hasMore) return;

    try {
      const res = await fetchMore({
        variables: {
          offset: workspaces.length,
        },
      });
      if (res.data?.workspaces && res.data.workspaces.length < LIMIT) {
        setHasMore(false);
      }
    } catch (e) {
      console.error('Error fetching more workspaces in loadMore:', e);
    }
  };

  // Derived data
  const workspaces = data?.workspaces || [];

  return {
    state: {
      searchTerm,
      selectedGroupId,
      searchMode,
      anchorEl,
      selectedWorkspace,
      showPaletteInMenu,
      hasMore,
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
      loadMore,
    },
    data: {
      workspaces,
      projectGroups: projectGroupsData?.projectGroups || [],
      totalWorkspaces: totalWorkspacesData?.totalWorkspaces || 0,
      loading,
      error,
    },
  };
};
