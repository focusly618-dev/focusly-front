import { EMPTY_DOCUMENT } from '@/utils/documentContent';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';

import { useAppSelector } from '@/redux/hooks';
import {
  GET_WORKSPACES,
  GET_WORKSPACE_BY_ID,
  GET_PROJECT_GROUPS,
} from '../Workspace.graphql';
import { useWorkspaceForm } from './useWorkspaceForm.hook';
import { useWorkspaceTasks } from './useWorkspaceTasks.hook';
import { useWorkspaceActions } from './useWorkspaceActions.hook';
import type { WorkspaceTypes, TaskSearchItems } from '../workspace.types';

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

  // 5. GraphQL Queries. The sidebar already loads (and keeps fresh) these
  // same two: from the cache, so opening the page doesn't fetch them again.
  const { data: workspacesData, loading: workspacesLoadingQuery } = useQuery(
    GET_WORKSPACES,
    {
      variables: { search: '' },
      fetchPolicy: 'cache-first',
    },
  );

  const { data: projectGroupsData, loading: projectGroupsLoading } = useQuery(
    GET_PROJECT_GROUPS,
    {
      fetchPolicy: 'cache-first',
    },
  );

  const workspacesLoading = workspacesLoadingQuery || projectGroupsLoading;

  const [getWorkspaceById] = useLazyQuery(GET_WORKSPACE_BY_ID);

  const workspaces: WorkspaceTypes[] = useMemo(() => {
    const list = workspacesData?.result?.workspaces || [];
    return [...list].sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [workspacesData]);

  const hasWorkspaces =
    workspaces.length > 0 ||
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
              const linkedList =
                (workspace.tasks as unknown as TaskSearchItems[]) || [];
              reset({
                id: workspace.id,
                title: workspace.title,
                content: workspace.content,
                taskId: workspace.taskId || (linkedList[0]?.id ?? null),
                projectId: workspace.projectId,
                groupId: workspace.groupId,
                project: workspace.project,
                emoji: workspace.emoji,
                background_color: workspace.background_color,
                card_show_background: workspace.card_show_background,
                saveStatus: true,
                tasks: linkedList,
              });
              if (workspace.task) {
                handleSelectTask(workspace.task);
              } else if (linkedList.length > 0) {
                handleSelectTask(linkedList[0]);
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

    const linkedList = (workspace.tasks as unknown as TaskSearchItems[]) || [];
    reset({
      id: workspace.id,
      title: workspace.title,
      content: workspace.content,
      taskId: workspace.taskId || (linkedList[0]?.id ?? null),
      projectId: workspace.projectId,
      groupId: workspace.groupId,
      project: workspace.project,
      emoji: workspace.emoji,
      background_color: workspace.background_color,
      card_show_background: workspace.card_show_background,
      saveStatus: true,
      tasks: linkedList,
    });
    if (workspace.task) {
      handleSelectTask(workspace.task);
    } else if (linkedList.length > 0) {
      handleSelectTask(linkedList[0]);
    } else {
      handleSelectTask(null);
    }
    onEditorChange(true);
  };

  const handleCreateNew = (
    initialTitle?: string,
    initialContent?: string,
    targetGroupId?: string,
  ): void => {
    isSelectingWorkspaceRef.current = true;
    setIsCreatingNew(true);

    // Clear workspaceId from URL to prevent reloading the previous workspace
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('workspaceId');
    newParams.delete('modal');
    setSearchParams(newParams);

    reset({
      title: initialTitle || '',
      taskId: undefined,
      content: initialContent || EMPTY_DOCUMENT,
      id: undefined,
      projectId: undefined,
      groupId: targetGroupId || selectedGroupId || undefined,
      emoji: undefined,
      background_color: undefined,
      card_show_background: false,
      saveStatus: true,
    });

    handleSelectTask(null);
    onEditorChange(true);
  };

  return {
    // Form
    register,
    setValue,
    watch,
    getValues,
    reset,
    control,
    saveStatus,
    saveState,

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
    workspaces,
    workspacesData,
    workspacesLoading,
    hasWorkspaces,
    workspaceIdParam,
    isCreatingNew,
    handleSelectWorkspace,
    handleCreateNew,

    // URL Parameters
    searchParams,
    setSearchParams,
    selectedGroupId,
  };
};
