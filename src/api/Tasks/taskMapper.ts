import type { Task, TaskStatus } from '@/redux/tasks/task.types';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import type { GoogleCalendarEvent } from '@/redux/calendar/calendar.types';

export const normalizeGoogleId = (id: string | null | undefined): string => {
  if (!id) return '';
  return id.replace(/^_+/, '');
};

export const getBaseGoogleId = (id: string | null | undefined): string => {
  if (!id) return '';
  return normalizeGoogleId(id).split('_')[0];
};

export const getAvatarUrl = (email?: string): string => {
  const name = email?.split('@')[0] || 'user';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
};

export const mapCollaborator = (c: {
  name?: string;
  email?: string;
  avatar?: string;
}) => ({
  ...c,
  name: c.name || '',
  email: c.email || '',
  avatar: c.avatar || getAvatarUrl(c.email),
});

export const mapGoogleEventToTask = (event: GoogleCalendarEvent): Task => ({
  id: event.id,
  user_id: 'google-user',
  title: event.title || 'Untitled',
  notes_encrypted: event.notes_encrypted || '',
  estimate_timer: event.estimate_timer || 30,
  priority_level: event.priority_level || 3,
  deadline: event.deadline,
  status: (event.status as TaskStatus) || 'Pending',
  category: 'Meeting',
  created_at: event.created_at || new Date().toISOString(),
  updated_at: event.updated_at || new Date().toISOString(),
  links: event.links || [],
  task_type: 'GoogleTask',
  google_event_id: normalizeGoogleId(event.id),
  source: 'google',
  tags: event.tags || [],
  estimated_start_date: event.estimated_start_date,
  estimated_end_date: event.deadline,
  is_owner: event.is_owner !== undefined ? event.is_owner : true,
  collaborators: (event.collaborators || []).map(mapCollaborator),
});

export const safeISO = (d: string | null | undefined): string | null => {
  if (!d) return null;
  try {
    // Backend stores naive UTC datetimes (no timezone suffix).
    // If the string has no 'Z' or offset (+/-HH:MM), append 'Z' so the
    // browser treats it as UTC instead of local time.
    const normalized = /Z$|[+-]\d{2}:\d{2}$/.test(d) ? d : d + 'Z';
    const date = new Date(normalized);
    return isNaN(date.getTime()) ? null : date.toISOString();
  } catch {
    return null;
  }
};

export const mapWorkspace = (w: TaskResponse['workspace']) => {
  if (!w) return [];
  return [
    {
      id: w.id,
      title: w.title,
      content: w.content || '',
      updatedAt: w.updatedAt || '',
      folder: w.project || w.folder,
    },
  ];
};

export const mapTags = (tags?: (string | { name: string })[]): string[] => {
  if (!tags) return [];
  return tags.map((tag) => (typeof tag === 'string' ? tag : tag.name));
};

export const mapResponseToTask = (t: TaskResponse): Task => ({
  id: t.id,
  user_id: t.user_id || '',
  title: t.title,
  notes_encrypted: t.notes_encrypted || '',
  estimate_timer: t.estimate_timer || 0,
  real_timer: t.real_timer,
  duration: t.duration,
  priority_level: t.priority_level,
  deadline: safeISO(t.deadline) || new Date().toISOString(),
  status: t.status as TaskStatus,
  category: t.category || 'General',
  color: t.color,
  created_at: safeISO(t.created_at) || new Date().toISOString(),
  updated_at: safeISO(t.updated_at) || new Date().toISOString(),
  completed_at: safeISO(t.completed_at),
  deleted_at: safeISO(t.deleted_at),
  links: t.links || [],
  task_type: (t.task_type || 'PlatformTask') as 'GoogleTask' | 'PlatformTask',
  google_event_id: normalizeGoogleId(t.google_event_id),
  source: (t.source || 'platform') as 'google' | 'platform',
  collaborators: (t.collaborators || []).map(mapCollaborator),
  tags: mapTags(t.tags),
  estimated_start_date: safeISO(t.estimated_start_date),
  estimated_end_date: safeISO(t.estimated_end_date),
  use_ai: t.use_ai,
  is_owner: t.is_owner,
  workspaces: mapWorkspace(t.workspace),
});
