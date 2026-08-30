import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm, useWatch } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { CREATE_WORKSPACE, UPDATE_WORKSPACE } from '../Workspace.graphql';
import type { WorkspaceFormData } from '../types/workspace.types';
import { DEFAULT_WORKSPACE_DATA } from '@/utils';
import { generateWorkspaceTitle } from '@/api/AI/apiAI';
import { stripMarkdown } from '@/components/chat/suggestedActionCard/actionExecution.utils';

// Below this many characters of actual (non-markdown) text, there isn't
// enough signal yet for a meaningful AI title — wait for more content
// instead of spending a request on "Untitled"-tier input.
const MIN_CONTENT_LENGTH_FOR_AUTO_TITLE = 40;

export const useWorkspaceForm = () => {
  const [createWorkspace] = useMutation(CREATE_WORKSPACE, {
    refetchQueries: [
      'GetWorkspacesPaginated',
      'GetWorkspaces',
      'GetProjectGroups',
    ],
    update(cache) {
      cache.evict({ fieldName: 'workspacesPaginated' });
      cache.evict({ fieldName: 'workspaces' });
      cache.gc();
    },
  });
  const [updateWorkspace] = useMutation(UPDATE_WORKSPACE, {
    refetchQueries: ['GetWorkspacesPaginated', 'GetWorkspaces'],
    update(cache) {
      cache.evict({ fieldName: 'workspacesPaginated' });
      cache.evict({ fieldName: 'workspaces' });
    },
  });

  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>(
    'idle',
  );
  const isMountedRef = useRef(true);
  const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }
    };
  }, []);

  const safeSetSaveState = useCallback((state: 'idle' | 'saving' | 'saved') => {
    if (isMountedRef.current) {
      setSaveState(state);
    }
  }, []);

  const { register, watch, setValue, getValues, reset, control } =
    useForm<WorkspaceFormData>({
      defaultValues: DEFAULT_WORKSPACE_DATA,
    });

  const values = useWatch({ control }) as WorkspaceFormData;

  const saveToBackend = useCallback(
    async (data: WorkspaceFormData) => {
      safeSetSaveState('saving');
      try {
        if (data.id) {
          await updateWorkspace({
            variables: {
              updateWorkspaceInput: {
                id: data.id,
                title: data.title,
                content: data.content,
                taskId: data.taskId ?? null,
                saveStatus: data.saveStatus ?? true,
                emoji: data.emoji ?? undefined,
                background_color: data.background_color ?? undefined,
                card_show_background: data.card_show_background ?? undefined,
                groupId: data.groupId ?? null,
              },
            },
          });
        } else {
          if (!data.title?.trim() && data.content === '[]') {
            safeSetSaveState('idle');
            return;
          }

          const result = await createWorkspace({
            variables: {
              createWorkspaceInput: {
                title: data.title,
                content: data.content,
                taskId: data.taskId,
                saveStatus: data.saveStatus ?? true,
                groupId: data.groupId ?? null,
                emoji: data.emoji ?? undefined,
                background_color: data.background_color ?? undefined,
                card_show_background: data.card_show_background ?? undefined,
              },
            },
          });

          if (result.data?.createWorkspace?.id && isMountedRef.current) {
            setValue('id', result.data.createWorkspace.id);
          }
        }

        safeSetSaveState('saved');

        if (savedTimeoutRef.current) {
          clearTimeout(savedTimeoutRef.current);
        }
        savedTimeoutRef.current = setTimeout(() => {
          safeSetSaveState('idle');
        }, 2000);
      } catch (err) {
        console.error('Error saving workspace:', err);
        safeSetSaveState('idle');
      }
    },
    [createWorkspace, updateWorkspace, setValue, safeSetSaveState],
  );

  const debouncedSave = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs
      debounce((data: WorkspaceFormData) => {
        saveToBackend(data);
      }, 1000),
    [saveToBackend],
  );

  const lastId = useRef(values.id);
  const lastSavedValues = useRef(
    JSON.stringify({
      title: values.title,
      content: values.content,
      taskId: values.taskId ?? null,
      groupId: values.groupId ?? null,
      emoji: values.emoji ?? null,
      background_color: values.background_color ?? null,
      card_show_background: values.card_show_background ?? false,
    }),
  );

  useEffect(() => {
    const currentValues = JSON.stringify({
      title: values.title,
      content: values.content,
      taskId: values.taskId ?? null,
      groupId: values.groupId ?? null,
      emoji: values.emoji ?? null,
      background_color: values.background_color ?? null,
      card_show_background: values.card_show_background ?? false,
    });

    // If we switched workspaces, reset the baseline and don't save yet
    if (values.id !== lastId.current) {
      lastId.current = values.id;
      lastSavedValues.current = currentValues;
      safeSetSaveState('idle');
      return;
    }

    if (currentValues !== lastSavedValues.current) {
      const parsedCurrent = JSON.parse(currentValues);
      const parsedLast = JSON.parse(lastSavedValues.current);

      // Immediately set saveState to 'saving' so the spinner shows up during debounce delay
      safeSetSaveState('saving');
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }

      // If ONLY or ALSO the taskId changed, save immediately
      if (parsedCurrent.taskId !== parsedLast.taskId) {
        saveToBackend(values);
      } else {
        debouncedSave(values);
      }

      lastSavedValues.current = currentValues;
    }
  }, [values, debouncedSave, saveToBackend, safeSetSaveState]);

  useEffect(() => {
    return () => {
      debouncedSave.flush();
    };
  }, [debouncedSave]);

  // Auto-title: once a workspace with no title (typed or otherwise) has
  // enough real content, ask the AI for a short title instead of leaving it
  // blank forever. Runs at most once per workspace — a title the user later
  // clears back out won't be regenerated.
  const titleGenerationRef = useRef<{ id?: string; attempted: boolean }>({
    id: values.id,
    attempted: false,
  });

  useEffect(() => {
    if (titleGenerationRef.current.id === values.id) return;
    titleGenerationRef.current = { id: values.id, attempted: false };
  }, [values.id]);

  useEffect(() => {
    if (titleGenerationRef.current.attempted) return;
    if (values.title?.trim()) return;

    const plainText = stripMarkdown(values.content ?? '');
    if (plainText.length < MIN_CONTENT_LENGTH_FOR_AUTO_TITLE) return;

    titleGenerationRef.current.attempted = true;
    generateWorkspaceTitle(plainText)
      .then((generated) => {
        if (generated && isMountedRef.current) {
          setValue('title', generated, { shouldDirty: true });
        }
      })
      .catch((err) => {
        console.error('Failed to auto-generate workspace title:', err);
      });
  }, [values.id, values.title, values.content, setValue]);

  return {
    register,
    watch,
    setValue,
    getValues,
    reset,
    control,
    values,
    saveStatus: values.saveStatus || false,
    saveState,
  };
};
