import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import {
  CREATE_TASK,
  GET_TASKS,
  GET_TASKS_TITLES,
} from '@/pages/Tasks/Task.graphql';
import {
  CREATE_WORKSPACE,
  CREATE_PROJECT_GROUP,
  GET_WORKSPACES,
  GET_PROJECT_GROUPS,
} from '@/pages/Workspace/workspaces.graphql';
import { useAppSelector } from '@/redux/hooks';

import { type ParsedLuminaAction } from '@/utils/lumina';

interface SuggestedActionCardProps {
  action: ParsedLuminaAction;
}

export const SuggestedActionCard: React.FC<SuggestedActionCardProps> = ({
  action,
}) => {
  const theme = useTheme();
  const [, setSearchParams] = useSearchParams();
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
      if (action.type === 'CREATE_TASK') {
        const priorityLevel = action.payload.priority_level ?? 2;
        const estimateTimer = action.payload.estimate_timer ?? 1800;

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
            { query: GET_TASKS_TITLES, variables: { userId: user.id } },
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

  const getActionTitle = () => {
    if (action.type === 'CREATE_TASK') return 'Create Task';
    if (action.type === 'CREATE_WORKSPACE') return 'Create Workspace';
    if (action.type === 'INSERT_TO_WORKSPACE') return 'Insert into Workspace';
    return 'Create Project Group';
  };

  const getActionDetails = () => {
    if (action.type === 'CREATE_TASK') {
      return `Title: "${action.payload.title}"`;
    }
    if (action.type === 'CREATE_WORKSPACE') {
      return `Title: "${action.payload.title}"`;
    }
    if (action.type === 'INSERT_TO_WORKSPACE') {
      const summary = action.payload.markdown || '';
      return summary.length > 80 ? `${summary.substring(0, 80)}...` : summary;
    }
    return `Name: "${action.payload.name}"`;
  };

  const getActionIcon = () => {
    const sx = { fontSize: 20, color: theme.palette.primary.main };
    if (action.type === 'CREATE_TASK') return <AssignmentIcon sx={sx} />;
    if (action.type === 'CREATE_WORKSPACE') return <DescriptionIcon sx={sx} />;
    if (action.type === 'INSERT_TO_WORKSPACE')
      return <AssignmentIcon sx={sx} />;
    return <FolderIcon sx={sx} />;
  };

  return (
    <Card
      sx={{
        mt: 1.5,
        mb: 0.5,
        borderRadius: '12px',
        border: `1px solid ${theme.palette.divider}`,
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.3) 100%)'
            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.6) 100%)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="center" gap={1.2} mb={1}>
          {getActionIcon()}
          <Typography variant="subtitle2" fontWeight={800} color="text.primary">
            {getActionTitle()} Suggestion
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, fontSize: '13px' }}
        >
          {getActionDetails()}
        </Typography>

        {errorMessage && (
          <Typography
            variant="caption"
            color="error.main"
            display="block"
            sx={{ mb: 2 }}
          >
            {errorMessage}
          </Typography>
        )}

        <Box display="flex" justifyContent="flex-end" alignItems="center">
          {isCompleted ? (
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                display="flex"
                alignItems="center"
                gap={0.8}
                sx={{ color: 'success.main' }}
              >
                <CheckCircleIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" fontWeight={700}>
                  {action.type === 'INSERT_TO_WORKSPACE'
                    ? 'Inserted Successfully!'
                    : 'Created Successfully!'}
                </Typography>
              </Box>

              {createdId && action.type === 'CREATE_WORKSPACE' && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    setSearchParams({
                      tab: 'Workspace',
                      workspaceId: createdId,
                    })
                  }
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '10px',
                    borderRadius: '6px',
                    py: 0.2,
                    px: 1.2,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      bgcolor: 'rgba(59, 130, 246, 0.08)',
                    },
                  }}
                >
                  Open Workspace
                </Button>
              )}

              {createdId && action.type === 'CREATE_TASK' && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSearchParams((prev) => {
                      const newParams = new URLSearchParams(prev);
                      newParams.set('taskId', createdId);
                      return newParams;
                    });
                  }}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '10px',
                    borderRadius: '6px',
                    py: 0.2,
                    px: 1.2,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      bgcolor: 'rgba(59, 130, 246, 0.08)',
                    },
                  }}
                >
                  View Task
                </Button>
              )}
            </Box>
          ) : (
            <Button
              variant="contained"
              size="small"
              disabled={isLoading}
              onClick={handleExecute}
              startIcon={
                isLoading ? (
                  <CircularProgress size={12} color="inherit" />
                ) : (
                  <AddIcon sx={{ fontSize: 14 }} />
                )
              }
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '11px',
                borderRadius: '6px',
                px: 2.5,
                boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
              }}
            >
              {isLoading
                ? action.type === 'INSERT_TO_WORKSPACE'
                  ? 'Inserting...'
                  : 'Creating...'
                : action.type === 'INSERT_TO_WORKSPACE'
                  ? 'Insert into Note'
                  : 'Create'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
