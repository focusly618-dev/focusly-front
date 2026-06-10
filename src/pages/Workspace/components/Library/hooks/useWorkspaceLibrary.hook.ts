import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_WORKSPACES,
  GET_FOLDERS,
  CREATE_FOLDER,
  UPDATE_WORKSPACE,
  UPDATE_FOLDER,
  DELETE_FOLDER,
  GET_PROJECT_GROUPS,
} from '../../../workspaces.graphql';
import type {
  WorkspaceTypes,
  ProjectTypes,
} from '../../../types/workspace.types';
import { sileo } from '@/utils/sileo';

export const useWorkspaceLibrary = (
  selectedProjectId: string | null,
  setSelectedProjectId: (id: string | null) => void,
  selectedGroupId: string | null = null,
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<'workspace' | 'project'>(
    'workspace',
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [projectAnchorEl, setProjectAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceTypes | null>(null);
  const [selectedProjectToManage, setSelectedProjectToManage] =
    useState<ProjectTypes | null>(null);
  const [isUpdateProjectModalOpen, setIsUpdateProjectModalOpen] =
    useState(false);
  const [isAllProjectsModalOpen, setIsAllProjectsModalOpen] = useState(false);
  const [showPaletteInMenu, setShowPaletteInMenu] = useState(false);

  // Queries
  const { data, loading, error } = useQuery(GET_WORKSPACES, {
    variables: {
      search: searchMode === 'workspace' ? searchTerm : '',
      groupId: selectedGroupId || undefined,
    },
  });

  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
  } = useQuery(GET_FOLDERS, {
    variables: { groupId: selectedGroupId },
  });

  const { data: projectGroupsData } = useQuery(GET_PROJECT_GROUPS);

  // Mutations
  const [createProject] = useMutation(CREATE_FOLDER, {
    refetchQueries: ['GetProjects'],
  });

  const [updateProject] = useMutation(UPDATE_FOLDER, {
    refetchQueries: ['GetProjects', 'GetWorkspaces'],
  });

  const [deleteProject] = useMutation(DELETE_FOLDER, {
    refetchQueries: ['GetProjects', 'GetWorkspaces'],
  });

  const [updateWorkspace] = useMutation(UPDATE_WORKSPACE, {
    refetchQueries: ['GetWorkspaces', 'GetProjects'],
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

  const handleProjectMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    project: ProjectTypes,
  ) => {
    event.stopPropagation();
    setProjectAnchorEl(event.currentTarget);
    setSelectedProjectToManage(project);
  };

  const handleProjectMenuClose = () => {
    setProjectAnchorEl(null);
  };

  const handleMoveToProject = async (
    workspace: WorkspaceTypes,
    projectId: string | null,
  ) => {
    if (!workspace) return;
    sileo.info({
      title: 'Moving...',
      description: 'Updating workspace folder',
    });
    try {
      await updateWorkspace({
        variables: {
          updateWorkspaceInput: {
            id: workspace.id,
            projectId: projectId,
          },
        },
      });
      sileo.success({
        title: 'Workspace moved',
        description: projectId
          ? 'Workspace moved to folder'
          : 'Workspace moved to All Notes',
        fill: 'var(--sileo-success-bg)',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error moving workspace:', err);
      sileo.error({
        title: 'Move failed',
        description: 'There was an error moving the workspace.',
        fill: 'var(--sileo-delete-bg)',
      });
    }
    handleMenuClose();
  };

  const handleCreateProject = async (name: string, color: string) => {
    try {
      await createProject({
        variables: {
          createProjectInput: { name, color, groupId: selectedGroupId },
        },
      });
      setIsProjectModalOpen(false);
      sileo.success({
        title: 'Folder created',
        description: `Folder "${name}" has been created.`,
        fill: 'var(--sileo-success-bg)',
        duration: 4000,
      });
    } catch (err) {
      console.error('Error creating folder:', err);
    }
  };

  const handleUpdateProject = async (
    id: string,
    name: string,
    color: string,
  ) => {
    try {
      await updateProject({
        variables: {
          updateProjectInput: { id, name, color, groupId: selectedGroupId },
        },
      });
      sileo.success({
        title: 'Folder updated',
        description: 'Changes saved successfully',
        fill: 'var(--sileo-update-bg)',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error updating folder:', err);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProjectToManage) return;
    sileo.warning({
      title: 'Remove Folder',
      description:
        'Are you sure you want to remove this folder? Linked workspaces will be kept as general notes.',
      fill: 'var(--sileo-warning-bg)',
      button: {
        title: 'Delete',
        onClick: async () => {
          try {
            await deleteProject({
              variables: { id: selectedProjectToManage.id },
            });
            if (selectedProjectId === selectedProjectToManage.id) {
              setSelectedProjectId(null);
            }
            sileo.success({
              title: 'Folder deleted',
              description: 'Folder has been removed.',
              fill: 'var(--sileo-delete-bg)',
              duration: 4000,
            });
          } catch (err) {
            console.error('Error deleting folder:', err);
          }
          handleProjectMenuClose();
        },
      },
    });
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
  const projects = (projectsData?.projects || [])
    .filter(
      (p: ProjectTypes) => !selectedGroupId || p.groupId === selectedGroupId,
    )
    .filter((p: ProjectTypes) =>
      searchMode === 'project'
        ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true,
    );

  const allWorkspaces = data?.workspaces || [];
  const workspaces = allWorkspaces.filter((w: WorkspaceTypes) => {
    if (selectedProjectId) {
      return w.projectId === selectedProjectId;
    }
    if (selectedGroupId) {
      return (
        w.groupId === selectedGroupId || w.project?.groupId === selectedGroupId
      );
    }
    return true;
  });

  if (projectsError) {
    console.error('Error fetching folders:', projectsError);
  }

  return {
    state: {
      searchTerm,
      selectedProjectId,
      selectedGroupId,
      isProjectModalOpen,
      searchMode,
      anchorEl,
      projectAnchorEl,
      selectedWorkspace,
      selectedProjectToManage,
      isUpdateProjectModalOpen,
      isAllProjectsModalOpen,
      showPaletteInMenu,
    },
    actions: {
      setSearchTerm,
      setSelectedProjectId,
      setIsProjectModalOpen,
      setSearchMode,
      setIsUpdateProjectModalOpen,
      setIsAllProjectsModalOpen,
      handleMenuOpen,
      handleMenuClose,
      handleSetBackground,
      handleRemoveBackground,
      handleProjectMenuOpen,
      handleProjectMenuClose,
      handleMoveToProject,
      handleCreateProject,
      handleUpdateProject,
      handleDeleteProject,
      handleUnlinkTask,
      handleClearSearch,
      setSelectedProjectToManage,
      setShowPaletteInMenu,
    },
    data: {
      workspaces,
      projects,
      allWorkspaces,
      projectGroups: projectGroupsData?.projectGroups || [],
      loading,
      projectsLoading,
      error,
    },
  };
};
