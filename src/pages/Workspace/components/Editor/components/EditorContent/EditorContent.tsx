import React, { useState, useEffect } from 'react';
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
import {
  Folder as FolderIcon,
  AutoAwesome as AutoAwesomeIcon,
  Description as DescriptionIcon,
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

type HeaderColor =
  | 'aurora'
  | 'sunset'
  | 'ocean'
  | 'forest'
  | 'midnight'
  | 'rose'
  | 'golden'
  | 'cosmic'
  | 'ember'
  | 'dusk'
  | 'arctic'
  | 'spring'
  | 'candy'
  | 'neon'
  | 'borealis'
  | 'royal'
  | 'grape'
  | 'kyoto'
  | 'aqua'
  | 'mauve'
  | 'shore'
  | 'peach'
  | 'indigo'
  | 'nebula'
  | 'mint'
  | 'blood'
  | 'silver'
  | 'obsidian'
  | 'none';

const colorPalette: { color: HeaderColor; gradient: string; label: string }[] = [
  { color: 'none', gradient: 'none', label: 'None' },
  {
    color: 'aurora',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    label: 'Aurora',
  },
  {
    color: 'sunset',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    label: 'Sunset',
  },
  {
    color: 'ocean',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    label: 'Ocean',
  },
  {
    color: 'forest',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    label: 'Forest',
  },
  {
    color: 'midnight',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    label: 'Midnight',
  },
  {
    color: 'rose',
    gradient: 'linear-gradient(135deg, #fc5c7d 0%, #6a3093 100%)',
    label: 'Rose',
  },
  {
    color: 'golden',
    gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    label: 'Golden',
  },
  {
    color: 'cosmic',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #7b2ff7 50%, #f107a3 100%)',
    label: 'Cosmic',
  },
  {
    color: 'ember',
    gradient: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
    label: 'Ember',
  },
  {
    color: 'dusk',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    label: 'Dusk',
  },
  {
    color: 'arctic',
    gradient: 'linear-gradient(135deg, #304352 0%, #d7d2cc 100%)',
    label: 'Arctic',
  },
  {
    color: 'spring',
    gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
    label: 'Spring',
  },
  {
    color: 'candy',
    gradient: 'linear-gradient(135deg, #ff6fd8 0%, #3813c2 100%)',
    label: 'Candy',
  },
  {
    color: 'neon',
    gradient: 'linear-gradient(135deg, #21D4FD 0%, #B721FF 100%)',
    label: 'Neon',
  },
  {
    color: 'borealis',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    label: 'Borealis',
  },
  {
    color: 'royal',
    gradient: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
    label: 'Royal',
  },
  {
    color: 'grape',
    gradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
    label: 'Grape',
  },
  {
    color: 'kyoto',
    gradient: 'linear-gradient(135deg, #c21500 0%, #ffc500 100%)',
    label: 'Kyoto',
  },
  {
    color: 'aqua',
    gradient: 'linear-gradient(135deg, #50C9C3 0%, #96DEDA 100%)',
    label: 'Aqua',
  },
  {
    color: 'mauve',
    gradient: 'linear-gradient(135deg, #42275a 0%, #734b6d 100%)',
    label: 'Mauve',
  },
  {
    color: 'shore',
    gradient: 'linear-gradient(135deg, #70e1f5 0%, #ffd194 100%)',
    label: 'Shore',
  },
  {
    color: 'peach',
    gradient: 'linear-gradient(135deg, #FF9A8B 0%, #FF6A88 100%)',
    label: 'Peach',
  },
  {
    color: 'indigo',
    gradient: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
    label: 'Indigo',
  },
  {
    color: 'nebula',
    gradient: 'linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%)',
    label: 'Nebula',
  },
  {
    color: 'mint',
    gradient: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
    label: 'Mint',
  },
  {
    color: 'blood',
    gradient: 'linear-gradient(135deg, #f85032 0%, #e73827 100%)',
    label: 'Blood',
  },
  {
    color: 'silver',
    gradient: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
    label: 'Silver',
  },
  {
    color: 'obsidian',
    gradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    label: 'Obsidian',
  },
];

interface EditorContentProps {
  currentFolder?: { name: string; color?: string };
  currentTitle: string;
  setTitle: (t: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any;
  onContentChange: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCustomSlashMenuItems: (editor: any) => any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getWorkspaceMentionMenuItems: (editor: any) => any[];
  setValue?: UseFormSetValue<WorkspaceFormData>;
  watch?: UseFormWatch<WorkspaceFormData>;
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
}: EditorContentProps) => {
  const theme = useTheme();
  const isThemeDark = theme.palette.mode === 'dark';

  const persistedEmoji = watch?.('emoji');
  const persistedBg = watch?.('background_color');

  const [menuAnchor, setMenuAnchor] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [colorAnchor, setColorAnchor] = useState<null | HTMLElement>(null);
  const [iconAnchor, setIconAnchor] = useState<null | HTMLElement>(null);
  const [headerColor, setHeaderColor] = useState<HeaderColor>('none');
  const [headerIcon, setHeaderIcon] = useState<string>('');

  // Sync persisted values into local state when workspace loads/changes
  useEffect(() => {
    const bg = (persistedBg as HeaderColor | undefined) ?? 'none';
    setHeaderColor(colorPalette.some((c) => c.color === bg) ? bg : 'none');
  }, [persistedBg]);

  useEffect(() => {
    setHeaderIcon(persistedEmoji ?? '');
  }, [persistedEmoji]);

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

  const currentBgGradient = colorPalette.find((c) => c.color === headerColor)?.gradient || 'none';
  const hasCover = headerColor !== 'none';

  const handleColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorAnchor(event.currentTarget);
  };

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setIconAnchor(event.currentTarget);
  };

  const handleColorSelect = (color: HeaderColor) => {
    setHeaderColor(color);
    setValue?.('background_color', color === 'none' ? undefined : color);
    setColorAnchor(null);
  };

  const handleIconSelect = (iconName: string) => {
    setHeaderIcon(iconName);
    setValue?.('emoji', iconName || undefined);
    setIconAnchor(null);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    const selection = window.getSelection()?.toString();
    if (selection && selection.trim().length > 0) {
      event.preventDefault();
      setSelectedText(selection);
      setMenuAnchor({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
    }
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  const handleCreateTask = () => {
    console.log('Create task with AI:', selectedText);
    handleClose();
    // Here you would typically trigger a modal or call an AI service
  };

  const handleCreateResume = () => {
    console.log('Create a resume:', selectedText);
    handleClose();
    // Here you would typically trigger a summarization service
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
          color: 'rgba(255,255,255,0.9)',
          borderColor: 'rgba(255,255,255,0.25)',
          bgcolor: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(10px)',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.5)' },
        }
      : {
          color: 'text.disabled',
          borderColor: 'divider',
          bgcolor: 'transparent',
          '&:hover': { color: 'text.secondary', borderColor: 'text.secondary' },
        }),
  });

  return (
    <StyledEditorContent>

      {/* ── COVER BANNER (with icon + action buttons overlaid at bottom) ── */}
      {hasCover ? (
        <Box
          sx={{
            ml: '-60px',
            mr: '-60px',
            mt: '-40px',
            position: 'relative',
            mb: headerIcon && iconMap[headerIcon] ? '36px' : '16px',
          }}
        >
          {/* Gradient banner */}
          <Box
            sx={{
              height: '180px',
              background: currentBgGradient,
              transition: 'background 0.5s ease',
            }}
          />

          {/* Bottom row: icon (floating) + action buttons */}
          <Box
            sx={{
              position: 'absolute',
              bottom: headerIcon && iconMap[headerIcon] ? '-36px' : 0,
              left: '60px',
              right: '60px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              px: 0,
              pb: headerIcon && iconMap[headerIcon] ? 0 : 1.5,
            }}
          >
            {/* Large icon card — sits on top of the cover edge */}
            {headerIcon && iconMap[headerIcon] ? (
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
                  {React.createElement(iconMap[headerIcon], {
                    sx: { fontSize: 30, color: 'text.primary' },
                  })}
                </Box>
              </Tooltip>
            ) : (
              <Box /> /* spacer so buttons stay right */
            )}

            {/* Ghost action buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                pb: headerIcon && iconMap[headerIcon] ? 1.5 : 0,
              }}
            >
              <Box onClick={handleIconClick} sx={ghostBtnSx(true)}>
                <EmojiPickerIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 600 }}>
                  {headerIcon ? 'Change icon' : 'Add icon'}
                </Typography>
              </Box>
              <Box onClick={handleColorClick} sx={ghostBtnSx(true)}>
                <CoverIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 600 }}>
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
            mb: headerIcon && iconMap[headerIcon] ? 1 : 1.5,
            transition: 'opacity 0.2s',
          }}
        >
          <Box onClick={handleIconClick} sx={ghostBtnSx(false)}>
            <EmojiPickerIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 600 }}>
              {headerIcon ? 'Change icon' : 'Add icon'}
            </Typography>
          </Box>
          <Box onClick={handleColorClick} sx={ghostBtnSx(false)}>
            <CoverIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 600 }}>
              Add cover
            </Typography>
          </Box>
        </Box>
      )}

      {/* ── LARGE ICON when no cover ── */}
      {!hasCover && headerIcon && iconMap[headerIcon] && (
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
            {React.createElement(iconMap[headerIcon], {
              sx: { fontSize: 32, color: 'text.primary' },
            })}
          </Box>
        </Tooltip>
      )}

      {/* ── FOLDER BADGE ── */}
      {currentFolder && (
        <FolderBadge bgColor={currentFolder.color}>
          <FolderIcon sx={{ fontSize: 12 }} />
          <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
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
            minWidth: 200,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        <MenuItem onClick={handleCreateTask} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#7c3aed' }}>
            <AutoAwesomeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Create task with AI"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>
        <MenuItem onClick={handleCreateResume} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#137fec' }}>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Create a resume"
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
          sx={{ px: 0.5, pb: 1, display: 'block', color: 'text.disabled', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}
        >
          Cover style
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.75 }}>
          {colorPalette.map((c) => (
            <Tooltip key={c.color} title={c.label} placement="top">
              <Box
                onClick={() => handleColorSelect(c.color)}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '8px',
                  background: c.gradient === 'none' ? (isThemeDark ? '#1e1e1e' : '#f0f0f0') : c.gradient,
                  cursor: 'pointer',
                  outline: headerColor === c.color ? '2.5px solid' : '1px solid',
                  outlineColor: headerColor === c.color ? 'primary.main' : 'divider',
                  outlineOffset: headerColor === c.color ? '2px' : '0px',
                  transition: 'all 0.18s',
                  position: 'relative',
                  '&:hover': { transform: 'scale(1.15)', outlineColor: 'primary.main' },
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
            borderRadius: '14px',
            minWidth: '260px',
            maxHeight: '360px',
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
          sx={{ px: 0.5, pb: 1, display: 'block', color: 'text.disabled', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}
        >
          Choose icon
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
          }}
        >
          {Object.keys(iconMap).map((iconName) => (
            <Tooltip key={iconName} title={iconName} placement="top">
              <Box
                onClick={() => handleIconSelect(iconName)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 34,
                  height: 34,
                  borderRadius: '9px',
                  cursor: 'pointer',
                  bgcolor: headerIcon === iconName ? 'primary.main' : 'transparent',
                  color: headerIcon === iconName ? 'primary.contrastText' : 'text.secondary',
                  border: '1px solid',
                  borderColor: headerIcon === iconName ? 'primary.main' : 'transparent',
                  transition: 'all 0.15s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'text.primary',
                    borderColor: 'divider',
                  },
                }}
              >
                {React.createElement(iconMap[iconName], { sx: { fontSize: 18 } })}
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Menu>
    </StyledEditorContent>
  );
};
