import type { ICalendarEvent } from './CalendarEvent.types';
import type { Task } from '@/redux/tasks/task.types';

export interface SemanticTheme {
  key: 'deep_work' | 'wellness' | 'habits' | 'ritual' | 'rhythm';
  label: string;
  borderColor: string;
  borderLight: string;
  borderDark: string;
  borderGray: string;
  bgLight: string;
  bgDark: string;
  bgGray: string;
  hoverLight: string;
  hoverDark: string;
  hoverGray: string;
  tagBgLight: string;
  tagBgDark: string;
  tagBorderLight: string;
  tagBorderDark: string;
  textColorLight: string;
  textColorDark: string;
  tagColor: string;
  tagColorLight: string;
  tagColorDark: string;
}

export const SEMANTIC_THEMES: Record<SemanticTheme['key'], SemanticTheme> = {
  deep_work: {
    key: 'deep_work',
    label: 'Deep Work',
    borderColor: '#94a3b8',
    borderLight: '#cbd5e1',
    borderDark: '#273240',
    borderGray: '#2d3847',
    bgLight: '#f8fafc',
    bgDark: '#131821',
    bgGray: '#1c222b',
    hoverLight: '#f1f5f9',
    hoverDark: '#1a212d',
    hoverGray: '#232a35',
    tagBgLight: '#e2e8f0',
    tagBgDark: '#1e2633',
    tagBorderLight: '#cbd5e1',
    tagBorderDark: '#2c394c',
    textColorLight: '#334155',
    textColorDark: '#94a3b8',
    tagColor: '#475569',
    tagColorLight: '#475569',
    tagColorDark: '#94a3b8',
  },
  wellness: {
    key: 'wellness',
    label: 'Salud',
    borderColor: '#86a789',
    borderLight: '#c6d8c8',
    borderDark: '#203326',
    borderGray: '#24382b',
    bgLight: '#f4f7f4',
    bgDark: '#111914',
    bgGray: '#1b231d',
    hoverLight: '#eaf0eb',
    hoverDark: '#17231c',
    hoverGray: '#212c24',
    tagBgLight: '#dbe5dc',
    tagBgDark: '#19291f',
    tagBorderLight: '#c2d4c4',
    tagBorderDark: '#273e30',
    textColorLight: '#284635',
    textColorDark: '#86a789',
    tagColor: '#3b654c',
    tagColorLight: '#3b654c',
    tagColorDark: '#86a789',
  },
  habits: {
    key: 'habits',
    label: 'Hábito',
    borderColor: '#d4b28c',
    borderLight: '#e2d1bd',
    borderDark: '#33281d',
    borderGray: '#392d21',
    bgLight: '#faf7f2',
    bgDark: '#191511',
    bgGray: '#221e18',
    hoverLight: '#f3ece3',
    hoverDark: '#221d17',
    hoverGray: '#2a251e',
    tagBgLight: '#eee3d3',
    tagBgDark: '#2a2016',
    tagBorderLight: '#dfccb5',
    tagBorderDark: '#403122',
    textColorLight: '#553922',
    textColorDark: '#d4b28c',
    tagColor: '#7c5835',
    tagColorLight: '#7c5835',
    tagColorDark: '#d4b28c',
  },
  ritual: {
    key: 'ritual',
    label: 'Ritual',
    borderColor: '#b8a5c9',
    borderLight: '#d4c6de',
    borderDark: '#2f2038',
    borderGray: '#35253f',
    bgLight: '#f8f5fa',
    bgDark: '#18121d',
    bgGray: '#211c26',
    hoverLight: '#f0ebf5',
    hoverDark: '#211927',
    hoverGray: '#292330',
    tagBgLight: '#e9e0f0',
    tagBgDark: '#271a2f',
    tagBorderLight: '#d6c8e3',
    tagBorderDark: '#3d2b49',
    textColorLight: '#4b355d',
    textColorDark: '#b8a5c9',
    tagColor: '#614972',
    tagColorLight: '#614972',
    tagColorDark: '#b8a5c9',
  },
  rhythm: {
    key: 'rhythm',
    label: 'Ritmo',
    borderColor: '#8eaab5',
    borderLight: '#c3d6de',
    borderDark: '#1d2d34',
    borderGray: '#22333b',
    bgLight: '#f2f6f8',
    bgDark: '#11171b',
    bgGray: '#1b2226',
    hoverLight: '#e6eef1',
    hoverDark: '#172025',
    hoverGray: '#222a30',
    tagBgLight: '#d7e4e9',
    tagBgDark: '#17272e',
    tagBorderLight: '#bed4dc',
    tagBorderDark: '#273c46',
    textColorLight: '#264855',
    textColorDark: '#8eaab5',
    tagColor: '#355c6b',
    tagColorLight: '#355c6b',
    tagColorDark: '#8eaab5',
  },
};

export interface ResolvedSemanticEvent {
  theme: SemanticTheme;
  tagLabel: string;
  tagPrefix?: string;
  secondaryTag?: string;
  linkTag?: string;
  isDeepWork?: boolean;
}

export const resolveSemanticTheme = (
  event: ICalendarEvent,
): ResolvedSemanticEvent => {
  const task = event.resource as Task | undefined;
  const title = (event.title || '').toLowerCase();
  const category = (task?.category || '').toLowerCase();
  const notes = (task?.notes_encrypted || '').toLowerCase();
  const combined = `${title} ${category} ${notes}`;

  // 1. Wellness / Breaks / Physical Health & Personal calls (Green in screenshot)
  if (
    combined.includes('personal') ||
    combined.includes('llamada') ||
    combined.includes('familia') ||
    combined.includes('salud') ||
    combined.includes('bienestar') ||
    combined.includes('pausa') ||
    combined.includes('estiramiento') ||
    combined.includes('caminata') ||
    combined.includes('desconexión') ||
    combined.includes('desconexion') ||
    combined.includes('descanso') ||
    combined.includes('wellness') ||
    combined.includes('stretch')
  ) {
    let tag = 'Salud';
    if (
      combined.includes('personal') ||
      combined.includes('llamada') ||
      combined.includes('familia')
    ) {
      tag = 'Personal';
    } else if (combined.includes('pausa')) {
      tag = 'Salud';
    } else if (
      combined.includes('desconexión') ||
      combined.includes('desconexion')
    ) {
      tag = 'Desconexión';
    } else if (combined.includes('caminata')) {
      tag = 'Desconexión';
    }
    return {
      theme: SEMANTIC_THEMES.wellness,
      tagLabel: tag,
      tagPrefix: '•',
    };
  }

  // 2. Rhythm / Ergonomics / Music (Cyan in screenshot)
  if (
    combined.includes('ritmo') ||
    combined.includes('ergonomía') ||
    combined.includes('ergonomia') ||
    combined.includes('playlist') ||
    combined.includes('música') ||
    combined.includes('musica') ||
    combined.includes('postura') ||
    combined.includes('espalda')
  ) {
    let tag = 'Ritmo';
    if (
      combined.includes('ergonomía') ||
      combined.includes('ergonomia') ||
      combined.includes('postura') ||
      combined.includes('espalda')
    ) {
      tag = 'Ergonomía';
    }
    return {
      theme: SEMANTIC_THEMES.rhythm,
      tagLabel: tag,
      tagPrefix: '•',
    };
  }

  // 3. Rituals / Reflection / Journaling / Breathing (Purple in screenshot)
  if (
    combined.includes('ritual') ||
    combined.includes('reflexión') ||
    combined.includes('reflexion') ||
    combined.includes('journaling') ||
    combined.includes('logros') ||
    combined.includes('respiración') ||
    combined.includes('respiracion') ||
    combined.includes('4-7-8')
  ) {
    let tag = 'Ritual';
    if (
      combined.includes('reflexión') ||
      combined.includes('reflexion') ||
      combined.includes('journaling') ||
      combined.includes('logros')
    ) {
      tag = 'Reflexión';
    }
    return {
      theme: SEMANTIC_THEMES.ritual,
      tagLabel: tag,
      tagPrefix: '•',
    };
  }

  // 4. Habits / Podcast / Guided Meditation / Gratitude (Amber in screenshot)
  if (
    combined.includes('podcast') ||
    combined.includes('hábito') ||
    combined.includes('habito') ||
    combined.includes('gratitud') ||
    combined.includes('lectura') ||
    combined.includes('meditación') ||
    combined.includes('meditacion') ||
    combined.includes('cierre') ||
    combined.includes('crecimiento')
  ) {
    let tag = 'Hábito';
    let secondaryTag: string | undefined = undefined;

    if (combined.includes('podcast') || combined.includes('crecimiento')) {
      tag = 'Podcast';
    } else if (
      combined.includes('meditación') ||
      combined.includes('meditacion')
    ) {
      tag = 'Meditación';
      secondaryTag = 'Cierre de jornada';
    } else if (combined.includes('cierre')) {
      tag = 'Hábito';
      secondaryTag = 'Cierre de jornada';
    }

    return {
      theme: SEMANTIC_THEMES.habits,
      tagLabel: tag,
      tagPrefix: '•',
      secondaryTag,
    };
  }

  // 5. Deep Work / Core Dev / Tech (Indigo in screenshot)
  const isDev =
    combined.includes('argo') ||
    combined.includes('endpoint') ||
    combined.includes('auth') ||
    combined.includes('api') ||
    combined.includes('dev') ||
    combined.includes('backend') ||
    combined.includes('frontend') ||
    combined.includes('desarrollo') ||
    combined.includes('code');

  const jiraMatch = combined.match(/(jira|focus)-?\d+/i);
  const linkTag = jiraMatch ? jiraMatch[0].toUpperCase() : undefined;

  return {
    theme: SEMANTIC_THEMES.deep_work,
    tagLabel: isDev ? 'Core Dev' : 'Deep Work',
    tagPrefix: isDev ? undefined : '★',
    isDeepWork: true,
    linkTag,
  };
};
