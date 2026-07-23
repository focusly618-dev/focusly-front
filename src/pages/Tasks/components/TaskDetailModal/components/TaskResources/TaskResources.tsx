import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Avatar,
  TextField,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Link as LinkIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  VideoCall as VideoCallIcon,
  Add as AddIcon,
  Launch as LaunchIcon,
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import {
  resourcesContainerSx,
  resourcesHeaderSx,
  resourceCountSx,
  addMeetButtonSx,
  addResourceButtonSx,
  resourceItemSx,
  resourceIconContainerSx,
  resourceLinkButtonSx,
  resourceRemoveButtonSx,
  addResourceFormSx,
} from './TaskResources.styles';

interface Link {
  title: string;
  url: string;
}

interface Collaborator {
  name?: string;
  email: string;
  avatar?: string;
  responseStatus?: string;
}

interface TaskResourcesProps {
  links: Link[];
  isLinksExpanded: boolean;
  setIsLinksExpanded: (b: boolean) => void;
  isGeneratingMeet: boolean;
  handleGenerateMeet: () => void;
  hasMeetLink: boolean;
  setIsAddingLink: (b: boolean) => void;
  isAddingLink: boolean;
  newLinkTitle: string;
  setNewLinkTitle: (t: string) => void;
  newLinkUrl: string;
  setNewLinkUrl: (u: string) => void;
  handleAddLink: (title: string, url: string) => void;
  handleRemoveLink: (idx: number) => void;
  collaborators?: Collaborator[];
  handleAddCollaborator?: (name: string, email: string) => void;
  handleRemoveCollaborator?: (index: number) => void;
  isReadOnly?: boolean;
}

export const TaskResources = ({
  links,
  isLinksExpanded,
  setIsLinksExpanded,
  isGeneratingMeet,
  handleGenerateMeet,
  hasMeetLink,
  setIsAddingLink,
  isAddingLink,
  newLinkTitle,
  setNewLinkTitle,
  newLinkUrl,
  setNewLinkUrl,
  handleAddLink,
  handleRemoveLink,
  collaborators = [],
  handleAddCollaborator,
  handleRemoveCollaborator,
  isReadOnly,
}: TaskResourcesProps) => {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);

  const submitCollaborator = () => {
    if (emailInput.includes('@') && handleAddCollaborator) {
      handleAddCollaborator(nameInput, emailInput);
      setEmailInput('');
      setNameInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitCollaborator();
    }
  };

  const getLinkIcon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return {
        src: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        isImage: true,
      };
    } catch {
      return {
        icon: <LinkIcon sx={{ fontSize: 16 }} />,
        isImage: false,
        color: 'primary.main',
      };
    }
  };

  const showCollaboratorSection =
    hasMeetLink && (isAddingCollaborator || collaborators.length > 0);

  return (
    <Box sx={resourcesContainerSx}>
      <Box
        sx={resourcesHeaderSx(isLinksExpanded)}
        onClick={() => setIsLinksExpanded(!isLinksExpanded)}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <LinkIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            Links and resources
          </Typography>
          {!isLinksExpanded && links.length > 0 && (
            <Box sx={resourceCountSx}>{links.length}</Box>
          )}
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <IconButton
            size="small"
            sx={{ p: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsLinksExpanded(!isLinksExpanded);
            }}
          >
            {isLinksExpanded ? (
              <ExpandLessIcon sx={{ fontSize: 18 }} />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
          {!isReadOnly && (
            <AnimatePresence>
              {isLinksExpanded && (
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  {/* Add Meet Button */}
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateMeet();
                    }}
                    disabled={isGeneratingMeet || hasMeetLink}
                    startIcon={
                      isGeneratingMeet ? (
                        <CircularProgress size={14} color="inherit" />
                      ) : (
                        <VideoCallIcon sx={{ fontSize: 16 }} />
                      )
                    }
                    sx={addMeetButtonSx(hasMeetLink)}
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={hasMeetLink ? 'added' : 'add'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {hasMeetLink ? 'Meet Added' : 'Add Meet'}
                      </motion.span>
                    </AnimatePresence>
                  </Button>

                  {/* Add Collaborators Button (PersonAddIcon) */}
                  {hasMeetLink && (
                    <Button
                      size="small"
                      startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAddingCollaborator((prev) => !prev);
                      }}
                      sx={addResourceButtonSx}
                    >
                      Add Collaborators
                    </Button>
                  )}

                  {/* Add Resource Button */}
                  <Button
                    size="small"
                    startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddingLink(true);
                    }}
                    sx={addResourceButtonSx}
                  >
                    Add Resource
                  </Button>
                </Box>
              )}
            </AnimatePresence>
          )}
        </Box>
      </Box>

      {/* Collaborators Section (Only when Meet is present) */}
      <AnimatePresence mode="popLayout">
        {isLinksExpanded && showCollaboratorSection && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            sx={{
              overflow: 'hidden',
              mb: 2,
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

            {!isReadOnly && (
              <Box
                display="flex"
                gap={1}
                mb={collaborators.length > 0 ? 1.5 : 0}
              >
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Escribe el correo del colaborador..."
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
            )}

            {collaborators.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={1} mt={1.5}>
                {collaborators.map((c, idx) => (
                  <Chip
                    key={`${c.email}-${idx}`}
                    avatar={
                      <Avatar src={c.avatar}>
                        {c.name?.charAt(0) || c.email.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    label={c.name ? `${c.name} (${c.email})` : c.email}
                    onDelete={
                      !isReadOnly && handleRemoveCollaborator
                        ? () => handleRemoveCollaborator(idx)
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
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {isLinksExpanded && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            sx={{ overflow: 'hidden' }}
          >
            {links.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Stack gap={1}>
                  <AnimatePresence initial={false}>
                    {links.map((link, idx) => {
                      const iconInfo = getLinkIcon(link.url);
                      return (
                        <Box
                          key={`${link.url}-${idx}`}
                          component={motion.div}
                          layout
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                          }}
                          sx={resourceItemSx}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                            sx={{ minWidth: 0, flex: 1 }}
                          >
                            <Box
                              sx={resourceIconContainerSx(
                                iconInfo.isImage,
                                iconInfo.color,
                              )}
                            >
                              {iconInfo.isImage ? (
                                <Avatar
                                  src={iconInfo.src}
                                  variant="rounded"
                                  sx={{
                                    width: 20,
                                    height: 20,
                                    bgcolor: 'transparent',
                                  }}
                                >
                                  <LinkIcon
                                    sx={{
                                      fontSize: 16,
                                      color: 'text.secondary',
                                    }}
                                  />
                                </Avatar>
                              ) : (
                                iconInfo.icon
                              )}
                            </Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: 'text.primary',
                                  mb: 0.2,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {link.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'primary.main',
                                  fontWeight: 500,
                                  display: 'block',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {link.url}
                              </Typography>
                            </Box>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <IconButton
                              size="small"
                              href={link.url}
                              target="_blank"
                              sx={resourceLinkButtonSx}
                            >
                              <LaunchIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            {!isReadOnly && (
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveLink(idx)}
                                sx={resourceRemoveButtonSx}
                              >
                                <CloseIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </AnimatePresence>
                </Stack>
              </Box>
            )}

            <AnimatePresence>
              {isAddingLink && (
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  sx={addResourceFormSx}
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
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      gap={1}
                      mt={0.5}
                    >
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
            </AnimatePresence>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};
