import React from 'react';
import { useTranslation } from 'react-i18next';
import type { WorkspaceTypes } from '@/pages/Workspace/workspace.types';
import { UNTITLED_WORKSPACE_TITLE } from '@/utils';
import { ConfirmDeleteDialog } from '../ConfirmDeleteDialog/ConfirmDeleteDialog';

export interface DeleteWorkspacesModalProps {
  open: boolean;
  onClose: () => void;
  workspaces: WorkspaceTypes[];
  onConfirmDelete: (ids: string[]) => Promise<unknown> | void;
}

export const DeleteWorkspacesModal: React.FC<DeleteWorkspacesModalProps> = ({
  open,
  onClose,
  workspaces,
  onConfirmDelete,
}) => {
  const { t } = useTranslation();
  const isBulk = workspaces.length > 1;

  return (
    <ConfirmDeleteDialog
      open={open}
      onClose={onClose}
      title={
        isBulk
          ? t('workspaceLibrary.deleteWorkspacesDialog.bulkTitle', {
              count: workspaces.length,
            })
          : t('workspaceLibrary.deleteWorkspacesDialog.title')
      }
      description={
        isBulk
          ? t('workspaceLibrary.deleteWorkspacesDialog.bulkDescription', {
              count: workspaces.length,
            })
          : t('workspaceLibrary.deleteWorkspacesDialog.description', {
              name: workspaces[0]?.title || UNTITLED_WORKSPACE_TITLE,
            })
      }
      itemNames={workspaces.map(
        (workspace) => workspace.title || UNTITLED_WORKSPACE_TITLE,
      )}
      warning={
        isBulk
          ? t('workspaceLibrary.deleteWorkspacesDialog.warning_other', {
              count: workspaces.length,
            })
          : t('workspaceLibrary.deleteWorkspacesDialog.warning_one', {
              count: 1,
            })
      }
      warningNote={t('workspaceLibrary.deleteDialog.noWorkspacesWarning')}
      onConfirm={() =>
        onConfirmDelete(workspaces.map((workspace) => workspace.id))
      }
    />
  );
};
