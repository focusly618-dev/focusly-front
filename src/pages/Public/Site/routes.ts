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
      'captura · apuntes por asignatura',
      'captura · modo enfoque',
    ],
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
      'captura · plan semanal',
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
      'captura · documento técnico',
      'captura · ventana dorada',
    ],
  },
  creators: {
    path: '/for/creators',
    icon: 'videocam',
    navKey: 'who',
    related: ['tasks', 'workspaces', 'calendar'],
    media: img('calendario de contenido'),
    blockMedia: [
      'captura · tarea con subtareas',
      'captura · guion',
      'captura · calendario de publicación',
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
