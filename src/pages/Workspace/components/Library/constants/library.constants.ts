import {
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

export const colorPaletteMap: Record<
  string,
  { gradient: string; isLight: boolean }
> = {
  aurora: {
    gradient: 'linear-gradient(135deg, #a5b4fc 0%, #c084fc 100%)',
    isLight: true,
  },
  sunset: {
    gradient: 'linear-gradient(135deg, #fbcfe8 0%, #fda4af 100%)',
    isLight: true,
  },
  ocean: {
    gradient: 'linear-gradient(135deg, #7dd3fc 0%, #67e8f9 100%)',
    isLight: true,
  },
  forest: {
    gradient: 'linear-gradient(135deg, #99f6e4 0%, #86efac 100%)',
    isLight: true,
  },
  midnight: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    isLight: false,
  },
  rose: {
    gradient: 'linear-gradient(135deg, #fecdd3 0%, #f9a8d4 100%)',
    isLight: true,
  },
  golden: {
    gradient: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)',
    isLight: true,
  },
  cosmic: {
    gradient: 'linear-gradient(135deg, #c4b5fd 0%, #a5b4fc 100%)',
    isLight: true,
  },
  ember: {
    gradient: 'linear-gradient(135deg, #fca5a5 0%, #f87171 100%)',
    isLight: true,
  },
  dusk: {
    gradient: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
    isLight: true,
  },
  arctic: {
    gradient: 'linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%)',
    isLight: true,
  },
  spring: {
    gradient: 'linear-gradient(135deg, #bef264 0%, #d9f99d 100%)',
    isLight: true,
  },
  candy: {
    gradient: 'linear-gradient(135deg, #f5d0fe 0%, #e9d5ff 100%)',
    isLight: true,
  },
  neon: {
    gradient: 'linear-gradient(135deg, #67e8f9 0%, #c084fc 100%)',
    isLight: true,
  },
  borealis: {
    gradient: 'linear-gradient(135deg, #86efac 0%, #5eead4 100%)',
    isLight: true,
  },
  royal: {
    gradient: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
    isLight: false,
  },
  grape: {
    gradient: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)',
    isLight: true,
  },
  kyoto: {
    gradient: 'linear-gradient(135deg, #fecaca 0%, #fef08a 100%)',
    isLight: true,
  },
  aqua: {
    gradient: 'linear-gradient(135deg, #99f6e4 0%, #a5f3fc 100%)',
    isLight: true,
  },
  mauve: {
    gradient: 'linear-gradient(135deg, #d8b4fe 0%, #c084fc 100%)',
    isLight: true,
  },
  shore: {
    gradient: 'linear-gradient(135deg, #bae6fd 0%, #fef3c7 100%)',
    isLight: true,
  },
  peach: {
    gradient: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    isLight: true,
  },
  indigo: {
    gradient: 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)',
    isLight: true,
  },
  nebula: {
    gradient: 'linear-gradient(135deg, #e9d5ff 0%, #fbcfe8 100%)',
    isLight: true,
  },
  mint: {
    gradient: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
    isLight: true,
  },
  blood: {
    gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    isLight: true,
  },
  silver: {
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    isLight: true,
  },
  obsidian: {
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    isLight: false,
  },
  // Solid pastel colors without gradients
  pastel_pink: {
    gradient: '#fecdd3',
    isLight: true,
  },
  pastel_rose: {
    gradient: '#fda4af',
    isLight: true,
  },
  pastel_coral: {
    gradient: '#fca5a5',
    isLight: true,
  },
  pastel_peach: {
    gradient: '#ffedd5',
    isLight: true,
  },
  pastel_orange: {
    gradient: '#fed7aa',
    isLight: true,
  },
  pastel_yellow: {
    gradient: '#fef08a',
    isLight: true,
  },
  pastel_lime: {
    gradient: '#bef264',
    isLight: true,
  },
  pastel_green: {
    gradient: '#86efac',
    isLight: true,
  },
  pastel_mint: {
    gradient: '#99f6e4',
    isLight: true,
  },
  pastel_teal: {
    gradient: '#5eead4',
    isLight: true,
  },
  pastel_cyan: {
    gradient: '#67e8f9',
    isLight: true,
  },
  pastel_sky: {
    gradient: '#7dd3fc',
    isLight: true,
  },
  pastel_blue: {
    gradient: '#a5b4fc',
    isLight: true,
  },
  pastel_indigo: {
    gradient: '#c7d2fe',
    isLight: true,
  },
  pastel_violet: {
    gradient: '#c4b5fd',
    isLight: true,
  },
  pastel_purple: {
    gradient: '#d8b4fe',
    isLight: true,
  },
  pastel_magenta: {
    gradient: '#f5d0fe',
    isLight: true,
  },
  pastel_lavender: {
    gradient: '#e9d5ff',
    isLight: true,
  },
  pastel_gray: {
    gradient: '#e2e8f0',
    isLight: true,
  },
  pastel_slate: {
    gradient: '#cbd5e1',
    isLight: true,
  },
};

export const iconMap: Record<string, React.ElementType> = {
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
