import { EditorView } from '@codemirror/view';
import { compressImageToDataUrl } from '@/utils/images/imageCompressor';
import { sileo } from '@/utils';

// Compression is async, so a placeholder token is inserted synchronously at
// paste time and later found-and-replaced by exact text match — this stays
// correct even if the user keeps typing elsewhere while the image compresses,
// without needing to track/remap document positions across transactions.
// Deliberately plain text, not `![...](...)` syntax — the Image live-preview
// widget would otherwise try to render the placeholder itself as an <img>
// with a bogus src and flash a broken-image icon while compression runs.
const makeToken = (file: File) =>
  `⏳ Uploading ${file.name || 'image'}… #${Math.random().toString(36).slice(2)}`;

const uploadAndReplace = (view: EditorView, file: File, token: string) => {
  compressImageToDataUrl(file)
    .then((dataUrl) => {
      const idx = view.state.doc.toString().indexOf(token);
      if (idx === -1) return;
      const alt = (file.name || 'image').replace(/\.[^./]+$/, '');
      view.dispatch({
        changes: {
          from: idx,
          to: idx + token.length,
          insert: `![${alt}](${dataUrl})`,
        },
      });
    })
    .catch((error) => {
      console.error('Failed to process pasted image:', error);
      const idx = view.state.doc.toString().indexOf(token);
      if (idx !== -1) {
        view.dispatch({
          changes: { from: idx, to: idx + token.length, insert: '' },
        });
      }
      sileo.error({
        title: 'Image paste failed',
        description: 'Could not process the pasted image.',
        fill: 'var(--sileo-error-bg)',
      });
    });
};

export const imagePasteExtension = EditorView.domEventHandlers({
  paste(event, view) {
    const files = Array.from(event.clipboardData?.files ?? []).filter((file) =>
      file.type.startsWith('image/'),
    );
    if (files.length === 0) return false;

    event.preventDefault();

    const tokens = files.map(makeToken);
    const { from, to } = view.state.selection.main;
    const insertText = tokens.join('\n\n');
    view.dispatch({
      changes: { from, to, insert: insertText },
      selection: { anchor: from + insertText.length },
    });

    files.forEach((file, i) => uploadAndReplace(view, file, tokens[i]));
    return true;
  },
});
