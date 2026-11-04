import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './locales/es/translation.json';
import en from './locales/en/translation.json';
import enGB from './locales/en-GB/translation.json';
import ptBR from './locales/pt-BR/translation.json';
import fr from './locales/fr/translation.json';
import de from './locales/de/translation.json';
import it from './locales/it/translation.json';
import ja from './locales/ja/translation.json';
import ko from './locales/ko/translation.json';
import zhCN from './locales/zh-CN/translation.json';

export const SUPPORTED_LANGUAGES = [
  'es',
  'en',
  'en-GB',
  'pt-BR',
  'fr',
  'de',
  'it',
  'ja',
  'ko',
  'zh-CN',
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

// Each language under its own name, in the order the pickers list them
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
  {
    code: 'en',
    label: 'English (US)',
    nativeLabel: 'English (US)',
    flag: '🇺🇸',
  },
  {
    code: 'en-GB',
    label: 'English (UK)',
    nativeLabel: 'English (UK)',
    flag: '🇬🇧',
  },
  {
    code: 'pt-BR',
    label: 'Portuguese (Brazil)',
    nativeLabel: 'Português (Brasil)',
    flag: '🇧🇷',
  },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어', flag: '🇰🇷' },
  {
    code: 'zh-CN',
    label: 'Chinese (Simplified)',
    nativeLabel: '简体中文',
    flag: '🇨🇳',
  },
];

const LANGUAGE_STORAGE_KEY = 'focusly-language';

const isSupported = (lang: string | null): lang is SupportedLanguage =>
  !!lang && (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);

const getInitialLanguage = (): SupportedLanguage => {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isSupported(stored) ? stored : 'es';
};

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    'en-GB': { translation: enGB },
    'pt-BR': { translation: ptBR },
    fr: { translation: fr },
    de: { translation: de },
    it: { translation: it },
    ja: { translation: ja },
    ko: { translation: ko },
    'zh-CN': { translation: zhCN },
  },

  lng: getInitialLanguage(),
  // UK English only holds what differs from US English; anything a language
  // lacks shows in English
  fallbackLng: { 'en-GB': ['en'], default: ['en'] },
  // Codes like "pt-BR" are languages of their own, not "pt" + a region
  load: 'currentOnly',
  supportedLngs: [...SUPPORTED_LANGUAGES],

  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  // The page's own language, for screen readers, fonts and hyphenation
  if (typeof document !== 'undefined') document.documentElement.lang = lng;
});
if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
}

export const changeLanguage = (lang: SupportedLanguage) => {
  i18n.changeLanguage(lang);
};

/** The language without its region: "pt-BR" → "pt", "en-GB" → "en". */
export const baseLanguage = (lang?: string) => (lang || 'es').split('-')[0];

export default i18n;
