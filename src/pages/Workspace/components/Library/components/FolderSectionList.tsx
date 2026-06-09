import { Box, Typography, Skeleton, useTheme, IconButton } from '@mui/material';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  FolderSpecial as FolderSpecialIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';
import { FolderTabsContainer, FolderTabItem } from '../WorkspaceLibrary.styles';
import type { ProjectTypes } from '../../../types/workspace.types';

interface FolderSectionListProps {
  selectedFolderId: string | null;
  onFolderSelect: (id: string | null) => void;
  allWorkspacesCount: number;
  folders: ProjectTypes[];
  foldersLoading: boolean;
  onFolderMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    folder: ProjectTypes,
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
}: FolderSectionListProps) => {
  const theme = useTheme();

  return (
    <FolderTabsContainer id="joyride-workspace-folders">
      <AnimatePresence mode="popLayout" initial={false}>
        {/* All Notes Tab */}
        <Box
          component={motion.div}
          layout
          key="all-notes"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          sx={{ flexShrink: 0 }}
        >
          <FolderTabItem
            active={!selectedFolderId}
            onClick={() => onFolderSelect(null)}
            color={theme.palette.primary.main}
          >
            <FolderSpecialIcon sx={{ fontSize: 18, opacity: 0.8 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: !selectedFolderId ? 700 : 500 }}
            >
              All Notes
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '11px',
                px: 1,
                py: 0.2,
                borderRadius: '6px',
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.04)',
                color: theme.palette.text.secondary,
                border: `1px solid ${theme.palette.divider}`,
                fontWeight: 600,
              }}
            >
              {allWorkspacesCount}
            </Typography>
          </FolderTabItem>
        </Box>

        {/* Dynamic Folder Tabs */}
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
                  variant="text"
                  width={100}
                  height={40}
                  sx={{ borderRadius: '4px', mx: 1 }}
                />
              </Box>
            ))
          : folders.map((folder: ProjectTypes) => {
              const isActive = selectedFolderId === folder.id;
              const folderColor = folder.color || theme.palette.primary.main;
              return (
                <Box
                  key={folder.id}
                  component={motion.div}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                  sx={{ flexShrink: 0 }}
                >
                  <FolderTabItem
                    active={isActive}
                    onClick={() => onFolderSelect(folder.id)}
                    color={folderColor}
                    sx={{
                      '&:hover .folder-options-btn': {
                        opacity: 1,
                      },
                    }}
                  >
                    {isActive ? (
                      <FolderOpenIcon
                        sx={{ fontSize: 18, color: folderColor }}
                      />
                    ) : (
                      <FolderIcon
                        sx={{ fontSize: 18, color: folderColor, opacity: 0.8 }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isActive ? 700 : 500,
                        maxWidth: '120px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {folder.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '11px',
                        px: 1,
                        py: 0.2,
                        borderRadius: '6px',
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(0,0,0,0.04)',
                        color: theme.palette.text.secondary,
                        border: `1px solid ${theme.palette.divider}`,
                        fontWeight: 600,
                        mr: 0.5,
                      }}
                    >
                      {folder.workspaceCount || 0}
                    </Typography>
                    <IconButton
                      className="folder-options-btn"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFolderMenuOpen(e, folder);
                      }}
                      sx={{
                        p: 0.1,
                        opacity: isActive ? 0.7 : 0,
                        transition: 'opacity 0.2s',
                        color: isActive ? '#fff' : 'text.secondary',
                        bgcolor: isActive ? 'rgba(0,0,0,0.15)' : 'transparent',
                        '&:hover': {
                          bgcolor: isActive
                            ? 'rgba(0,0,0,0.3)'
                            : 'action.hover',
                        },
                      }}
                    >
                      <MoreVertIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </FolderTabItem>
                </Box>
              );
            })}
      </AnimatePresence>
    </FolderTabsContainer>
  );
};
