import { useState, useMemo, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { startOfWeek, addDays, startOfMonth } from 'date-fns';
import { useAppSelector } from '@/redux/hooks';
import { ColorModeContext } from '@/context';
import {
  GET_WORKSPACES,
  REMOVE_WORKSPACE,
  CREATE_WORKSPACE,
  GET_PROJECT_GROUPS,
  CREATE_PROJECT_GROUP,
  UPDATE_PROJECT_GROUP,
  DELETE_PROJECT_GROUP,
} from '@/pages/Workspace/Workspace.graphql';
import { sileo } from '@/utils';
import type {
  WorkspaceTypes,
  ProjectGroupTypes,
} from '@/pages/Workspace/types/workspace.types';
import { TaskBar, type SidebarProps } from '../types/Sidebar.types';
import {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
  MARK_ALL_NOTIFICATIONS_AS_READ,
  DELETE_NOTIFICATION,
} from '@/pages/Notifications/Notifications.graphql';

interface SidebarNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: string;
}

export const useSidebar = ({ activeTab, changeStatusTab }: SidebarProps) => {
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();

  // Workspaces Queries & Mutations
  const { data: workspacesData } = useQuery(GET_WORKSPACES, {
    variables: { search: '' },
    fetchPolicy: 'cache-and-network',
  });
  const { data: projectGroupsData } = useQuery(GET_PROJECT_GROUPS, {
    fetchPolicy: 'cache-and-network',
  });

  // Workspaces Mutations
  const refetchAll = [
    { query: GET_WORKSPACES, variables: { search: '' } },
    { query: GET_PROJECT_GROUPS },
  ];
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
  const selectedGroupId = searchParams.get('groupId');
  const isWorkspaceTab = activeTab === TaskBar.Workspace;

  // Track expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  // Inline Project Group creation state
  const [isCreatingGroupInline, setIsCreatingGroupInline] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Track which group the workspace creation belongs to
  const [creatingWorkspaceInGroupId, setCreatingWorkspaceInGroupId] = useState<
    string | null
  >(null);
  const [newWorkspaceTitle, setNewWorkspaceTitle] = useState('');
  const [ungroupedName, setUngroupedName] = useState(() => {
    return localStorage.getItem('ungrouped_group_name') || 'Sin grupo';
  });

  // Inline Group Renaming state
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');

  // Tree Context Menus
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeMenuType, setActiveMenuType] = useState<
    'workspace' | 'group' | null
  >(null);
  const [activeWorkspaceItem, setActiveWorkspaceItem] =
    useState<WorkspaceTypes | null>(null);
  const [activeGroupItem, setActiveGroupItem] =
    useState<ProjectGroupTypes | null>(null);

  // Handlers
  const toggleGroupExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedGroups((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  const handleOpenMenu = (
    e: React.MouseEvent<HTMLElement>,
    type: 'workspace' | 'group',
    item: ProjectGroupTypes | WorkspaceTypes,
  ) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setActiveMenuType(type);
    if (type === 'group') {
      setActiveGroupItem(item as ProjectGroupTypes);
    } else {
      setActiveWorkspaceItem(item as WorkspaceTypes);
    }
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setActiveMenuType(null);
    setActiveWorkspaceItem(null);
    setActiveGroupItem(null);
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
    newParams.delete('projectId');
    newParams.delete('action');
    changeStatusTab(TaskBar.Workspace, newParams);
  };

  const handleCreateWorkspaceInline = async () => {
    const title = newWorkspaceTitle.trim();
    if (!title) return;
    try {
      const { data } = await createWorkspaceMutation({
        variables: {
          createWorkspaceInput: {
            title,
            content: '[]',
            groupId:
              creatingWorkspaceInGroupId === 'ungrouped'
                ? null
                : creatingWorkspaceInGroupId,
            saveStatus: true,
          },
        },
      });
      setNewWorkspaceTitle('');
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
    if (id === 'ungrouped') {
      const ungroupedWorkspaces = (workspacesData?.workspaces || []).filter(
        (w: WorkspaceTypes) => !w.groupId,
      );
      if (ungroupedWorkspaces.length === 0) {
        sileo.success({
          title: 'No notes to delete',
          description: 'There are no notes in this section.',
          fill: 'var(--sileo-success-bg)',
          duration: 3000,
        });
        return;
      }
      sileo.warning({
        title: 'Delete General Notes',
        description: `Are you sure you want to delete all ${ungroupedWorkspaces.length} notes in this section? This action is permanent.`,
        fill: 'var(--sileo-warning-bg)',
        button: {
          title: 'Delete All',
          onClick: async () => {
            try {
              for (const w of ungroupedWorkspaces) {
                await deleteWorkspaceMutation({ variables: { id: w.id } });
              }
              sileo.success({
                title: 'Notes deleted',
                description: 'All general notes have been deleted.',
                fill: 'var(--sileo-delete-bg)',
                duration: 4000,
              });
            } catch (err) {
              console.error('Error deleting general workspaces:', err);
            }
          },
        },
      });
      return;
    }

    sileo.warning({
      title: 'Remove Project',
      description:
        'Are you sure? Workspaces inside will be unlinked but not deleted.',
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
    if (id === 'ungrouped') {
      localStorage.setItem('ungrouped_group_name', name);
      setUngroupedName(name);
      return;
    }
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

  const handleRenameGroupPrompt = (group: ProjectGroupTypes) => {
    setEditingGroupId(group.id);
    setEditingGroupName(group.id === 'ungrouped' ? ungroupedName : group.name);
  };

  const handleRenameGroupSubmit = async () => {
    if (!editingGroupId) return;
    const trimmed = editingGroupName.trim();
    if (trimmed) {
      await handleRenameGroup(editingGroupId, trimmed);
    }
    setEditingGroupId(null);
    setEditingGroupName('');
  };

  // Derive project groups list
  const projectGroups: ProjectGroupTypes[] =
    projectGroupsData?.projectGroups || [];

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

  const { data: notificationsData } = useQuery(GET_NOTIFICATIONS, {
    pollInterval: 8000,
  });

  const [markRead] = useMutation(MARK_NOTIFICATION_AS_READ, {
    refetchQueries: [GET_NOTIFICATIONS],
  });
  const [markAllReadMutation] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ, {
    refetchQueries: [GET_NOTIFICATIONS],
  });
  const [deleteNotifMutation] = useMutation(DELETE_NOTIFICATION, {
    refetchQueries: [GET_NOTIFICATIONS],
  });

  const formatNotifTime = (createdAtStr: string) => {
    try {
      const date = new Date(createdAtStr);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = date.toDateString() === yesterday.toDateString();

      const timeStr = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const dateStr = date.toLocaleDateString([], {
        day: '2-digit',
        month: 'long',
      });

      if (isToday) {
        return `Hoy a las ${timeStr}`;
      } else if (isYesterday) {
        return `Ayer a las ${timeStr}`;
      } else {
        return `${dateStr} a las ${timeStr}`;
      }
    } catch {
      return createdAtStr;
    }
  };

  const notificationsList = notificationsData?.getNotifications || [];
  const notifications: SidebarNotification[] = notificationsList.map(
    (n: Record<string, string>) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      time: formatNotifTime(n.createdAt),
      read: n.status === 'read',
      type: n.type,
    }),
  );

  const unreadCount = notifications.filter((n) => !n.read).length;
  const notifOpen = Boolean(notifAnchor);

  const handleNotifOpen = (e: React.MouseEvent<HTMLButtonElement>) =>
    setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);
  const markAsRead = (id: string) => {
    markRead({ variables: { id } });
  };
  const markAllRead = () => {
    markAllReadMutation();
  };
  const deleteNotif = (id: string) => {
    deleteNotifMutation({ variables: { id } });
  };

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
    projectGroupsData,
    projectGroups,
    selectedWorkspaceId,
    selectedGroupId,
    isWorkspaceTab,
    expandedGroups,
    setExpandedGroups,
    isCreatingGroupInline,
    setIsCreatingGroupInline,
    newGroupName,
    setNewGroupName,
    creatingWorkspaceInGroupId,
    setCreatingWorkspaceInGroupId,
    newWorkspaceTitle,
    setNewWorkspaceTitle,
    menuAnchor,
    setMenuAnchor,
    activeMenuType,
    setActiveMenuType,
    activeWorkspaceItem,
    setActiveWorkspaceItem,
    activeGroupItem,
    setActiveGroupItem,
    toggleGroupExpand,
    handleOpenMenu,
    handleCloseMenu,
    handleSelectGroup,
    handleSelectWorkspace,
    handleCreateWorkspaceInline,
    handleCreateGroupInline,
    handleDeleteGroup,
    handleRenameGroup,
    handleRenameGroupPrompt,
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
    ungroupedName,
    setUngroupedName,
    editingGroupId,
    setEditingGroupId,
    editingGroupName,
    setEditingGroupName,
    handleRenameGroupSubmit,
  };
};

export type UseSidebarReturn = ReturnType<typeof useSidebar>;
