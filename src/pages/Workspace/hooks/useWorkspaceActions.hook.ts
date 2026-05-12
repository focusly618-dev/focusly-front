import { client } from '@/api/apollo';
import { REMOVE_WORKSPACE, GET_WORKSPACES } from '../workspaces.graphql';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { useConfirm } from '@/components/ui/Confirm/ConfirmContext';

export const useWorkspaceActions = () => {
  const toast = useToast();
  const { confirm } = useConfirm();
  const handleOpen = async (id: string) => {
    const ok = await confirm({
      title: 'Delete Workspace',
      description: 'Are you sure you want to remove this workspace? This action cannot be undone.',
      confirmText: 'Delete',
      severity: 'error'
    });

    if (ok) {
      deleteWorkspace(id);
    }
  };

  const deleteWorkspace = async (id: string) => {
    try {
      await client.mutate({
        mutation: REMOVE_WORKSPACE,
        variables: { id },
        update(cache) {
          cache.modify({
            fields: {
              workspaces(existingWorkspaces = [], { readField }) {
                return existingWorkspaces.filter(
                  (workspaceRef: import('@apollo/client').Reference) =>
                    id !== readField('id', workspaceRef)
                );
              },
              totalWorkspaces(existingTotal = 0) {
                return Math.max(0, existingTotal - 1);
              },
            },
          });
        },
      });
      toast.success('Workspace deleted');
    } catch (error) {
      console.error('Error deleting workspace:', error);
      toast.error('Error deleting workspace');
    }
  };

  // ... rest of the hook
  const searchWorkspaces = async (query: string) => {
    try {
      const result = await client.query({
        query: GET_WORKSPACES,
        variables: { search: query },
      });
      return result.data.workspaces;
    } catch (error) {
      console.error('Error searching workspaces:', error);
      return [];
    }
  };

  return {
    handleOpen,
    searchWorkspaces,
    deleteWorkspace,
    open: false, // Placeholder
    handleClose: () => {}, // Placeholder
    onConfirm: () => {}, // Placeholder
  };
};
