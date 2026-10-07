import { useSyncExternalStore } from 'react';
import { ConfirmDeleteDialog } from '@/pages/Projects/modals/ConfirmDeleteDialog/ConfirmDeleteDialog';
import { confirmService } from '@/services/confirmService';

/** Shows the confirmations requested with confirmAction(). */
export const ConfirmDialogHost = () => {
  const request = useSyncExternalStore(
    confirmService.subscribe,
    confirmService.getSnapshot,
  );
  return (
    <ConfirmDeleteDialog
      open={Boolean(request)}
      onClose={confirmService.close}
      title={request?.title ?? ''}
      description={request?.description ?? ''}
      confirmText={request?.confirmText}
      warning={request?.warning}
      warningNote={request?.warningNote}
      onConfirm={async () => {
        await request?.onConfirm();
      }}
    />
  );
};
