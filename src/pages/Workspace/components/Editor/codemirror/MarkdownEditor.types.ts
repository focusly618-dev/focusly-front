export interface MarkdownSelection {
  text: string;
  from: number;
  to: number;
}

export interface MarkdownEditorRef {
  getSelection: () => MarkdownSelection;
  // Selects the paragraph (run of non-blank lines) under a screen point, as
  // the right-click menu's target when nothing is selected. Null on a blank
  // line or outside the text.
  selectParagraphAt: (x: number, y: number) => MarkdownSelection | null;
  replaceRange: (from: number, to: number, text: string) => void;
  // Rewrites ranges in place without moving the cursor, scrolling or taking
  // focus — for edits made from outside the text, like renaming a canvas
  // link while its title is being typed. Positions are in the current doc.
  applyChanges: (
    changes: { from: number; to: number; insert: string }[],
  ) => void;
  insertAtCursor: (text: string) => void;
  // Where a document position is drawn on screen (viewport coordinates), to
  // anchor UI to the text. `side` picks the character before (-1) or after
  // (1) it, which matters at line ends. Null when it isn't rendered.
  coordsAtPos: (
    pos: number,
    side?: -1 | 1,
  ) => { left: number; right: number; top: number; bottom: number } | null;
  insertAtEnd: (text: string) => void;
  setCursor: (pos: number) => void;
  jumpToSection: (target: { pos?: number; text?: string }) => boolean;
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
