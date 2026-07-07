import { useState, type ReactNode } from 'react';
import { useMutation } from '@apollo/client';
import { useTheme } from '@mui/material';
import { useAppSelector } from '@/redux/hooks';
import {
  CREATE_TASK,
  GET_TASKS,
  GET_TASKS_TITLES,
} from '@/pages/Tasks/Tasks.graphql';
import {
  CREATE_PROJECT_GROUP,
  CREATE_WORKSPACE,
  GET_PROJECT_GROUPS,
  GET_WORKSPACES,
} from '@/pages/Workspace/Workspace.graphql';
import type { ParsedLuminaAction } from '@/utils';
import type { UseSuggestedActionCardReturn } from './suggestedActionCard.types';
import {
  Folder as FolderIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';

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

  const normalizeEstimateTimer = (value?: number) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) return 1800;
    if (value > 1000 && value % 60 === 0) return Math.round(value / 60);
    return value;
  };

  const handleExecute = async () => {
    if (!user) {
      setErrorMessage('User not authenticated');
      return;
    }
    setErrorMessage('');

    try {
      if (action.type === 'CREATE_TASK') {
        const priorityLevel = action.payload.priority_level ?? 2;
        const estimateTimer = normalizeEstimateTimer(
          Number(action.payload.estimate_timer) || 1800,
        );

        const res = await createTask({
          variables: {
            createTaskInput: {
              title: action.payload.title || 'AI Task',
              notes_encrypted: `${action.payload.notes_encrypted || ''} [COLOR:#3b82f6]`,
              estimate_timer: estimateTimer,
              real_timer: 0,
              tags: [],
              deadline: new Date().toISOString(),
              priority_level: priorityLevel,
              category: 'General',
              color: '#3b82f6',
              links: [],
              user_id: user.id,
              status: 'Backlog',
              use_ai: true,
            },
          },
          refetchQueries: [
            { query: GET_TASKS, variables: { userId: user.id } },
            {
              query: GET_TASKS_TITLES,
              variables: { userId: user.id, limit: 24, offset: 0 },
            },
          ],
        });

        const id = res.data?.createTask?.id;
        if (id) {
          localStorage.setItem(actionIdKey, id);
          setCreatedId(id);
        }
      } else if (action.type === 'CREATE_WORKSPACE') {
        const res = await createWorkspace({
          variables: {
            createWorkspaceInput: {
              title: action.payload.title || 'AI Workspace',
              content: action.payload.content || '[]',
              groupId: action.payload.groupId || null,
              saveStatus: true,
            },
          },
          refetchQueries: [
            { query: GET_WORKSPACES, variables: { search: '' } },
          ],
        });

        const id = res.data?.createWorkspace?.id;
        if (id) {
          localStorage.setItem(actionIdKey, id);
          setCreatedId(id);
        }
      } else if (action.type === 'CREATE_NOTE') {
        const res = await createWorkspace({
          variables: {
            createWorkspaceInput: {
              title: action.payload.title || 'AI Note',
              content:
                action.payload.content_encrypted ||
                action.payload.content ||
                '[]',
              groupId:
                action.payload.project_group_id ||
                action.payload.groupId ||
                null,
              saveStatus: true,
            },
          },
          refetchQueries: [
            { query: GET_WORKSPACES, variables: { search: '' } },
          ],
        });

        const id = res.data?.createWorkspace?.id;
        if (id) {
          localStorage.setItem(actionIdKey, id);
          setCreatedId(id);
        }
      } else if (action.type === 'CREATE_PROJECT_GROUP') {
        const res = await createProjectGroup({
          variables: {
            input: {
              name: action.payload.name || 'AI Project Group',
              color: '#3b82f6',
              emoji: '📁',
            },
          },
          refetchQueries: [{ query: GET_PROJECT_GROUPS }],
        });

        const id = res.data?.createProjectGroup?.id;
        if (id) {
          localStorage.setItem(actionIdKey, id);
          setCreatedId(id);
        }
      } else if (action.type === 'INSERT_TO_WORKSPACE') {
        const text = action.payload.markdown || '';
        window.dispatchEvent(
          new CustomEvent('lumina-insert-content', {
            detail: { text },
          }),
        );
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

  const getActionTitle = (): string => {
    if (action.type === 'CREATE_TASK') return 'Create Task';
    if (action.type === 'CREATE_WORKSPACE') return 'Create Workspace';
    if (action.type === 'CREATE_NOTE') return 'Create Note';
    if (action.type === 'INSERT_TO_WORKSPACE') return 'Insert into Workspace';
    return 'Create Project Group';
  };

  const getActionDetails = (): string => {
    if (action.type === 'CREATE_TASK') {
      return `Title: "${action.payload.title}"`;
    }
    if (action.type === 'CREATE_WORKSPACE' || action.type === 'CREATE_NOTE') {
      return `Title: "${action.payload.title}"`;
    }
    if (action.type === 'INSERT_TO_WORKSPACE') {
      const summary = action.payload.markdown || '';
      return summary.length > 80 ? `${summary.substring(0, 80)}...` : summary;
    }
    return `Name: "${action.payload.name}"`;
  };

  const getActionIcon = (): ReactNode => {
    const sx = { fontSize: 20, color: theme.palette.primary.main };
    if (action.type === 'CREATE_TASK') return <AssignmentIcon sx={sx} />;
    if (action.type === 'CREATE_WORKSPACE' || action.type === 'CREATE_NOTE')
      return <DescriptionIcon sx={sx} />;
    if (action.type === 'INSERT_TO_WORKSPACE')
      return <AssignmentIcon sx={sx} />;
    return <FolderIcon sx={sx} />;
  };

  return {
    isCompleted,
    createdId,
    errorMessage,
    handleExecute,
    getActionIcon,
    getActionTitle,
    getActionDetails,
    isLoading,
  };
};
