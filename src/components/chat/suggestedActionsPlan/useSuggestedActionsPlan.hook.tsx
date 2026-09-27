import { useState, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { useAppSelector } from '@/redux/hooks';
import { CREATE_TASK, UPDATE_TASK } from '@/pages/Tasks/Tasks.graphql';
import {
  CREATE_PROJECT_GROUP,
  CREATE_WORKSPACE,
} from '@/pages/Workspace/Workspace.graphql';
import type { ParsedLuminaAction } from '@/utils';
import { executeSingleAction } from '../suggestedActionCard/actionExecution.utils';
import type { PlanItemStatus } from './SuggestedActionsPlan.types';

export const useSuggestedActionsPlan = (actions: ParsedLuminaAction[]) => {
  const { user } = useAppSelector((state) => state.auth);

  // Compact fingerprint: type + title/name for each action, not the full payload.
  // JSON.stringify(actions) can be hundreds of KB when notes/content are included.
  const planKey = useMemo(() => {
    const fingerprint = actions
      .map(
        (a) =>
          `${a.type}:${a.payload.title ?? a.payload.name ?? ''}:${a.payload.deadline ?? ''}`,
      )
      .join('|');
    return `focusly_plan_completed_${fingerprint}`;
  }, [actions]);
  const initiallyCompleted = localStorage.getItem(planKey) === 'true';

  const [open, setOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initiallyCompleted);
  const [isCreating, setIsCreating] = useState(false);
  const [itemStatuses, setItemStatuses] = useState<PlanItemStatus[]>(() =>
    actions.map(() => (initiallyCompleted ? 'done' : 'pending')),
  );
  const [errorMessage, setErrorMessage] = useState('');

  const [createTask] = useMutation(CREATE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [createWorkspace] = useMutation(CREATE_WORKSPACE);
  const [createProjectGroup] = useMutation(CREATE_PROJECT_GROUP);

  const handleCreateAll = async () => {
    if (!user) {
      setErrorMessage('User not authenticated');
      return;
    }
    setErrorMessage('');
    setIsCreating(true);

    const statuses = [...itemStatuses];
    let hasError = false;

    // Thread context: tracks IDs produced by previous steps so later steps can use them.
    // Specifically, if CREATE_PROJECT_GROUP runs before CREATE_WORKSPACE, we pass the
    // created group ID into the workspace action so it doesn't create another duplicate group.
    let lastCreatedGroupId: string | undefined;

    for (let i = 0; i < actions.length; i++) {
      if (statuses[i] === 'done') continue;
      statuses[i] = 'creating';
      setItemStatuses([...statuses]);
      try {
        // Inject the group ID from a preceding CREATE_PROJECT_GROUP into any
        // CREATE_WORKSPACE or CREATE_NOTE that lacks a project_group_id already.
        let resolvedAction = actions[i];
        if (
          lastCreatedGroupId &&
          (actions[i].type === 'CREATE_WORKSPACE' ||
            actions[i].type === 'CREATE_NOTE') &&
          !actions[i].payload.project_group_id
        ) {
          resolvedAction = {
            ...actions[i],
            payload: {
              ...actions[i].payload,
              project_group_id: lastCreatedGroupId,
            },
          };
        }

        const result = await executeSingleAction(resolvedAction, {
          userId: user.id,
          createTask,
          updateTask,
          createWorkspace,
          createProjectGroup,
        });

        // Track the created group ID to thread into subsequent workspace/note actions.
        if (actions[i].type === 'CREATE_PROJECT_GROUP' && result.id) {
          lastCreatedGroupId = result.id;
        }

        statuses[i] = 'done';
      } catch (err) {
        console.error('Error creating plan item:', err);
        statuses[i] = 'error';
        hasError = true;
      }
      setItemStatuses([...statuses]);
    }

    setIsCreating(false);
    if (!hasError) {
      localStorage.setItem(planKey, 'true');
      setIsCompleted(true);
    } else {
      setErrorMessage(
        'Algunas tareas no se pudieron crear. Vuelve a intentarlo.',
      );
    }
  };

  return {
    open,
    setOpen,
    isCompleted,
    isCreating,
    itemStatuses,
    errorMessage,
    handleCreateAll,
  };
};
