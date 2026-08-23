export interface MarkdownSelection {
  text: string;
  from: number;
  to: number;
}

export interface MarkdownEditorRef {
  getSelection: () => MarkdownSelection;
  replaceRange: (from: number, to: number, text: string) => void;
  insertAtCursor: (text: string) => void;
  insertAtEnd: (text: string) => void;
  setCursor: (pos: number) => void;
  getValue: () => string;
  focus: () => void;
  // Replaces the whole document with a combined old+new preview (deletions
  // struck through, additions underlined) and holds both versions inline
  // until resolveDiff() commits one side and discards the other.
  showDiff: (proposedText: string) => void;
  resolveDiff: (resolution: 'accept' | 'reject') => void;
}

export interface MarkdownEditorProps {
  initialValue: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  // Fired on every selection change inside the editor (empty string when the
  // selection collapses to a cursor). Driven entirely by CodeMirror's own
  // selection state, so clicking into unrelated UI outside the editor (e.g.
  // the floating Ask Lumina input) never triggers it — only an actual
  // selection change inside the editor does.
  onSelectionChange?: (text: string) => void;
}
