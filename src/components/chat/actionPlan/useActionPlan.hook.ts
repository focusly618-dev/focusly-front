import { useMemo, useRef, useState } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeTask } from '@/redux/tasks/task.slice';
import {
  incrementSyncVersion,
  removeEvent,
} from '@/redux/calendar/calendar.slice';
import { AuthProviders } from '@/pages/Public/Login/types/Login.types';
import type { UserSettings } from '@/api/User/apiUser.types';
import {
  CREATE_TASK,
  DELETE_TASK,
  UPDATE_TASK,
} from '@/pages/Tasks/Tasks.graphql';
import {
  CREATE_PROJECT_GROUP,
  CREATE_WORKSPACE,
  GET_PROJECT_GROUPS,
} from '@/pages/Workspace/Workspace.graphql';
import type { LuminaActionPayload, ParsedLuminaAction } from '@/utils';
import { executeSingleAction, type ActionResult } from './actionExecution';
import {
  createPlanRefs,
  executionOrder,
  existingProjectFor,
  recordResult,
  resolveAction,
  type PlanRefs,
} from './planExecution';
import {
  buildPlanTree,
  isDestructive,
  isEventAction,
  planDependencies,
  summarizePlan,
  toggleSelection,
  type ExistingProject,
} from './planModel';

export type PlanItemStatus =
  | 'pending'
  | 'creating'
  | 'done'
  | 'error'
  /** Left unchecked when the plan ran. */
  | 'skipped';

/** What the user changed on an item before running the plan. */
export type ItemEdit = Pick<
  LuminaActionPayload,
  'title' | 'name' | 'deadline' | 'start' | 'end'
>;

/** Where a finished item can be opened outside Focusly (Google Calendar). */
export type ItemLinks = Pick<ActionResult, 'url' | 'meetUrl'>;

interface SavedRun {
  statuses: PlanItemStatus[];
  createdIds: (string | null)[];
  links?: (ItemLinks | null)[];
}

const STORAGE_PREFIX = 'focusly_plan_completed_';

// Compact fingerprint: type + title/name for each action, not the full
// payload (notes/content can be hundreds of KB).
const fingerprint = (actions: ParsedLuminaAction[]) =>
  STORAGE_PREFIX +
  actions
    .map(
      (a) =>
        `${a.type}:${a.payload.title ?? a.payload.name ?? ''}:${a.payload.deadline ?? ''}`,
    )
    .join('|');

const readSavedRun = (key: string, count: number): SavedRun | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    // Plans run before per-item tracking only stored "true".
    if (raw === 'true') {
      return {
        statuses: Array(count).fill('done'),
        createdIds: Array(count).fill(null),
      };
    }
    const saved = JSON.parse(raw) as SavedRun;
    return saved.statuses?.length === count ? saved : null;
  } catch {
    return null;
  }
};

export const useActionPlan = (actions: ParsedLuminaAction[]) => {
  const { user, authProvider } = useAppSelector((state) => state.auth);
  const tasks = useAppSelector((state) => state.task.tasks);
  const calendarEvents = useAppSelector((state) => state.calendar.reduxEvents);
  const calendarConnected =
    authProvider === AuthProviders.google &&
    Boolean((user?.settings as UserSettings | undefined)?.calendarConnected);
  /** Calendar actions can't run without Google Calendar connected. */
  const isBlocked = (index: number) =>
    !calendarConnected && isEventAction(actions[index]);
  const client = useApolloClient();
  const dispatch = useAppDispatch();
  const { data: projectsData } = useQuery(GET_PROJECT_GROUPS, {
    fetchPolicy: 'cache-first',
  });
  const existingProjects: ExistingProject[] = useMemo(
    () => projectsData?.projectGroups ?? [],
    [projectsData],
  );

  const storageKey = useMemo(() => fingerprint(actions), [actions]);
  const [saved] = useState(() => readSavedRun(storageKey, actions.length));

  const [statuses, setStatuses] = useState<PlanItemStatus[]>(
    () => saved?.statuses ?? actions.map(() => 'pending'),
  );
  const [createdIds, setCreatedIds] = useState<(string | null)[]>(
    () => saved?.createdIds ?? actions.map(() => null),
  );
  const [links, setLinks] = useState<(ItemLinks | null)[]>(
    () => saved?.links ?? actions.map(() => null),
  );
  const [selected, setSelected] = useState<Set<number>>(
    () =>
      new Set(
        actions
          .map((_, i) => i)
          .filter((i) =>
            saved ? saved.statuses[i] !== 'skipped' : !isBlocked(i),
          ),
      ),
  );
  const [edits, setEdits] = useState<Record<number, ItemEdit>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Survives a retry, so items that failed can still find what the first
  // attempt created.
  const refsRef = useRef<PlanRefs | null>(null);

  const [createTask] = useMutation(CREATE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [createWorkspace] = useMutation(CREATE_WORKSPACE);
  const [createProjectGroup] = useMutation(CREATE_PROJECT_GROUP);
  const [deleteTask] = useMutation(DELETE_TASK);
  // Deleting needs an explicit "I understand" before the plan can run.
  const [destructiveConfirmed, setDestructiveConfirmed] = useState(false);

  const tree = useMemo(
    () => buildPlanTree(actions, existingProjects),
    [actions, existingProjects],
  );
  const deps = useMemo(() => planDependencies(tree), [tree]);
  const summary = useMemo(
    () => summarizePlan(actions, selected, tree),
    [actions, selected, tree],
  );

  /** The action as it will run, with the user's edits. */
  const effectiveAction = (index: number): ParsedLuminaAction => {
    const edit = edits[index];
    const action = actions[index];
    return edit
      ? { ...action, payload: { ...action.payload, ...edit } }
      : action;
  };

  const hasStarted = statuses.some((s) => s !== 'pending');
  const isCompleted =
    hasStarted &&
    statuses.every((s) => s === 'done' || s === 'skipped') &&
    statuses.some((s) => s === 'done');
  const hasErrors = statuses.some((s) => s === 'error');
  const pendingDeletions = actions.filter(
    (action, i) =>
      isDestructive(action) && selected.has(i) && statuses[i] !== 'done',
  ).length;
  const needsConfirmation = pendingDeletions > 0 && !destructiveConfirmed;
  const canEdit = (index: number) =>
    !isRunning &&
    !isBlocked(index) &&
    statuses[index] !== 'done' &&
    statuses[index] !== 'creating';

  const toggle = (index: number) => {
    if (!canEdit(index)) return;
    setSelected((current) => toggleSelection(current, index, deps));
  };

  const setAll = (value: boolean) => {
    if (isRunning) return;
    setSelected(
      new Set(
        actions
          .map((_, i) => i)
          .filter((i) => statuses[i] === 'done' || (value && !isBlocked(i))),
      ),
    );
  };

  const editItem = (index: number, edit: ItemEdit) => {
    if (!canEdit(index)) return;
    setEdits((current) => ({
      ...current,
      [index]: { ...current[index], ...edit },
    }));
  };

  /** The user's projects, so a plan never duplicates one by name. */
  const loadRefs = async (): Promise<PlanRefs> => {
    if (refsRef.current) return refsRef.current;
    let projects: ExistingProject[] = existingProjects;
    try {
      const { data } = await client.query({
        query: GET_PROJECT_GROUPS,
        fetchPolicy: 'network-only',
      });
      projects = data?.projectGroups ?? projects;
    } catch (err) {
      console.warn('Could not load projects before running the plan:', err);
    }
    refsRef.current = createPlanRefs(projects);
    return refsRef.current;
  };

  const run = async () => {
    if (!user || isRunning || needsConfirmation) return;
    setErrorMessage('');
    setIsRunning(true);

    const refs = await loadRefs();
    const nextStatuses = [...statuses];
    const nextIds = [...createdIds];
    const nextLinks = [...links];
    const commit = () => {
      setStatuses([...nextStatuses]);
      setCreatedIds([...nextIds]);
      setLinks([...nextLinks]);
    };

    for (const i of executionOrder(actions)) {
      if (nextStatuses[i] === 'done') continue;
      if (!selected.has(i) || isBlocked(i)) {
        nextStatuses[i] = 'skipped';
        continue;
      }
      nextStatuses[i] = 'creating';
      commit();
      const action = effectiveAction(i);
      try {
        const existingId = existingProjectFor(action, refs);
        if (existingId) {
          // Same name as one of the user's projects: use it, don't clone it.
          recordResult(action, { id: existingId }, refs);
          nextIds[i] = existingId;
        } else {
          const resolved = resolveAction(action, refs);
          const result = await executeSingleAction(resolved, {
            userId: user.id,
            createTask,
            updateTask,
            createWorkspace,
            createProjectGroup,
            deleteTask,
            client,
            onTaskDeleted: (id) => dispatch(removeTask({ id })),
            onEventDeleted: (id) => dispatch(removeEvent({ id })),
            // The calendar view refetches its events.
            onCalendarChanged: () => dispatch(incrementSyncVersion()),
          });
          recordResult(resolved, result, refs);
          if (result.url || result.meetUrl) {
            nextLinks[i] = { url: result.url, meetUrl: result.meetUrl };
          }
          nextIds[i] =
            result.id ??
            (action.type === 'UPDATE_TASK'
              ? (action.payload.id ?? null)
              : null);
        }
        nextStatuses[i] = 'done';
      } catch (err) {
        console.error('Error creating plan item:', err);
        nextStatuses[i] = 'error';
      }
      commit();
    }

    commit();
    setIsRunning(false);
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          statuses: nextStatuses,
          createdIds: nextIds,
          links: nextLinks,
        }),
      );
    } catch {
      // Storage full or blocked: the plan just won't remember on reload.
    }
    if (nextStatuses.some((s) => s === 'error')) {
      setErrorMessage('error');
    }
  };

  return {
    actions,
    tree,
    summary,
    tasks,
    calendarEvents,
    calendarConnected,
    isBlocked,
    existingProjects,
    selected,
    toggle,
    selectAll: () => setAll(true),
    selectNone: () => setAll(false),
    edits,
    editItem,
    effectiveAction,
    canEdit,
    statuses,
    createdIds,
    links,
    isRunning,
    isCompleted,
    hasErrors,
    hasStarted,
    errorMessage,
    pendingDeletions,
    needsConfirmation,
    destructiveConfirmed,
    setDestructiveConfirmed,
    run,
  };
};

export type PlanController = ReturnType<typeof useActionPlan>;
