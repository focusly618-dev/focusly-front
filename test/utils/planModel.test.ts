import { describe, it, expect } from 'vitest';
import {
  buildPlanTree,
  documentOutline,
  isDestructive,
  isEventAction,
  planDependencies,
  summarizePlan,
  toggleSelection,
  wordCount,
} from '@/components/chat/actionPlan/planModel';
import type { ParsedLuminaAction } from '@/utils';

const nutrition: ParsedLuminaAction[] = [
  {
    type: 'CREATE_PROJECT_GROUP',
    payload: { ref: 'p1', name: 'Nutrición', emoji: '🥗' },
  },
  {
    type: 'CREATE_WORKSPACE',
    payload: {
      ref: 'w1',
      title: 'Menú',
      project_ref: 'p1',
      content: '# Menú\n## Lunes\n## Martes',
    },
  },
  {
    type: 'CREATE_TASK',
    payload: {
      title: 'Lista de compras',
      project_ref: 'p1',
      workspace_ref: 'w1',
      estimate_timer: 45,
      deadline: '2026-10-05T10:00:00',
      subtasks: [{ title: 'Frutas' }, { title: 'Verduras' }],
    },
  },
  {
    type: 'CREATE_TASK',
    payload: {
      title: 'Pesarse',
      project_ref: 'p1',
      estimate_timer: 15,
      deadline: '2026-10-07T08:00:00',
    },
  },
  { type: 'CREATE_TASK', payload: { title: 'Suelta', estimate_timer: 30 } },
  { type: 'UPDATE_TASK', payload: { id: 't-9', priority_level: 3 } },
];

describe('buildPlanTree', () => {
  it('nests documents in their project and tasks in their document', () => {
    const tree = buildPlanTree(nutrition);

    expect(tree.projects).toHaveLength(1);
    const [project] = tree.projects;
    expect(project).toMatchObject({
      name: 'Nutrición',
      isNew: true,
      index: 0,
      emoji: '🥗',
    });
    expect(project.workspaces).toEqual([{ index: 1, tasks: [2] }]);
    expect(project.tasks).toEqual([3]);
    expect(tree.tasks).toEqual([4]);
    expect(tree.updates).toEqual([5]);
  });

  it('shows an existing project by name, and reuses it for a same-named new one', () => {
    const existing = [{ id: 'proj-1', name: 'Nutrición', emoji: '🍎' }];
    const byId = buildPlanTree(
      [
        {
          type: 'CREATE_WORKSPACE',
          payload: { title: 'Menú', project_group_id: 'proj-1' },
        },
      ],
      existing,
    );
    expect(byId.projects[0]).toMatchObject({
      name: 'Nutrición',
      isNew: false,
      index: null,
    });

    const byName = buildPlanTree(nutrition.slice(0, 2), existing);
    expect(byName.projects).toHaveLength(1);
    expect(byName.projects[0]).toMatchObject({
      key: 'id:proj-1',
      isNew: false,
    });
  });

  it('documents that only name their project end up under one project', () => {
    const tree = buildPlanTree([
      {
        type: 'CREATE_WORKSPACE',
        payload: { title: 'A', project_name: 'Nutrición' },
      },
      {
        type: 'CREATE_WORKSPACE',
        payload: { title: 'B', project_name: 'nutrición' },
      },
    ]);
    expect(tree.projects).toHaveLength(1);
    expect(tree.projects[0].workspaces.map((w) => w.index)).toEqual([0, 1]);
  });
});

describe('selection', () => {
  const tree = buildPlanTree(nutrition);
  const deps = planDependencies(tree);
  const all = new Set(nutrition.map((_, i) => i));

  it('unchecking a new project unchecks everything inside it', () => {
    const next = toggleSelection(all, 0, deps);
    expect([...next].sort()).toEqual([4, 5]);
  });

  it('unchecking a document unchecks its tasks only', () => {
    const next = toggleSelection(all, 1, deps);
    expect(next.has(2)).toBe(false);
    expect(next.has(3)).toBe(true);
  });

  it('checking a task brings back its document and project', () => {
    const none = new Set<number>();
    expect([...toggleSelection(none, 2, deps)].sort()).toEqual([0, 1, 2]);
  });
});

describe('details', () => {
  it('lists a document outline and counts words', () => {
    expect(documentOutline('# T\n## A\ntext\n### **B**\n#### deep')).toEqual([
      { level: 1, text: 'T' },
      { level: 2, text: 'A' },
      { level: 3, text: 'B' },
    ]);
    expect(wordCount('# Hola mundo\n- uno dos')).toBe(4);
  });

  it('summarizes what is selected', () => {
    const tree = buildPlanTree(nutrition);
    const summary = summarizePlan(nutrition, new Set([0, 1, 2, 3, 5]), tree);
    expect(summary).toMatchObject({
      projects: 1,
      documents: 1,
      tasks: 2,
      subtasks: 2,
      updates: 1,
      minutes: 60,
    });
    expect(summary.firstDate?.getDate()).toBe(5);
    expect(summary.lastDate?.getDate()).toBe(7);
  });
});

describe('changes and deletions', () => {
  const actions: ParsedLuminaAction[] = [
    { type: 'UPDATE_TASK', payload: { id: 't1', status: 'Done' } },
    {
      type: 'UPDATE_SUBTASKS',
      payload: { id: 't2', add: [{ title: 'Nuevo' }] },
    },
    { type: 'DELETE_TASK', payload: { id: 't3' } },
  ];

  it('groups edits and checklists as changes, deletions apart', () => {
    const tree = buildPlanTree(actions);
    expect(tree.updates).toEqual([0, 1]);
    expect(tree.deletions).toEqual([2]);
  });

  it('counts deletions in the summary', () => {
    const tree = buildPlanTree(actions);
    expect(summarizePlan(actions, new Set([0, 1, 2]), tree)).toMatchObject({
      updates: 2,
      deletions: 1,
    });
  });
});

describe('calendar events', () => {
  const actions: ParsedLuminaAction[] = [
    {
      type: 'CREATE_EVENT',
      payload: {
        title: 'Kickoff',
        start: '2026-10-08T10:00:00',
        attendees: ['ana@example.com', 'no-es-correo', 'luis@example.com'],
      },
    },
    { type: 'UPDATE_EVENT', payload: { id: 'ev1', meet: true } },
    { type: 'DELETE_EVENT', payload: { id: 'ev2' } },
    {
      type: 'CREATE_TASK',
      payload: { title: 'Preparar', deadline: '2026-10-06' },
    },
  ];

  it('new events get their own section; edits and cancellations join the others', () => {
    const tree = buildPlanTree(actions);
    expect(tree.events).toEqual([0]);
    expect(tree.updates).toEqual([1]);
    expect(tree.deletions).toEqual([2]);
    expect(tree.tasks).toEqual([3]);
  });

  it('canceling an event is destructive; every event action needs the calendar', () => {
    expect(actions.map(isDestructive)).toEqual([false, false, true, false]);
    expect(actions.map(isEventAction)).toEqual([true, true, true, false]);
  });

  it('counts events, their valid guests and their dates', () => {
    const tree = buildPlanTree(actions);
    const summary = summarizePlan(actions, new Set([0, 1, 2, 3]), tree);
    expect(summary).toMatchObject({
      events: 1,
      guests: 2,
      updates: 1,
      deletions: 1,
      tasks: 1,
    });
    expect(summary.lastDate).toEqual(new Date('2026-10-08T10:00:00'));
  });
});
