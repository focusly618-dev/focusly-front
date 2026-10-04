import type { ParsedLuminaAction } from '@/utils';
import { normalizeName } from './planExecution';
import { normalizeEstimateTimer, parseDeadline } from './planFormat';
import { cleanEmails, eventWindow } from './eventBody';

// The shape of a Lumina plan as the user reviews it: projects holding their
// documents, documents holding the tasks about them, calendar events, plus
// changes to existing tasks and events. Items are action indexes into the
// plan's action list.

export interface ExistingProject {
  id: string;
  name?: string | null;
  emoji?: string | null;
  color?: string | null;
}

export interface WorkspaceView {
  index: number;
  tasks: number[];
}

export interface ProjectView {
  key: string;
  /** The CREATE_PROJECT_GROUP action, when the plan creates the project. */
  index: number | null;
  name: string;
  emoji?: string | null;
  color?: string | null;
  /** False for one of the user's projects the plan files things into. */
  isNew: boolean;
  workspaces: WorkspaceView[];
  /** Tasks in the project that aren't about one of its documents. */
  tasks: number[];
}

export interface PlanTree {
  projects: ProjectView[];
  /** Documents outside any project (older replies). */
  workspaces: WorkspaceView[];
  tasks: number[];
  /** New Google Calendar events. */
  events: number[];
  /** Changes to existing tasks (fields, status, subtasks) and events. */
  updates: number[];
  /** Destructive: shown apart and confirmed explicitly. */
  deletions: number[];
  inserts: number[];
}

export const isDestructive = (action: ParsedLuminaAction) =>
  action.type === 'DELETE_TASK' || action.type === 'DELETE_EVENT';

/** Actions that go to the user's Google Calendar (needs it connected). */
export const isEventAction = (action: ParsedLuminaAction) =>
  action.type === 'CREATE_EVENT' ||
  action.type === 'UPDATE_EVENT' ||
  action.type === 'DELETE_EVENT';

const isDocument = (a: ParsedLuminaAction) =>
  a.type === 'CREATE_WORKSPACE' || a.type === 'CREATE_NOTE';

export const buildPlanTree = (
  actions: ParsedLuminaAction[],
  existingProjects: ExistingProject[] = [],
): PlanTree => {
  const tree: PlanTree = {
    projects: [],
    workspaces: [],
    tasks: [],
    events: [],
    updates: [],
    deletions: [],
    inserts: [],
  };
  const projects = new Map<string, ProjectView>();
  const existingByName = new Map(
    existingProjects
      .filter((p) => p.name)
      .map((p) => [normalizeName(p.name as string), p]),
  );
  const existingById = new Map(existingProjects.map((p) => [p.id, p]));

  const projectView = (
    key: string,
    init: () => Omit<ProjectView, 'key' | 'workspaces' | 'tasks'>,
  ) => {
    let view = projects.get(key);
    if (!view) {
      view = { key, ...init(), workspaces: [], tasks: [] };
      projects.set(key, view);
      tree.projects.push(view);
    }
    return view;
  };

  const existingView = (id: string) =>
    projectView(`id:${id}`, () => {
      const known = existingById.get(id);
      return {
        index: null,
        name: known?.name || '',
        emoji: known?.emoji,
        color: known?.color,
        isNew: false,
      };
    });

  // Named projects (new, or reused when the user already has one by that name).
  const namedView = (
    name: string,
    index: number | null,
    extra: Partial<ProjectView> = {},
  ) => {
    const existing = existingByName.get(normalizeName(name));
    if (existing) {
      const view = existingView(existing.id);
      if (view.index === null && index !== null) view.index = index;
      return view;
    }
    return projectView(`name:${normalizeName(name)}`, () => ({
      index,
      name: name.trim(),
      isNew: true,
      ...extra,
    }));
  };

  const byRef = new Map<string, ProjectView>();
  actions.forEach((action, index) => {
    if (action.type !== 'CREATE_PROJECT_GROUP') return;
    const name = action.payload.name || action.payload.project_name || '';
    const view = namedView(name, index, {
      emoji: action.payload.emoji,
      color: action.payload.color,
    });
    if (view.index === null) view.index = index;
    if (action.payload.ref) byRef.set(action.payload.ref, view);
  });

  const projectFor = (action: ParsedLuminaAction): ProjectView | null => {
    const { project_ref, project_group_id, project_name, new_project_name } =
      action.payload;
    if (project_ref && byRef.has(project_ref)) return byRef.get(project_ref)!;
    if (project_group_id) return existingView(project_group_id);
    const name = project_name || new_project_name;
    return name ? namedView(name, null) : null;
  };

  const workspaceByRef = new Map<string, WorkspaceView>();
  actions.forEach((action, index) => {
    if (!isDocument(action)) return;
    const view: WorkspaceView = { index, tasks: [] };
    if (action.payload.ref) workspaceByRef.set(action.payload.ref, view);
    const project = projectFor(action);
    (project ? project.workspaces : tree.workspaces).push(view);
  });

  actions.forEach((action, index) => {
    if (action.type === 'CREATE_TASK') {
      const ref = action.payload.workspace_ref;
      const workspace = ref ? workspaceByRef.get(ref) : undefined;
      if (workspace) {
        workspace.tasks.push(index);
        return;
      }
      const project = projectFor(action);
      (project ? project.tasks : tree.tasks).push(index);
    } else if (action.type === 'CREATE_EVENT') {
      tree.events.push(index);
    } else if (
      action.type === 'UPDATE_TASK' ||
      action.type === 'UPDATE_SUBTASKS' ||
      action.type === 'UPDATE_EVENT'
    ) {
      tree.updates.push(index);
    } else if (isDestructive(action)) {
      tree.deletions.push(index);
    } else if (action.type === 'INSERT_TO_WORKSPACE') {
      tree.inserts.push(index);
    }
  });

  return tree;
};

/* ── Selection: what gets created ─────────────────────────────────────── */

/**
 * For each item, the items it can't exist without: a document needs the new
 * project it lives in; a task follows its document and project (unchecking
 * those unchecks it, checking it checks them back).
 */
export const planDependencies = (tree: PlanTree): Map<number, number[]> => {
  const deps = new Map<number, number[]>();
  for (const project of tree.projects) {
    const parent =
      project.isNew && project.index !== null ? [project.index] : [];
    for (const ws of project.workspaces) {
      deps.set(ws.index, parent);
      for (const task of ws.tasks) deps.set(task, [ws.index, ...parent]);
    }
    for (const task of project.tasks) deps.set(task, parent);
  }
  for (const ws of tree.workspaces) {
    for (const task of ws.tasks) deps.set(task, [ws.index]);
  }
  return deps;
};

export const toggleSelection = (
  selected: ReadonlySet<number>,
  index: number,
  deps: Map<number, number[]>,
): Set<number> => {
  const next = new Set(selected);
  if (next.has(index)) {
    next.delete(index);
    // Everything that depends on it goes too.
    let changed = true;
    while (changed) {
      changed = false;
      for (const [item, parents] of deps) {
        if (next.has(item) && parents.some((p) => !next.has(p))) {
          next.delete(item);
          changed = true;
        }
      }
    }
  } else {
    next.add(index);
    for (const parent of deps.get(index) ?? []) next.add(parent);
  }
  return next;
};

/* ── Details shown in the preview ─────────────────────────────────────── */

export interface OutlineEntry {
  level: number;
  text: string;
}

/** A document's headings (up to `max`), for a glance at its structure. */
export const documentOutline = (markdown: string, max = 8): OutlineEntry[] =>
  markdown
    .split('\n')
    .map((line) => /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line.trim()))
    .filter((m): m is RegExpExecArray => m !== null)
    .slice(0, max)
    .map((m) => ({ level: m[1].length, text: m[2].replace(/[*_`]/g, '') }));

export const wordCount = (markdown: string) =>
  markdown
    .replace(/[#>*_`[\]()-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

export const documentContent = (action: ParsedLuminaAction) =>
  action.payload.content ||
  action.payload.content_encrypted ||
  action.payload.markdown ||
  '';

export const taskMinutes = (action: ParsedLuminaAction) =>
  normalizeEstimateTimer(Number(action.payload.estimate_timer) || 30);

export interface PlanSummary {
  projects: number;
  documents: number;
  tasks: number;
  subtasks: number;
  events: number;
  /** Guests the new events invite (they get an email). */
  guests: number;
  updates: number;
  deletions: number;
  minutes: number;
  firstDate: Date | null;
  lastDate: Date | null;
}

/** Totals for the selected items. */
export const summarizePlan = (
  actions: ParsedLuminaAction[],
  selected: ReadonlySet<number>,
  tree: PlanTree,
): PlanSummary => {
  const summary: PlanSummary = {
    projects: tree.projects.filter(
      (p) => p.isNew && p.index !== null && selected.has(p.index),
    ).length,
    documents: 0,
    tasks: 0,
    subtasks: 0,
    events: 0,
    guests: 0,
    updates: 0,
    deletions: 0,
    minutes: 0,
    firstDate: null,
    lastDate: null,
  };
  const addDate = (date: Date | null) => {
    if (!date) return;
    if (!summary.firstDate || date < summary.firstDate)
      summary.firstDate = date;
    if (!summary.lastDate || date > summary.lastDate) summary.lastDate = date;
  };
  actions.forEach((action, index) => {
    if (!selected.has(index)) return;
    if (isDocument(action)) summary.documents += 1;
    if (
      action.type === 'UPDATE_TASK' ||
      action.type === 'UPDATE_SUBTASKS' ||
      action.type === 'UPDATE_EVENT'
    ) {
      summary.updates += 1;
    }
    if (isDestructive(action)) summary.deletions += 1;
    if (action.type === 'CREATE_EVENT') {
      summary.events += 1;
      summary.guests += cleanEmails(action.payload.attendees).length;
      addDate(eventWindow(action.payload).start);
    }
    if (action.type !== 'CREATE_TASK') return;
    summary.tasks += 1;
    summary.subtasks += action.payload.subtasks?.length ?? 0;
    summary.minutes += taskMinutes(action);
    addDate(parseDeadline(action.payload.deadline));
  });
  return summary;
};
