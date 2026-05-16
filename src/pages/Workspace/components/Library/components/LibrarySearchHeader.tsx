import { Box, IconButton } from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  FolderShared as FolderSharedIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import {
  LibraryHeader,
  HeaderTitle,
  HeaderSubtitle,
  SearchBar,
  ActionCapsule,
  CapsuleIconButton,
} from '../WorkspaceLibrary.styles';

interface LibrarySearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  searchMode: 'workspace' | 'folder';
  onSearchModeChange: (mode: 'workspace' | 'folder') => void;
}

export const LibrarySearchHeader = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  searchMode,
  onSearchModeChange,
}: LibrarySearchHeaderProps) => {
  return (
    <LibraryHeader>
      <Box>
        <HeaderTitle>Workspace Library</HeaderTitle>
        <HeaderSubtitle>
          Manage your strategic documents and brain dumps.
        </HeaderSubtitle>
      </Box>
      <Box display="flex" alignItems="center">
        <SearchBar id="joyride-workspace-search">
          <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <input
            placeholder={
              searchMode === 'workspace'
                ? 'Search workspaces...'
                : 'Search folders...'
            }
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              p: 0.5,
              visibility: searchTerm ? 'visible' : 'hidden',
            }}
            onClick={onClearSearch}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </SearchBar>

        <ActionCapsule>
          <CapsuleIconButton
            active={searchMode === 'folder'}
            onClick={() => {
              onSearchModeChange('folder');
              if (searchMode !== 'folder') onClearSearch();
            }}
          >
            <FolderSharedIcon fontSize="small" />
          </CapsuleIconButton>
          <CapsuleIconButton
            active={searchMode === 'workspace'}
            onClick={() => {
              onSearchModeChange('workspace');
              if (searchMode !== 'workspace') onClearSearch();
            }}
          >
            <FilterListIcon fontSize="small" />
          </CapsuleIconButton>
        </ActionCapsule>
      </Box>
    </LibraryHeader>
  );
};
