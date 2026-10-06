import i18n from '@/i18n';
import { notify } from '@/utils';
import { confirmAction } from './confirmService';

/**
 * Asks before deleting a task from its modal. `deleteTask` reports its own
 * errors and resolves false when the task couldn't be deleted: the dialog
 * then stays open to try again.
 */
export const confirmTaskDeletion = (
  deleteTask: () => Promise<boolean | void>,
  onDeleted: () => void,
) =>
  confirmAction({
    title: i18n.t('confirmDialogs.deleteTask.title'),
    description: i18n.t('confirmDialogs.deleteTask.description'),
    confirmText: i18n.t('confirmDialogs.deleteTask.confirm'),
    onConfirm: async () => {
      if ((await deleteTask()) === false) {
        throw new Error('The task was not deleted');
      }
      onDeleted();
      notify.success({ title: i18n.t('confirmDialogs.deleteTask.done') });
    },
  });
