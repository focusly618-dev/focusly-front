import { useState } from 'react';
import {
  Box,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  Apps as AppsIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { SearchBar } from '../WorkspaceLibrary.styles';

interface LibrarySearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  viewMode: 'gallery' | 'list' | 'grid';
  onViewModeChange: (mode: 'gallery' | 'list' | 'grid') => void;
}

export const LibrarySearchHeader = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  viewMode,
  onViewModeChange,
}: LibrarySearchHeaderProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectMode = (mode: 'gallery' | 'list' | 'grid') => {
    onViewModeChange(mode);
    handleCloseMenu();
  };

  const getActiveIcon = () => {
    switch (viewMode) {
      case 'list':
        return <ViewListIcon sx={{ fontSize: 18 }} />;
      case 'grid':
        return <AppsIcon sx={{ fontSize: 18 }} />;
      case 'gallery':
      default:
        return <GridViewIcon sx={{ fontSize: 18 }} />;
    }
  };

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
        onClick={handleOpenMenu}
        sx={{
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
          borderRadius: '8px',
          p: 0.5,
          width: '38px',
          height: '38px',
          color: 'text.secondary',
          bgcolor: anchorEl
            ? theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.03)'
            : 'transparent',
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.03)',
            borderColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.25)'
                : 'rgba(0,0,0,0.25)',
          },
        }}
      >
        {getActiveIcon()}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            mt: 1,
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 8px 24px rgba(0,0,0,0.4), 0 0 1px 1px rgba(255,255,255,0.05)'
                : '0 8px 24px rgba(0,0,0,0.08), 0 0 1px 1px rgba(0,0,0,0.05)',
            bgcolor: 'background.paper',
            minWidth: 150,
            p: 0.5,
          },
        }}
      >
        <MenuItem
          onClick={() => handleSelectMode('gallery')}
          selected={viewMode === 'gallery'}
          sx={{
            fontSize: '13px',
            borderRadius: '6px',
            py: 1,
            fontWeight: 500,
          }}
        >
          <ListItemIcon sx={{ minWidth: '32px !important' }}>
            <GridViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Gallery"
            primaryTypographyProps={{ fontSize: '13px' }}
          />
          {viewMode === 'gallery' && (
            <CheckIcon fontSize="small" sx={{ ml: 1, fontSize: 16 }} />
          )}
        </MenuItem>

        <MenuItem
          onClick={() => handleSelectMode('grid')}
          selected={viewMode === 'grid'}
          sx={{
            fontSize: '13px',
            borderRadius: '6px',
            py: 1,
            fontWeight: 500,
          }}
        >
          <ListItemIcon sx={{ minWidth: '32px !important' }}>
            <AppsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Grid"
            primaryTypographyProps={{ fontSize: '13px' }}
          />
          {viewMode === 'grid' && (
            <CheckIcon fontSize="small" sx={{ ml: 1, fontSize: 16 }} />
          )}
        </MenuItem>

        <MenuItem
          onClick={() => handleSelectMode('list')}
          selected={viewMode === 'list'}
          sx={{
            fontSize: '13px',
            borderRadius: '6px',
            py: 1,
            fontWeight: 500,
          }}
        >
          <ListItemIcon sx={{ minWidth: '32px !important' }}>
            <ViewListIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="List"
            primaryTypographyProps={{ fontSize: '13px' }}
          />
          {viewMode === 'list' && (
            <CheckIcon fontSize="small" sx={{ ml: 1, fontSize: 16 }} />
          )}
        </MenuItem>
      </Menu>
    </Box>
  );
};
