import { describe, it, expect, vi, afterEach } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { markdownExtension } from '@/pages/Workspace/components/Editor/codemirror/extensions/markdownLanguage';
import { targetHighlightExtension } from '@/pages/Workspace/components/Editor/codemirror/extensions/targetHighlight';
import { createImperativeApi } from '@/pages/Workspace/components/Editor/codemirror/imperativeApi';

if (typeof window !== 'undefined') {
  window.Range.prototype.getClientRects = () => [] as unknown as DOMRectList;
  window.Range.prototype.getBoundingClientRect = () =>
    ({ top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 }) as DOMRect;
}

const DOC = 'Intro text\n\n## Goals\n\nSome goals\n\n## Next steps\n\nMore';

const setup = (cursor = 3) => {
  const view = new EditorView({
    state: EditorState.create({
      doc: DOC,
      selection: { anchor: cursor },
      extensions: [markdownExtension, targetHighlightExtension],
    }),
  });
  return { view, api: createImperativeApi(() => view) };
};

afterEach(() => vi.useRealTimers());

describe('jumping to a section', () => {
  it('tints just the heading line, with no glow on its text', () => {
    const { view, api } = setup();

    expect(api.jumpToSection({ text: 'Next steps' })).toBe(true);

    const tinted = view.contentDOM.querySelectorAll('.cm-target-line');
    expect([...tinted].map((l) => l.textContent)).toEqual(['## Next steps']);
    expect(view.contentDOM.querySelector('.cm-target-text-glow')).toBeNull();
    expect(view.contentDOM.querySelector('.cm-target-line-glow')).toBeNull();
  });

  it("leaves the user's cursor where it was", () => {
    const { view, api } = setup(3);
    api.jumpToSection({ text: 'Goals' });
    expect(view.state.selection.main).toMatchObject({ anchor: 3, head: 3 });
  });

  it('clears the tint once it has faded', () => {
    vi.useFakeTimers();
    const { view, api } = setup();

    api.jumpToSection({ text: 'Goals' });
    expect(view.contentDOM.querySelector('.cm-target-line')).not.toBeNull();

    vi.advanceTimersByTime(1800);
    expect(view.contentDOM.querySelector('.cm-target-line')).toBeNull();
  });
});
