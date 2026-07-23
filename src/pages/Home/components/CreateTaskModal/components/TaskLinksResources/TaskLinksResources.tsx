import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Stack,
  CircularProgress,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Link as LinkIcon,
  Launch as LaunchIcon,
  Close as CloseIcon,
  Add as AddIcon,
  VideoCall as VideoCallIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import type { CollaboratorInput } from '../../types/CreateTaskModal.types';

interface TaskLink {
  title: string;
  url: string;
}

interface TaskLinksResourcesProps {
  links: TaskLink[];
  handleAddLink: (title: string, url: string) => void;
  handleRemoveLink: (index: number) => void;
  newLinkTitle: string;
  setNewLinkTitle: (v: string) => void;
  newLinkUrl: string;
  setNewLinkUrl: (v: string) => void;
  isAddingLink: boolean;
  setIsAddingLink: (v: boolean) => void;
  hasMeetLink: boolean;
  isGeneratingMeet: boolean;
  handleGenerateMeet: () => void;
  collaborators?: CollaboratorInput[];
  handleAddCollaborator?: (email: string) => void;
  handleRemoveCollaborator?: (email: string) => void;
}

export const TaskLinksResources = ({
  links,
  handleAddLink,
  handleRemoveLink,
  newLinkTitle,
  setNewLinkTitle,
  newLinkUrl,
  setNewLinkUrl,
  isAddingLink,
  setIsAddingLink,
  hasMeetLink,
  isGeneratingMeet,
  handleGenerateMeet,
  collaborators = [],
  handleAddCollaborator,
  handleRemoveCollaborator,
}: TaskLinksResourcesProps) => {
  const [emailInput, setEmailInput] = useState('');
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);

  const submitCollaborator = () => {
    if (emailInput.includes('@') && handleAddCollaborator) {
      handleAddCollaborator(emailInput);
      setEmailInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      submitCollaborator();
    }
  };

  const showCollaboratorSection =
    hasMeetLink && (isAddingCollaborator || collaborators.length > 0);

  return (
    <Box sx={{ px: 4, mb: 4 }}>
      {/* Links & Resources Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1.5}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <LinkIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontSize: '13px', fontWeight: 500 }}
          >
            Links and resources
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          {/* Add Meet Button */}
          <Button
            size="small"
            onClick={handleGenerateMeet}
            disabled={isGeneratingMeet || hasMeetLink}
            startIcon={
              isGeneratingMeet ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <VideoCallIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              )
            }
            sx={{
              textTransform: 'none',
              borderRadius: '6px',
              px: 1.5,
              py: 0.25,
              fontSize: '12px',
              fontWeight: 500,
              color: hasMeetLink ? 'text.disabled' : 'text.secondary',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'transparent',
              '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'text.secondary',
              },
            }}
          >
            {hasMeetLink ? 'Meet Added' : 'Add Meet'}
          </Button>

          {/* Add Collaborator Button (with PersonAdd Icon) */}
          {hasMeetLink && (
            <Button
              size="small"
              onClick={() => setIsAddingCollaborator((prev) => !prev)}
              startIcon={
                <PersonAddIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              }
              sx={{
                textTransform: 'none',
                borderRadius: '6px',
                px: 1.5,
                py: 0.25,
                fontSize: '12px',
                fontWeight: 500,
                color: 'text.secondary',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: isAddingCollaborator
                  ? 'action.selected'
                  : 'transparent',
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderColor: 'text.secondary',
                },
              }}
            >
              Add Collaborators
            </Button>
          )}

          {/* Add Resource Button */}
          {!isAddingLink && (
            <Button
              size="small"
              onClick={() => setIsAddingLink(true)}
              startIcon={
                <AddIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              }
              sx={{
                textTransform: 'none',
                borderRadius: '6px',
                px: 1.5,
                py: 0.25,
                fontSize: '12px',
                fontWeight: 500,
                color: 'text.secondary',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'transparent',
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderColor: 'text.secondary',
                },
              }}
            >
              Add Resource
            </Button>
          )}
        </Box>
      </Box>

      {/* Collaborators Section */}
      {showCollaboratorSection && (
        <Box
          mb={3}
          sx={{
            p: 2,
            borderRadius: '8px',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(0,0,0,0.02)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <PersonAddIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              Colaboradores / Asistentes (Invitación vía Google Calendar)
            </Typography>
          </Box>

          <Box display="flex" gap={1} mb={collaborators.length > 0 ? 1.5 : 0}>
            <TextField
              size="small"
              fullWidth
              placeholder="Escribe el correo del colaborador y presiona Enter..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={handleKeyDown}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '13px',
                },
              }}
            />
            <Button
              size="small"
              variant="contained"
              disableElevation
              onClick={submitCollaborator}
              disabled={!emailInput.includes('@')}
              startIcon={
                <PersonAddIcon sx={{ fontSize: 16, color: 'white' }} />
              }
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              Agregar
            </Button>
          </Box>

          {collaborators.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={1} mt={1.5}>
              {collaborators.map((c) => (
                <Chip
                  key={c.email}
                  avatar={
                    <Avatar src={c.avatar}>
                      {c.name?.charAt(0) || c.email.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  label={c.name ? `${c.name} (${c.email})` : c.email}
                  onDelete={
                    handleRemoveCollaborator
                      ? () => handleRemoveCollaborator(c.email)
                      : undefined
                  }
                  size="small"
                  variant="outlined"
                  sx={{
                    borderRadius: '6px',
                    fontWeight: 500,
                    fontSize: '12px',
                    borderColor:
                      c.responseStatus === 'accepted'
                        ? 'success.main'
                        : c.responseStatus === 'declined'
                          ? 'error.main'
                          : 'divider',
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Links Stack */}
      <Stack gap={1} mb={isAddingLink ? 2 : 0}>
        {links.map((link, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1,
              borderRadius: '8px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.02)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <LinkIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, lineHeight: 1.2 }}
                >
                  {link.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {link.url}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton
                size="small"
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'primary.main' }}
              >
                {link.title.toLowerCase().includes('meet') ? (
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: '4px',
                    }}
                  >
                    JOIN
                  </Typography>
                ) : (
                  <LaunchIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                )}
              </IconButton>
              <IconButton size="small" onClick={() => handleRemoveLink(index)}>
                <CloseIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Stack>

      {/* Add Resource Form */}
      {isAddingLink && (
        <Box
          sx={{
            p: 2,
            borderRadius: '8px',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.03)',
            border: '1px dashed',
            borderColor: 'primary.main',
          }}
        >
          <Stack gap={1.5}>
            <TextField
              size="small"
              placeholder="Link Title (e.g., Google Meet, Design Doc)"
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
              fullWidth
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: '14px', fontWeight: 500 },
              }}
            />
            <TextField
              size="small"
              placeholder="URL (https://...)"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              fullWidth
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: '13px', color: 'primary.main' },
              }}
            />
            <Box display="flex" justifyContent="flex-end" gap={1} mt={0.5}>
              <Button
                size="small"
                onClick={() => {
                  setIsAddingLink(false);
                  setNewLinkTitle('');
                  setNewLinkUrl('');
                }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                disableElevation
                disabled={!newLinkTitle || !newLinkUrl}
                onClick={() => {
                  handleAddLink(newLinkTitle, newLinkUrl);
                  setNewLinkTitle('');
                  setNewLinkUrl('');
                  setIsAddingLink(false);
                }}
              >
                Add Resource
              </Button>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
};
