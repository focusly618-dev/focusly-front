import { useState, useEffect, useRef } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import type { Step } from 'react-joyride';
import { Folder as FolderIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { BlockNoteEditor } from '@blocknote/core';

import { useAppSelector } from '@/redux/hooks';
import {
  GET_TOTAL_WORKSPACES,
  GET_WORKSPACES,
  GET_WORKSPACE_BY_ID,
  GET_PROJECT_GROUPS,
} from '../Workspace.graphql';
import { useWorkspaceForm } from './useWorkspaceForm.hook';
import { useWorkspaceTasks } from './useWorkspaceTasks.hook';
import { useWorkspaceActions } from './useWorkspaceActions.hook';
import type { WorkspaceTypes } from '../types/workspace.types';

interface UseWorkspaceProps {
  isEditorOpen?: boolean;
  onEditorChange?: (isOpen: boolean) => void;
}

const defaultOnEditorChange = () => {};

export const useWorkspace = (props?: UseWorkspaceProps) => {
  const isEditorOpen = props?.isEditorOpen ?? false;
  const onEditorChange = props?.onEditorChange ?? defaultOnEditorChange;
  const { user } = useAppSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedGroupId = searchParams.get('groupId');
  const workspaceIdParam = searchParams.get('workspaceId');

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [prevGroupId, setPrevGroupId] = useState(selectedGroupId);
  const isSelectingWorkspaceRef = useRef(false);

  if (selectedGroupId !== prevGroupId) {
    setPrevGroupId(selectedGroupId);
    setIsCreatingNew(false);
  }

  // 1. Onboarding On-demand state
  const [runOnboarding, setRunOnboarding] = useState((): boolean => {
    return localStorage.getItem('onboarding_workspace_completed') !== 'true';
  });

  const onboardingSteps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      content: (
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Welcome to Your Workspace! 🧠
          </Typography>
          <Typography variant="body2">
            This is where you plan your strategy and organize your thoughts.
          </Typography>
        </Box>
      ),
    },
    {
      target: '#joyride-workspace-search',
      content: 'Quickly find your notes or projects using the search bar.',
    },
    {
      target: '#joyride-workspace-create-note',
      content: 'Start a new strategic note to capture your next big idea.',
    },
  ];

  const handleFinishOnboarding = (): void => {
    setRunOnboarding(false);
    localStorage.setItem('onboarding_workspace_completed', 'true');
  };

  // 2. Actions Hook (Delete, Search)
  const {
    open,
    handleOpen,
    handleClose,
    onConfirm,
    deleteWorkspace,
    searchWorkspaces,
  } = useWorkspaceActions();

  // 3. Form Hook (useForm, Auto-save)
  const {
    register,
    watch,
    setValue,
    getValues,
    reset,
    control,
    saveStatus,
    saveState,
  } = useWorkspaceForm();

  // 4. Tasks Hook (Selection, Sync, Updates)
  const {
    tasksData,
    isLoading,
    selectTask,
    handleSelectTask,
    handleUpdateTask,
    loadMore,
  } = useWorkspaceTasks({
    userId: user?.id,
    onTaskSelect: (taskId) => setValue('taskId', taskId),
  });

  // 5. GraphQL Queries
  const { data: workspacesData, loading: workspacesLoadingQuery } = useQuery(
    GET_WORKSPACES,
    {
      variables: { search: '' },
    },
  );

  const { data: projectGroupsData, loading: projectGroupsLoading } = useQuery(
    GET_PROJECT_GROUPS,
    {
      fetchPolicy: 'cache-and-network',
    },
  );

  const workspacesLoading = workspacesLoadingQuery || projectGroupsLoading;

  const [getWorkspaceById] = useLazyQuery(GET_WORKSPACE_BY_ID);
  const { data: totalWorkspacesData, loading: totalWorkspacesLoading } =
    useQuery(GET_TOTAL_WORKSPACES);

  const hasWorkspaces =
    (workspacesData?.workspaces?.length ?? 0) > 0 ||
    (projectGroupsData?.projectGroups?.length ?? 0) > 0;

  // 6. Effects
  // Load workspace from URL parameters
  useEffect(() => {
    const loadWorkspaceFromUrl = async () => {
      if (isSelectingWorkspaceRef.current) {
        isSelectingWorkspaceRef.current = false;
        return;
      }
      if (workspaceIdParam) {
        setIsCreatingNew(false);
        if (watch('id') !== workspaceIdParam) {
          try {
            const { data } = await getWorkspaceById({
              variables: { id: workspaceIdParam },
            });
            const workspace = data?.workspace;
            if (workspace) {
              reset({
                id: workspace.id,
                title: workspace.title,
                content: workspace.content,
                taskId: workspace.taskId || null,
                projectId: workspace.projectId,
                groupId: workspace.groupId,
                project: workspace.project,
                emoji: workspace.emoji,
                background_color: workspace.background_color,
                card_show_background: workspace.card_show_background,
                saveStatus: true,
              });
              if (workspace.task) {
                handleSelectTask(workspace.task);
              } else {
                handleSelectTask(null);
              }
              onEditorChange(true);
            } else {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('workspaceId');
              setSearchParams(newParams);
            }
          } catch (error) {
            console.error('Error loading workspace from URL', error);
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('workspaceId');
            setSearchParams(newParams);
          }
        }
      } else {
        if (isEditorOpen && !isCreatingNew) {
          onEditorChange(false);
        }
      }
    };
    loadWorkspaceFromUrl();
  }, [
    workspaceIdParam,
    isEditorOpen,
    isCreatingNew,
    getWorkspaceById,
    onEditorChange,
    setValue,
    handleSelectTask,
    searchParams,
    setSearchParams,
    watch,
    reset,
  ]);

  const workspaceId = watch('id');

  // Sync workspace ID to search parameters
  useEffect(() => {
    if (isEditorOpen && workspaceId && !workspaceIdParam) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('workspaceId', workspaceId);
      setSearchParams(newParams);
    }
  }, [
    isEditorOpen,
    workspaceId,
    workspaceIdParam,
    searchParams,
    setSearchParams,
  ]);

  // 7. Component Handlers
  const handleSelectWorkspace = (workspace: WorkspaceTypes): void => {
    isSelectingWorkspaceRef.current = true;
    setIsCreatingNew(false);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('workspaceId', workspace.id);
    setSearchParams(newParams);

    reset({
      id: workspace.id,
      title: workspace.title,
      content: workspace.content,
      taskId: workspace.taskId || null,
      projectId: workspace.projectId,
      groupId: workspace.groupId,
      project: workspace.project,
      emoji: workspace.emoji,
      background_color: workspace.background_color,
      card_show_background: workspace.card_show_background,
      saveStatus: true,
    });
    if (workspace.task) {
      handleSelectTask(workspace.task);
    } else {
      handleSelectTask(null);
    }
    onEditorChange(true);
  };

  const handleCreateNew = (): void => {
    isSelectingWorkspaceRef.current = true;
    setIsCreatingNew(true);

    // Clear workspaceId from URL to prevent reloading the previous workspace
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('workspaceId');
    setSearchParams(newParams);

    reset({
      title: 'Untitled Strategic Plan',
      taskId: undefined,
      content: '[]',
      id: undefined,
      projectId: undefined,
      groupId: selectedGroupId || undefined,
      emoji: undefined,
      background_color: undefined,
      card_show_background: false,
      saveStatus: true,
    });

    handleSelectTask(null);
    onEditorChange(true);
  };

  const getWorkspaceMentionMenuItems = (editor: BlockNoteEditor) => {
    if (!workspacesData?.workspaces) return [];

    const currentId = watch('id');
    const otherWorkspaces = workspacesData.workspaces.filter(
      (w: WorkspaceTypes) => w.id !== currentId,
    );

    return otherWorkspaces.map((w: WorkspaceTypes) => ({
      title: w.title,
      icon: (
        <FolderIcon
          sx={{ fontSize: 18, color: w.project?.color || 'primary.main' }}
        />
      ),
      onItemClick: () => {
        editor.insertInlineContent([
          {
            type: 'link',
            href: `/dashboard?tab=Workspace&workspaceId=${w.id}`,
            content: `@${w.title}`,
          },
          {
            type: 'text',
            text: ' ',
            styles: {},
          },
        ]);
      },
    }));
  };

  return {
    // Onboarding
    runOnboarding,
    handleFinishOnboarding,
    onboardingSteps,

    // Form
    register,
    setValue,
    watch,
    getValues,
    reset,
    control,
    saveStatus,
    saveState,
    totalWorkspacesData,
    totalWorkspacesLoading,

    // Tasks
    tasksData,
    loadMore,
    isLoading,
    handleSelectTask,
    selectTask,
    handleUpdateTask,

    // Actions
    searchWorkspaces,
    deleteWorkspace,
    open,
    handleOpen,
    handleClose,
    onConfirm,

    // Workspace loading / queries
    workspacesData,
    workspacesLoading,
    hasWorkspaces,
    workspaceIdParam,
    isCreatingNew,
    handleSelectWorkspace,
    handleCreateNew,
    getWorkspaceMentionMenuItems,

    // URL Parameters
    searchParams,
    setSearchParams,
    selectedGroupId,
  };
};
