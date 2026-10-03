import {
  CURSOR_FENCE,
  EDIT_PROPOSAL_END,
  EDIT_PROPOSAL_START,
  REPLACEMENT_END,
  REPLACEMENT_START,
  SELECTION_FENCE,
} from '@/api/AI/editorAssistant';
import { parseLuminaActions, type ParsedLuminaAction } from '@/utils/lumina';

export type QuickActionId =
  | 'improve'
  | 'fix'
  | 'shorter'
  | 'longer'
  | 'translate'
  | 'explain'
  | 'matchStyle'
  | 'summarize'
  | 'continue'
  | 'extractTasks'
  | 'proofread';

export type ActionScope = 'selection' | 'cursor' | 'document';

/** Shown while text is selected; they act on the selection. */
export const SELECTION_ACTIONS: QuickActionId[] = [
  'improve',
  'fix',
  'shorter',
  'longer',
  'translate',
  'explain',
  'matchStyle',
];

/** Shown without a selection; they act on the document or the cursor. */
export const DOCUMENT_ACTIONS: QuickActionId[] = [
  'summarize',
  'continue',
  'extractTasks',
  'proofread',
];

export const TRANSLATE_LANGUAGES = [
  'es',
  'en',
  'ja',
  'pt',
  'fr',
  'de',
] as const;

/** How much text before the cursor "continue writing" sends along. */
export const CURSOR_CONTEXT_CHARS = 1500;

export const actionScope = (id: QuickActionId): ActionScope =>
  SELECTION_ACTIONS.includes(id)
    ? 'selection'
    : id === 'continue'
      ? 'cursor'
      : 'document';

/** Where a fragment reply lands: the document as it was when asked. */
export interface FragmentTarget {
  doc: string;
  from: number;
  to: number;
}

const fenceFor = (text: string) => {
  const longestRun = Math.max(
    0,
    ...(text.match(/`+/g) ?? []).map((r) => r.length),
  );
  return '`'.repeat(Math.max(3, longestRun + 1));
};

/** A user message that quotes part of the document in a labeled fence. */
export const buildScopedMessage = (
  instruction: string,
  scope: ActionScope,
  fragment = '',
): string => {
  if (scope === 'document') return instruction;
  const label = scope === 'selection' ? SELECTION_FENCE : CURSOR_FENCE;
  const fence = fenceFor(fragment);
  return `${instruction}\n\n${fence}${label}\n${fragment}\n${fence}`;
};

export interface UserMessageView {
  text: string;
  quote: string | null;
  scope: ActionScope;
}

const SCOPED_MESSAGE = new RegExp(
  String.raw`^([\s\S]*?)\n\n(\`{3,})(${SELECTION_FENCE}|${CURSOR_FENCE})\n([\s\S]*?)\n\2\s*$`,
);

/** Splits a user message back into its instruction and quoted fragment. */
export const describeUserMessage = (content: string): UserMessageView => {
  const match = SCOPED_MESSAGE.exec(content);
  if (!match) return { text: content, quote: null, scope: 'document' };
  return {
    text: match[1].trim(),
    quote: match[4],
    scope: match[3] === SELECTION_FENCE ? 'selection' : 'cursor',
  };
};

export interface AssistantReply {
  /** The conversational part, without blocks or action tags. */
  note: string;
  /** A complete revised document (whole-document edit). */
  edit: string | null;
  /** New text for the quoted fragment. */
  replacement: string | null;
  actions: ParsedLuminaAction[];
  /** A block has started streaming but isn't finished yet. */
  isPreparingEdit: boolean;
  /** An action tag has started streaming but isn't finished yet. */
  isPreparingActions: boolean;
}

const BLOCKS = [
  { start: EDIT_PROPOSAL_START, end: EDIT_PROPOSAL_END, kind: 'edit' },
  { start: REPLACEMENT_START, end: REPLACEMENT_END, kind: 'replacement' },
] as const;

/** Reads a (possibly still streaming) assistant reply. */
export const parseAssistantReply = (
  raw: string,
  { complete = true }: { complete?: boolean } = {},
): AssistantReply => {
  let first: { index: number; block: (typeof BLOCKS)[number] } | null = null;
  for (const block of BLOCKS) {
    const index = raw.indexOf(block.start);
    if (index !== -1 && (!first || index < first.index)) {
      first = { index, block };
    }
  }

  const before = first ? raw.slice(0, first.index) : raw;
  const { cleanText, actions, hasPendingAction } = parseLuminaActions(before);

  let edit: string | null = null;
  let replacement: string | null = null;
  let isPreparingEdit = false;
  if (first) {
    const bodyStart = first.index + first.block.start.length;
    const endIndex = raw.indexOf(first.block.end, bodyStart);
    const closed = endIndex !== -1;
    // An unterminated block counts once the stream is over: the model
    // sometimes drops the closing marker.
    if (closed || complete) {
      const body = raw
        .slice(bodyStart, closed ? endIndex : undefined)
        .replace(/^\r?\n/, '')
        .replace(/\s+$/, '');
      if (body) {
        if (first.block.kind === 'edit') edit = body;
        else replacement = body;
      }
    } else {
      isPreparingEdit = true;
    }
  }

  return {
    note: cleanText.trim(),
    edit,
    replacement,
    actions,
    isPreparingEdit,
    isPreparingActions: hasPendingAction && !complete,
  };
};

/** The target document with the fragment replaced (or inserted at a cursor). */
export const applyFragment = (
  target: FragmentTarget,
  replacement: string,
): string => {
  const { doc, from, to } = target;
  let text = replacement;
  // Continuing mid-line: keep the new text from gluing onto the last word.
  if (
    from === to &&
    from > 0 &&
    !/\s$/.test(doc.slice(0, from)) &&
    !/^\s/.test(text)
  ) {
    text = ` ${text}`;
  }
  return `${doc.slice(0, from)}${text}${doc.slice(to)}`;
};

/** The reply as conversation history: what the backend keeps, too. */
export const historyContent = (role: 'user' | 'assistant', raw: string) =>
  role === 'user' ? raw : parseAssistantReply(raw).note || '✏️';

/** Links tasks Lumina proposes to the document they came from. */
export const linkActionsToWorkspace = (
  actions: ParsedLuminaAction[],
  workspaceId?: string | null,
): ParsedLuminaAction[] =>
  workspaceId
    ? actions.map((action) =>
        action.type === 'CREATE_TASK'
          ? {
              ...action,
              payload: { ...action.payload, workspace_id: workspaceId },
            }
          : action,
      )
    : actions;

/**
 * A finished reply's change, waiting to be shown as a diff. It only goes up
 * for review automatically on top of the document it was written for, so a
 * reply that finishes while the document is closed (or edited meanwhile)
 * never overwrites newer text.
 */
export interface PendingReview {
  messageId: string;
  /** The whole document with the change applied. */
  proposedDoc: string;
  /** The document the change was written against. */
  baseDoc: string;
  /** For fragment replies: the fragment, offered for manual insert instead. */
  fragment: string | null;
}

export type ReplyOutcome =
  | { kind: 'review'; review: PendingReview }
  | { kind: 'fragment'; fragment: string }
  | { kind: 'none' };

/** What a finished reply asks of the editor. */
export const replyOutcome = (
  messageId: string,
  text: string,
  target: FragmentTarget | null,
  documentText: string,
): ReplyOutcome => {
  const reply = parseAssistantReply(text);
  if (reply.edit) {
    return {
      kind: 'review',
      review: {
        messageId,
        proposedDoc: reply.edit,
        baseDoc: documentText,
        fragment: null,
      },
    };
  }
  if (reply.replacement) {
    if (!target) return { kind: 'fragment', fragment: reply.replacement };
    return {
      kind: 'review',
      review: {
        messageId,
        proposedDoc: applyFragment(target, reply.replacement),
        baseDoc: target.doc,
        fragment: reply.replacement,
      },
    };
  }
  return { kind: 'none' };
};
