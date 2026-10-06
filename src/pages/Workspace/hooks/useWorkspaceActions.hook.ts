import { client } from '@/api/apollo';
import { REMOVE_WORKSPACE, GET_WORKSPACES } from '../Workspace.graphql';
import { notify, getFriendlyErrorMessage } from '@/utils';
import i18n from '@/i18n';
import { confirmAction } from '@/services/confirmService';

export const useWorkspaceActions = () => {
  const handleOpen = (id: string): void => {
    confirmAction({
      title: i18n.t('confirmDialogs.deleteDocument.title'),
      description: i18n.t('confirmDialogs.deleteDocument.description'),
      confirmText: i18n.t('confirmDialogs.deleteDocument.confirm'),
      onConfirm: () => deleteWorkspace(id),
    });
  };

  const deleteWorkspace = async (id: string) => {
    try {
      await client.mutate({
        mutation: REMOVE_WORKSPACE,
        variables: { id },
        refetchQueries: ['GetWorkspacesPaginated', 'GetWorkspaces'],
        update(cache) {
          cache.evict({ id: cache.identify({ __typename: 'Workspace', id }) });
          cache.evict({ fieldName: 'workspacesPaginated' });
          cache.evict({ fieldName: 'workspaces' });
          cache.gc();
        },
      });
      notify.success({
        title: i18n.t('confirmDialogs.deleteDocument.done'),
      });
    } catch (error) {
      console.error('Error deleting workspace:', error);
      notify.error({
        title: getFriendlyErrorMessage(
          error,
          i18n.t('confirmDialogs.deleteDocument.failed'),
        ),
      });
    }
  };

  const deleteWorkspaces = async (ids: string[]) => {
    if (!ids.length) return 0;

    const results = await Promise.allSettled(
      ids.map((id) =>
        client.mutate({ mutation: REMOVE_WORKSPACE, variables: { id } }),
      ),
    );
    const deletedIds = ids.filter((_, i) => results[i].status === 'fulfilled');
    const failed = results.filter(
      (r): r is PromiseRejectedResult => r.status === 'rejected',
    );
    failed.forEach((r) => console.error('Error deleting workspace:', r.reason));

    if (deletedIds.length > 0) {
      deletedIds.forEach((id) =>
        client.cache.evict({
          id: client.cache.identify({ __typename: 'Workspace', id }),
        }),
      );
      client.cache.gc();
      // Refetch once for the whole batch; project groups carry workspace counts.
      await client.refetchQueries({
        include: [
          'GetWorkspacesPaginated',
          'GetProjectGroupsPaginated',
          'GetProjectGroups',
        ],
      });
      notify.success({
        title: i18n.t('workspaceLibrary.toast.workspacesDeleted', {
          count: deletedIds.length,
        }),
      });
    }

    if (failed.length > 0) {
      notify.error({
        title: getFriendlyErrorMessage(
          failed[0].reason,
          i18n.t('workspaceLibrary.toast.workspacesDeleteFailed', {
            count: failed.length,
          }),
        ),
      });
      if (deletedIds.length === 0) throw failed[0].reason;
    }

    return deletedIds.length;
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
    deleteWorkspaces,
    open: false, // Placeholder
    handleClose: () => {}, // Placeholder
    onConfirm: () => {}, // Placeholder
  };
};
