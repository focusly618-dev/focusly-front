import type { BuildCreateTaskPayloadParams } from './types/TaskDetailModal.types';

export const parseDuration = (duration: string | undefined | null): number => {
  if (!duration || typeof duration !== 'string') return 0;

  const norm = duration.toLowerCase().trim();
  if (!norm) return 0;

  const shortMatch = norm.match(/^(\d{1,3})(h|m)?$/i);
  if (shortMatch) {
    const amount = parseInt(shortMatch[1], 10);
    if (shortMatch[2] === 'h') return amount * 60;
    if (shortMatch[2] === 'm') return amount;
    return amount;
  }

  const combinedMatch = norm.match(/^(\d{1,3})h\s*(\d{1,3})m$/i);
  if (combinedMatch) {
    return parseInt(combinedMatch[1], 10) * 60 + parseInt(combinedMatch[2], 10);
  }

  return 0;
};

export const formatDuration = (minutes?: number): string => {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = Number((minutes % 60).toFixed(1));
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
};

export const parseRealTime = (time: string): number => {
  return parseDuration(time);
};

export interface TaskColorOption {
  value: string;
  name: string;
}

export const PASTEL_COLORS: TaskColorOption[] = [
  { value: '#BAE6FD', name: 'Cielo' },
  { value: '#DDD6FE', name: 'Lavanda' },
  { value: '#A7F3D0', name: 'Menta' },
  { value: '#C2D6C4', name: 'Salvia' },
  { value: '#FED7AA', name: 'Melocotón' },
  { value: '#FBCFE8', name: 'Rosa Pálido' },
  { value: '#FECDD3', name: 'Cerezo' },
  { value: '#FDE68A', name: 'Vainilla' },
  { value: '#E9D5FF', name: 'Lila' },
  { value: '#99F6E4', name: 'Eucalipto' },
  { value: '#FCD34D', name: 'Miel' },
  { value: '#FFD1BA', name: 'Coral Suave' },
  { value: '#C6D8DF', name: 'Bruma' },
  { value: '#D4B8E5', name: 'Malva' },
  { value: '#E8DCB8', name: 'Arena' },
  { value: '#C7D2FE', name: 'Periwinkle' },
  { value: '#B5D5C5', name: 'Musgo' },
  { value: '#F3C5B5', name: 'Terracota' },
  { value: '#CBD5E1', name: 'Pizarra' },
  { value: '#EDE0D4', name: 'Almendra' },
];

export const TASK_COLORS = PASTEL_COLORS.map((c) => c.value);

export const getColorName = (hex?: string): string | undefined => {
  if (!hex) return undefined;
  const upper = hex.toUpperCase();
  const match = PASTEL_COLORS.find((c) => c.value.toUpperCase() === upper);
  return match?.name;
};

export type PriorityType = 'High' | 'Med' | 'Low' | 'No priority';

export const getPriorityFromLevel = (level: number): PriorityType => {
  if (level >= 3) return 'High';
  if (level === 2) return 'Med';
  if (level === 1) return 'Low';
  return 'No priority';
};

export const getPriorityLevel = (priority: PriorityType): number => {
  if (priority === 'High') return 3;
  if (priority === 'Med') return 2;
  if (priority === 'Low') return 1;
  return 0;
};

export const getTagColors = (
  tagName: string | null | undefined = 'General',
) => {
  // Handle null/undefined
  const safeTagName = tagName ?? 'General';
  // Simple hash for consistency
  let hash = 0;
  for (let i = 0; i < safeTagName.length; i++) {
    hash = safeTagName.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Predefined premium HSL base colors
  // These are curated to look good with 12% opacity (background) and 80% opacity (border)
  const hues = [
    210, // Blue
    260, // Purple/Indigo
    330, // Pink/Rose
    15, // Orange/Coral
    160, // Emerald/Green
    195, // Sky/Cyan
    45, // Amber/Gold
    280, // Violet
  ];

  const hue = hues[Math.abs(hash) % hues.length];
  const saturation = 70;
  const lightness = 60;

  return {
    bgcolor: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.15)`,
    color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    borderColor: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)`,
  };
};
export const normalizeUrl = (url: string) =>
  (url || '').replace(/^https?:\/\//, '').replace(/\/$/, '');

export const deduplicateLinks = (links: { title: string; url: string }[]) => {
  const seen = new Set();
  return links.filter((l) => {
    const norm = normalizeUrl(l.url);
    if (seen.has(norm)) return false;
    seen.add(norm);
    return true;
  });
};

export const getTimerSuggestions = (val: string) => {
  const clean = val.trim();
  if (!clean || clean.length > 8) return [];

  const suggestions: string[] = [];
  if (/^\d+$/.test(clean)) {
    suggestions.push(`${clean}h`, `${clean}m`);
  } else if (/^\d+h$/.test(clean)) {
    suggestions.push(`${clean} 00m`, `${clean} 30m`);
  } else {
    const hmMatch = clean.match(/^(\d+h)\s*(\d+)$/);
    if (hmMatch) {
      suggestions.push(`${hmMatch[1]} ${hmMatch[2]}m`);
      if (hmMatch[2].length === 1) {
        suggestions.push(`${hmMatch[1]} ${hmMatch[2]}0m`);
      }
    }
  }
  return suggestions;
};

export const buildCreateTaskPayload = ({
  state,
  userId,
  meetLink,
  googleEventId,
  initialGoogleEventId,
}: BuildCreateTaskPayloadParams): Record<string, unknown> => {
  const estimateTimer = parseDuration(state.duration);
  const realTimer = parseRealTime(state.realTime || '');
  const priorityLevel = getPriorityLevel(state.priority as PriorityType);

  const cleanDesc = (state.description || '')
    .replace(/\[COLOR:(.*?)\]/g, '')
    .replace(/\[START_DATE:(.*?)\]/g, '')
    .trim();

  const links = deduplicateLinks(state.links || []).map((l) => ({
    title: l.title,
    url: l.url,
  }));
  if (meetLink && !links.some((l) => l.url === meetLink)) {
    links.push({ title: 'Google Meet', url: meetLink });
  }

  const hasValidDeadline = Boolean(
    state.deadline && !isNaN(state.deadline.getTime()),
  );
  const deadlineISO = hasValidDeadline ? state.deadline!.toISOString() : '';
  const endDateISO = hasValidDeadline
    ? new Date(
        state.deadline!.getTime() + (estimateTimer || 25) * 60000,
      ).toISOString()
    : undefined;

  const targetStatus = hasValidDeadline
    ? state.status === 'Backlog'
      ? 'Todo'
      : state.status || 'Todo'
    : 'Backlog';

  return {
    title: state.title,
    notes_encrypted: `${cleanDesc} [COLOR:${state.color}]`,
    estimate_timer: estimateTimer,
    real_timer: realTimer,
    tags: state.tags,
    deadline: deadlineISO,
    priority_level: priorityLevel,
    category: state.category,
    color: state.color,
    links,
    collaborators: state.collaborators,
    user_id: userId,
    status: targetStatus,
    google_event_id: googleEventId || initialGoogleEventId,
    estimated_start_date: hasValidDeadline ? deadlineISO : undefined,
    estimated_end_date: endDateISO,
    time_logs: state.time_logs || [],
    skip_scheduling: !hasValidDeadline,
  };
};
