import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
  SortByAlpha as SortByAlphaIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  Palette as PaletteIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import {
  LibraryHeader,
  HeaderTitle,
  StyledTextField,
} from '../WorkspaceLibrary.styles';
import { LibrarySearchHeader } from './LibrarySearchHeader';

export type ProjectSortOption =
  | 'recent'
  | 'name-asc'
  | 'name-desc'
  | 'notes-count';

export interface WorkspaceLibraryHeaderProps {
  isInsideFolder: boolean;
  activeGroupName?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  folderSearchTerm: string;
  onFolderSearchChange: (value: string) => void;
  onClearFolderSearch: () => void;
  viewMode: 'gallery' | 'list' | 'grid';
  onViewModeChange: (mode: 'gallery' | 'list' | 'grid') => void;
  projectSortBy: ProjectSortOption;
  onProjectSortChange: (sort: ProjectSortOption) => void;
  projectColorFilter: string;
  onProjectColorFilterChange: (color: string) => void;
  noteSortBy: 'recent' | 'title-asc' | 'title-desc';
  onNoteSortChange: (sort: 'recent' | 'title-asc' | 'title-desc') => void;
  noteFilterType: 'all' | 'linked-task' | 'has-cover';
  onNoteFilterChange: (type: 'all' | 'linked-task' | 'has-cover') => void;
  onCreate?: () => void;
}

const PROJECT_COLORS = [
  { name: 'All', value: 'all' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Slate', value: '#475569' },
];

export const WorkspaceLibraryHeader: React.FC<WorkspaceLibraryHeaderProps> = ({
  isInsideFolder,
  activeGroupName,
  searchTerm,
  onSearchChange,
  onClearSearch,
  folderSearchTerm,
  onFolderSearchChange,
  onClearFolderSearch,
  viewMode,
  onViewModeChange,
  projectSortBy,
  onProjectSortChange,
  projectColorFilter,
  onProjectColorFilterChange,
  noteSortBy,
  onNoteSortChange,
  noteFilterType,
  onNoteFilterChange,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };

  const isProjectFilterActive =
    projectSortBy !== 'recent' || projectColorFilter !== 'all';

  return (
    <LibraryHeader>
      <Box>
        <HeaderTitle variant="h4">
          {isInsideFolder ? activeGroupName : 'Projects'}
        </HeaderTitle>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        {isInsideFolder ? (
          <LibrarySearchHeader
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onClearSearch={onClearSearch}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            noteSortBy={noteSortBy}
            onNoteSortChange={onNoteSortChange}
            noteFilterType={noteFilterType}
            onNoteFilterChange={onNoteFilterChange}
          />
        ) : (
          <Box display="flex" alignItems="center" gap={1}>
            <StyledTextField
              placeholder="Search projects..."
              value={folderSearchTerm}
              onChange={(e) => onFolderSearchChange(e.target.value)}
              size="small"
              sx={{
                width: '260px',
                flex: { xs: 1, sm: 'none' },
              }}
              InputProps={{
                startAdornment: (
                  <SearchIcon
                    sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }}
                  />
                ),
                endAdornment: folderSearchTerm ? (
                  <IconButton
                    size="small"
                    sx={{ color: 'text.secondary', p: 0.5 }}
                    onClick={onClearFolderSearch}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                ) : null,
              }}
            />

            <Tooltip title="Filter & Sort Projects">
              <IconButton
                size="small"
                onClick={handleOpenFilterMenu}
                sx={{
                  border: `1px solid ${
                    isProjectFilterActive
                      ? theme.palette.primary.main
                      : isDark
                        ? 'rgba(255,255,255,0.12)'
                        : 'rgba(0,0,0,0.12)'
                  }`,
                  borderRadius: '8px',
                  p: 0.5,
                  width: '38px',
                  height: '38px',
                  color: isProjectFilterActive
                    ? theme.palette.primary.main
                    : 'text.secondary',
                  bgcolor:
                    filterMenuAnchor || isProjectFilterActive
                      ? isDark
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(0,0,0,0.04)'
                      : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: isDark
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                <FilterListIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {/* Filter & Sort Menu for Projects */}
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
                Sort Projects
              </Typography>

              <MenuItem
                selected={projectSortBy === 'recent'}
                onClick={() => {
                  onProjectSortChange('recent');
                  handleCloseFilterMenu();
                }}
                sx={{ borderRadius: '8px', fontSize: '13px', py: 0.8 }}
              >
                <ListItemIcon sx={{ minWidth: '32px !important' }}>
                  <AccessTimeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Recently Updated" />
                {projectSortBy === 'recent' && (
                  <CheckIcon fontSize="small" sx={{ fontSize: 16 }} />
                )}
              </MenuItem>

              <MenuItem
                selected={projectSortBy === 'name-asc'}
                onClick={() => {
                  onProjectSortChange('name-asc');
                  handleCloseFilterMenu();
                }}
                sx={{ borderRadius: '8px', fontSize: '13px', py: 0.8 }}
              >
                <ListItemIcon sx={{ minWidth: '32px !important' }}>
                  <SortByAlphaIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Name (A to Z)" />
                {projectSortBy === 'name-asc' && (
                  <CheckIcon fontSize="small" sx={{ fontSize: 16 }} />
                )}
              </MenuItem>

              <MenuItem
                selected={projectSortBy === 'notes-count'}
                onClick={() => {
                  onProjectSortChange('notes-count');
                  handleCloseFilterMenu();
                }}
                sx={{ borderRadius: '8px', fontSize: '13px', py: 0.8 }}
              >
                <ListItemIcon sx={{ minWidth: '32px !important' }}>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Most Notes" />
                {projectSortBy === 'notes-count' && (
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
                Filter by Color
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  gap: 0.8,
                  px: 1,
                  py: 0.5,
                  flexWrap: 'wrap',
                }}
              >
                {PROJECT_COLORS.map((c) => {
                  const isSelected = projectColorFilter === c.value;
                  return (
                    <Tooltip key={c.value} title={c.name}>
                      <Box
                        onClick={() => {
                          onProjectColorFilterChange(c.value);
                          handleCloseFilterMenu();
                        }}
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          bgcolor:
                            c.value === 'all' ? 'text.secondary' : c.value,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: isSelected ? '2px solid #fff' : 'none',
                          boxShadow: isSelected ? '0 0 0 2px #7c3aed' : 'none',
                          transition: 'transform 0.15s ease',
                          '&:hover': {
                            transform: 'scale(1.15)',
                          },
                        }}
                      >
                        {c.value === 'all' && (
                          <PaletteIcon sx={{ fontSize: 12, color: '#fff' }} />
                        )}
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            </Menu>
          </Box>
        )}
      </Box>
    </LibraryHeader>
  );
};
