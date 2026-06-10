import { useEffect, useMemo, useState } from 'react';
import type { UseFormWatch } from 'react-hook-form';
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  type PartialBlock,
} from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import type {
  TaskSearchItems,
  WorkspaceFormData,
} from '../../../types/workspace.types';

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
  },
});

export interface UseWorkspaceEditorProps {
  watch: UseFormWatch<WorkspaceFormData>;
  tasksData: { tasks: TaskSearchItems[] } | undefined;
}

export const useWorkspaceEditor = ({
  watch,
  tasksData,
}: UseWorkspaceEditorProps) => {
  const currentTitle = watch('title');
  const currentContent = watch('content');
  const currentFolder = watch('project');

  const [showPalette, setShowPalette] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [runOnboarding, setRunOnboarding] = useState(() => {
    return (
      localStorage.getItem('onboarding_workspace_editor_completed') !== 'true'
    );
  });

  const handleOnboardingComplete = () => {
    setRunOnboarding(false);

    localStorage.setItem('onboarding_workspace_editor_completed', 'true');
  };

  useEffect(() => {
    if (runOnboarding) {
      localStorage.setItem('onboarding_workspace_editor_completed', 'true');
    }
  }, [runOnboarding]);

  const filteredTasks = useMemo(() => {
    if (!tasksData?.tasks) return [];

    const lowerSearch = searchTerm.toLowerCase();

    return tasksData.tasks.filter((task: TaskSearchItems) => {
      const isPlatformTask = task.source === 'platform';
      if (!isPlatformTask) return false;
      return task.title.toLowerCase().includes(lowerSearch);
    });
  }, [tasksData, searchTerm]);

  const initialContent = useMemo(() => {
    try {
      const parsed = currentContent ? JSON.parse(currentContent) : undefined;

      return Array.isArray(parsed) && parsed.length > 0
        ? (parsed as PartialBlock[])
        : undefined;
    } catch (error) {
      console.error('Failed to parse workspace content:', error);

      return undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editor = useCreateBlockNote({
    schema,

    initialContent: initialContent || [
      {
        type: 'paragraph',
        content: 'Welcome to your new workspace! Type / for commands...',
      },
    ],
  });

  const onboardingSteps = [
    {
      target: '#joyride-editor-search',
      content:
        'Use this search bar to quickly find and link tasks to your document.',
    },
    {
      target: '#joyride-editor-area',
      content:
        'Welcome to the smart editor! Type "@" to link other workspaces, or type "/" to bring up formatting options and blocks.',
    },
    {
      target: '#joyride-editor-metadata',
      content:
        'Here you can view and update the status, priority, and estimated time of the task linked to this document.',
    },
    {
      target: '#joyride-editor-full-detail',
      content:
        'Need more details? Click here to open the full task view without leaving the editor.',
    },
  ];

  return {
    currentTitle,
    currentContent,
    currentFolder,

    showPalette,
    setShowPalette,

    searchTerm,
    setSearchTerm,

    filteredTasks,

    editor,

    onboardingSteps,

    runOnboarding,
    setRunOnboarding,
    handleOnboardingComplete,
  };
};
