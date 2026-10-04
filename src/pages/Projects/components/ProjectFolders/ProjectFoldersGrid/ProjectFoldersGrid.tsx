import React from 'react';
import { Box, Typography, Pagination } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {
  GridWrapper,
  FoldersGrid,
  DashedCard,
  AddCircleIconWrapper,
} from './ProjectFoldersGrid.styles';
import { useProjectFoldersGrid } from './ProjectFoldersGrid.hook';
import { ProjectFolderCard } from '../ProjectFolderCard';
import { SelectionToolbar } from '../../SelectionToolbar';
import {
  CreateFolderModal,
  CustomizeFolderModal,
  DeleteFolderModal,
} from '../../../modals';
import { useTranslation } from 'react-i18next';
import type { ProjectFoldersGridProps } from './ProjectFoldersGrid.types';

export const ProjectFoldersGrid: React.FC<ProjectFoldersGridProps> = ({
  groups,
  totalGroupPages = 1,
  groupPage = 1,
  onPageChange,
  onSelectFolder,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolders,
  folderSearchTerm = '',
  selection: { state: selection, actions: selectionActions },
}) => {
  const { t } = useTranslation();
  const { state, actions } = useProjectFoldersGrid();

  const handleConfirmDelete = async (ids: string[]) => {
    await onDeleteFolders(ids);
    selectionActions.stopSelecting();
  };

  return (
    <GridWrapper>
      {selection.isSelecting && (
        <Box sx={{ mb: 2 }}>
          <SelectionToolbar
            isSelecting
            selectedCount={selection.selectedCount}
            allSelected={selectionActions.areAllSelected(groups)}
            hasItems={groups.length > 0}
            onCancel={selectionActions.stopSelecting}
            onToggleAll={() => selectionActions.toggleAll(groups)}
            onDelete={() => actions.openDelete(selection.selectedItems)}
          />
        </Box>
      )}

      <FoldersGrid>
        {/* Dashed Create Folder Card */}
        {!selection.isSelecting && (
          <DashedCard onClick={actions.openCreate}>
            <AddCircleIconWrapper>
              <AddIcon sx={{ fontSize: 22 }} />
            </AddCircleIconWrapper>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                fontSize: '15px',
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              {t('projects.newProject', 'Nuevo Proyecto')}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontSize: '12px' }}
            >
              {t('projects.createCleanFolder', 'Crear una carpeta limpia')}
            </Typography>
          </DashedCard>
        )}

        {/* Folder Cards List */}
        {groups.map((group) => (
          <ProjectFolderCard
            key={group.id}
            group={group}
            onSelect={onSelectFolder}
            onCustomize={actions.openCustomize}
            onDelete={actions.openDelete}
            selectionMode={selection.isSelecting}
            selected={selectionActions.isSelected(group.id)}
            onToggleSelect={selectionActions.toggle}
          />
        ))}
      </FoldersGrid>

      {/* Pagination Footer */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 4,
          pb: 2,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontSize: '13px' }}
        >
          {folderSearchTerm
            ? t(
                'projects.showingResultsFor',
                `Mostrando ${groups.length} resultados para "${folderSearchTerm}"`,
                { count: groups.length, term: folderSearchTerm },
              )
            : t(
                'projects.showingCountOfTotal',
                `Mostrando ${groups.length} de ${groups.length} proyectos`,
                { current: groups.length, total: groups.length },
              )}
        </Typography>

        <Pagination
          count={Math.max(totalGroupPages, 1)}
          page={groupPage}
          onChange={(_event, value) => onPageChange?.(value)}
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: '6px',
              fontSize: '13px',
              minWidth: '32px',
              height: '32px',
              fontWeight: 500,
              color: 'text.secondary',
              '&.Mui-selected': {
                bgcolor: '#008767 !important',
                color: '#ffffff',
                fontWeight: 700,
              },
              '&:hover': {
                bgcolor: 'action.hover',
              },
            },
          }}
        />
      </Box>

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
        groups={state.groupsToDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </GridWrapper>
  );
};
