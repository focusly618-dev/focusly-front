import type { IconName } from '../icons';
import type { PageSlug, PlanKey, ProductColumnKey } from '../routes';

export interface Named {
  name: string;
  desc: string;
  /** Shorter label for the footer, when the name is long. */
  short?: string;
}

export interface IconText {
  icon: IconName;
  title: string;
  desc: string;
}

export interface PageText {
  /** Breadcrumb label, e.g. "Producto · Planifica". */
  group: string;
  title: string;
  sub: string;
  /** [title, description] of each content block, matching PAGES[slug].blockMedia. */
  blocks?: [string, string][];
  /** Label of the secondary hero button when it isn't "see pricing". */
  cta2?: string;
}

/** All the copy of the public site in one language. */
export interface SiteContent {
  /** Name and one-line description of every page (menus, related cards). */
  items: Record<PageSlug, Named>;
  pages: Record<PageSlug, PageText>;

  nav: {
    homeAria: string;
    mainAria: string;
    product: string;
    lumina: string;
    who: string;
    pricing: string;
    resources: string;
    login: string;
    start: string;
    openApp: string;
    language: string;
    openMenu: string;
    closeMenu: string;
    menu: string;
    /** "{name}" is replaced by the current theme's name. */
    themeAria: string;
    columns: Record<ProductColumnKey, string>;
    luminaCard: { title: string; desc: string; cta: string; prompt: string };
  };

  themes: { light: string; dark: string; graydark: string };

  hero: {
    h1: string;
    sub: string;
    cta: string;
    demo: string;
    micro: string;
    prompt: string;
    thinking: string;
    plan: string;
    add: string;
    added: string;
    placeholder: string;
    items: [string, string, string, string];
    durations: [string, string, string, string];
    days: [string, string, string, string, string];
    events: [string, string, string];
    alt: string;
  };

  trust: { integrates: string; logoTitle: string; beta: string; aria: string };

  problem: {
    eyebrow: string;
    title: string;
    sub: string;
    pains: { icon: IconName; title: string; desc: string; fix: string }[];
  };

  pillars: {
    eyebrow: string;
    title: string;
    tabsAria: string;
    tabs: {
      icon: IconName;
      label: string;
      title: string;
      bullets: [string, string, string];
    }[];
  };

  lumina: {
    eyebrow: string;
    title: string;
    sub: string;
    caps: IconText[];
    demo: {
      aria: string;
      before: string;
      mention: string;
      thinking: string;
      planTitle: string;
      tasks: [string, string][];
      create: string;
      created: string;
      input: string;
    };
  };

  how: { eyebrow: string; title: string; steps: IconText[] };

  insights: {
    eyebrow: string;
    title: string;
    sub: string;
    week: string;
    sample: string;
    focusHours: string;
    tasksDone: string;
    energy: string;
    golden: string;
    barsTitle: string;
    days: [string, string, string, string, string, string, string];
    heatmapTitle: string;
    goldenLegend: string;
    hoursUnit: string;
  };

  whoSection: { eyebrow: string; title: string };

  beta: {
    title: string;
    sub: string;
    emailLabel: string;
    placeholder: string;
    submit: string;
  };

  pricing: {
    eyebrow: string;
    title: string;
    monthly: string;
    annual: string;
    annualAria: string;
    save: string;
    recommended: string;
    perMonth: string;
    perMonthAnnual: string;
    compareAll: string;
    compareTitle: string;
    feature: string;
    note: string;
    plans: Record<
      PlanKey,
      { name: string; desc: string; cta: string; feats: string[] }
    >;
    /** [feature, free, pro, business] */
    table: [string, string, string, string][];
  };

  security: {
    eyebrow: string;
    title: string;
    terms: string;
    privacy: string;
    items: IconText[];
  };

  faq: { title: string; items: [string, string][] };

  finalCta: { title: string; sub: string; cta: string; micro: string };

  footer: {
    tagline: string;
    product: string;
    resources: string;
    legal: string;
    terms: string;
    privacy: string;
    language: string;
    theme: string;
  };

  demoModal: { aria: string; close: string };

  page: {
    breadcrumbAria: string;
    home: string;
    seePricing: string;
    explore: string;
    finalTitle: string;
    useTemplate: string;
    preview: string;
    filterTemplates: string;
    helpSearchLabel: string;
    helpPlaceholder: string;
    /** "{q}" is replaced by the search query. */
    helpEmpty: string;
    helpContactTitle: string;
    helpContactDesc: string;
    helpContact: string;
  };

  help: IconText[];
  changelog: {
    version: string;
    date: string;
    tag: string;
    title: string;
    desc: string;
  }[];
  templateCategories: [string, ...string[]];
  templates: { cat: string; name: string; desc: string }[];
}
