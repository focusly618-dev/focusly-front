import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useWorkspaceEditor } from '@/pages/Workspace/components/Editor/useWorkspaceEditor.hook';
import { EMPTY_DOCUMENT, isEmptyDocument } from '@/utils/documentContent';
import { DEFAULT_WORKSPACE_DATA } from '@/utils/constants/constants';

/** What the editor opens with, for a stored content. */
const opened = (content: string | undefined) => {
  const values: Record<string, unknown> = { content };
  const watch = ((name: string) => values[name]) as never;
  const { result } = renderHook(() =>
    useWorkspaceEditor({ watch, tasksData: undefined }),
  );
  return result.current.initialMarkdown;
};

describe('a new document', () => {
  it('starts empty, not with the old editor\'s "[]"', () => {
    expect(EMPTY_DOCUMENT).toBe('');
    expect(DEFAULT_WORKSPACE_DATA.content).toBe('');
  });

  it('opens with nothing written (it used to show "[]")', () => {
    expect(opened('[]')).toBe('');
    expect(opened('  [] ')).toBe('');
    expect(opened('')).toBe('');
    expect(opened(undefined)).toBe('');
  });
});

describe('what counts as empty', () => {
  it.each(['', '   ', '[]', ' [] ', null, undefined])('%j is empty', (c) => {
    expect(isEmptyDocument(c)).toBe(true);
  });

  it.each(['# Plan', '[link](https://x.y)', '[ ] tarea', '[{"type":"p"}]'])(
    '%j is not',
    (c) => {
      expect(isEmptyDocument(c)).toBe(false);
    },
  );
});

describe('documents with content', () => {
  it('markdown opens as it is', () => {
    expect(opened('# Plan\n\n- [ ] Comprar')).toBe('# Plan\n\n- [ ] Comprar');
  });

  it('a markdown line starting with "[" is not mistaken for old JSON', () => {
    expect(opened('[Guía](https://focusly.app)')).toBe(
      '[Guía](https://focusly.app)',
    );
  });

  it("the old editor's blocks are turned into markdown", () => {
    const blocks = JSON.stringify([
      {
        type: 'heading',
        props: { level: 1 },
        content: [{ type: 'text', text: 'Plan', styles: {} }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Primer paso', styles: {} }],
      },
    ]);
    const markdown = opened(blocks);
    expect(markdown).toContain('# Plan');
    expect(markdown).toContain('Primer paso');
    expect(markdown).not.toContain('"type"');
  });
});
