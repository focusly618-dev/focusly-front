import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Dialog,
  DialogContent,
  Checkbox,
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Folder as FolderIcon,
  Delete as DeleteIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui';
import { StyledTextField } from '../WorkspaceLibrary.styles';
import type { ProjectTypes } from '../../../types/workspace.types';

interface AllProjectsModalProps {
  open: boolean;
  onClose: () => void;
  projects: ProjectTypes[];
  onSelect: (projectId: string) => void;
  selectedId: string | null;
  onDeleteProjects?: (projectIds: string[]) => Promise<void>;
}

export const AllProjectsModal = ({
  open,
  onClose,
  projects,
  onSelect,
  selectedId,
  onDeleteProjects,
}: AllProjectsModalProps) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForDelete, setSelectedForDelete] = useState<string[]>([]);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteClick = async () => {
    if (onDeleteProjects) {
      await onDeleteProjects(selectedForDelete);
      setSelectedForDelete([]);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          bgcolor: theme.palette.background.paper,
          backgroundImage: 'none',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ color: 'text.primary', mb: 0.5 }}
            >
              All Folders
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', opacity: 0.7 }}
            >
              Browse and select folders for your library view.
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ position: 'relative', my: 3 }}>
          <StyledTextField
            fullWidth
            placeholder={`Search across ${projects.length} folders...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              maxWidth: 'none',
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon
                  sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }}
                />
              ),
              endAdornment: searchTerm ? (
                <IconButton
                  size="small"
                  sx={{ color: 'text.secondary', p: 0.5 }}
                  onClick={() => setSearchTerm('')}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : null,
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
            maxHeight: '400px',
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.divider,
              borderRadius: '10px',
            },
          }}
        >
          {filteredProjects.length === 0 ? (
            <Box
              sx={{
                gridColumn: '1 / -1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                textAlign: 'center',
                width: '100%',
              }}
            >
              <FolderIcon
                sx={{
                  fontSize: 48,
                  color: 'text.disabled',
                  mb: 2,
                  opacity: 0.5,
                }}
              />
              <Typography
                variant="h6"
                fontWeight={750}
                sx={{ color: 'text.secondary', mb: 1 }}
              >
                {projects.length === 0
                  ? 'No folders added yet'
                  : 'No matching folders'}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.disabled', opacity: 0.7, maxWidth: 300 }}
              >
                {projects.length === 0
                  ? 'Create a custom folder in the library or sidebar to start grouping your plans.'
                  : 'Try adjusting your search terms.'}
              </Typography>
            </Box>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <Box
                  key={project.id}
                  component={motion.div}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => onSelect(project.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: '16px',
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.015)'
                        : 'rgba(0,0,0,0.01)',
                    border: `2px solid ${selectedId === project.id ? '#00f5ff' : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    '&:hover': {
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.04)'
                          : 'rgba(0,0,0,0.03)',
                      boxShadow:
                        selectedId === project.id
                          ? '0 0 20px rgba(0, 245, 255, 0.2)'
                          : 'none',
                      borderLeft: `10px solid ${project.color || theme.palette.primary.main}`,
                      pl: '14px',
                    },
                  }}
                >
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Checkbox
                      checked={selectedForDelete.includes(project.id)}
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      onChange={() => {
                        setSelectedForDelete((prev) =>
                          prev.includes(project.id)
                            ? prev.filter((id) => id !== project.id)
                            : [...prev, project.id],
                        );
                      }}
                      sx={{
                        mr: 1,
                        color: theme.palette.text.secondary,
                        '&.Mui-checked': {
                          color: 'error.main',
                        },
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      bgcolor: `${project.color || theme.palette.primary.main}1A`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <FolderIcon
                      sx={{
                        color: project.color || theme.palette.primary.main,
                        fontSize: 24,
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      noWrap
                      sx={{ maxWidth: '100%' }}
                    >
                      {project.name.length > 40
                        ? `${project.name.substring(0, 40)}...`
                        : project.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', opacity: 0.7 }}
                    >
                      {project.workspaceCount || 0} Items
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '12px',
                      bgcolor:
                        selectedId === project.id
                          ? 'rgba(0, 245, 255, 0.1)'
                          : 'transparent',
                      border: `1px solid ${selectedId === project.id ? '#00f5ff' : 'transparent'}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={800}
                      sx={{
                        color:
                          selectedId === project.id
                            ? '#00f5ff'
                            : 'text.secondary',
                        fontSize: '10px',
                      }}
                    >
                      {selectedId === project.id ? 'VISIBLE' : 'SELECT'}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </AnimatePresence>
          )}
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={4}
        >
          {selectedForDelete.length > 0 ? (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
              sx={{
                fontWeight: 800,
                borderRadius: '12px',
                px: 2.5,
                boxShadow: '0 0 15px rgba(244, 67, 54, 0.3)',
                '&:hover': {
                  bgcolor: 'error.dark',
                  boxShadow: '0 0 25px rgba(244, 67, 54, 0.5)',
                },
              }}
            >
              Eliminar ({selectedForDelete.length})
            </Button>
          ) : (
            <Box />
          )}

          <Box gap={2} display="flex">
            <Button
              variant="text"
              onClick={onClose}
              sx={{ color: 'text.secondary', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                bgcolor: '#00f5ff',
                color: '#000',
                fontWeight: 800,
                borderRadius: '12px',
                px: 3,
                boxShadow: '0 0 20px rgba(0, 245, 255, 0.4)',
                '&:hover': {
                  bgcolor: '#00e1eb',
                  boxShadow: '0 0 30px rgba(0, 245, 255, 0.6)',
                },
              }}
            >
              Apply Changes
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
