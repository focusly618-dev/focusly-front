import { useTranslation } from 'react-i18next';
import { es } from './es';
import { en } from './en';
import { ja } from './ja';
import { ptBR } from './pt-BR';
import { fr } from './fr';
import { de } from './de';
import { it } from './it';
import { ko } from './ko';
import { zhCN } from './zh-CN';
import type { SiteContent } from './types';

export type { SiteContent } from './types';

const CONTENT: Record<string, SiteContent> = {
  es,
  en,
  ja,
  'pt-BR': ptBR,
  fr,
  de,
  it,
  ko,
  'zh-CN': zhCN,
};

/** Site copy in the app's current language: its own ("pt-BR"), else its base
 * language's ("en-GB" reads the English one), else English. `lang` is the
 * one shown. */
export const useSiteContent = (): { c: SiteContent; lang: string } => {
  const { i18n } = useTranslation();
  const language = i18n.language || 'es';
  const lang = [language, language.split('-')[0]].find((l) => l in CONTENT);
  return lang ? { c: CONTENT[lang], lang } : { c: en, lang: 'en' };
};

/** Replaces "{name}"-style placeholders in a template string. */
export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
