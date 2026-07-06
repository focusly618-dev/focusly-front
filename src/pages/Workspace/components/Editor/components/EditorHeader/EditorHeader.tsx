import { useNavigate } from 'react-router';
import {
  CheckCircleOutline as CheckCircleIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Language as LanguageIcon,
  SwapHoriz as SwapIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import {
  CircularProgress,
  Fade,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Button,
} from '@mui/material';

import { SearchPalette } from '../SearchPalette/SearchPalette';
import { HeaderCenter, HeaderRight } from '@/pages/Workspace/Workspace.styles';
import { EditorHeader as StyledEditorHeader } from './EditorHeader.styles';
import type { EditorHeaderProps } from './EditorHeader.types';
import { useEditorHeader } from './useEditorHeader.hook';

export const EditorHeader = (props: EditorHeaderProps) => {
  const {
    showPalette,
    setShowPalette,
    loadMore,
    searchTerm,
    setSearchTerm,
    filteredTasks,
    selectTask,
    handleSelectTask,
    setValue,
    saveState,
    sourceLanguage,
    targetLanguage,
    hasMore,
  } = props;

  const {
    isListening,
    sourceAnchor,
    setSourceAnchor,
    targetAnchor,
    setTargetAnchor,
    toggleListening,
    handleSourceSelect,
    handleTargetSelect,
    handleSwapLanguages,
    getLanguageLabel,
  } = useEditorHeader(props);

  const navigate = useNavigate();
  const backWorkspace = (): void => {
    if (props.groupId && props.groupId !== undefined) {
      const baseURL = `/dashboard?tab=Workspace&groupId=${props.groupId}`;
      navigate(baseURL);
      return;
    }
    navigate('/dashboard?tab=Workspace');
  };
  return (
    <StyledEditorHeader>
      <HeaderCenter
        id="joyride-editor-search"
        sx={{ position: 'relative', zIndex: 50, mx: 2 }}
      >
        <Button
          onClick={backWorkspace}
          startIcon={
            <ArrowBackIcon
              sx={{
                fontSize: 17,
                transition: 'transform 0.2s ease',
              }}
            />
          }
          sx={{
            height: '34px',
            px: 1.8,
            mr: 12,
            borderRadius: '20px',
            border: '1px solid',
            borderColor: 'divider',
            color: 'text.secondary',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(0,0,0,0.02)',
            backdropFilter: 'blur(8px)',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.2px',
            transition: 'all 0.25s ease',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',

            '&:hover': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.06)',
              borderColor: 'text.secondary',
              transform: 'translateX(-2px)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.08)',

              '& .MuiSvgIcon-root': {
                transform: 'translateX(-3px)',
              },
            },

            '&:active': {
              transform: 'scale(0.97)',
            },
          }}
        >
          Back
        </Button>
        <SearchPalette
          showPalette={showPalette}
          setShowPalette={setShowPalette}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredTasks={filteredTasks}
          selectTask={selectTask}
          handleSelectTask={handleSelectTask}
          setValue={setValue}
          loadMore={loadMore}
          hasMore={hasMore}
        />
      </HeaderCenter>

      <HeaderRight>
        {/* Source Language Selector */}
        <IconButton
          onClick={(e) => setSourceAnchor(e.currentTarget)}
          size="small"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '20px',
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            height: '32px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'text.secondary',
            },
          }}
        >
          <LanguageIcon sx={{ fontSize: 14 }} />
          {getLanguageLabel(sourceLanguage)}
        </IconButton>

        {/* Swap Languages Button */}
        <IconButton
          onClick={handleSwapLanguages}
          size="small"
          sx={{
            width: '32px',
            height: '32px',
            border: '1px solid',
            borderColor: 'divider',
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'text.secondary',
            },
          }}
        >
          <SwapIcon sx={{ fontSize: 16 }} />
        </IconButton>

        {/* Target Language Selector */}
        <IconButton
          onClick={(e) => setTargetAnchor(e.currentTarget)}
          size="small"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '20px',
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            height: '32px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'text.secondary',
            },
          }}
        >
          <LanguageIcon sx={{ fontSize: 14 }} />
          {getLanguageLabel(targetLanguage)}
        </IconButton>

        {/* Real-time speech preview overlay */}
        {isListening && (
          <Fade in={true}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(239, 68, 68, 0.08)'
                    : 'rgba(239, 68, 68, 0.04)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '6px 14px',
                height: '32px',
                borderRadius: '20px',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
                maxWidth: '280px',
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: 'error.main',
                  animation: 'blink 1.2s infinite ease-in-out',
                  '@keyframes blink': {
                    '0%, 100%': { opacity: 0.2 },
                    '50%': { opacity: 1 },
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                }}
              >
                Listening...
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Dictation Microphone Button */}
        <IconButton
          onClick={toggleListening}
          size="small"
          sx={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            color: isListening ? 'error.main' : 'text.secondary',
            bgcolor: isListening ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
            border: '1px solid',
            borderColor: isListening ? 'error.main' : 'divider',
            animation: isListening ? 'pulse 1.5s infinite ease-in-out' : 'none',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.3)',
              },
              '70%': {
                transform: 'scale(1.08)',
                boxShadow: '0 0 0 6px rgba(239, 68, 68, 0)',
              },
              '100%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)',
              },
            },
            '&:hover': {
              bgcolor: isListening ? 'rgba(239, 68, 68, 0.15)' : 'action.hover',
            },
          }}
        >
          {isListening ? (
            <MicIcon sx={{ fontSize: 16 }} />
          ) : (
            <MicOffIcon sx={{ fontSize: 16 }} />
          )}
        </IconButton>

        {/* Save Status Indicator */}
        <Fade
          in={saveState === 'saving' || saveState === 'saved'}
          timeout={300}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(0, 0, 0, 0.02)',
              border: '1px solid',
              borderColor: (theme) =>
                saveState === 'saved'
                  ? 'rgba(16, 185, 129, 0.2)'
                  : theme.palette.divider,
              padding: '6px 12px',
              height: '32px',
              borderRadius: '20px',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
              boxShadow:
                saveState === 'saved'
                  ? '0 0 10px rgba(16, 185, 129, 0.1)'
                  : 'none',
            }}
          >
            {saveState === 'saving' ? (
              <>
                <CircularProgress
                  size={14}
                  thickness={6}
                  sx={{
                    color: 'text.secondary',
                    animationDuration: '750ms',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    fontSize: '11px',
                  }}
                >
                  saving
                </Typography>
              </>
            ) : saveState === 'saved' ? (
              <>
                <CheckCircleIcon
                  sx={{
                    fontSize: 14,
                    color: '#10B981',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#10B981',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    fontSize: '11px',
                  }}
                >
                  saved
                </Typography>
              </>
            ) : null}
          </Box>
        </Fade>

        {/* Source Language selection Menu */}
        <Menu
          anchorEl={sourceAnchor}
          open={Boolean(sourceAnchor)}
          onClose={() => setSourceAnchor(null)}
          PaperProps={{
            sx: {
              borderRadius: '10px',
              mt: 0.5,
              minWidth: '130px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <MenuItem onClick={() => handleSourceSelect('auto')}>
            <ListItemText
              primary="Detect Language"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleSourceSelect('es')}>
            <ListItemText
              primary="Spanish"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleSourceSelect('en')}>
            <ListItemText
              primary="English"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleSourceSelect('fr')}>
            <ListItemText
              primary="French"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleSourceSelect('de')}>
            <ListItemText
              primary="German"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleSourceSelect('it')}>
            <ListItemText
              primary="Italian"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleSourceSelect('pt')}>
            <ListItemText
              primary="Portuguese"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
        </Menu>

        {/* Target Language selection Menu */}
        <Menu
          anchorEl={targetAnchor}
          open={Boolean(targetAnchor)}
          onClose={() => setTargetAnchor(null)}
          PaperProps={{
            sx: {
              borderRadius: '10px',
              mt: 0.5,
              minWidth: '130px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <MenuItem onClick={() => handleTargetSelect('es')}>
            <ListItemText
              primary="Spanish"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleTargetSelect('en')}>
            <ListItemText
              primary="English"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleTargetSelect('fr')}>
            <ListItemText
              primary="French"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleTargetSelect('de')}>
            <ListItemText
              primary="German"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleTargetSelect('it')}>
            <ListItemText
              primary="Italian"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleTargetSelect('pt')}>
            <ListItemText
              primary="Portuguese"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
        </Menu>
      </HeaderRight>
    </StyledEditorHeader>
  );
};
