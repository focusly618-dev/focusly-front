import { useRef, useState } from 'react';
import {
  CheckCircleOutline as CheckCircleIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  ArrowBack as ArrowBackIcon,
  InfoOutlined as InfoIcon,
  FlashOn as FlashOnIcon,
  AutoAwesome as AutoAwesomeIcon,
  Translate as TranslateIcon,
  VisibilityOutlined as EyeIcon,
  MoreHoriz as MoreHorizIcon,
  FileUpload as ImportIcon,
  FileDownload as ExportIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import {
  CircularProgress,
  Fade,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Badge,
  Divider,
} from '@mui/material';

import { SearchPalette } from '../SearchPalette/SearchPalette';
import { ImportContentModal } from './components/ImportContentModal/ImportContentModal';
import { convertMarkdownToDocx } from './documentExporters';
import { sileo } from '@/utils';
import {
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
} from '@/pages/Workspace/Workspace.styles';
import { EditorHeader as StyledEditorHeader } from './EditorHeader.styles';
import type { EditorHeaderProps } from './EditorHeader.types';
import { useEditorHeader } from './useEditorHeader.hook';

export const EditorHeader = (props: EditorHeaderProps) => {
  const {
    onBack,
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
    isCentered,
    onToggleCentered,
    onToggleSidebar,
    onStartFocus,
    markdownEditorRef,
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
    getLanguageLabel,
  } = useEditorHeader(props);

  const [toolsAnchor, setToolsAnchor] = useState<HTMLElement | null>(null);
  const toolsButtonRef = useRef<HTMLButtonElement>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [exportAnchor, setExportAnchor] = useState<HTMLElement | null>(null);

  const downloadBlob = (blob: Blob, extension: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(selectTask?.title || 'note').replace(/[^\w-]+/g, '_')}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format: 'md' | 'docx') => {
    setExportAnchor(null);
    const markdown = markdownEditorRef?.current?.getValue() ?? '';

    if (format === 'md') {
      downloadBlob(new Blob([markdown], { type: 'text/markdown' }), 'md');
      return;
    }

    try {
      const blob = await convertMarkdownToDocx(markdown);
      downloadBlob(blob, 'docx');
    } catch (error) {
      console.error('Failed to export document as Word:', error);
      sileo.error({
        title: 'Export failed',
        description: 'Could not generate the Word document.',
        fill: 'var(--sileo-error-bg)',
      });
    }
  };

  return (
    <StyledEditorHeader>
      {/* ─── DESKTOP LAYOUT ─── */}
      <HeaderLeft sx={{ display: { xs: 'none', md: 'flex' } }}>
        <IconButton
          onClick={onBack}
          sx={{
            width: '34px',
            height: '34px',
            minWidth: '34px',
            p: 0,
            mr: { xs: 0, md: 1 },
            borderRadius: '50%',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.12)'
                : '#e2e8f0',
            color: 'text.primary',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.03)'
                : '#ffffff',
            '&:hover': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.08)'
                  : '#f8fafc',
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </HeaderLeft>

      <HeaderCenter
        id="joyride-editor-search"
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'relative',
          zIndex: 50,
          mx: { md: 1, lg: 2 },
        }}
      >
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

      <HeaderRight sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
        {/* Target Language Button */}
        <Button
          onClick={(e) => setTargetAnchor(e.currentTarget)}
          startIcon={<TranslateIcon sx={{ fontSize: 14 }} />}
          sx={{
            height: '34px',
            px: 1.5,
            borderRadius: '8px',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.12)'
                : '#e2e8f0',
            color: 'text.primary',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'none',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.03)'
                : '#ffffff',
            '&:hover': {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.08)'
                  : '#f8fafc',
            },
          }}
        >
          {getLanguageLabel(targetLanguage)}
        </Button>

        {/* Editor Tools: Detect Language, Dictation, Focus Mode */}
        <IconButton
          ref={toolsButtonRef}
          onClick={(e) => setToolsAnchor(e.currentTarget)}
          size="small"
          sx={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.12)'
                : '#e2e8f0',
            color: 'text.primary',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.03)'
                : '#ffffff',
            '&:hover': {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.08)'
                  : '#f8fafc',
            },
          }}
        >
          <Badge
            variant="dot"
            color="error"
            invisible={!isListening}
            sx={{
              '& .MuiBadge-dot': {
                animation: isListening
                  ? 'pulse 1.5s infinite ease-in-out'
                  : 'none',
              },
              '@keyframes pulse': {
                '0%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.5)' },
                '70%': { boxShadow: '0 0 0 4px rgba(239, 68, 68, 0)' },
                '100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
              },
            }}
          >
            <MoreHorizIcon sx={{ fontSize: 18 }} />
          </Badge>
        </IconButton>

        {/* Save Status Indicator */}
        <Fade
          in={saveState === 'saving' || saveState === 'saved'}
          timeout={300}
        >
          <Box
            title={
              saveState === 'saving' ? 'Saving changes...' : 'All changes saved'
            }
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(0, 0, 0, 0.02)',
              border: '1px solid',
              borderColor: (theme) =>
                saveState === 'saved'
                  ? 'rgba(16, 185, 129, 0.2)'
                  : theme.palette.divider,
              padding: '4px 10px',
              height: '32px',
              borderRadius: '20px',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
              flexShrink: 0,
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
                    display: { xs: 'none', xl: 'inline-block' },
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
                    display: { xs: 'none', xl: 'inline-block' },
                  }}
                >
                  saved
                </Typography>
              </>
            ) : null}
          </Box>
        </Fade>

        {/* Editor Tools Menu (Detect Language / Dictation / Focus Mode) */}
        <Menu
          anchorEl={toolsAnchor}
          open={Boolean(toolsAnchor)}
          onClose={() => setToolsAnchor(null)}
          PaperProps={{
            sx: {
              borderRadius: '10px',
              mt: 0.5,
              minWidth: '190px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setToolsAnchor(null);
              setSourceAnchor(toolsButtonRef.current);
            }}
          >
            <ListItemIcon>
              <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText
              primary={
                sourceLanguage === 'auto'
                  ? 'Detect Language'
                  : getLanguageLabel(sourceLanguage)
              }
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem
            onClick={() => {
              toggleListening();
              setToolsAnchor(null);
            }}
          >
            <ListItemIcon>
              {isListening ? (
                <MicIcon sx={{ fontSize: 18, color: 'error.main' }} />
              ) : (
                <MicOffIcon sx={{ fontSize: 18 }} />
              )}
            </ListItemIcon>
            <ListItemText
              primary={isListening ? 'Stop Dictation' : 'Start Dictation'}
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem
            onClick={() => {
              setToolsAnchor(null);
              if (onStartFocus) {
                onStartFocus(selectTask);
              } else if (onToggleCentered) {
                onToggleCentered();
              }
            }}
          >
            <ListItemIcon>
              <FlashOnIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText
              primary="Focus Mode"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />

          <MenuItem
            onClick={() => {
              setToolsAnchor(null);
              setIsImportModalOpen(true);
            }}
          >
            <ListItemIcon>
              <ImportIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText
              primary="Import Document"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem
            onClick={() => {
              setToolsAnchor(null);
              setExportAnchor(toolsButtonRef.current);
            }}
          >
            <ListItemIcon>
              <ExportIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText
              primary="Export Document"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
        </Menu>

        <ImportContentModal
          open={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          markdownEditorRef={markdownEditorRef}
        />

        {/* Export format selection Menu */}
        <Menu
          anchorEl={exportAnchor}
          open={Boolean(exportAnchor)}
          onClose={() => setExportAnchor(null)}
          PaperProps={{
            sx: {
              borderRadius: '10px',
              mt: 0.5,
              minWidth: '190px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <MenuItem onClick={() => handleExport('md')}>
            <ListItemIcon>
              <ExportIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText
              primary="Markdown (.md)"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleExport('docx')}>
            <ListItemIcon>
              <DescriptionIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText
              primary="Word (.docx)"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
        </Menu>

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

      {/* ─── MOBILE ONLY LAYOUT ─── */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Volver Back Button */}
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          sx={{
            color: 'text.primary',
            textTransform: 'none',
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '0.5px',
            p: 0,
            minWidth: 0,
            '&:hover': { bgcolor: 'transparent' },
          }}
        >
          VOLVER
        </Button>

        {/* Center: MODO ENFOQUE Button */}
        <Button
          onClick={onToggleCentered}
          startIcon={<EyeIcon sx={{ fontSize: 16 }} />}
          sx={{
            height: '32px',
            px: 2,
            borderRadius: '20px',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(19, 127, 236, 0.2)'
                : 'rgba(19, 127, 236, 0.1)',
            color: 'primary.main',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.5px',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(19, 127, 236, 0.3)'
                  : 'rgba(19, 127, 236, 0.15)',
            },
          }}
        >
          {isCentered ? 'VISTA NORMAL' : 'MODO ENFOQUE'}
        </Button>

        {/* Right: Info Circle Button */}
        <IconButton
          onClick={onToggleSidebar}
          size="small"
          sx={{
            color: 'text.primary',
            p: 0.5,
            '&:hover': { bgcolor: 'transparent' },
          }}
        >
          <InfoIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>
    </StyledEditorHeader>
  );
};
