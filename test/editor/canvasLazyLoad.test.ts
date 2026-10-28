import { describe, it, expect, vi } from 'vitest';

// Excalidraw (the canvas's drawing tool) is heavy: opening a note must not
// load it, only opening or creating a canvas. The mock records when the
// library is first evaluated, which is exactly when the real one would be
// downloaded.
const loaded = vi.hoisted(() => ({ excalidraw: false }));
vi.mock('@excalidraw/excalidraw', () => {
  loaded.excalidraw = true;
  return {
    Excalidraw: () => null,
    hashElementsVersion: () => 0,
    convertToExcalidrawElements: (elements: unknown[]) => elements,
  };
});

// The note editor's heavy, unrelated subtrees (CodeMirror with Mermaid and
// KaTeX, the AI panel, the emoji picker) stand in as stubs: they don't lead
// to Excalidraw, and loading them for real made this test crawl on a busy
// runner.
vi.mock(
  '@/pages/Workspace/components/Editor/codemirror/MarkdownEditor',
  () => ({ MarkdownEditor: () => null }),
);
vi.mock(
  '@/pages/Workspace/components/Editor/components/EditorAskAI/EditorAskAI',
  () => ({ EditorAskAI: () => null }),
);
vi.mock('emoji-picker-react', () => ({
  default: () => null,
  Theme: { DARK: 'dark', LIGHT: 'light' },
}));

describe('the drawing tool', () => {
  it('stays out of the editor until a canvas is opened', async () => {
    await import('@/pages/Workspace/components/Editor/components/EditorContent/EditorContent');
    await import('@/pages/Workspace/components/Editor/components/EditorContent/useEditorContent.hook');
    expect(loaded.excalidraw).toBe(false);

    await import('@/pages/Workspace/components/Editor/components/EditorContent/EditorCanvas');
    expect(loaded.excalidraw).toBe(true);
    // Importing the editor for real is slow on a busy runner: the
    // @mui/icons-material barrel alone takes seconds to evaluate
  }, 60_000);
});
