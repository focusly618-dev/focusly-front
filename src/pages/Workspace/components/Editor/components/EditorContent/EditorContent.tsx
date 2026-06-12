import React, { useState } from 'react';
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
import { sileo } from '@/utils/sileo';
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
  | 'pastel_pink'
  | 'pastel_rose'
  | 'pastel_coral'
  | 'pastel_peach'
  | 'pastel_orange'
  | 'pastel_yellow'
  | 'pastel_lime'
  | 'pastel_green'
  | 'pastel_mint'
  | 'pastel_teal'
  | 'pastel_cyan'
  | 'pastel_sky'
  | 'pastel_blue'
  | 'pastel_indigo'
  | 'pastel_violet'
  | 'pastel_purple'
  | 'pastel_magenta'
  | 'pastel_lavender'
  | 'pastel_gray'
  | 'pastel_slate'
  | 'none';

const colorPalette: { color: HeaderColor; gradient: string; label: string }[] =
  [
    { color: 'none', gradient: 'none', label: 'None' },
    {
      color: 'aurora',
      gradient: 'linear-gradient(135deg, #a5b4fc 0%, #c084fc 100%)',
      label: 'Aurora',
    },
    {
      color: 'sunset',
      gradient: 'linear-gradient(135deg, #fbcfe8 0%, #fda4af 100%)',
      label: 'Sunset',
    },
    {
      color: 'ocean',
      gradient: 'linear-gradient(135deg, #7dd3fc 0%, #67e8f9 100%)',
      label: 'Ocean',
    },
    {
      color: 'forest',
      gradient: 'linear-gradient(135deg, #99f6e4 0%, #86efac 100%)',
      label: 'Forest',
    },
    {
      color: 'midnight',
      gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      label: 'Midnight',
    },
    {
      color: 'rose',
      gradient: 'linear-gradient(135deg, #fecdd3 0%, #f9a8d4 100%)',
      label: 'Rose',
    },
    {
      color: 'golden',
      gradient: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
      label: 'Golden',
    },
    {
      color: 'cosmic',
      gradient: 'linear-gradient(135deg, #c4b5fd 0%, #a5b4fc 100%)',
      label: 'Cosmic',
    },
    {
      color: 'ember',
      gradient: 'linear-gradient(135deg, #fca5a5 0%, #f87171 100%)',
      label: 'Ember',
    },
    {
      color: 'dusk',
      gradient: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
      label: 'Dusk',
    },
    {
      color: 'arctic',
      gradient: 'linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%)',
      label: 'Arctic',
    },
    {
      color: 'spring',
      gradient: 'linear-gradient(135deg, #bef264 0%, #d9f99d 100%)',
      label: 'Spring',
    },
    {
      color: 'candy',
      gradient: 'linear-gradient(135deg, #f5d0fe 0%, #e9d5ff 100%)',
      label: 'Candy',
    },
    {
      color: 'neon',
      gradient: 'linear-gradient(135deg, #67e8f9 0%, #c084fc 100%)',
      label: 'Neon',
    },
    {
      color: 'borealis',
      gradient: 'linear-gradient(135deg, #86efac 0%, #5eead4 100%)',
      label: 'Borealis',
    },
    {
      color: 'royal',
      gradient: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
      label: 'Royal',
    },
    {
      color: 'grape',
      gradient: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)',
      label: 'Grape',
    },
    {
      color: 'kyoto',
      gradient: 'linear-gradient(135deg, #fecaca 0%, #fef08a 100%)',
      label: 'Kyoto',
    },
    {
      color: 'aqua',
      gradient: 'linear-gradient(135deg, #99f6e4 0%, #a5f3fc 100%)',
      label: 'Aqua',
    },
    {
      color: 'mauve',
      gradient: 'linear-gradient(135deg, #d8b4fe 0%, #c084fc 100%)',
      label: 'Mauve',
    },
    {
      color: 'shore',
      gradient: 'linear-gradient(135deg, #bae6fd 0%, #fef3c7 100%)',
      label: 'Shore',
    },
    {
      color: 'peach',
      gradient: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
      label: 'Peach',
    },
    {
      color: 'indigo',
      gradient: 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)',
      label: 'Indigo',
    },
    {
      color: 'nebula',
      gradient: 'linear-gradient(135deg, #e9d5ff 0%, #fbcfe8 100%)',
      label: 'Nebula',
    },
    {
      color: 'mint',
      gradient: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
      label: 'Mint',
    },
    {
      color: 'blood',
      gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      label: 'Blood',
    },
    {
      color: 'silver',
      gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      label: 'Silver',
    },
    {
      color: 'obsidian',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      label: 'Obsidian',
    },
    // Solid pastel colors
    {
      color: 'pastel_pink',
      gradient: '#fecdd3',
      label: 'Pastel Pink',
    },
    {
      color: 'pastel_rose',
      gradient: '#fda4af',
      label: 'Pastel Rose',
    },
    {
      color: 'pastel_coral',
      gradient: '#fca5a5',
      label: 'Pastel Coral',
    },
    {
      color: 'pastel_peach',
      gradient: '#ffedd5',
      label: 'Pastel Peach',
    },
    {
      color: 'pastel_orange',
      gradient: '#fed7aa',
      label: 'Pastel Orange',
    },
    {
      color: 'pastel_yellow',
      gradient: '#fef08a',
      label: 'Pastel Yellow',
    },
    {
      color: 'pastel_lime',
      gradient: '#bef264',
      label: 'Pastel Lime',
    },
    {
      color: 'pastel_green',
      gradient: '#86efac',
      label: 'Pastel Green',
    },
    {
      color: 'pastel_mint',
      gradient: '#99f6e4',
      label: 'Pastel Mint',
    },
    {
      color: 'pastel_teal',
      gradient: '#5eead4',
      label: 'Pastel Teal',
    },
    {
      color: 'pastel_cyan',
      gradient: '#67e8f9',
      label: 'Pastel Cyan',
    },
    {
      color: 'pastel_sky',
      gradient: '#7dd3fc',
      label: 'Pastel Sky',
    },
    {
      color: 'pastel_blue',
      gradient: '#a5b4fc',
      label: 'Pastel Blue',
    },
    {
      color: 'pastel_indigo',
      gradient: '#c7d2fe',
      label: 'Pastel Indigo',
    },
    {
      color: 'pastel_violet',
      gradient: '#c4b5fd',
      label: 'Pastel Violet',
    },
    {
      color: 'pastel_purple',
      gradient: '#d8b4fe',
      label: 'Pastel Purple',
    },
    {
      color: 'pastel_magenta',
      gradient: '#f5d0fe',
      label: 'Pastel Magenta',
    },
    {
      color: 'pastel_lavender',
      gradient: '#e9d5ff',
      label: 'Pastel Lavender',
    },
    {
      color: 'pastel_gray',
      gradient: '#e2e8f0',
      label: 'Pastel Gray',
    },
    {
      color: 'pastel_slate',
      gradient: '#cbd5e1',
      label: 'Pastel Slate',
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

  const persistedEmoji = watch?.('emoji');
  const persistedBg = watch?.('background_color');

  const [menuAnchor, setMenuAnchor] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [colorAnchor, setColorAnchor] = useState<null | HTMLElement>(null);
  const [iconAnchor, setIconAnchor] = useState<null | HTMLElement>(null);
  const headerColor: HeaderColor =
    (persistedBg as HeaderColor | undefined) ?? 'none';
  const headerIcon: string = persistedEmoji ?? '';

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

  const currentBgGradient =
    colorPalette.find((c) => c.color === headerColor)?.gradient || 'none';
  const hasCover = headerColor !== 'none';

  const handleColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorAnchor(event.currentTarget);
  };

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setIconAnchor(event.currentTarget);
  };

  const handleColorSelect = (color: HeaderColor) => {
    setValue?.('background_color', color === 'none' ? undefined : color);
    setColorAnchor(null);
  };

  const handleIconSelect = (iconName: string) => {
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

  const translateText = async (
    text: string,
    toLang: string,
  ): Promise<string> => {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=Autodetect|${toLang}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
      throw new Error('No translation returned');
    } catch (err) {
      console.error('Translation error:', err);
      return text;
    }
  };

  const getLanguageLabel = (code: string) => {
    if (code === 'auto') return 'Detect Language';
    if (code === 'es') return 'Spanish';
    if (code === 'en') return 'English';
    if (code === 'fr') return 'French';
    if (code === 'de') return 'German';
    if (code === 'it') return 'Italian';
    if (code === 'pt') return 'Portuguese';
    return '';
  };

  const handleCreateTask = () => {
    handleClose();
    sileo.success({
      title: 'Task created!',
      description: `New task created from selection: "${selectedText.slice(0, 30)}..."`,
      fill: 'var(--sileo-success-bg)',
      duration: 3000,
    });
  };

  const processTextWithAI = async (action: string) => {
    handleClose();
    if (!selectedText) return;

    let promptDescription = 'Processing text...';
    let successTitle = 'Text updated';
    let resultText = selectedText;

    if (action === 'grammar') {
      promptDescription = 'Fixing grammar and spelling...';
      successTitle = 'Grammar & spelling fixed';
      let temp = selectedText.trim();
      if (temp.length > 0) {
        temp = temp.charAt(0).toUpperCase() + temp.slice(1);
        if (!temp.endsWith('.') && !temp.endsWith('!') && !temp.endsWith('?')) {
          temp += '.';
        }
      }
      resultText = temp;
    } else if (action === 'summarize') {
      promptDescription = 'Creating summary...';
      successTitle = 'Summary generated';
      resultText = `Summary: "${selectedText.slice(0, 100)}..."`;
    } else if (action === 'expand') {
      promptDescription = 'Expanding text...';
      successTitle = 'Text expanded';
      resultText = `${selectedText} (This point is critical for our strategic alignment. We need to ensure all team members understand the implications and coordinate their efforts to execute this phase efficiently.)`;
    } else if (action === 'shorten') {
      promptDescription = 'Shortening text...';
      successTitle = 'Text condensed';
      resultText =
        selectedText.length > 60
          ? `${selectedText.slice(0, 50)}...`
          : selectedText;
    } else if (action.startsWith('translate_')) {
      const langCode = action.replace('translate_', '');
      const langLabel = getLanguageLabel(langCode);
      promptDescription = `Translating to ${langLabel}...`;
      successTitle = `Translated to ${langLabel}`;
      resultText = await translateText(selectedText, langCode);
    } else if (action === 'tone_professional') {
      promptDescription = 'Changing tone to professional...';
      successTitle = 'Tone changed to Professional';
      resultText = `We should professionally note that: ${selectedText}`;
    } else if (action === 'tone_casual') {
      promptDescription = 'Changing tone to casual...';
      successTitle = 'Tone changed to Casual';
      resultText = `Hey, just so you know: ${selectedText} 😊`;
    }

    try {
      await sileo.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
        loading: {
          title: 'AI Assistant',
          description: promptDescription,
          fill: 'var(--sileo-info-bg)',
        },
        success: {
          title: successTitle,
          description: 'The selected text has been updated.',
          fill: 'var(--sileo-success-bg)',
          duration: 3000,
        },
        error: {
          title: 'AI Processing Error',
          description: 'Could not refine the selected text.',
          fill: 'var(--sileo-error-bg)',
        },
      });

      editor.insertInlineContent([
        {
          type: 'text',
          text: resultText,
          styles: {},
        },
      ]);
    } catch (e) {
      console.error(e);
    }
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
            ml: '-60px',
            mr: '-60px',
            mt: '-40px',
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
              left: '60px',
              right: '60px',
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
                  sx={{ color: 'inherit', fontWeight: 600 }}
                >
                  {headerIcon ? 'Change icon' : 'Add icon'}
                </Typography>
              </Box>
              <Box onClick={handleColorClick} sx={ghostBtnSx(true)}>
                <CoverIcon sx={{ fontSize: 14 }} />
                <Typography
                  variant="caption"
                  sx={{ color: 'inherit', fontWeight: 600 }}
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
              sx={{ color: 'inherit', fontWeight: 600 }}
            >
              {headerIcon ? 'Change icon' : 'Add icon'}
            </Typography>
          </Box>
          <Box onClick={handleColorClick} sx={ghostBtnSx(false)}>
            <CoverIcon sx={{ fontSize: 14 }} />
            <Typography
              variant="caption"
              sx={{ color: 'inherit', fontWeight: 600 }}
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
