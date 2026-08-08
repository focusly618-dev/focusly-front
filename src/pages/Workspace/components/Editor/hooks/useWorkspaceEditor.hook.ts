import { useEffect, useMemo, useState } from 'react';
import type { UseFormWatch } from 'react-hook-form';
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  type PartialBlock,
  BlockNoteEditor,
} from '@blocknote/core';
import { createCodeBlockSpec } from '@blocknote/core/blocks';
import { useCreateBlockNote } from '@blocknote/react';
import { createHighlighter as createShikiHighlighter } from 'shiki';
import { compressImageToDataUrl } from '@/utils';
import { DatabaseTableBlock } from '../blocks/DatabaseTable/DatabaseTableBlock';
import type {
  TaskSearchItems,
  WorkspaceFormData,
} from '../../../types/workspace.types';

// Languages selectable from the dropdown that appears on every code block.
// Typing ` ```js ` (etc.) at the start of a line also auto-selects the
// matching language via its alias.
export const CODE_BLOCK_LANGUAGES: Record<
  string,
  { name: string; aliases?: string[] }
> = {
  text: { name: 'Plain Text', aliases: ['plaintext', 'txt'] },
  markdown: { name: 'Markdown', aliases: ['md'] },
  javascript: { name: 'JavaScript', aliases: ['js'] },
  typescript: { name: 'TypeScript', aliases: ['ts'] },
  jsx: { name: 'JSX' },
  tsx: { name: 'TSX' },
  python: { name: 'Python', aliases: ['py'] },
  java: { name: 'Java' },
  csharp: { name: 'C#', aliases: ['cs', 'c#'] },
  cpp: { name: 'C++', aliases: ['c++'] },
  c: { name: 'C' },
  go: { name: 'Go', aliases: ['golang'] },
  rust: { name: 'Rust', aliases: ['rs'] },
  php: { name: 'PHP' },
  ruby: { name: 'Ruby', aliases: ['rb'] },
  swift: { name: 'Swift' },
  kotlin: { name: 'Kotlin', aliases: ['kt'] },
  sql: { name: 'SQL' },
  bash: { name: 'Bash', aliases: ['sh', 'shell'] },
  json: { name: 'JSON' },
  yaml: { name: 'YAML', aliases: ['yml'] },
  html: { name: 'HTML' },
  css: { name: 'CSS' },
};

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    codeBlock: createCodeBlockSpec({
      defaultLanguage: 'text',
      supportedLanguages: CODE_BLOCK_LANGUAGES,
      // Lazy: only fetched the first time a code block is actually rendered.
      // BlockNote always calls `codeToTokens` with a single, fixed `theme`
      // (picked once and cached for the whole session), so a plain
      // `themes: ['x']` highlighter can't react to the app's light/dark
      // toggle. Instead we wrap the highlighter to always request Shiki's
      // dual-theme output (CSS variables per token) so the actual color is
      // resolved live in CSS via the `[data-mantine-color-scheme]` attribute
      // BlockNoteView already sets — see the `.shiki` rules in
      // WorkspaceEditor.styles.ts.
      createHighlighter: async () => {
        const highlighter = await createShikiHighlighter({
          themes: ['github-light', 'github-dark'],
          langs: Object.keys(CODE_BLOCK_LANGUAGES).filter((l) => l !== 'text'),
        });

        return Object.assign(Object.create(highlighter), {
          codeToTokens: (code: string, options: { lang?: string }) =>
            highlighter.codeToTokens(code, {
              lang: options?.lang as Parameters<
                typeof highlighter.codeToTokens
              >[1]['lang'],
              themes: { light: 'github-light', dark: 'github-dark' },
              defaultColor: false,
            }),
        });
      },
    }),
    databaseTable: DatabaseTableBlock(),
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
    if (!currentContent) return undefined;

    const trimmed = currentContent.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) && parsed.length > 0
          ? (parsed as PartialBlock[])
          : undefined;
      } catch (error) {
        console.error('Failed to parse workspace content as JSON:', error);
      }
    }

    // Fallback: Parse raw Markdown/plain text content using BlockNote's native markdown parser
    try {
      const tempEditor = BlockNoteEditor.create({ schema });
      const blocks = tempEditor.tryParseMarkdownToBlocks(currentContent);
      return (blocks.length > 0 ? blocks : undefined) as PartialBlock[];
    } catch (e) {
      console.error(
        'Failed to parse content using tryParseMarkdownToBlocks:',
        e,
      );
      return undefined;
    }
  }, [currentContent]);

  const editor = useCreateBlockNote({
    schema,
    initialContent: initialContent || [
      {
        type: 'paragraph',
        content: 'Welcome to your new workspace! Type / for commands...',
      },
    ],
    uploadFile: async (file: File) => {
      // Compress the image before storing it as base64.
      // • WebP output: ~60-80 % smaller than the raw PNG/JPEG base64.
      // • Max side: 1920 px (full-HD) — sufficient for any editor display.
      // • Quality: 0.82 — visually lossless at screen resolution.
      // • GIF / SVG are passed through unchanged (Canvas can't re-encode them).
      return compressImageToDataUrl(file, { maxSidePx: 1920, quality: 0.82 });
    },
  });

  useEffect(() => {
    if (!editor) return;

    const handleInsert = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string }>;
      const textToInsert = customEvent.detail?.text;
      if (!textToInsert) return;

      try {
        const blocks = editor.tryParseMarkdownToBlocks(textToInsert);
        // Insert at the end of the document
        const lastBlock = editor.document[editor.document.length - 1];
        editor.insertBlocks(blocks, lastBlock, 'after');
      } catch (err) {
        console.error(
          'Lumina failed to insert blocks into BlockNote editor:',
          err,
        );
      }
    };

    window.addEventListener('lumina-insert-content', handleInsert);
    return () => {
      window.removeEventListener('lumina-insert-content', handleInsert);
    };
  }, [editor]);

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
