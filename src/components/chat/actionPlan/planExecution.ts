import type { ParsedLuminaAction } from '@/utils';

// Running a multi-action plan from Lumina: projects first, then the documents
// that live in them, then the tasks that point at both. Actions refer to
// things created earlier in the same plan through a "ref" ("p1", "w1"); as
// each item is created its real id is recorded here so later ones resolve.

const EXECUTION_RANK: Record<ParsedLuminaAction['type'], number> = {
  CREATE_PROJECT_GROUP: 0,
  CREATE_WORKSPACE: 1,
  CREATE_NOTE: 1,
  CREATE_TASK: 2,
  CREATE_EVENT: 2,
  UPDATE_TASK: 3,
  UPDATE_SUBTASKS: 3,
  UPDATE_EVENT: 3,
  INSERT_TO_WORKSPACE: 4,
  // Deletions last: nothing else in the plan should depend on what goes.
  DELETE_TASK: 5,
  DELETE_EVENT: 5,
};

/** Indexes of `actions` in the order they must run (stable within a rank). */
export const executionOrder = (actions: ParsedLuminaAction[]): number[] =>
  actions
    .map((_, index) => index)
    .sort(
      (a, b) =>
        (EXECUTION_RANK[actions[a].type] ?? 9) -
          (EXECUTION_RANK[actions[b].type] ?? 9) || a - b,
    );

export const normalizeName = (name: string) =>
  name.trim().toLocaleLowerCase().replace(/\s+/g, ' ');

/** Ids created (or found) so far while running a plan. */
export interface PlanRefs {
  projects: Map<string, string>;
  workspaces: Map<string, string>;
  /** Normalized project name → id, for actions that name a project. */
  projectsByName: Map<string, string>;
}

export const createPlanRefs = (
  existingProjects: { id: string; name?: string | null }[] = [],
): PlanRefs => ({
  projects: new Map(),
  workspaces: new Map(),
  projectsByName: new Map(
    existingProjects
      .filter((p) => p.name)
      .map((p) => [normalizeName(p.name as string), p.id]),
  ),
});

export class UnresolvedReferenceError extends Error {}

const REF_SHAPE = /^[pw]\d+$/i;

/** A plan ref ("p1", "w2") rather than a real id (always a UUID). */
const looksLikeRef = (value: string, known: Map<string, string>) =>
  known.has(value) || REF_SHAPE.test(value);

const projectNameOf = (action: ParsedLuminaAction) =>
  action.payload.name ||
  action.payload.project_name ||
  action.payload.new_project_name;

/**
 * The action with its references swapped for real ids. Throws when a
 * workspace's project was never created (it failed earlier): creating the
 * document anyway would orphan it or invent a project for it.
 */
export const resolveAction = (
  action: ParsedLuminaAction,
  refs: PlanRefs,
): ParsedLuminaAction => {
  const payload = { ...action.payload };
  const isDocument =
    action.type === 'CREATE_WORKSPACE' || action.type === 'CREATE_NOTE';

  // Lumina sometimes writes a ref into the id field ("project_group_id": "p1")
  // and the backend rejects it as an unknown project. Real ids are UUIDs, so
  // anything ref-shaped is moved back to the ref field and resolved below.
  if (
    payload.project_group_id &&
    looksLikeRef(payload.project_group_id, refs.projects)
  ) {
    payload.project_ref = payload.project_ref || payload.project_group_id;
    payload.project_group_id = undefined;
  }
  if (
    payload.workspace_id &&
    looksLikeRef(payload.workspace_id, refs.workspaces)
  ) {
    payload.workspace_ref = payload.workspace_ref || payload.workspace_id;
    payload.workspace_id = undefined;
  }

  if (payload.project_ref && !payload.project_group_id) {
    const id = refs.projects.get(payload.project_ref);
    if (id) payload.project_group_id = id;
    // Moving a task is the point of an UPDATE_TASK that names a project, so
    // reporting it done without the move would be wrong.
    else if (isDocument || action.type === 'UPDATE_TASK') {
      throw new UnresolvedReferenceError(
        `Project "${payload.project_ref}" wasn't created`,
      );
    }
  }

  if (payload.workspace_ref && !payload.workspace_id) {
    const id = refs.workspaces.get(payload.workspace_ref);
    // A task whose document failed is still worth creating, just unlinked.
    if (id) payload.workspace_id = id;
  }

  // Older replies name the project on every document instead of creating it
  // once: they all share the first one created (or an existing namesake).
  if (isDocument && !payload.project_group_id) {
    const name = payload.project_name || payload.new_project_name;
    const id = name ? refs.projectsByName.get(normalizeName(name)) : undefined;
    if (id) payload.project_group_id = id;
  }

  return { ...action, payload };
};

/** An existing project with the same name, which the plan reuses. */
export const existingProjectFor = (
  action: ParsedLuminaAction,
  refs: PlanRefs,
): string | undefined => {
  if (action.type !== 'CREATE_PROJECT_GROUP') return undefined;
  const name = projectNameOf(action);
  return name ? refs.projectsByName.get(normalizeName(name)) : undefined;
};

/** Records what an executed action created so later actions can use it. */
export const recordResult = (
  action: ParsedLuminaAction,
  result: { id?: string; projectGroupId?: string },
  refs: PlanRefs,
) => {
  const { payload } = action;
  if (action.type === 'CREATE_PROJECT_GROUP' && result.id) {
    if (payload.ref) refs.projects.set(payload.ref, result.id);
    const name = projectNameOf(action);
    if (name) refs.projectsByName.set(normalizeName(name), result.id);
  }
  if (action.type === 'CREATE_WORKSPACE' || action.type === 'CREATE_NOTE') {
    if (payload.ref && result.id) refs.workspaces.set(payload.ref, result.id);
    // A project the document created for itself, by name.
    const name = payload.project_name || payload.new_project_name;
    if (name && result.projectGroupId) {
      refs.projectsByName.set(normalizeName(name), result.projectGroupId);
    }
  }
};
