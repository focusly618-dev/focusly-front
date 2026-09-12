import { useMutation } from '@apollo/client';
import { UPDATE_WORKSPACE } from '../../Workspace/Workspace.graphql';
import type { WorkspaceTypes } from '../../Workspace/workspace.types';
import { sileo } from '@/utils';

export const useProjectDocActions = () => {
  const [updateWorkspace, { loading: updating }] = useMutation(
    UPDATE_WORKSPACE,
    {
      refetchQueries: ['GetWorkspacesPaginated', 'GetWorkspaceById'],
    },
  );

  const setBackgroundColor = async (workspaceId: string, color: string) => {
    try {
      await updateWorkspace({
        variables: {
          updateWorkspaceInput: {
            id: workspaceId,
            background_color: color,
            card_show_background: true,
          },
        },
      });
      sileo.success({
        title: 'Background updated',
        description: 'Workspace background updated successfully.',
        fill: 'var(--sileo-update-bg)',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error setting background:', err);
      sileo.error({
        title: 'Error',
        description: 'Failed to update background color.',
        duration: 3000,
      });
    }
  };

  const removeBackgroundColor = async (workspaceId: string) => {
    try {
      await updateWorkspace({
        variables: {
          updateWorkspaceInput: {
            id: workspaceId,
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
      sileo.error({
        title: 'Error',
        description: 'Failed to reset background.',
        duration: 3000,
      });
    }
  };

  const unlinkTask = async (workspace: WorkspaceTypes) => {
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
      sileo.error({
        title: 'Error',
        description: 'Failed to unlink task.',
        duration: 3000,
      });
    }
  };

  return {
    setBackgroundColor,
    removeBackgroundColor,
    unlinkTask,
    updating,
  };
};
