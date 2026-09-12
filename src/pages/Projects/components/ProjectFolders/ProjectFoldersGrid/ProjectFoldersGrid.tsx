import React from 'react';
import { Box, Typography, Pagination } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import {
  GridWrapper,
  FoldersGrid,
  DashedCard,
  AddCircleIconWrapper,
} from './ProjectFoldersGrid.styles';
import { useProjectFoldersGrid } from './ProjectFoldersGrid.hook';
import { ProjectFolderCard } from '../ProjectFolderCard';
import {
  CreateFolderModal,
  CustomizeFolderModal,
  DeleteFolderModal,
} from '../../modals';
import type { ProjectFoldersGridProps } from './ProjectFoldersGrid.types';

export const ProjectFoldersGrid: React.FC<ProjectFoldersGridProps> = ({
  groups,
  totalGroupPages = 1,
  groupPage = 1,
  onPageChange,
  onSelectFolder,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  folderSearchTerm = '',
}) => {
  const { t } = useTranslation();
  const { state, actions } = useProjectFoldersGrid();

  return (
    <GridWrapper>
      <FoldersGrid>
        {/* Dashed Create Folder Card */}
        <DashedCard onClick={actions.openCreate}>
          <AddCircleIconWrapper>
            <AddIcon sx={{ fontSize: 24 }} />
          </AddCircleIconWrapper>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: 'text.secondary' }}
          >
            {t('workspaceLibrary.newFolder')}
          </Typography>
        </DashedCard>

        {/* Folder Cards List */}
        {groups.map((group, index) => (
          <ProjectFolderCard
            key={group.id}
            group={group}
            index={index}
            onSelect={onSelectFolder}
            onCustomize={actions.openCustomize}
            onDelete={actions.openDelete}
          />
        ))}
      </FoldersGrid>

      {/* Pagination */}
      {!folderSearchTerm && totalGroupPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <Pagination
            count={totalGroupPages}
            page={groupPage}
            onChange={(_event, value) => onPageChange?.(value)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      {/* Modals */}
      <CreateFolderModal
        open={state.isCreateOpen}
        onClose={actions.closeCreate}
        onCreateFolder={onCreateFolder}
      />

      <CustomizeFolderModal
        open={state.isCustomizeOpen}
        onClose={actions.closeCustomize}
        group={state.selectedGroup}
        onUpdateFolder={onUpdateFolder}
      />

      <DeleteFolderModal
        open={state.isDeleteOpen}
        onClose={actions.closeDelete}
        group={state.selectedGroup}
        onConfirmDelete={onDeleteFolder}
      />
    </GridWrapper>
  );
};
