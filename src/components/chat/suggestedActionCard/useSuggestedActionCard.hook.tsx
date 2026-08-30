import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useTheme } from '@mui/material';
import { useAppSelector } from '@/redux/hooks';
import { CREATE_TASK } from '@/pages/Tasks/Tasks.graphql';
import {
  CREATE_PROJECT_GROUP,
  CREATE_WORKSPACE,
} from '@/pages/Workspace/Workspace.graphql';
import type { ParsedLuminaAction } from '@/utils';
import type { UseSuggestedActionCardReturn } from './suggestedActionCard.types';
import {
  executeSingleAction,
  getActionIcon,
  getActionTitle,
  getActionPreviewData,
} from './actionExecution.utils';

export const useSuggestedActionCard = (
  action: ParsedLuminaAction,
): UseSuggestedActionCardReturn => {
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);

  // Generate unique keys based on action payload properties
  const actionKey = `focusly_action_completed_${action.type}_${JSON.stringify(action.payload)}`;
  const actionIdKey = `focusly_action_created_id_${action.type}_${JSON.stringify(action.payload)}`;

  const [isCompleted, setIsCompleted] = useState(() => {
    return localStorage.getItem(actionKey) === 'true';
  });
  const [createdId, setCreatedId] = useState(() => {
    return localStorage.getItem(actionIdKey) || '';
  });
  const [errorMessage, setErrorMessage] = useState('');

  const [createTask, { loading: taskLoading }] = useMutation(CREATE_TASK);
  const [createWorkspace, { loading: wsLoading }] =
    useMutation(CREATE_WORKSPACE);
  const [createProjectGroup, { loading: groupLoading }] =
    useMutation(CREATE_PROJECT_GROUP);

  const isLoading = taskLoading || wsLoading || groupLoading;

  const handleExecute = async () => {
    if (!user) {
      setErrorMessage('User not authenticated');
      return;
    }
    setErrorMessage('');

    try {
      const { id } = await executeSingleAction(action, {
        userId: user.id,
        createTask,
        createWorkspace,
        createProjectGroup,
      });
      if (id) {
        localStorage.setItem(actionIdKey, id);
        setCreatedId(id);
      }
      localStorage.setItem(actionKey, 'true');
      setIsCompleted(true);
    } catch (err) {
      console.error('Error executing AI action:', err);
      const message =
        err instanceof Error ? err.message : 'Error executing action';
      setErrorMessage(message);
    }
  };

  return {
    isCompleted,
    createdId,
    errorMessage,
    handleExecute,
    getActionIcon: () => getActionIcon(action, theme.palette.primary.main),
    getActionTitle: () => getActionTitle(action),
    getActionPreview: () => getActionPreviewData(action),
    isLoading,
  };
};
