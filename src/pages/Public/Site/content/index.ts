import { useTranslation } from 'react-i18next';
import { es } from './es';
import { en } from './en';
import { ja } from './ja';
import type { SiteContent } from './types';

export type { SiteContent } from './types';

const CONTENT: Record<string, SiteContent> = { es, en, ja };

/** Site copy in the app's current language (Spanish as the fallback). */
export const useSiteContent = (): { c: SiteContent; lang: string } => {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'es').split('-')[0];
  return { c: CONTENT[lang] ?? es, lang: CONTENT[lang] ? lang : 'es' };
};

/** Replaces "{name}"-style placeholders in a template string. */
export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
