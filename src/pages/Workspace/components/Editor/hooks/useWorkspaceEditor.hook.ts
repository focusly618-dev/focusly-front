import { useEffect, useMemo, useRef, useState } from 'react';
import type { UseFormWatch } from 'react-hook-form';
import { BlockNoteEditor, type PartialBlock } from '@blocknote/core';
import type {
  TaskSearchItems,
  WorkspaceFormData,
} from '../../../types/workspace.types';
import type { MarkdownEditorRef } from '../codemirror/MarkdownEditor.types';

export interface UseWorkspaceEditorProps {
  watch: UseFormWatch<WorkspaceFormData>;
  tasksData: { tasks: TaskSearchItems[] } | undefined;
}

// Notes created before the CodeMirror migration have BlockNote block-JSON in
// `content`. This throwaway, schema-default editor instance exists only to
// convert that legacy JSON to markdown once on load — it is never rendered
// or edited. (The custom "Database Table" block never shipped to real users
// before being removed in the same pass that introduced this migration, so
// the default schema — paragraphs/headings/lists/code/tables/images — covers
// every note that actually exists.)
const convertLegacyBlocksToMarkdown = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return null;

  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const migrationEditor = BlockNoteEditor.create();
    return migrationEditor.blocksToMarkdownLossy(parsed as PartialBlock[]);
  } catch (error) {
    console.error('Failed to migrate legacy workspace content:', error);
    return null;
  }
};

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

  // Read once on mount (and whenever a *different* workspace is loaded) —
  // MarkdownEditor treats this as its uncontrolled `initialValue`, it does
  // not get synced back in on every keystroke.
  const initialMarkdown = useMemo(() => {
    if (!currentContent) return '';
    return convertLegacyBlocksToMarkdown(currentContent) ?? currentContent;
  }, [currentContent]);

  const markdownEditorRef = useRef<MarkdownEditorRef>(null);

  useEffect(() => {
    const handleInsert = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string }>;
      const textToInsert = customEvent.detail?.text;
      if (!textToInsert) return;
      markdownEditorRef.current?.insertAtEnd(textToInsert);
    };

    window.addEventListener('lumina-insert-content', handleInsert);
    return () => {
      window.removeEventListener('lumina-insert-content', handleInsert);
    };
  }, []);

  const onboardingSteps = [
    {
      target: '#joyride-editor-search',
      content:
        'Use this search bar to quickly find and link tasks to your document.',
    },
    {
      target: '#joyride-editor-area',
      content:
        'Welcome to the smart editor! Write in plain Markdown — **bold**, # headings, - lists, and > quotes all render as you type.',
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

    initialMarkdown,
    markdownEditorRef,

    onboardingSteps,

    runOnboarding,
    setRunOnboarding,
    handleOnboardingComplete,
  };
};
