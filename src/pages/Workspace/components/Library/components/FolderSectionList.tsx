import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  FolderSpecial as FolderSpecialIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderSection,
  FolderSectionHeader,
  FolderList,
  FolderCapsule,
  FolderIconCircle,
  MoreFoldersCapsule,
  MoreFoldersCircle,
  AddFolderCapsule,
  FolderOptionsIconButton,
} from '../WorkspaceLibrary.styles';
import type { FolderTypes } from '../../../types/workspace.types';

interface FolderSectionListProps {
  selectedFolderId: string | null;
  onFolderSelect: (id: string | null) => void;
  allWorkspacesCount: number;
  folders: FolderTypes[];
  foldersLoading: boolean;
  onFolderMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    folder: FolderTypes,
  ) => void;
  onAllFoldersOpen: () => void;
  onAddFolderOpen: () => void;
}

export const FolderSectionList = ({
  selectedFolderId,
  onFolderSelect,
  allWorkspacesCount,
  folders,
  foldersLoading,
  onFolderMenuOpen,
  onAllFoldersOpen,
  onAddFolderOpen,
}: FolderSectionListProps) => {
  const theme = useTheme();

  // Move selected folder to first position
  const sortedFolders = [...folders].sort((a, b) => {
    if (a.id === selectedFolderId) return -1;
    if (b.id === selectedFolderId) return 1;
    return 0;
  });

  const visibleFolders = sortedFolders.slice(0, 4);
  const hiddenFoldersCount =
    sortedFolders.length > 4 ? sortedFolders.length - 4 : 0;

  return (
    <FolderSection id="joyride-workspace-folders">
      <FolderSectionHeader>
        <FolderIcon sx={{ fontSize: 16 }} />
        <Typography>FOLDERS</Typography>
      </FolderSectionHeader>

      <FolderList>
        <AnimatePresence mode="popLayout" initial={false}>
          <Box
            component={motion.div}
            layout
            key="add-folder"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            sx={{ flexShrink: 0 }}
          >
            <AddFolderCapsule onClick={onAddFolderOpen}>
              <AddIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography>ADD FOLDER</Typography>
            </AddFolderCapsule>
          </Box>

          <Box
            component={motion.div}
            layout
            key="all-notes"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            sx={{ flexShrink: 0 }}
          >
            <FolderCapsule
              active={!selectedFolderId}
              onClick={() => onFolderSelect(null)}
            >
              <FolderIconCircle color={theme.palette.primary.main}>
                <FolderSpecialIcon sx={{ fontSize: 20 }} />
              </FolderIconCircle>
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{
                    color: !selectedFolderId
                      ? theme.palette.mode === 'dark'
                        ? '#fff'
                        : 'primary.main'
                      : 'text.primary',
                    lineHeight: 1.2,
                  }}
                >
                  All Notes
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', opacity: 0.7 }}
                >
                  {allWorkspacesCount} items
                </Typography>
              </Box>
            </FolderCapsule>
          </Box>

          {hiddenFoldersCount > 0 && (
            <Box
              component={motion.div}
              layout
              key="all-folders-more"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              sx={{ flexShrink: 0 }}
            >
              <MoreFoldersCapsule onClick={onAllFoldersOpen}>
                <MoreFoldersCircle className="more-count-circle">
                  +{hiddenFoldersCount}
                </MoreFoldersCircle>
                <Typography
                  variant="subtitle2"
                  fontWeight={800}
                  sx={{
                    color: 'text.secondary',
                    fontSize: '11px',
                    letterSpacing: '0.5px',
                  }}
                >
                  ALL FOLDERS
                </Typography>
              </MoreFoldersCapsule>
            </Box>
          )}

          {foldersLoading
            ? [1, 2, 3].map((i) => (
                <Box
                  key={`skeleton-${i}`}
                  component={motion.div}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  sx={{ flexShrink: 0 }}
                >
                  <Skeleton
                    variant="rectangular"
                    width={180}
                    height={64}
                    sx={{ borderRadius: '40px' }}
                  />
                </Box>
              ))
            : visibleFolders.map((folder: FolderTypes) => (
                <Box
                  key={folder.id}
                  component={motion.div}
                  layout
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                    mass: 0.8,
                  }}
                  sx={{ flexShrink: 0 }}
                >
                  <FolderCapsule
                    active={selectedFolderId === folder.id}
                    onClick={() => onFolderSelect(folder.id)}
                    color={folder.color}
                  >
                    <FolderOptionsIconButton
                      className="folder-options-btn"
                      onClick={(e) => onFolderMenuOpen(e, folder)}
                    >
                      <MoreVertIcon sx={{ fontSize: 16 }} />
                    </FolderOptionsIconButton>
                    <FolderIconCircle color={folder.color}>
                      {selectedFolderId === folder.id ? (
                        <FolderOpenIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <FolderIcon sx={{ fontSize: 20 }} />
                      )}
                    </FolderIconCircle>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{
                          color:
                            selectedFolderId === folder.id
                              ? folder.color || theme.palette.primary.main
                              : 'text.primary',
                          lineHeight: 1.2,
                          maxWidth: '120px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {folder.name.length > 40
                          ? `${folder.name.substring(0, 40)}...`
                          : folder.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', opacity: 0.7 }}
                      >
                        {folder.workspaceCount || 0} items
                      </Typography>
                    </Box>
                  </FolderCapsule>
                </Box>
              ))}
        </AnimatePresence>
      </FolderList>
    </FolderSection>
  );
};
