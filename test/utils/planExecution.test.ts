import { describe, it, expect } from 'vitest';
import {
  UnresolvedReferenceError,
  createPlanRefs,
  executionOrder,
  existingProjectFor,
  recordResult,
  resolveAction,
} from '@/components/chat/actionPlan/planExecution';
import type { ParsedLuminaAction } from '@/utils';

const project: ParsedLuminaAction = {
  type: 'CREATE_PROJECT_GROUP',
  payload: { ref: 'p1', name: 'Nutrición' },
};
const workspace: ParsedLuminaAction = {
  type: 'CREATE_WORKSPACE',
  payload: { ref: 'w1', title: 'Plan semanal', project_ref: 'p1' },
};
const task: ParsedLuminaAction = {
  type: 'CREATE_TASK',
  payload: {
    title: 'Lista de compras',
    project_ref: 'p1',
    workspace_ref: 'w1',
  },
};

describe('planExecution', () => {
  it('runs projects, then documents, then tasks, keeping order within each', () => {
    const update: ParsedLuminaAction = {
      type: 'UPDATE_TASK',
      payload: { id: 't9' },
    };
    expect(executionOrder([task, update, workspace, project])).toEqual([
      3, 2, 0, 1,
    ]);
  });

  it('resolves refs to the ids created earlier in the plan', () => {
    const refs = createPlanRefs();
    recordResult(project, { id: 'proj-1' }, refs);
    recordResult(resolveAction(workspace, refs), { id: 'ws-1' }, refs);

    expect(resolveAction(task, refs).payload).toMatchObject({
      project_group_id: 'proj-1',
      workspace_id: 'ws-1',
    });
  });

  it('a document whose project failed is not created orphaned', () => {
    expect(() => resolveAction(workspace, createPlanRefs())).toThrow(
      UnresolvedReferenceError,
    );
  });

  it('a task whose document failed is still created, just unlinked', () => {
    const refs = createPlanRefs();
    recordResult(project, { id: 'proj-1' }, refs);
    const resolved = resolveAction(task, refs);
    expect(resolved.payload.project_group_id).toBe('proj-1');
    expect(resolved.payload.workspace_id).toBeUndefined();
  });

  it('documents that only name the project share the first one created', () => {
    const refs = createPlanRefs();
    const doc = (title: string): ParsedLuminaAction => ({
      type: 'CREATE_WORKSPACE',
      payload: { title, project_name: 'Nutrición ' },
    });

    // The first one creates the project itself and reports its id…
    recordResult(doc('A'), { id: 'ws-a', projectGroupId: 'proj-1' }, refs);
    // …the next ones reuse it instead of creating their own.
    expect(resolveAction(doc('B'), refs).payload.project_group_id).toBe(
      'proj-1',
    );
    expect(resolveAction(doc('C'), refs).payload.project_group_id).toBe(
      'proj-1',
    );
  });

  it('reuses an existing project with the same name instead of cloning it', () => {
    const refs = createPlanRefs([{ id: 'existing', name: 'nutrición' }]);
    expect(existingProjectFor(project, refs)).toBe('existing');
  });

  it('a ref written into an id field is resolved like a ref', () => {
    const refs = createPlanRefs();
    recordResult(project, { id: 'proj-1' }, refs);
    recordResult(resolveAction(workspace, refs), { id: 'ws-1' }, refs);
    const moveTask: ParsedLuminaAction = {
      type: 'UPDATE_TASK',
      payload: { id: 'task-9', project_group_id: 'p1', workspace_id: 'w1' },
    };

    expect(resolveAction(moveTask, refs).payload).toMatchObject({
      project_group_id: 'proj-1',
      workspace_id: 'ws-1',
    });
  });

  it('never sends an unresolved ref as a project id', () => {
    const moveTask: ParsedLuminaAction = {
      type: 'UPDATE_TASK',
      payload: { id: 'task-9', project_group_id: 'p1' },
    };
    expect(() => resolveAction(moveTask, createPlanRefs())).toThrow(
      UnresolvedReferenceError,
    );

    const newTask: ParsedLuminaAction = {
      type: 'CREATE_TASK',
      payload: { title: 'Sin proyecto', project_group_id: 'p3' },
    };
    expect(
      resolveAction(newTask, createPlanRefs()).payload.project_group_id,
    ).toBeUndefined();
  });

  it('keeps real project ids untouched', () => {
    const id = '3f2b8c1e-9a4d-4c7e-8b1a-2d6f0e5a7c91';
    const moveTask: ParsedLuminaAction = {
      type: 'UPDATE_TASK',
      payload: { id: 'task-9', project_group_id: id },
    };
    expect(
      resolveAction(moveTask, createPlanRefs()).payload.project_group_id,
    ).toBe(id);
  });
});
