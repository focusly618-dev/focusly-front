import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useAppSelector } from '@/redux/hooks';
import { CREATE_TASK } from '@/pages/Tasks/Tasks.graphql';
import {
  CREATE_PROJECT_GROUP,
  CREATE_WORKSPACE,
} from '@/pages/Workspace/Workspace.graphql';
import type { ParsedLuminaAction } from '@/utils';
import { executeSingleAction } from '../suggestedActionCard/actionExecution.utils';
import type { PlanItemStatus } from './SuggestedActionsPlan.types';

export const useSuggestedActionsPlan = (actions: ParsedLuminaAction[]) => {
  const { user } = useAppSelector((state) => state.auth);

  const planKey = `focusly_plan_completed_${JSON.stringify(actions)}`;
  const initiallyCompleted = localStorage.getItem(planKey) === 'true';

  const [open, setOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initiallyCompleted);
  const [isCreating, setIsCreating] = useState(false);
  const [itemStatuses, setItemStatuses] = useState<PlanItemStatus[]>(() =>
    actions.map(() => (initiallyCompleted ? 'done' : 'pending')),
  );
  const [errorMessage, setErrorMessage] = useState('');

  const [createTask] = useMutation(CREATE_TASK);
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

    for (let i = 0; i < actions.length; i++) {
      if (statuses[i] === 'done') continue;
      statuses[i] = 'creating';
      setItemStatuses([...statuses]);
      try {
        await executeSingleAction(actions[i], {
          userId: user.id,
          createTask,
          createWorkspace,
          createProjectGroup,
        });
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
