import React, { Suspense, lazy, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContent } from './useEditorContent.hook';
import { useCanvasCardPreviews } from './useCanvasCardPreviews.hook';
import { useCanvasReadOnly } from './canvasPlan';
import {
  Box,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  alpha,
  ButtonBase,
} from '@mui/material';
import EmojiPicker, { Theme as EmojiPickerTheme } from 'emoji-picker-react';
import {
  Folder as FolderIcon,
  AutoAwesome as AutoAwesomeIcon,
  Description as DescriptionIcon,
  Spellcheck as SpellcheckIcon,
  Translate as TranslateIcon,
  TextIncrease as ExpandIcon,
  TextDecrease as ShortenIcon,
  // Toolbar — minimal
  SentimentSatisfiedAlt as EmojiPickerIcon,
  Image as CoverIcon,
  // Icon picker — curated professional set
  ArticleOutlined as ArticleIcon,
  StarBorder as StarIcon,
  BookmarkBorder as BookmarkIcon,
  WorkOutlined as WorkIcon,
  HomeOutlined as HomeIcon,
  SchoolOutlined as SchoolIcon,
  FlightOutlined as FlightIcon,
  MusicNote as MusicNoteIcon,
  CameraAlt as CameraAltIcon,
  LightbulbOutlined as LightbulbIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  LocationOn as LocationOnIcon,
  FitnessCenter as FitnessCenterIcon,
  Restaurant as RestaurantIcon,
  Movie as MovieIcon,
  Code as CodeIcon,
  Psychology as PsychologyIcon,
  RocketLaunch as RocketIcon,
  FavoriteBorder as FavoriteIcon,
  LocalFireDepartment as FireIcon,
  Spa as EcoIcon,
  Brush as BrushIcon,
  Gamepad as GamingIcon,
  DeveloperMode as TerminalIcon,
  AccountTree as HubIcon,
  Stars as MagicIcon,
  LocalOffer as TagIcon,
  ViewSidebar as FocusModeIcon,
  ViewStream as DefaultModeIcon,
} from '@mui/icons-material';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { WorkspaceFormData } from '../../../../workspace.types';
import { AITaskPreviewModal } from '../AITaskPreviewModal/AITaskPreviewModal';
import {
  EditorContent as StyledEditorContent,
  FolderBadge,
  TitleInput,
  MarkdownEditorSurface,
} from './EditorContent.styles';
import { colorPalette } from '@/utils';
import { CuteRobotIcon, AutoflowIcon } from '@/components/ui';
import { MarkdownEditor } from '../../codemirror/MarkdownEditor';
import type { MarkdownEditorRef } from '../../codemirror/MarkdownEditor.types';
import { EditorAskAI } from '../EditorAskAI/EditorAskAI';
import { surfaceColor } from '@/context';
import { CanvasLoading } from './CanvasLoading';
import type { CanvasView } from '../../useCanvasView.hook';
import { splitCanvasLabel } from './canvasLinks.utils';
import { CreateCanvasPopover } from '../CanvasIdentity/CreateCanvasPopover';
import { editorFontVars, type EditorFontStyle } from '../../editorFonts';

// Excalidraw is heavy and only a canvas needs it: it's split into its own
// chunk, fetched when a canvas is opened rather than with every note.
const EditorCanvas = lazy(() =>
  import('./EditorCanvas').then((m) => ({ default: m.EditorCanvas })),
);

interface EditorContentProps {
  currentFolder?: { name: string; color?: string };
  currentTitle: string;
  setTitle: (t: string) => void;
  initialMarkdown: string;
  markdownEditorRef: React.RefObject<MarkdownEditorRef | null>;
  onChange: (markdown: string) => void;
  setValue?: UseFormSetValue<WorkspaceFormData>;
  watch?: UseFormWatch<WorkspaceFormData>;
  targetLanguage?: string;
  isCentered: boolean;
  toggleCentered: () => void;
  canvasView: CanvasView;
  fontStyle: EditorFontStyle;
}

export const EditorContent = ({
  currentFolder,
  currentTitle,
  setTitle,
  initialMarkdown,
  markdownEditorRef,
  onChange,
  setValue,
  watch,
  targetLanguage,
  isCentered,
  toggleCentered,
  canvasView,
  fontStyle,
}: EditorContentProps) => {
  const theme = useTheme();
  const isThemeDark = theme.palette.mode === 'dark';
  const editorSurfaceRef = useRef<HTMLDivElement>(null);
  const [liveSelectedText, setLiveSelectedText] = useState('');
  const workspaceId = (watch?.('id') as string | undefined) || null;
  useCanvasCardPreviews(workspaceId, markdownEditorRef);
  // Phones only view canvases, so they don't make new ones either
  const canvasReadOnly = useCanvasReadOnly();
  const [coverColorCategory, setCoverColorCategory] = useState<
    'all' | 'gradient' | 'pastel' | 'solid'
  >('all');

  const {
    menuAnchor,
    colorAnchor,
    setColorAnchor,
    iconAnchor,
    setIconAnchor,
    headerColor,
    headerIcon,
    currentBgGradient,
    hasCover,
    handleColorClick,
    handleIconClick,
    handleColorSelect,
    handleIconSelect,
    handleContextMenu,
    handleClose,
    selectedText,
    getLanguageLabel,
    handleCreateTask,
    processTextWithAI,
    isAIProcessing,
    aiTaskPreviewData,
    isAITaskPreviewOpen,
    setIsAITaskPreviewOpen,
    handleConfirmAITask,
    isCreatingTask,
    handleGenerateCanvasPage,
    canvasDraft,
    isCreatingCanvas,
    handleCancelCanvasDraft,
    handleCreateCanvas,
  } = useEditorContent({
    setValue,
    watch,
    markdownEditorRef,
    canvasView,
  });
  const isCanvasActive = canvasView.isActive;
  // The right-click menu's actions need a selection or a paragraph to act on
  const hasMenuTarget = selectedText.trim().length > 0;

  const { t } = useTranslation();

  // Use derived values directly - no need for useEffect sync
  // (persistedBg and persistedEmoji from watch() are already reactive)

  const iconMap: Record<string, React.ElementType> = {
    Article: ArticleIcon,
    Star: StarIcon,
    Bookmark: BookmarkIcon,
    Work: WorkIcon,
    Home: HomeIcon,
    School: SchoolIcon,
    Flight: FlightIcon,
    Music: MusicNoteIcon,
    Camera: CameraAltIcon,
    Lightbulb: LightbulbIcon,
    Calendar: CalendarTodayIcon,
    Clock: AccessTimeIcon,
    Money: AttachMoneyIcon,
    Location: LocationOnIcon,
    Fitness: FitnessCenterIcon,
    Restaurant: RestaurantIcon,
    Movie: MovieIcon,
    Code: CodeIcon,
    Psychology: PsychologyIcon,
    Rocket: RocketIcon,
    Favorite: FavoriteIcon,
    Fire: FireIcon,
    Eco: EcoIcon,
    Brush: BrushIcon,
    Gaming: GamingIcon,
    Terminal: TerminalIcon,
    Hub: HubIcon,
    Magic: MagicIcon,
    Tag: TagIcon,
  };

  const handleCreateResume = () => {
    processTextWithAI('summarize');
  };
  // The icon / cover / view actions over the document, styled like the
  // header's buttons: solid, with a hairline border, the same on a cover as
  // off it (where a light shadow lifts them off the picture).
  const actionBtnSx = (onCover: boolean) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.75,
    height: 30,
    px: 1.25,
    borderRadius: '8px',
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    color: 'text.secondary',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    boxShadow: onCover ? '0 1px 2px rgba(0,0,0,0.12)' : 'none',
    transition: 'border-color .15s, color .15s',
    '& svg': { fontSize: 16 },
    '&:hover': {
      color: 'text.primary',
      borderColor: alpha(theme.palette.text.primary, 0.3),
    },
    '&.Mui-focusVisible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: 2,
    },
  });

  /** The three actions: icon, cover, and the focused (centered) view. */
  const headerActions = (onCover: boolean) => {
    const actions = [
      {
        key: 'icon',
        onClick: handleIconClick,
        icon: <EmojiPickerIcon />,
        label: headerIcon
          ? t('workspaceEditor.header.changeIcon')
          : t('workspaceEditor.header.addIcon'),
      },
      {
        key: 'cover',
        onClick: handleColorClick,
        icon: <CoverIcon />,
        label: onCover
          ? t('workspaceEditor.header.changeCover')
          : t('workspaceEditor.header.addCover'),
      },
      {
        key: 'view',
        onClick: toggleCentered,
        icon: isCentered ? <DefaultModeIcon /> : <FocusModeIcon />,
        label: isCentered
          ? t('workspaceEditor.header.defaultView')
          : t('workspaceEditor.header.focusView'),
      },
    ];
    return actions.map((action) => (
      <ButtonBase
        key={action.key}
        onClick={action.onClick}
        aria-label={action.label}
        title={action.label}
        sx={actionBtnSx(onCover)}
      >
        {action.icon}
        {/* Small screens: icons only (the label is the button's name). */}
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
          {action.label}
        </Box>
      </ButtonBase>
    ));
  };

  const handleEditorSurfaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // A canvas link with a line to itself is a card that carries its name
    // and icon; one inside a sentence has them in its text.
    const card = target.closest<HTMLElement>('.cm-canvas-card');
    if (card) {
      canvasView.open(
        card.dataset.canvasId || null,
        card.dataset.canvasName || 'Canvas',
        card.dataset.canvasIcon || null,
      );
      return;
    }
    const canvasLinkEl = target.closest<HTMLElement>('.cm-live-canvas-link');
    if (canvasLinkEl) {
      // The link's text stands in until the saved name and icon load.
      const { icon, name } = splitCanvasLabel(canvasLinkEl.textContent || '');
      canvasView.open(
        canvasLinkEl.dataset.canvasId || null,
        name || 'Canvas',
        icon,
      );
    }
  };

  return (
    <StyledEditorContent
      sx={{
        ...editorFontVars(fontStyle),
        // An open canvas takes the whole area under the header.
        ...(isCanvasActive && {
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          p: { xs: 1, md: 1.5 },
        }),
      }}
    >
      {!isCanvasActive &&
        (hasCover ? (
          <Box
            sx={{
              ml: { xs: '-8px', md: '-60px' },
              mr: { xs: '-8px', md: '-60px' },
              mt: { xs: '-16px', md: '-40px' },
              position: 'relative',
              mb: headerIcon ? '36px' : '16px',
            }}
          >
            {/* Gradient banner */}
            <Box
              sx={{
                height: '180px',
                background: currentBgGradient,
                transition: 'background 0.5s ease',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(0, 0, 0, 0.1)'
                      : 'rgba(255, 255, 255, 0.05)',
                },
              }}
            />

            {/* Bottom row: icon (floating) + action buttons */}
            <Box
              sx={{
                position: 'absolute',
                bottom: headerIcon ? '-36px' : 0,
                left: isCentered ? '50%' : { xs: '20px', md: '60px' },
                right: isCentered ? 'auto' : { xs: '20px', md: '60px' },
                width: isCentered ? '100%' : 'auto',
                maxWidth: isCentered ? '800px' : 'none',
                transform: isCentered ? 'translateX(-50%)' : 'none',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                px: isCentered ? { xs: 2, md: 0 } : 0,
                pb: headerIcon ? 0 : 1.5,
                transition: 'all 0.3s ease',
              }}
            >
              {/* Large icon card — sits on top of the cover edge */}
              {headerIcon ? (
                <Tooltip title="Change icon">
                  <Box
                    onClick={handleIconClick}
                    sx={{
                      display: 'inline-flex',
                      width: 60,
                      height: 60,
                      borderRadius: '14px',
                      bgcolor: 'background.paper',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.22)',
                      border: '1px solid',
                      borderColor: 'divider',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 2,
                      position: 'relative',
                      transition: 'transform 0.18s',
                      '&:hover': { transform: 'scale(1.06)' },
                    }}
                  >
                    {iconMap[headerIcon] ? (
                      React.createElement(iconMap[headerIcon], {
                        sx: { fontSize: 30, color: 'text.primary' },
                      })
                    ) : (
                      <span style={{ fontSize: '30px', lineHeight: 1 }}>
                        {headerIcon}
                      </span>
                    )}
                  </Box>
                </Tooltip>
              ) : (
                <Box />
              )}

              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  pb: headerIcon ? 1.5 : 1.4,
                }}
              >
                {headerActions(true)}
              </Box>
            </Box>
          </Box>
        ) : (
          /* ── NO COVER: ghost toolbar row, always visible ── */
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: headerIcon ? 1 : 1.5,
              transition: 'all 0.3s ease',
              maxWidth: isCentered ? '800px' : '100%',
              margin: isCentered ? '0 auto' : '0',
              width: '100%',
            }}
          >
            {headerActions(false)}
          </Box>
        ))}

      {/* ── Center Content Wrapper ── */}
      <Box
        sx={{
          maxWidth: isCanvasActive ? '100%' : isCentered ? '800px' : '100%',
          margin: isCanvasActive ? '0' : isCentered ? '0 auto' : '0',
          width: '100%',
          transition: 'all 0.3s ease',
          ...(isCanvasActive && {
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }),
        }}
      >
        {isCanvasActive && (
          // The drawing tool downloads the first time a canvas opens
          <Suspense fallback={<CanvasLoading />}>
            <EditorCanvas
              title={canvasView.title}
              icon={canvasView.icon}
              onLoaded={canvasView.applySaved}
              onClose={canvasView.close}
              canvasId={canvasView.id}
            />
          </Suspense>
        )}
        {/* Hidden, not unmounted, while a canvas is open: unmounting would drop
            edits still inside the editor's change debounce (such as the link
            just inserted for a new canvas), and its undo history. */}
        <Box sx={{ display: isCanvasActive ? 'none' : 'block' }}>
          {/* ── LARGE ICON when no cover ── */}
          {!hasCover && headerIcon && (
            <Tooltip title="Change icon">
              <Box
                onClick={handleIconClick}
                sx={{
                  display: 'inline-flex',
                  mb: 2,
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: isThemeDark
                    ? '0 4px 20px rgba(0,0,0,0.4)'
                    : '0 4px 12px rgba(0,0,0,0.06)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: isThemeDark
                      ? '0 8px 30px rgba(0,0,0,0.6)'
                      : '0 8px 16px rgba(0,0,0,0.12)',
                  },
                }}
              >
                {iconMap[headerIcon] ? (
                  React.createElement(iconMap[headerIcon], {
                    sx: { fontSize: 32, color: 'text.primary' },
                  })
                ) : (
                  <span style={{ fontSize: '32px', lineHeight: 1 }}>
                    {headerIcon}
                  </span>
                )}
              </Box>
            </Tooltip>
          )}

          {/* ── FOLDER BADGE ── */}
          {currentFolder && (
            <FolderBadge bgColor={currentFolder.color}>
              <FolderIcon sx={{ fontSize: 12 }} />
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ textTransform: 'uppercase' }}
              >
                {currentFolder.name}
              </Typography>
            </FolderBadge>
          )}

          <TitleInput
            placeholder="Untitled Document"
            value={currentTitle}
            onChange={(e) => setTitle(e.target.value)}
          />

          <MarkdownEditorSurface
            id="joyride-editor-area"
            ref={editorSurfaceRef}
            onContextMenu={handleContextMenu}
            onClick={handleEditorSurfaceClick}
            // Reserve room below the last line so it can scroll clear of the
            // fixed "Ask Lumina" button instead of ending up hidden behind it
            // — that button sits on top of the viewport, not in document flow.
            style={{ position: 'relative', paddingBottom: '96px' }}
          >
            <MarkdownEditor
              ref={markdownEditorRef}
              initialValue={initialMarkdown}
              onChange={onChange}
              placeholder="Start writing..."
              onSelectionChange={setLiveSelectedText}
            />

            {isAIProcessing && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: surfaceColor(
                    theme,
                    'rgba(15, 23, 42, 0.45)',
                    'rgba(36, 36, 36, 0.45)',
                    'rgba(255, 255, 255, 0.45)',
                  ),
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  borderRadius: '12px',
                  animation: 'fadeIn 0.25s ease-out',
                  '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 3,
                    py: 1.5,
                    borderRadius: '99px',
                    bgcolor:
                      theme.palette.mode === 'dark' ? '#1e1b4b' : '#e0f2fe',
                    border: `1px solid ${theme.palette.primary.main}30`,
                    boxShadow: `0 8px 32px rgba(15, 23, 76, 0.25), 0 0 16px ${theme.palette.primary.main}15`,
                    animation: 'pulseGlow 2s infinite ease-in-out',
                    '@keyframes pulseGlow': {
                      '0%, 100%': {
                        transform: 'scale(1)',
                        boxShadow: `0 8px 32px rgba(15, 23, 76, 0.25), 0 0 16px ${theme.palette.primary.main}15`,
                      },
                      '50%': {
                        transform: 'scale(1.02)',
                        boxShadow: `0 8px 32px rgba(15, 23, 76, 0.35), 0 0 24px ${theme.palette.primary.main}30`,
                      },
                    },
                  }}
                >
                  <CuteRobotIcon
                    size={22}
                    variant="mini"
                    primaryColor="#137fec"
                    eyeColor="#22d3ee"
                  />
                  <Typography
                    variant="body2"
                    fontWeight={750}
                    color="text.primary"
                    sx={{ letterSpacing: '0.2px' }}
                  >
                    Lumina AI is writing...
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Keyed by document so switching notes starts on that note's thread */}
            <EditorAskAI
              key={workspaceId ?? 'unsaved'}
              markdownEditorRef={markdownEditorRef}
              selectedText={liveSelectedText}
              workspaceId={workspaceId}
              documentTitle={currentTitle}
            />
          </MarkdownEditorSurface>
        </Box>
      </Box>

      <Menu
        open={menuAnchor !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          menuAnchor !== null
            ? { top: menuAnchor.mouseY, left: menuAnchor.mouseX }
            : undefined
        }
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: 220,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        {!hasMenuTarget && (
          <Typography
            variant="caption"
            component="div"
            sx={{ px: 2, pt: 0.5, pb: 1, color: 'text.secondary' }}
          >
            Select text, or right-click a paragraph
          </Typography>
        )}
        <MenuItem
          disabled={!hasMenuTarget}
          onClick={handleCreateTask}
          sx={{ py: 1.2 }}
        >
          <ListItemIcon sx={{ color: '#7c3aed' }}>
            <AutoAwesomeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Create task with AI"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>

        <MenuItem
          disabled={!hasMenuTarget}
          onClick={handleCreateResume}
          sx={{ py: 1.2 }}
        >
          <ListItemIcon sx={{ color: '#137fec' }}>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Create a resume"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>

        <MenuItem
          disabled={!hasMenuTarget}
          onClick={() => processTextWithAI('grammar')}
          sx={{ py: 1.2 }}
        >
          <ListItemIcon sx={{ color: '#ec4899' }}>
            <SpellcheckIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Fix spelling & grammar"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>

        <MenuItem
          disabled={!hasMenuTarget}
          onClick={() => processTextWithAI('expand')}
          sx={{ py: 1.2 }}
        >
          <ListItemIcon sx={{ color: '#10b981' }}>
            <ExpandIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Make text longer"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>

        <MenuItem
          disabled={!hasMenuTarget}
          onClick={() => processTextWithAI('shorten')}
          sx={{ py: 1.2 }}
        >
          <ListItemIcon sx={{ color: '#f59e0b' }}>
            <ShortenIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Make text shorter"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>

        <MenuItem
          disabled={!hasMenuTarget}
          onClick={() => processTextWithAI('tone_professional')}
          sx={{ py: 1.2 }}
        >
          <ListItemIcon sx={{ color: '#6b7280' }}>
            <WorkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Professional tone"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>

        <MenuItem
          disabled={!hasMenuTarget}
          onClick={() => processTextWithAI('tone_casual')}
          sx={{ py: 1.2 }}
        >
          <ListItemIcon sx={{ color: '#f43f5e' }}>
            <EmojiPickerIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Casual tone"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>

        <MenuItem
          disabled={!hasMenuTarget}
          onClick={() =>
            processTextWithAI(`translate_${targetLanguage || 'en'}`)
          }
          sx={{ py: 1.2 }}
        >
          <ListItemIcon sx={{ color: '#0ea5e9' }}>
            <TranslateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={`Translate to ${getLanguageLabel(targetLanguage || 'en')}`}
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>

        {!canvasReadOnly && (
          <MenuItem
            disabled={!hasMenuTarget}
            onClick={handleGenerateCanvasPage}
            sx={{ py: 1.2 }}
          >
            <ListItemIcon sx={{ color: '#0ea5e9' }}>
              <AutoflowIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={'Create Canvas Page'}
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
        )}
      </Menu>

      {/* ── Color / Cover Picker ── */}
      <Menu
        anchorEl={colorAnchor}
        open={Boolean(colorAnchor)}
        onClose={() => setColorAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            minWidth: '310px',
            maxWidth: '330px',
            mt: 1,
            boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
            border: '1px solid',
            borderColor: 'divider',
            p: 1.75,
            maxHeight: 460,
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.15)',
              borderRadius: '4px',
            },
          },
        }}
      >
        {/* Category Classification Chips */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            mb: 1.5,
            px: 0.5,
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {[
            {
              id: 'all' as const,
              label: 'Todos',
              count: colorPalette.length - 1, // minus 'none'
              dot: 'linear-gradient(135deg, #a5b4fc, #fbcfe8, #86efac)',
            },
            {
              id: 'gradient' as const,
              label: 'Gradientes',
              count: colorPalette.filter(
                (c) =>
                  !c.color.startsWith('pastel_') &&
                  !c.color.startsWith('solid_') &&
                  c.color !== 'none',
              ).length,
              dot: 'linear-gradient(135deg, #a5b4fc 0%, #c084fc 100%)',
            },
            {
              id: 'pastel' as const,
              label: 'Pasteles',
              count: colorPalette.filter((c) => c.color.startsWith('pastel_'))
                .length,
              dot: '#fecdd3',
            },
            {
              id: 'solid' as const,
              label: 'Sólidos',
              count: colorPalette.filter((c) => c.color.startsWith('solid_'))
                .length,
              dot: '#0284c7',
            },
          ].map((cat) => {
            const isActive = coverColorCategory === cat.id;
            return (
              <Box
                key={cat.id}
                onClick={() => setCoverColorCategory(cat.id)}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.6,
                  px: 1,
                  py: 0.4,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isActive
                    ? 'primary.main'
                    : isThemeDark
                      ? 'rgba(255,255,255,0.12)'
                      : 'rgba(0,0,0,0.1)',
                  bgcolor: isActive
                    ? alpha(theme.palette.primary.main, 0.12)
                    : isThemeDark
                      ? 'rgba(255,255,255,0.04)'
                      : 'rgba(0,0,0,0.03)',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: isActive
                      ? alpha(theme.palette.primary.main, 0.18)
                      : isThemeDark
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(0,0,0,0.06)',
                    color: 'text.primary',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: cat.dot,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
                {cat.label} ({cat.count})
              </Box>
            );
          })}
        </Box>

        {/* Gradientes */}
        {(coverColorCategory === 'all' ||
          coverColorCategory === 'gradient') && (
          <>
            <Typography
              variant="caption"
              sx={{
                px: 0.5,
                pb: 0.75,
                display: 'block',
                color: 'text.secondary',
                fontWeight: 800,
                fontSize: '10px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
              }}
            >
              Gradientes
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 0.75,
                mb: 1.75,
              }}
            >
              {colorPalette
                .filter(
                  (c) =>
                    !c.color.startsWith('pastel_') &&
                    !c.color.startsWith('solid_'),
                )
                .map((c) => (
                  <Tooltip key={c.color} title={c.label} placement="top">
                    <Box
                      onClick={() => handleColorSelect(c.color)}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background:
                          c.gradient === 'none'
                            ? isThemeDark
                              ? '#1e1e1e'
                              : '#f0f0f0'
                            : c.gradient,
                        cursor: 'pointer',
                        outline:
                          headerColor === c.color ? '2.5px solid' : '1px solid',
                        outlineColor:
                          headerColor === c.color ? 'primary.main' : 'divider',
                        outlineOffset: headerColor === c.color ? '2px' : '0px',
                        transition: 'all 0.18s',
                        position: 'relative',
                        '&:hover': {
                          transform: 'scale(1.15)',
                          outlineColor: 'primary.main',
                        },
                      }}
                    />
                  </Tooltip>
                ))}
            </Box>
          </>
        )}

        {/* Tonos Pasteles */}
        {(coverColorCategory === 'all' || coverColorCategory === 'pastel') && (
          <>
            <Typography
              variant="caption"
              sx={{
                px: 0.5,
                pb: 0.75,
                display: 'block',
                color: 'text.secondary',
                fontWeight: 800,
                fontSize: '10px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
              }}
            >
              Tonos Pasteles
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 0.75,
                mb: 1.75,
              }}
            >
              {colorPalette
                .filter((c) => c.color.startsWith('pastel_'))
                .map((c) => (
                  <Tooltip key={c.color} title={c.label} placement="top">
                    <Box
                      onClick={() => handleColorSelect(c.color)}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background: c.gradient,
                        cursor: 'pointer',
                        outline:
                          headerColor === c.color ? '2.5px solid' : '1px solid',
                        outlineColor:
                          headerColor === c.color ? 'primary.main' : 'divider',
                        outlineOffset: headerColor === c.color ? '2px' : '0px',
                        transition: 'all 0.18s',
                        position: 'relative',
                        '&:hover': {
                          transform: 'scale(1.15)',
                          outlineColor: 'primary.main',
                        },
                      }}
                    />
                  </Tooltip>
                ))}
            </Box>
          </>
        )}

        {/* Tonos Sólidos */}
        {(coverColorCategory === 'all' || coverColorCategory === 'solid') && (
          <>
            <Typography
              variant="caption"
              sx={{
                px: 0.5,
                pb: 0.75,
                display: 'block',
                color: 'text.secondary',
                fontWeight: 800,
                fontSize: '10px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
              }}
            >
              Tonos Sólidos
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 0.75,
                pb: 0.5,
              }}
            >
              {colorPalette
                .filter((c) => c.color.startsWith('solid_'))
                .map((c) => (
                  <Tooltip key={c.color} title={c.label} placement="top">
                    <Box
                      onClick={() => handleColorSelect(c.color)}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background: c.gradient,
                        cursor: 'pointer',
                        outline:
                          headerColor === c.color ? '2.5px solid' : '1px solid',
                        outlineColor:
                          headerColor === c.color ? 'primary.main' : 'divider',
                        outlineOffset: headerColor === c.color ? '2px' : '0px',
                        transition: 'all 0.18s',
                        position: 'relative',
                        '&:hover': {
                          transform: 'scale(1.15)',
                          outlineColor: 'primary.main',
                        },
                      }}
                    />
                  </Tooltip>
                ))}
            </Box>
          </>
        )}
      </Menu>

      {/* ── Icon Picker ── */}
      <Menu
        anchorEl={iconAnchor}
        open={Boolean(iconAnchor)}
        onClose={() => setIconAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 0,
            overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <EmojiPicker
          onEmojiClick={(emojiData) => {
            handleIconSelect(emojiData.emoji);
          }}
          theme={isThemeDark ? EmojiPickerTheme.DARK : EmojiPickerTheme.LIGHT}
          lazyLoadEmojis={true}
        />
      </Menu>

      <CreateCanvasPopover
        draft={canvasDraft}
        creating={isCreatingCanvas}
        onCancel={handleCancelCanvasDraft}
        onCreate={handleCreateCanvas}
      />

      <AITaskPreviewModal
        open={isAITaskPreviewOpen}
        onClose={() => setIsAITaskPreviewOpen(false)}
        onConfirm={handleConfirmAITask}
        previewData={aiTaskPreviewData}
        loading={isCreatingTask}
      />
    </StyledEditorContent>
  );
};
