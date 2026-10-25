import type { IconName } from './icons';

// Every public page of the site, keyed by a stable slug. Texts live in
// ./content/<lang>.ts; this file holds what doesn't change per language.
export type PageSlug =
  | 'tasks'
  | 'calendar'
  | 'planner'
  | 'focus'
  | 'timeBlocks'
  | 'workspaces'
  | 'projects'
  | 'insights'
  | 'lumina'
  | 'templates'
  | 'students'
  | 'freelancers'
  | 'developers'
  | 'creators'
  | 'pricing'
  | 'help'
  | 'changelog';

/** Navbar entry a page belongs to (drives the active highlight). */
export type NavKey = 'product' | 'lumina' | 'who' | 'pricing' | 'resources';

export type PageType = 'pricing' | 'help' | 'log' | 'tpl';

export interface PageMeta {
  path: string;
  icon: IconName;
  navKey: NavKey;
  type?: PageType;
  related: PageSlug[];
  /** Secondary hero button target; defaults to the pricing page. */
  cta2?: PageSlug;
  /** Placeholder describing the hero media still to be produced. */
  media?: string;
  /** Placeholders for each content block's media, in block order. */
  blockMedia?: string[];
  /** Loop video (see LoopVideo and VITE_MEDIA_BASE_URL) replacing the hero placeholder. */
  video?: string;
  /** Loop videos replacing the block placeholders, in block order. */
  blockVideos?: string[];
}

const img = (what: string) =>
  `captura · ${what}\nWebP/AVIF + srcset · claro/oscuro`;
const loop = (what: string) =>
  `video en bucle · ${what}\nMP4/WebM < 2 MB · póster · claro/oscuro`;

export const PAGES: Record<PageSlug, PageMeta> = {
  tasks: {
    path: '/product/tasks',
    icon: 'checklist',
    navKey: 'product',
    related: ['calendar', 'planner', 'focus'],
    media: img('vista de tareas'),
    blockMedia: [
      'captura · bandeja / hoy / próximos',
      'captura · tarea con prioridad y etiquetas',
      'captura · subtareas + temporizador',
    ],
    video: 'tasks-hero',
    blockVideos: ['tasks-views', 'tasks-priority', 'tasks-subtasks'],
  },
  calendar: {
    path: '/product/calendar',
    icon: 'calendar_month',
    navKey: 'product',
    related: ['planner', 'timeBlocks', 'tasks'],
    media: img('calendario semanal sincronizado'),
    blockMedia: [
      'captura · eventos sincronizados',
      'captura · semana con bloques de enfoque',
      'captura · confirmar bloques',
    ],
    video: 'calendar-hero',
    blockVideos: ['calendar-sync', 'calendar-layers', 'calendar-confirm'],
  },
  planner: {
    path: '/product/planner',
    icon: 'auto_awesome',
    navKey: 'product',
    related: ['lumina', 'timeBlocks', 'calendar'],
    media: loop('planificador semanal con IA'),
    blockMedia: [
      'captura · ajustes de horario laboral',
      'captura · plan propuesto por Lumina',
      'captura · plan en Google Calendar',
    ],
    video: 'planner-hero',
    blockVideos: ['planner-hours', 'planner-review', 'planner-gcal'],
  },
  focus: {
    path: '/product/focus',
    icon: 'timer',
    navKey: 'product',
    related: ['timeBlocks', 'insights', 'tasks'],
    media: loop('modo enfoque'),
    blockMedia: [
      'captura · temporizador activo',
      'captura · descanso',
      'captura · resumen de sesión',
    ],
    video: 'focus-hero',
    blockVideos: ['focus-timer', 'focus-breaks', 'focus-insights'],
  },
  timeBlocks: {
    path: '/product/time-blocks',
    icon: 'view_timeline',
    navKey: 'product',
    related: ['planner', 'calendar', 'focus'],
    media: img('bloques de tiempo en la semana'),
    blockMedia: [
      'captura · propuesta de bloques',
      'captura · confirmar',
      'captura · bloque en Google Calendar',
    ],
    video: 'timeblocks-hero',
    blockVideos: [
      'timeblocks-suggest',
      'timeblocks-confirm',
      'timeblocks-gcal',
    ],
  },
  workspaces: {
    path: '/product/workspaces',
    icon: 'description',
    navKey: 'product',
    related: ['projects', 'templates', 'lumina'],
    media: img('editor Markdown con vista previa'),
    blockMedia: [
      'captura · editor dividido',
      'captura · árbol de proyectos',
      'captura · mención @ en el chat',
    ],
    video: 'workspaces-hero',
    blockVideos: ['workspaces-syntax', 'workspaces-projects', 'workspaces-ask'],
  },
  projects: {
    path: '/product/projects',
    icon: 'folder_open',
    navKey: 'product',
    related: ['workspaces', 'templates', 'tasks'],
    media: img('vista de proyecto'),
    blockMedia: [
      'captura · proyecto con documentos',
      'captura · nuevo proyecto desde plantilla',
      'captura · chat con contexto',
    ],
    video: 'projects-hero',
    blockVideos: ['projects-space', 'projects-templates', 'projects-context'],
  },
  insights: {
    path: '/product/insights',
    icon: 'insights',
    navKey: 'product',
    related: ['focus', 'planner', 'timeBlocks'],
    media: img('panel de Insights'),
    blockMedia: [
      'captura · métricas semanales',
      'captura · energía',
      'captura · ventana dorada',
      'captura · mapa de calor',
    ],
    video: 'insights-hero',
    blockVideos: [
      'insights-hours',
      'insights-energy',
      'insights-golden',
      'insights-heatmap',
    ],
  },
  lumina: {
    path: '/lumina',
    icon: 'auto_awesome',
    navKey: 'lumina',
    related: ['planner', 'timeBlocks', 'workspaces'],
    cta2: 'planner',
    media: loop('chat con Lumina'),
    blockMedia: [
      'captura · plan generado',
      'captura · bloques propuestos',
      'captura · adjunto en el chat',
      'captura · preferencias',
      'diagrama · qué datos usa Lumina',
    ],
    video: 'lumina-hero',
    blockVideos: [
      'lumina-plan',
      'lumina-blocks',
      'lumina-context',
      'lumina-memory',
      'lumina-privacy',
    ],
  },
  templates: {
    path: '/templates',
    icon: 'dashboard_customize',
    navKey: 'resources',
    type: 'tpl',
    related: ['workspaces', 'projects', 'help'],
  },
  students: {
    path: '/for/students',
    icon: 'school',
    navKey: 'who',
    related: ['planner', 'workspaces', 'focus'],
    media: img('semana de exámenes'),
    blockMedia: [
      'captura · plan de estudio',
      'captura · temario en PDF convertido en plan',
      'captura · modo enfoque',
    ],
    video: 'students-hero',
    blockVideos: ['students-study-plan', 'students-syllabus', 'students-focus'],
  },
  freelancers: {
    path: '/for/freelancers',
    icon: 'work',
    navKey: 'who',
    related: ['projects', 'tasks', 'planner'],
    media: img('semana con varios clientes'),
    blockMedia: [
      'captura · proyectos por cliente',
      'captura · registro de tiempo',
      'captura · tarea con enlace de Meet',
    ],
    video: 'freelancers-hero',
    blockVideos: [
      'freelancers-clients',
      'freelancers-time',
      'freelancers-meetings',
    ],
  },
  developers: {
    path: '/for/developers',
    icon: 'code',
    navKey: 'who',
    related: ['timeBlocks', 'workspaces', 'insights'],
    media: img('semana con bloques de enfoque'),
    blockMedia: [
      'captura · bloques entre reuniones',
      'captura · tablero Kanban del sprint',
      'captura · ventana dorada',
    ],
    video: 'developers-hero',
    blockVideos: ['developers-gaps', 'developers-board', 'developers-golden'],
  },
  creators: {
    path: '/for/creators',
    icon: 'videocam',
    navKey: 'who',
    related: ['tasks', 'workspaces', 'calendar'],
    media: img('calendario de contenido'),
    blockMedia: [
      'captura · tarea con subtareas',
      'captura · Lumina reescribiendo el guion',
      'captura · calendario de publicación',
    ],
    video: 'creators-hero',
    blockVideos: [
      'creators-subtasks',
      'creators-ai-script',
      'creators-publish',
    ],
  },
  pricing: {
    path: '/pricing',
    icon: 'sell',
    navKey: 'pricing',
    type: 'pricing',
    related: ['lumina', 'help', 'changelog'],
  },
  help: {
    path: '/help',
    icon: 'help',
    navKey: 'resources',
    type: 'help',
    related: ['changelog', 'templates', 'pricing'],
  },
  changelog: {
    path: '/changelog',
    icon: 'new_releases',
    navKey: 'resources',
    type: 'log',
    related: ['help', 'templates', 'lumina'],
  },
};

export const PAGE_SLUGS = Object.keys(PAGES) as PageSlug[];

/** Navbar "Producto" mega menu: column keys and the pages in each. */
export const PRODUCT_COLUMNS = [
  { key: 'plan', slugs: ['tasks', 'calendar', 'planner'] },
  { key: 'focus', slugs: ['focus', 'timeBlocks'] },
  { key: 'organize', slugs: ['workspaces', 'projects', 'templates'] },
  { key: 'understand', slugs: ['insights'] },
] as const satisfies readonly { key: string; slugs: readonly PageSlug[] }[];

export type ProductColumnKey = (typeof PRODUCT_COLUMNS)[number]['key'];

export const WHO_SLUGS = [
  'students',
  'freelancers',
  'developers',
  'creators',
] as const satisfies readonly PageSlug[];

export const RESOURCE_SLUGS = [
  'help',
  'changelog',
  'templates',
] as const satisfies readonly PageSlug[];

/** Home sections the navbar highlights while they're on screen. */
export const SPY_SECTIONS: Record<string, NavKey> = {
  producto: 'product',
  lumina: 'lumina',
  'para-quien': 'who',
  precios: 'pricing',
};

/** Account creation lives on the login screen's sign-up tab. */
export const SIGNUP_PATH = '/login?mode=signup';

// Prices and limits: the single place the landing and the pricing page read
// them from. Fill in the real values here.
export const PRICING = {
  free: { monthly: '$0', annual: '$0' },
  pro: { monthly: '[PRECIO]', annual: '[PRECIO]' },
  business: { monthly: '[PRECIO]', annual: '[PRECIO]' },
} as const;

export type PlanKey = keyof typeof PRICING;

/** Support address shown in the help center once it's defined. */
export const SUPPORT_EMAIL = '';
