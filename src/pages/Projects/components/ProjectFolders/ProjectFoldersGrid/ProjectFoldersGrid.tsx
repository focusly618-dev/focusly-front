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
import {
  CreateFolderModal,
  CustomizeFolderModal,
  DeleteFolderModal,
} from '../../../modals';
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
  const { state, actions } = useProjectFoldersGrid();

  return (
    <GridWrapper>
      <FoldersGrid>
        {/* Dashed Create Folder Card */}
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
            Nuevo Proyecto
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontSize: '12px' }}
          >
            Crear una carpeta limpia
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
            ? `Mostrando ${groups.length} resultados para "${folderSearchTerm}"`
            : `Mostrando ${groups.length} de ${groups.length} proyectos`}
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
        group={state.selectedGroup}
        onConfirmDelete={onDeleteFolder}
      />
    </GridWrapper>
  );
};
