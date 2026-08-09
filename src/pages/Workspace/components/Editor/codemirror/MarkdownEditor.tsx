import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { useTheme } from '@mui/material/styles';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { syntaxHighlighting } from '@codemirror/language';
import debounce from 'lodash.debounce';
import { buildMarkdownExtensions } from './extensions';
import { buildEditorTheme } from './theme/editorTheme';
import { buildHighlightStyle } from './theme/highlightStyle';
import { createImperativeApi } from './imperativeApi';
import type {
  MarkdownEditorProps,
  MarkdownEditorRef,
} from './MarkdownEditor.types';

// Mounted once, uncontrolled — `initialValue` is only read at construction
// time (mirrors how the previous BlockNote integration treated
// `initialContent`: a value read once via useMemo, never synced back in on
// every parent re-render). All further reads/writes go through the ref API
// or the `onChange` callback.
export const MarkdownEditor = forwardRef<
  MarkdownEditorRef,
  MarkdownEditorProps
>(({ initialValue, onChange, placeholder }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const theme = useTheme();

  const editorThemeCompartment = useRef(new Compartment()).current;
  const highlightCompartment = useRef(new Compartment()).current;

  const debouncedOnChange = useMemo(
    () => debounce((value: string) => onChange(value), 200),
    [onChange],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        ...buildMarkdownExtensions({
          editorThemeCompartment,
          highlightCompartment,
          initialEditorTheme: buildEditorTheme(theme),
          initialHighlightStyle: buildHighlightStyle(theme),
          placeholder,
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            debouncedOnChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({ state, parent: containerRef.current });
    viewRef.current = view;

    return () => {
      debouncedOnChange.cancel();
      view.destroy();
      viewRef.current = null;
    };
    // Intentionally mount once — see the note above on why `initialValue`
    // is not a dependency here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: [
        editorThemeCompartment.reconfigure(buildEditorTheme(theme)),
        highlightCompartment.reconfigure(
          syntaxHighlighting(buildHighlightStyle(theme)),
        ),
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.appMode]);

  useImperativeHandle(
    ref,
    () => createImperativeApi(() => viewRef.current),
    [],
  );

  return <div ref={containerRef} style={{ height: '100%' }} />;
});

MarkdownEditor.displayName = 'MarkdownEditor';
