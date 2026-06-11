import { useState, useEffect, useMemo, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { startOfWeek, addDays, startOfMonth } from 'date-fns';
import { useAppSelector } from '@/redux/hooks';
import { ColorModeContext } from '@/context/ColorModeContext';
import {
  GET_WORKSPACES,
  GET_FOLDERS,
  CREATE_FOLDER,
  UPDATE_FOLDER,
  DELETE_FOLDER,
  REMOVE_WORKSPACE,
  CREATE_WORKSPACE,
  GET_PROJECT_GROUPS,
  CREATE_PROJECT_GROUP,
  UPDATE_PROJECT_GROUP,
  DELETE_PROJECT_GROUP,
} from '@/pages/Workspace/workspaces.graphql';
import { sileo } from '@/utils/sileo';
import type {
  WorkspaceTypes,
  ProjectTypes,
  ProjectGroupTypes,
} from '@/pages/Workspace/types/workspace.types';
import { TaskBar, type SidebarProps } from '../types/Sidebar.types';

export const useSidebar = ({ activeTab, changeStatusTab }: SidebarProps) => {
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();

  // Projects & Workspaces Queries
  const { data: workspacesData, loading: workspacesLoading } = useQuery(
    GET_WORKSPACES,
    {
      variables: { search: '' },
      fetchPolicy: 'cache-and-network',
    },
  );
  const { data: projectsData, loading: projectsLoading } = useQuery(
    GET_FOLDERS,
    {
      fetchPolicy: 'cache-and-network',
    },
  );
  const { data: projectGroupsData, loading: projectGroupsLoading } = useQuery(
    GET_PROJECT_GROUPS,
    {
      fetchPolicy: 'cache-and-network',
    },
  );

  const isProjectsLoading =
    workspacesLoading || projectsLoading || projectGroupsLoading;

  // Projects & Workspaces Mutations
  const refetchAll = [
    { query: GET_FOLDERS },
    { query: GET_WORKSPACES, variables: { search: '' } },
    { query: GET_PROJECT_GROUPS },
  ];
  const [createProject] = useMutation(CREATE_FOLDER, {
    refetchQueries: refetchAll,
  });
  const [updateProject] = useMutation(UPDATE_FOLDER, {
    refetchQueries: refetchAll,
  });
  const [deleteProject] = useMutation(DELETE_FOLDER, {
    refetchQueries: refetchAll,
  });
  const [deleteWorkspaceMutation] = useMutation(REMOVE_WORKSPACE, {
    refetchQueries: [{ query: GET_WORKSPACES, variables: { search: '' } }],
  });
  const [createWorkspaceMutation] = useMutation(CREATE_WORKSPACE, {
    refetchQueries: [{ query: GET_WORKSPACES, variables: { search: '' } }],
  });
  const [createProjectGroup] = useMutation(CREATE_PROJECT_GROUP, {
    refetchQueries: refetchAll,
  });
  const [updateProjectGroup] = useMutation(UPDATE_PROJECT_GROUP, {
    refetchQueries: refetchAll,
  });
  const [deleteProjectGroup] = useMutation(DELETE_PROJECT_GROUP, {
    refetchQueries: refetchAll,
  });

  // State from URL Search Params
  const selectedWorkspaceId = searchParams.get('workspaceId') || undefined;
  const selectedProjectId = searchParams.get('projectId');
  const selectedGroupId = searchParams.get('groupId');
  const isWorkspaceTab = activeTab === TaskBar.Workspace;

  // Tree expanded states
  const [expandedProjects, setExpandedProjects] = useState<
    Record<string, boolean>
  >(() => {
    return { general: true };
  });
  // Track expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  // Modals state
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [isUpdateProjectModalOpen, setIsUpdateProjectModalOpen] =
    useState(false);
  const [selectedProjectToManage, setSelectedProjectToManage] =
    useState<ProjectTypes | null>(null);

  // Inline Folder Creation state — tracks which group is creating a folder
  const [creatingFolderInGroupId, setCreatingFolderInGroupId] = useState<
    string | null
  >(null);
  const [newFolderName, setNewFolderName] = useState('');

  // Inline Project Group creation state
  const [isCreatingGroupInline, setIsCreatingGroupInline] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Inline Workspace Creation state
  const [creatingWorkspaceInFolderId, setCreatingWorkspaceInFolderId] =
    useState<string | null>(null);
  // Track which group the workspace creation belongs to
  const [creatingWorkspaceInGroupId, setCreatingWorkspaceInGroupId] = useState<
    string | null
  >(null);
  const [newWorkspaceTitle, setNewWorkspaceTitle] = useState('');

  // Tree Context Menus
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeMenuType, setActiveMenuType] = useState<
    'project' | 'workspace' | 'group' | null
  >(null);
  const [activeProjectItem, setActiveProjectItem] =
    useState<ProjectTypes | null>(null);
  const [activeWorkspaceItem, setActiveWorkspaceItem] =
    useState<WorkspaceTypes | null>(null);
  const [activeGroupItem, setActiveGroupItem] =
    useState<ProjectGroupTypes | null>(null);

  // Handlers
  const toggleProjectExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedProjects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleGroupExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedGroups((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  const handleOpenMenu = (
    e: React.MouseEvent<HTMLElement>,
    type: 'project' | 'workspace' | 'group',
    item: ProjectTypes | ProjectGroupTypes | WorkspaceTypes,
  ) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setActiveMenuType(type);
    if (type === 'project') {
      setActiveProjectItem(item as ProjectTypes);
    } else if (type === 'group') {
      setActiveGroupItem(item as ProjectGroupTypes);
    } else {
      setActiveWorkspaceItem(item as WorkspaceTypes);
    }
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setActiveMenuType(null);
    setActiveProjectItem(null);
    setActiveWorkspaceItem(null);
    setActiveGroupItem(null);
  };

  const handleSelectProject = (projectId: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', TaskBar.Workspace);
    if (projectId) {
      newParams.set('projectId', projectId);
    } else {
      newParams.delete('projectId');
    }
    newParams.delete('workspaceId');
    newParams.delete('action');
    changeStatusTab(TaskBar.Workspace, newParams);
  };

  const handleSelectGroup = (groupId: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', TaskBar.Workspace);
    if (groupId) {
      newParams.set('groupId', groupId);
    } else {
      newParams.delete('groupId');
    }
    newParams.delete('projectId');
    newParams.delete('workspaceId');
    newParams.delete('action');
    changeStatusTab(TaskBar.Workspace, newParams);
  };

  const handleSelectWorkspace = (workspace: WorkspaceTypes) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', TaskBar.Workspace);
    newParams.set('workspaceId', workspace.id);
    if (workspace.projectId) {
      newParams.set('projectId', workspace.projectId);
    } else {
      newParams.delete('projectId');
    }
    newParams.delete('action');
    changeStatusTab(TaskBar.Workspace, newParams);
  };

  const handleCreateProject = async (name: string, color: string) => {
    try {
      await createProject({
        variables: {
          createProjectInput: { name, color },
        },
      });
      setIsCreateProjectModalOpen(false);
      sileo.success({
        title: 'Folder created',
        description: `Folder "${name}" has been created.`,
        fill: 'var(--sileo-success-bg)',
        duration: 4000,
      });
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleCreateFolderInline = async (groupId: string | null) => {
    const name = newFolderName.trim();
    if (!name) return;
    try {
      const defaultColors = [
        '#3b82f6',
        '#6366f1',
        '#8b5cf6',
        '#d946ef',
        '#22c55e',
        '#ef4444',
        '#f97316',
      ];
      const existingCount = projectsData?.projects?.length || 0;
      const color = defaultColors[existingCount % defaultColors.length];

      await createProject({
        variables: {
          createProjectInput: { name, color, groupId },
        },
      });
      setNewFolderName('');
      sileo.success({
        title: 'Folder created',
        description: `Folder "${name}" has been created.`,
        fill: 'var(--sileo-success-bg)',
        duration: 2000,
      });
    } catch (err) {
      console.error('Error creating folder inline:', err);
    }
  };

  const handleCreateWorkspaceInline = async () => {
    const title = newWorkspaceTitle.trim();
    if (!title) return;
    try {
      const projectId =
        creatingWorkspaceInFolderId &&
        creatingWorkspaceInFolderId.startsWith('general')
          ? null
          : creatingWorkspaceInFolderId;
      const { data } = await createWorkspaceMutation({
        variables: {
          createWorkspaceInput: {
            title,
            content: '[]',
            projectId,
            groupId: creatingWorkspaceInGroupId,
            saveStatus: true,
          },
        },
      });
      setNewWorkspaceTitle('');
      setCreatingWorkspaceInFolderId(null);
      setCreatingWorkspaceInGroupId(null);
      if (data?.createWorkspace) {
        handleSelectWorkspace(data.createWorkspace);
      }
      sileo.success({
        title: 'Workspace created',
        description: `Workspace "${title}" has been created.`,
        fill: 'var(--sileo-success-bg)',
        duration: 2000,
      });
    } catch (err) {
      console.error('Error creating workspace inline:', err);
    }
  };

  const handleCreateGroupInline = async () => {
    const name = newGroupName.trim();
    if (!name) return;
    try {
      await createProjectGroup({
        variables: {
          input: { name },
        },
      });
      setNewGroupName('');
      setIsCreatingGroupInline(false);
      sileo.success({
        title: 'Project created',
        description: `"${name}" has been created.`,
        fill: 'var(--sileo-success-bg)',
        duration: 2000,
      });
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    sileo.warning({
      title: 'Remove Project',
      description:
        'Are you sure? Folders and workspaces inside will be unlinked but not deleted.',
      fill: 'var(--sileo-warning-bg)',
      button: {
        title: 'Delete',
        onClick: async () => {
          try {
            await deleteProjectGroup({ variables: { id } });
            sileo.success({
              title: 'Project deleted',
              fill: 'var(--sileo-delete-bg)',
              duration: 4000,
            });
          } catch (err) {
            console.error('Error deleting project:', err);
          }
        },
      },
    });
  };

  const handleRenameGroup = async (id: string, name: string) => {
    try {
      await updateProjectGroup({
        variables: {
          input: { id, name },
        },
      });
    } catch (err) {
      console.error('Error renaming project group:', err);
    }
  };

  const handleRenameGroupPrompt = async (group: ProjectGroupTypes) => {
    const newName = window.prompt('Enter new group name:', group.name);
    if (newName && newName.trim() && newName.trim() !== group.name) {
      await handleRenameGroup(group.id, newName.trim());
    }
  };

  // Derive project groups list
  const projectGroups: ProjectGroupTypes[] =
    projectGroupsData?.projectGroups || [];

  // Auto-create default project group "Projects & Docs" if none exist
  useEffect(() => {
    if (
      projectGroupsData &&
      projectGroupsData.projectGroups &&
      projectGroupsData.projectGroups.length === 0
    ) {
      createProjectGroup({
        variables: {
          input: { name: 'Projects & Docs' },
        },
      }).catch((err) => {
        console.error('Error auto-creating default project group:', err);
      });
    }
  }, [projectGroupsData, createProjectGroup]);

  const handleUpdateProject = async (
    id: string,
    name: string,
    color: string,
  ) => {
    try {
      await updateProject({
        variables: {
          updateProjectInput: { id, name, color },
        },
      });
      sileo.success({
        title: 'Folder updated',
        description: 'Changes saved successfully',
        fill: 'var(--sileo-update-bg)',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error updating project:', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
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
              variables: { id },
            });
            if (selectedProjectId === id) {
              handleSelectProject(null);
            }
            sileo.success({
              title: 'Folder deleted',
              description: 'Folder has been removed.',
              fill: 'var(--sileo-delete-bg)',
              duration: 4000,
            });
          } catch (err) {
            console.error('Error deleting project:', err);
          }
        },
      },
    });
  };

  const handleDeleteWorkspace = (id: string) => {
    sileo.warning({
      title: 'Remove Workspace',
      description: 'Are you sure you want to remove this workspace?',
      fill: 'var(--sileo-warning-bg)',
      button: {
        title: 'Confirm',
        onClick: async () => {
          try {
            await deleteWorkspaceMutation({ variables: { id } });
            sileo.success({
              title: 'Workspace deleted',
              fill: 'var(--sileo-delete-bg)',
            });
            if (searchParams.get('workspaceId') === id) {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('workspaceId');
              setSearchParams(newParams);
            }
          } catch (error) {
            console.error('Error deleting workspace:', error);
            sileo.error({
              title: 'Error deleting workspace',
              fill: 'var(--sileo-error-bg)',
            });
          }
        },
      },
    });
  };

  // Notifications state
  const [notifAnchor, setNotifAnchor] = useState<HTMLButtonElement | null>(
    null,
  );
  const [notifications, setNotifications] = useState<
    { id: string; title: string; time: string; read: boolean }[]
  >([]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const notifOpen = Boolean(notifAnchor);

  const handleNotifOpen = (e: React.MouseEvent<HTMLButtonElement>) =>
    setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);
  const markAsRead = (id: string) =>
    setNotifications((p) =>
      p.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  const markAllRead = () =>
    setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const deleteNotif = (id: string) =>
    setNotifications((p) => p.filter((n) => n.id !== id));

  const currentView = searchParams.get('v') || 'day';
  const currentDateStr = searchParams.get('d');

  const currentDate = useMemo(() => {
    if (currentDateStr) {
      const [year, month, day] = currentDateStr.split('-').map(Number);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month - 1, day);
      }
    }
    return new Date();
  }, [currentDateStr]);

  const showMiniCalendar = false;

  const miniCalendarDays = useMemo(() => {
    const startOfCurrentMonth = startOfMonth(currentDate);
    const startOfGrid = startOfWeek(startOfCurrentMonth, { weekStartsOn: 1 }); // 1 = Monday
    return Array.from({ length: 42 }, (_, i) => addDays(startOfGrid, i));
  }, [currentDate]);

  return {
    colorMode,
    theme,
    user,
    searchParams,
    setSearchParams,
    workspacesData,
    projectsData,
    projectGroupsData,
    projectGroups,
    isProjectsLoading,
    selectedWorkspaceId,
    selectedProjectId,
    selectedGroupId,
    isWorkspaceTab,
    expandedProjects,
    setExpandedProjects,
    expandedGroups,
    setExpandedGroups,
    isCreateProjectModalOpen,
    setIsCreateProjectModalOpen,
    isUpdateProjectModalOpen,
    setIsUpdateProjectModalOpen,
    selectedProjectToManage,
    setSelectedProjectToManage,
    creatingFolderInGroupId,
    setCreatingFolderInGroupId,
    newFolderName,
    setNewFolderName,
    isCreatingGroupInline,
    setIsCreatingGroupInline,
    newGroupName,
    setNewGroupName,
    creatingWorkspaceInFolderId,
    setCreatingWorkspaceInFolderId,
    creatingWorkspaceInGroupId,
    setCreatingWorkspaceInGroupId,
    newWorkspaceTitle,
    setNewWorkspaceTitle,
    menuAnchor,
    setMenuAnchor,
    activeMenuType,
    setActiveMenuType,
    activeProjectItem,
    setActiveProjectItem,
    activeWorkspaceItem,
    setActiveWorkspaceItem,
    activeGroupItem,
    setActiveGroupItem,
    toggleProjectExpand,
    toggleGroupExpand,
    handleOpenMenu,
    handleCloseMenu,
    handleSelectProject,
    handleSelectGroup,
    handleSelectWorkspace,
    handleCreateProject,
    handleCreateFolderInline,
    handleCreateWorkspaceInline,
    handleCreateGroupInline,
    handleDeleteGroup,
    handleRenameGroup,
    handleRenameGroupPrompt,
    handleUpdateProject,
    handleDeleteProject,
    handleDeleteWorkspace,
    notifAnchor,
    notifications,
    unreadCount,
    notifOpen,
    handleNotifOpen,
    handleNotifClose,
    markAsRead,
    markAllRead,
    deleteNotif,
    currentView,
    currentDate,
    showMiniCalendar,
    miniCalendarDays,
    activeTab,
    changeStatusTab,
  };
};

export type UseSidebarReturn = ReturnType<typeof useSidebar>;
