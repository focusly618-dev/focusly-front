import { Box, IconButton, useTheme } from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  GridView as GridViewIcon,
} from '@mui/icons-material';
import { SearchBar } from '../WorkspaceLibrary.styles';

interface LibrarySearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

export const LibrarySearchHeader = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
}: LibrarySearchHeaderProps) => {
  const theme = useTheme();

  return (
    <Box display="flex" alignItems="center" sx={{ gap: 1.5, py: 1 }}>
      <SearchBar id="joyride-workspace-search" sx={{ height: '38px', py: 0 }}>
        <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
        <input
          placeholder="Search workspaces..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {!searchTerm && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 0.8,
              py: 0.2,
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.05)',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '4px',
              color: 'text.secondary',
              fontSize: '10px',
              fontWeight: 700,
              fontFamily: 'monospace',
              letterSpacing: '0.5px',
              opacity: 0.8,
              userSelect: 'none',
              ml: 1,
            }}
          >
            ⌘F
          </Box>
        )}
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

      <IconButton
        size="small"
        disabled
        sx={{
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
          borderRadius: '8px',
          p: 0.5,
          width: '38px',
          height: '38px',
          color: 'text.secondary',
          '&.Mui-disabled': {
            color: theme.palette.text.secondary,
            opacity: 0.5,
          },
        }}
      >
        <GridViewIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
};
