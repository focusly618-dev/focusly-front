import { useEffect, useMemo, useRef, useState } from 'react';
import type { UseFormWatch } from 'react-hook-form';
import { BlockNoteEditor, type PartialBlock } from '@blocknote/core';
import type { TaskSearchItems, WorkspaceFormData } from '../../workspace.types';
import type { MarkdownEditorRef } from './codemirror/MarkdownEditor.types';

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
      target: '#joyride-editor-area',
      content:
        '¡Bienvenido al editor! Escribe en Markdown puro — encabezados, negritas, listas y bloques de código con formato en tiempo real.',
    },
    {
      target: '#joyride-editor-sidebar',
      content:
        'Tu panel acompañante: consulta el índice de encabezados (Outline), el mapa visual de nodos y las estadísticas de tu documento.',
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
