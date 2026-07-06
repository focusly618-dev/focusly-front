import React from 'react';
import type { BlockNoteEditor } from '@blocknote/core';
import { useEditorContent } from './useEditorContent.hook';
import {
  Box,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
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
} from '@mui/icons-material';
import { BlockNoteView } from '@blocknote/mantine';
import { SuggestionMenuController } from '@blocknote/react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { WorkspaceFormData } from '../../../../../../pages/Workspace/types/workspace.types';
import {
  EditorContent as StyledEditorContent,
  FolderBadge,
  TitleInput,
  BlockNoteWrapper,
} from './EditorContent.styles';
import { colorPalette } from '@/utils';
import { CuteRobotIcon } from '@/components/ui';

interface EditorContentProps {
  currentFolder?: { name: string; color?: string };
  currentTitle: string;
  setTitle: (t: string) => void;
  editor: BlockNoteEditor;
  onContentChange: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCustomSlashMenuItems: (editor: BlockNoteEditor) => any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getWorkspaceMentionMenuItems: (editor: BlockNoteEditor) => any[];
  setValue?: UseFormSetValue<WorkspaceFormData>;
  watch?: UseFormWatch<WorkspaceFormData>;
  targetLanguage?: string;
}

export const EditorContent = ({
  currentFolder,
  currentTitle,
  setTitle,
  editor,
  onContentChange,
  getCustomSlashMenuItems,
  getWorkspaceMentionMenuItems,
  setValue,
  watch,
  targetLanguage,
}: EditorContentProps) => {
  const theme = useTheme();
  const isThemeDark = theme.palette.mode === 'dark';

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
    getLanguageLabel,
    handleCreateTask,
    processTextWithAI,
    isAIProcessing,
  } = useEditorContent({
    setValue,
    watch,
    editor,
  });

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
  // Ghost button styles reused for both cover actions
  const ghostBtnSx = (onCover: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 0.75,
    px: 1.5,
    py: 0.75,
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.3px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ...(onCover
      ? {
          color:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.9)'
              : 'rgba(0,0,0,0.75)',
          borderColor:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.2)'
              : 'rgba(0,0,0,0.08)',
          bgcolor:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(12px)',
          '&:hover': {
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(255,255,255,0.6)',
            borderColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.4)'
                : 'rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
          },
        }
      : {
          color: 'text.disabled',
          borderColor: 'divider',
          bgcolor: 'transparent',
          '&:hover': {
            color: 'text.secondary',
            borderColor: 'text.secondary',
            bgcolor: 'action.hover',
          },
        }),
  });

  return (
    <StyledEditorContent>
      {hasCover ? (
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
              left: { xs: '20px', md: '60px' },
              right: { xs: '20px', md: '60px' },
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              px: 0,
              pb: headerIcon ? 0 : 1.5,
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
                pb: headerIcon ? 1.5 : 0,
              }}
            >
              <Box onClick={handleIconClick} sx={ghostBtnSx(true)}>
                <EmojiPickerIcon sx={{ fontSize: 14 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'inherit',
                    fontWeight: 600,
                    display: { xs: 'none', sm: 'inline-block' },
                  }}
                >
                  {headerIcon ? 'Change icon' : 'Add icon'}
                </Typography>
              </Box>
              <Box onClick={handleColorClick} sx={ghostBtnSx(true)}>
                <CoverIcon sx={{ fontSize: 14 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'inherit',
                    fontWeight: 600,
                    display: { xs: 'none', sm: 'inline-block' },
                  }}
                >
                  Change cover
                </Typography>
              </Box>
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
            transition: 'opacity 0.2s',
          }}
        >
          <Box onClick={handleIconClick} sx={ghostBtnSx(false)}>
            <EmojiPickerIcon sx={{ fontSize: 14 }} />
            <Typography
              variant="caption"
              sx={{
                color: 'inherit',
                fontWeight: 600,
                display: { xs: 'none', sm: 'inline-block' },
              }}
            >
              {headerIcon ? 'Change icon' : 'Add icon'}
            </Typography>
          </Box>
          <Box onClick={handleColorClick} sx={ghostBtnSx(false)}>
            <CoverIcon sx={{ fontSize: 14 }} />
            <Typography
              variant="caption"
              sx={{
                color: 'inherit',
                fontWeight: 600,
                display: { xs: 'none', sm: 'inline-block' },
              }}
            >
              Add cover
            </Typography>
          </Box>
        </Box>
      )}

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

      <BlockNoteWrapper
        id="joyride-editor-area"
        onContextMenu={handleContextMenu}
        style={{ position: 'relative' }}
      >
        <BlockNoteView
          editor={editor}
          theme={isThemeDark ? 'dark' : 'light'}
          slashMenu={false}
          onChange={onContentChange}
        >
          {/* Slash Menu (/) */}
          <SuggestionMenuController
            triggerCharacter={'/'}
            getItems={async (query) =>
              getCustomSlashMenuItems(editor).filter((item) =>
                item.title.toLowerCase().includes(query.toLowerCase()),
              )
            }
          />
          <SuggestionMenuController
            triggerCharacter={'@'}
            getItems={async (query) =>
              getWorkspaceMentionMenuItems(editor).filter((item) =>
                item.title.toLowerCase().includes(query.toLowerCase()),
              )
            }
          />
        </BlockNoteView>

        {isAIProcessing && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(15, 23, 42, 0.45)'
                  : 'rgba(255, 255, 255, 0.45)',
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
                bgcolor: theme.palette.mode === 'dark' ? '#1e1b4b' : '#e0f2fe',
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
      </BlockNoteWrapper>

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
        <MenuItem onClick={handleCreateTask} sx={{ py: 1.2 }}>
          <ListItemIcon sx={{ color: '#7c3aed' }}>
            <AutoAwesomeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Create task with AI"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>

        <MenuItem onClick={handleCreateResume} sx={{ py: 1.2 }}>
          <ListItemIcon sx={{ color: '#137fec' }}>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Create a resume"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>

        <MenuItem onClick={() => processTextWithAI('grammar')} sx={{ py: 1.2 }}>
          <ListItemIcon sx={{ color: '#ec4899' }}>
            <SpellcheckIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Fix spelling & grammar"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>

        <MenuItem onClick={() => processTextWithAI('expand')} sx={{ py: 1.2 }}>
          <ListItemIcon sx={{ color: '#10b981' }}>
            <ExpandIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Make text longer"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>

        <MenuItem onClick={() => processTextWithAI('shorten')} sx={{ py: 1.2 }}>
          <ListItemIcon sx={{ color: '#f59e0b' }}>
            <ShortenIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Make text shorter"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>

        <MenuItem
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
      </Menu>

      {/* ── Color / Cover Picker ── */}
      <Menu
        anchorEl={colorAnchor}
        open={Boolean(colorAnchor)}
        onClose={() => setColorAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: '14px',
            minWidth: '260px',
            mt: 1,
            boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
            border: '1px solid',
            borderColor: 'divider',
            p: 1.5,
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            px: 0.5,
            pb: 1,
            display: 'block',
            color: 'text.disabled',
            fontWeight: 700,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
          }}
        >
          Cover style
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.75,
          }}
        >
          {colorPalette.map((c) => (
            <Tooltip key={c.color} title={c.label} placement="top">
              <Box
                onClick={() => handleColorSelect(c.color)}
                sx={{
                  width: 30,
                  height: 30,
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
    </StyledEditorContent>
  );
};
