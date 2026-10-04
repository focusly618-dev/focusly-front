import { describe, it, expect } from 'vitest';
import { InMemoryCache, gql } from '@apollo/client';

// The project task mutations show changes through an optimistic cache layer
// (recordOptimisticTransaction + modify) and drop it when the request
// settles. This pins that Apollo behaves the way they rely on.

const TASK = gql`
  fragment OptimisticTask on Task {
    id
    status
    subtasks {
      id
      completed
    }
  }
`;

const seed = () => {
  const cache = new InMemoryCache();
  cache.writeFragment({
    id: 'Task:t-1',
    fragment: TASK,
    data: {
      __typename: 'Task',
      id: 't-1',
      status: 'Todo',
      subtasks: [{ __typename: 'Subtask', id: 's-1', completed: false }],
    },
  });
  return cache;
};

const read = (cache: InMemoryCache, optimistic: boolean) =>
  cache.readFragment<{
    status: string;
    subtasks: { completed: boolean }[];
  }>({ id: 'Task:t-1', fragment: TASK }, optimistic);

describe('optimistic task changes', () => {
  it('are visible right away and gone once the layer is removed', () => {
    const cache = seed();

    cache.recordOptimisticTransaction((c) => {
      c.modify({
        id: c.identify({ __typename: 'Task', id: 't-1' }),
        fields: { status: () => 'Done' },
      });
      c.modify({
        id: c.identify({ __typename: 'Subtask', id: 's-1' }),
        fields: { completed: (value: boolean) => !value },
      });
    }, 'layer-1');

    expect(read(cache, true)?.status).toBe('Done');
    expect(read(cache, true)?.subtasks[0].completed).toBe(true);
    // The confirmed data underneath is untouched.
    expect(read(cache, false)?.status).toBe('Todo');

    cache.removeOptimistic('layer-1');
    expect(read(cache, true)?.status).toBe('Todo');
    expect(read(cache, true)?.subtasks[0].completed).toBe(false);
  });
});
