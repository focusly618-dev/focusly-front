import { useMutation } from '@apollo/client';
import { UPDATE_WORKSPACE } from '../../Workspace/Workspace.graphql';
import type { WorkspaceTypes } from '../../Workspace/workspace.types';
import { notify } from '@/utils';

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
      notify.success({
        title: 'Background updated',
        description: 'Workspace background updated successfully.',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error setting background:', err);
      notify.error({
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
      notify.success({
        title: 'Background removed',
        description: 'Workspace background has been reset.',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error removing background:', err);
      notify.error({
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
      notify.success({
        title: 'Task unlinked',
        description: 'The task association has been removed.',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error unlinking task:', err);
      notify.error({
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
