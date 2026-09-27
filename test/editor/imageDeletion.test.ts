import { describe, it, expect } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import {
  findImageAt,
  deleteImageBackward,
  deleteImageForward,
} from '@/pages/Workspace/components/Editor/codemirror/extensions/livePreview/image';

if (typeof window !== 'undefined') {
  window.Range.prototype.getClientRects = () => [] as unknown as DOMRectList;
  window.Range.prototype.getBoundingClientRect = () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => {},
  });
}

function createView(
  doc: string,
  selection?: { anchor: number; head?: number },
): EditorView {
  const state = EditorState.create({
    doc,
    selection,
    extensions: [markdown()],
  });
  return new EditorView({ state });
}

describe('Image deletion and protection', () => {
  it('finds image when cursor is at the end of the image (Backspace)', () => {
    const doc = 'Hello\n![cat](https://example.com/cat.png)\nWorld';
    const view = createView(doc);
    const imgEnd = doc.indexOf(')') + 1;

    const info = findImageAt(view.state, imgEnd, -1);
    expect(info).not.toBeNull();
    expect(info?.from).toBe(doc.indexOf('!['));
    expect(info?.to).toBe(imgEnd);
    expect(info?.isWholeLine).toBe(true);
  });

  it('finds image when cursor is at the start of the image (Delete)', () => {
    const doc = 'Hello\n![cat](https://example.com/cat.png)\nWorld';
    const view = createView(doc);
    const imgStart = doc.indexOf('![');

    const info = findImageAt(view.state, imgStart, 1);
    expect(info).not.toBeNull();
    expect(info?.from).toBe(imgStart);
    expect(info?.to).toBe(doc.indexOf(')') + 1);
    expect(info?.isWholeLine).toBe(true);
  });

  it('does not target image if cursor is after a space outside the image', () => {
    const doc = 'Hello ![cat](https://example.com/cat.png) world';
    const view = createView(doc);
    const posAfterSpace = doc.indexOf(')') + 2; // after the space

    const info = findImageAt(view.state, posAfterSpace, -1);
    // At posAfterSpace, pos - 1 is the space, so it should not delete the image
    expect(info).toBeNull();
  });

  it('deletes entire image and line break on Backspace when image is on its own line', () => {
    const doc =
      'Line 1\n![photo](data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==)\nLine 3';
    const imgEnd = doc.indexOf(')') + 1;
    const view = createView(doc, { anchor: imgEnd });

    const handled = deleteImageBackward(view);
    expect(handled).toBe(true);
    expect(view.state.doc.toString()).toBe('Line 1\nLine 3');
  });

  it('deletes entire image and line break on Delete when cursor is before the image', () => {
    const doc = 'Line 1\n![photo](https://example.com/pic.png)\nLine 3';
    const imgStart = doc.indexOf('![');
    const view = createView(doc, { anchor: imgStart });

    const handled = deleteImageForward(view);
    expect(handled).toBe(true);
    expect(view.state.doc.toString()).toBe('Line 1\nLine 3');
  });

  it('deletes only the image range when inline with other text', () => {
    const doc = 'Prefix ![photo](https://example.com/pic.png) Suffix';
    const imgEnd = doc.indexOf(')') + 1;
    const view = createView(doc, { anchor: imgEnd });

    const handled = deleteImageBackward(view);
    expect(handled).toBe(true);
    expect(view.state.doc.toString()).toBe('Prefix  Suffix');
  });

  it('handles and deletes damaged image markdown missing closing paren', () => {
    const doc = 'Line 1\n![broken](data:image/png;base64,1234567890\nLine 3';
    // Cursor at end of the damaged image line
    const line2End = doc.indexOf('\nLine 3');
    const view = createView(doc, { anchor: line2End });

    const handled = deleteImageBackward(view);
    expect(handled).toBe(true);
    expect(view.state.doc.toString()).toBe('Line 1\nLine 3');
  });

  it('deletes image when entire image is selected', () => {
    const doc = 'Line 1\n![photo](https://example.com/pic.png)\nLine 3';
    const from = doc.indexOf('![');
    const to = doc.indexOf(')') + 1;
    const view = createView(doc, { anchor: from, head: to });

    const handled = deleteImageBackward(view);
    expect(handled).toBe(true);
    expect(view.state.doc.toString()).toBe('Line 1\nLine 3');
  });
});
