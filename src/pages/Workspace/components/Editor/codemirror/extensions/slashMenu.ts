import {
  autocompletion,
  type Completion,
  type CompletionContext,
  type CompletionResult,
} from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import type { EditorView } from '@codemirror/view';
import i18n from '@/i18n';

/**
 * The "/" menu: type "/" at the start of a line (or after a space) to add a
 * heading, list, table, canvas... without knowing Markdown. Each option shows
 * a thin icon and its name in the app's language (no raw Markdown syntax).
 * Filtering ignores case and accents, in the user's language and English.
 */

export interface SlashItem {
  id: string;
  /** English (and common) words it's also found by */
  keywords: string[];
  icon: string;
  /** The block; `{|}` is where the cursor ends up */
  template: () => string;
}

export type CreateCanvasFromSlash = (anchor: {
  top: number;
  left: number;
}) => void;

const svg = (body: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const glyph = (text: string) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="16.8" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor" font-family="inherit">${text}</text></svg>`;

const t = (key: string, options?: Record<string, unknown>) =>
  i18n.t(`editor.slash.${key}`, options);

export const SLASH_ITEMS: SlashItem[] = [
  {
    id: 'h1',
    keywords: ['heading 1', 'title', 'h1'],
    icon: glyph('H1'),
    template: () => '# {|}',
  },
  {
    id: 'h2',
    keywords: ['heading 2', 'subtitle', 'h2'],
    icon: glyph('H2'),
    template: () => '## {|}',
  },
  {
    id: 'h3',
    keywords: ['heading 3', 'h3'],
    icon: glyph('H3'),
    template: () => '### {|}',
  },
  {
    id: 'bullet',
    keywords: ['bulleted list', 'bullet', 'list', 'ul'],
    icon: svg(
      '<circle cx="5" cy="7" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="5" cy="17" r="1"/><path d="M9 7h11M9 12h11M9 17h11"/>',
    ),
    template: () => '- {|}',
  },
  {
    id: 'numbered',
    keywords: ['numbered list', 'ordered', 'ol', 'list'],
    icon: svg(
      '<path d="M4 6h1v4M4 10h2M10 7h10M10 12h10M10 17h10M4 14.5c0-.8 2-.8 2 0s-2 1.5-2 2.5h2"/>',
    ),
    template: () => '1. {|}',
  },
  {
    id: 'todo',
    keywords: ['to-do', 'todo', 'checklist', 'checkbox', 'task'],
    icon: svg(
      '<rect x="3.5" y="4.5" width="6" height="6" rx="1.5"/><path d="m5 7.5 1 1 2-2M13 7.5h7.5M13 16.5h7.5"/><rect x="3.5" y="13.5" width="6" height="6" rx="1.5"/>',
    ),
    template: () => '- [ ] {|}',
  },
  {
    id: 'quote',
    keywords: ['quote', 'blockquote', 'cite'],
    icon: svg('<path d="M5 5v14M9 8h11M9 12h11M9 16h7"/>'),
    template: () => '> {|}',
  },
  {
    id: 'callout',
    keywords: ['callout', 'note', 'info', 'tip', 'warning'],
    icon: svg(
      '<rect x="3" y="4.5" width="18" height="15" rx="3"/><path d="M12 11v4.5M12 8.2v.1"/>',
    ),
    template: () => '> [!note]\n> {|}',
  },
  {
    id: 'toggle',
    keywords: ['toggle', 'collapse', 'details', 'dropdown'],
    icon: svg('<path d="m9 6 6 6-6 6"/>'),
    template: () =>
      `<details open>\n<summary>${t('templates.toggle')}</summary>\n\n{|}\n</details>`,
  },
  {
    id: 'code',
    keywords: ['code', 'snippet', 'pre'],
    icon: svg('<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>'),
    template: () => '```\n{|}\n```',
  },
  {
    id: 'table',
    keywords: ['table', 'grid', 'columns'],
    icon: svg(
      '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M3 10h18M3 15h18M12 4.5v15"/>',
    ),
    template: () => {
      const col = (n: number) => t('templates.column', { n });
      return `| {|}${col(1)} | ${col(2)} |\n| --- | --- |\n|  |  |`;
    },
  },
  {
    id: 'divider',
    keywords: ['divider', 'separator', 'line', 'hr'],
    icon: svg('<path d="M3 12h18"/>'),
    template: () => '---\n{|}',
  },
  {
    id: 'math',
    keywords: ['math', 'equation', 'formula', 'latex'],
    icon: svg('<path d="M17 5H7l6 7-6 7h10"/>'),
    template: () => '$$\n{|}\n$$',
  },
  {
    id: 'diagram',
    keywords: ['diagram', 'mermaid', 'flowchart', 'chart'],
    icon: svg(
      '<rect x="3" y="3.5" width="7" height="5.5" rx="1.2"/><rect x="14" y="15" width="7" height="5.5" rx="1.2"/><path d="M6.5 9v3.5h11V15"/>',
    ),
    template: () =>
      `\`\`\`mermaid\nflowchart TD\n  A[{|}${t('templates.start')}] --> B[${t('templates.end')}]\n\`\`\``,
  },
  {
    id: 'canvas',
    keywords: [
      'canvas',
      'board',
      'draw',
      'whiteboard',
      'excalidraw',
      'pizarra',
      'lienzo',
      'dibujo',
    ],
    icon: svg(
      '<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="2"/><path d="m14 14 3-3 3 3M7 16h6"/>',
    ),
    template: () => '',
  },
];

const fold = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const label = (item: SlashItem) => t(`items.${item.id}`);

/** Items matching what's typed after "/" (in the app's language or
 * English); all of them for a bare "/". */
export const matchSlashItems = (query: string): SlashItem[] => {
  const q = fold(query.trim());
  if (!q) return SLASH_ITEMS;
  return SLASH_ITEMS.filter((item) =>
    [label(item), ...item.keywords, item.id].some(
      (word) =>
        fold(word)
          .split(/\s+/)
          .some((part) => part.startsWith(q)) || fold(word).startsWith(q),
    ),
  );
};

/** Replaces "/query" with the block. A block typed mid-sentence starts on
 * its own line. For "canvas", clears "/query" and opens the create-canvas
 * popover anchored at the cursor. */
export const applySlashItem = (
  view: EditorView,
  item: SlashItem,
  from: number,
  to: number,
  onCreateCanvas?: CreateCanvasFromSlash,
) => {
  if (item.id === 'canvas') {
    let coords: { left: number; bottom: number } | null = null;
    try {
      coords = view.coordsAtPos(from, 1);
    } catch {
      coords = null;
    }
    const anchor = {
      top: (coords?.bottom ?? 0) + 6,
      left: coords?.left ?? 0,
    };
    view.dispatch({
      changes: { from, to, insert: '' },
      selection: { anchor: from },
      userEvent: 'input.complete',
    });
    onCreateCanvas?.(anchor);
    return;
  }

  const line = view.state.doc.lineAt(from);
  const before = view.state.sliceDoc(line.from, from);
  const lead = before.trim() ? '\n' : '';
  const raw = item.template();
  const cursorAt = raw.indexOf('{|}');
  const body = raw.replace('{|}', '');
  view.dispatch({
    changes: { from, to, insert: lead + body },
    selection: {
      anchor: from + lead.length + (cursorAt < 0 ? body.length : cursorAt),
    },
    scrollIntoView: true,
    userEvent: 'input.complete',
  });
};

// No menu inside code: "/" is just a character there
const IN_CODE =
  /^(FencedCode|CodeBlock|CodeText|InlineCode|HTMLBlock|URL|Autolink)$/;

export const createSlashSource =
  (onCreateCanvas?: CreateCanvasFromSlash) =>
  (context: CompletionContext): CompletionResult | null => {
    const match = context.matchBefore(/\/[\p{L}\p{N} ]{0,20}$/u);
    if (!match) return null;
    // A space right after "/" (or two in a row) means it's just text
    if (/^\/\s|\s{2}/.test(match.text)) return null;
    const charBefore = context.state.sliceDoc(match.from - 1, match.from);
    if (match.from > 0 && charBefore && !/\s/.test(charBefore)) return null;

    for (
      let node: ReturnType<typeof syntaxTree>['topNode'] | null = syntaxTree(
        context.state,
      ).resolveInner(match.from, 1);
      node;
      node = node.parent
    ) {
      if (IN_CODE.test(node.name)) return null;
    }

    const items = matchSlashItems(match.text.slice(1));
    if (!items.length) return null;

    return {
      from: match.from,
      to: context.pos,
      filter: false,
      options: items.map((item): Completion & { slash: SlashItem } => ({
        label: label(item),
        slash: item,
        apply: (view, _completion, from, to) =>
          applySlashItem(view, item, from, to, onCreateCanvas),
      })),
    };
  };

export const slashSource = createSlashSource();

export const buildSlashMenuExtension = (
  onCreateCanvas?: CreateCanvasFromSlash,
) =>
  autocompletion({
    override: [createSlashSource(onCreateCanvas)],
    icons: false,
    activateOnTyping: true,
    closeOnBlur: true,
    maxRenderedOptions: 20,
    tooltipClass: () => 'cm-slash-menu',
    optionClass: () => 'cm-slash-option',
    addToOptions: [
      {
        position: 10,
        render: (completion) => {
          const icon = document.createElement('span');
          icon.className = 'cm-slash-icon';
          icon.innerHTML =
            (completion as Completion & { slash?: SlashItem }).slash?.icon ??
            '';
          return icon;
        },
      },
    ],
  });

export const slashMenuExtension = buildSlashMenuExtension();
