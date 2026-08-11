import { useState } from 'react';
import {
  Box,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  Apps as AppsIcon,
  Check as CheckIcon,
  FilterList as FilterListIcon,
  AccessTime as AccessTimeIcon,
  SortByAlpha as SortByAlphaIcon,
  Link as LinkIcon,
  Wallpaper as WallpaperIcon,
} from '@mui/icons-material';
import { StyledTextField } from '../WorkspaceLibrary.styles';

export interface LibrarySearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  viewMode: 'gallery' | 'list' | 'grid';
  onViewModeChange: (mode: 'gallery' | 'list' | 'grid') => void;
  noteSortBy?: 'recent' | 'title-asc' | 'title-desc';
  onNoteSortChange?: (sort: 'recent' | 'title-asc' | 'title-desc') => void;
  noteFilterType?: 'all' | 'linked-task' | 'has-cover';
  onNoteFilterChange?: (type: 'all' | 'linked-task' | 'has-cover') => void;
}

export const LibrarySearchHeader = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  viewMode,
  onViewModeChange,
  noteSortBy = 'recent',
  onNoteSortChange,
  noteFilterType = 'all',
  onNoteFilterChange,
}: LibrarySearchHeaderProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [viewMenuAnchor, setViewMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const handleOpenViewMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setViewMenuAnchor(event.currentTarget);
  };

  const handleCloseViewMenu = () => {
    setViewMenuAnchor(null);
  };

  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };

  const handleSelectMode = (mode: 'gallery' | 'list' | 'grid') => {
    onViewModeChange(mode);
    handleCloseViewMenu();
  };

  const getActiveViewIcon = () => {
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

  const isNoteFilterActive =
    noteSortBy !== 'recent' || noteFilterType !== 'all';

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        gap: 1.5,
        py: 1,
        width: { xs: '100%', sm: 'auto' },
      }}
    >
      <StyledTextField
        id="joyride-workspace-search"
        placeholder="Search workspaces..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        sx={{
          width: '380px',
          flex: { xs: 1, sm: 'none' },
        }}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
          ),
          endAdornment: searchTerm ? (
            <IconButton
              size="small"
              sx={{ color: 'text.secondary', p: 0.5 }}
              onClick={onClearSearch}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 0.8,
                py: 0.2,
                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${
                  isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }`,
                borderRadius: '4px',
                color: 'text.secondary',
                fontSize: '10px',
                fontWeight: 700,
                fontFamily: 'monospace',
                letterSpacing: '0.5px',
                opacity: 0.8,
                userSelect: 'none',
              }}
            >
              ⌘F
            </Box>
          ),
        }}
      />

      {/* Filter & Sort Button for Notes */}
      {onNoteSortChange && onNoteFilterChange && (
        <Tooltip title="Filter & Sort Notes">
          <IconButton
            size="small"
            onClick={handleOpenFilterMenu}
            sx={{
              border: `1px solid ${
                isNoteFilterActive
                  ? theme.palette.primary.main
                  : isDark
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(0,0,0,0.12)'
              }`,
              borderRadius: '8px',
              p: 0.5,
              width: '38px',
              height: '38px',
              color: isNoteFilterActive
                ? theme.palette.primary.main
                : 'text.secondary',
              bgcolor:
                filterMenuAnchor || isNoteFilterActive
                  ? isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.04)'
                  : 'transparent',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <FilterListIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      )}

      {/* View Mode Selector Button */}
      <Tooltip title="Switch View Mode">
        <IconButton
          size="small"
          onClick={handleOpenViewMenu}
          sx={{
            border: `1px solid ${
              isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
            }`,
            borderRadius: '8px',
            p: 0.5,
            width: '38px',
            height: '38px',
            color: 'text.secondary',
            bgcolor: viewMenuAnchor
              ? isDark
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.03)'
              : 'transparent',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            },
          }}
        >
          {getActiveViewIcon()}
        </IconButton>
      </Tooltip>

      {/* Filter & Sort Menu for Notes */}
      {onNoteSortChange && onNoteFilterChange && (
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={handleCloseFilterMenu}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              mt: 1,
              minWidth: 200,
              p: 1,
              boxShadow: isDark
                ? '0 8px 24px rgba(0,0,0,0.5)'
                : '0 8px 24px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              px: 1.5,
              py: 0.5,
              fontWeight: 700,
              color: 'text.secondary',
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontSize: '11px',
            }}
          >
            Sort Notes
          </Typography>

          <MenuItem
            selected={noteSortBy === 'recent'}
            onClick={() => {
              onNoteSortChange('recent');
              handleCloseFilterMenu();
            }}
            sx={{ borderRadius: '8px', fontSize: '13px', py: 0.8 }}
          >
            <ListItemIcon sx={{ minWidth: '32px !important' }}>
              <AccessTimeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Recently Updated" />
            {noteSortBy === 'recent' && (
              <CheckIcon fontSize="small" sx={{ fontSize: 16 }} />
            )}
          </MenuItem>

          <MenuItem
            selected={noteSortBy === 'title-asc'}
            onClick={() => {
              onNoteSortChange('title-asc');
              handleCloseFilterMenu();
            }}
            sx={{ borderRadius: '8px', fontSize: '13px', py: 0.8 }}
          >
            <ListItemIcon sx={{ minWidth: '32px !important' }}>
              <SortByAlphaIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Title (A to Z)" />
            {noteSortBy === 'title-asc' && (
              <CheckIcon fontSize="small" sx={{ fontSize: 16 }} />
            )}
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          <Typography
            variant="caption"
            sx={{
              px: 1.5,
              py: 0.5,
              fontWeight: 700,
              color: 'text.secondary',
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontSize: '11px',
            }}
          >
            Filter Notes
          </Typography>

          <MenuItem
            selected={noteFilterType === 'all'}
            onClick={() => {
              onNoteFilterChange('all');
              handleCloseFilterMenu();
            }}
            sx={{ borderRadius: '8px', fontSize: '13px', py: 0.8 }}
          >
            <ListItemText primary="All Notes" />
            {noteFilterType === 'all' && (
              <CheckIcon fontSize="small" sx={{ fontSize: 16 }} />
            )}
          </MenuItem>

          <MenuItem
            selected={noteFilterType === 'linked-task'}
            onClick={() => {
              onNoteFilterChange('linked-task');
              handleCloseFilterMenu();
            }}
            sx={{ borderRadius: '8px', fontSize: '13px', py: 0.8 }}
          >
            <ListItemIcon sx={{ minWidth: '32px !important' }}>
              <LinkIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Linked to Task" />
            {noteFilterType === 'linked-task' && (
              <CheckIcon fontSize="small" sx={{ fontSize: 16 }} />
            )}
          </MenuItem>

          <MenuItem
            selected={noteFilterType === 'has-cover'}
            onClick={() => {
              onNoteFilterChange('has-cover');
              handleCloseFilterMenu();
            }}
            sx={{ borderRadius: '8px', fontSize: '13px', py: 0.8 }}
          >
            <ListItemIcon sx={{ minWidth: '32px !important' }}>
              <WallpaperIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="With Background Cover" />
            {noteFilterType === 'has-cover' && (
              <CheckIcon fontSize="small" sx={{ fontSize: 16 }} />
            )}
          </MenuItem>
        </Menu>
      )}

      {/* View Mode Menu */}
      <Menu
        anchorEl={viewMenuAnchor}
        open={Boolean(viewMenuAnchor)}
        onClose={handleCloseViewMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            mt: 1,
            boxShadow: isDark
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
