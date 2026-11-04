import type { Locale } from 'date-fns';
import {
  de,
  enGB,
  enUS,
  es,
  fr,
  it,
  ja,
  ko,
  ptBR,
  zhCN,
} from 'date-fns/locale';

// Dates in the app's language, for the places that format them with
// date-fns (the calendar and its titles). Intl formatting takes the
// language code itself ("pt-BR", "zh-CN") and needs nothing here.

/** date-fns locales by app language code. */
export const DATE_LOCALES: Record<string, Locale> = {
  es,
  en: enUS,
  'en-GB': enGB,
  'pt-BR': ptBR,
  fr,
  de,
  it,
  ja,
  ko,
  'zh-CN': zhCN,
};

/** The app language as a key of DATE_LOCALES: its own code, else its base
 * language ("en-AU" → "en"), else English. */
export const dateLanguage = (language?: string): string => {
  if (language && language in DATE_LOCALES) return language;
  const base = language?.split('-')[0];
  return base && base in DATE_LOCALES ? base : 'en';
};

export const dateFnsLocale = (language?: string): Locale =>
  DATE_LOCALES[dateLanguage(language)];

/** A day's title per date-fns locale: "Lunes, 12 de octubre", "Monday,
 * October 12", "Montag, 12. Oktober", "10月12日 月曜日". */
export const DAY_TITLE_FORMATS: Record<string, string> = {
  es: "EEEE, d 'de' MMMM",
  'en-US': 'EEEE, MMMM d',
  'en-GB': 'EEEE d MMMM',
  'pt-BR': "EEEE, d 'de' MMMM",
  fr: 'EEEE d MMMM',
  de: 'EEEE, d. MMMM',
  it: 'EEEE d MMMM',
  ja: 'M月d日 EEEE',
  ko: 'M월 d일 EEEE',
  'zh-CN': 'M月d日 EEEE',
};
