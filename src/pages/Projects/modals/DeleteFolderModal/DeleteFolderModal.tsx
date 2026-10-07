import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ProjectGroupTypes } from '@/pages/Workspace/workspace.types';
import { ConfirmDeleteDialog } from '../ConfirmDeleteDialog/ConfirmDeleteDialog';

export interface DeleteFolderModalProps {
  open: boolean;
  onClose: () => void;
  groups: ProjectGroupTypes[];
  onConfirmDelete: (ids: string[]) => Promise<unknown> | void;
}

const getWorkspaceCount = (group: ProjectGroupTypes) =>
  group.workspaceCount ?? group.workspaces?.length ?? 0;

export const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({
  open,
  onClose,
  groups,
  onConfirmDelete,
}) => {
  const { t } = useTranslation();
  const isBulk = groups.length > 1;
  const workspaceCount = groups.reduce(
    (total, group) => total + getWorkspaceCount(group),
    0,
  );

  // Deleting a project also deletes every workspace inside it on the backend,
  // so warn about the data that will be lost.
  let warning: string;
  let warningNote: string | undefined;

  if (workspaceCount === 0) {
    warning = t('workspaceLibrary.deleteDialog.noWorkspacesWarning');
  } else {
    warning = isBulk
      ? t('workspaceLibrary.deleteDialog.bulkWorkspacesWarning', {
          count: workspaceCount,
        })
      : t('workspaceLibrary.deleteDialog.workspacesWarning', {
          count: workspaceCount,
        });
    warningNote = t('workspaceLibrary.deleteDialog.noWorkspacesWarning');
  }

  return (
    <ConfirmDeleteDialog
      open={open}
      onClose={onClose}
      title={
        isBulk
          ? t('workspaceLibrary.deleteDialog.bulkTitle', {
              count: groups.length,
            })
          : t('workspaceLibrary.deleteDialog.title')
      }
      description={
        isBulk
          ? t('workspaceLibrary.deleteDialog.bulkDescription', {
              count: groups.length,
            })
          : t('workspaceLibrary.deleteDialog.description', {
              name: groups[0]?.name || '',
            })
      }
      itemNames={groups.map((group) => group.name)}
      warning={warning}
      warningNote={warningNote}
      onConfirm={() => onConfirmDelete(groups.map((group) => group.id))}
    />
  );
};
