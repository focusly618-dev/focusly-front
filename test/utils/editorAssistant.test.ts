import { describe, it, expect } from 'vitest';
import {
  EDIT_PROPOSAL_END,
  EDIT_PROPOSAL_START,
  REPLACEMENT_END,
  REPLACEMENT_START,
} from '@/api/AI/editorAssistant';
import {
  actionScope,
  applyFragment,
  buildScopedMessage,
  describeUserMessage,
  historyContent,
  linkActionsToWorkspace,
  parseAssistantReply,
} from '@/pages/Workspace/components/Editor/components/EditorAskAI/editorAssistant.utils';
import type { ParsedLuminaAction } from '@/utils/lumina';

describe('parseAssistantReply', () => {
  it('a plain answer is just a note', () => {
    const reply = parseAssistantReply('**Hola**, aquí tienes el resumen.');
    expect(reply).toMatchObject({
      note: '**Hola**, aquí tienes el resumen.',
      edit: null,
      replacement: null,
      actions: [],
    });
  });

  it('splits a whole-document edit from its note', () => {
    const reply = parseAssistantReply(
      `Reordené las secciones.\n${EDIT_PROPOSAL_START}\n# Doc\nTexto\n${EDIT_PROPOSAL_END}`,
    );
    expect(reply.note).toBe('Reordené las secciones.');
    expect(reply.edit).toBe('# Doc\nTexto');
  });

  it('splits a fragment replacement from its note', () => {
    const reply = parseAssistantReply(
      `Lo dejé más claro.\n${REPLACEMENT_START}\nTexto nuevo.\n${REPLACEMENT_END}`,
    );
    expect(reply.note).toBe('Lo dejé más claro.');
    expect(reply.replacement).toBe('Texto nuevo.');
  });

  it('while streaming, an open block is "preparing" and not applied yet', () => {
    const partial = `Listo:\n${REPLACEMENT_START}\nTexto a med`;
    const streaming = parseAssistantReply(partial, { complete: false });
    expect(streaming.isPreparingEdit).toBe(true);
    expect(streaming.replacement).toBeNull();
    expect(streaming.note).toBe('Listo:');

    // Once the stream ends, an unterminated block still counts.
    expect(parseAssistantReply(partial).replacement).toBe('Texto a med');
  });

  it('pulls out CREATE_TASK actions and keeps the text clean', () => {
    const reply = parseAssistantReply(
      'Encontré una tarea.\n[ACTION: CREATE_TASK {"title": "Enviar propuesta", "estimate_timer": 30}]',
    );
    expect(reply.note).toBe('Encontré una tarea.');
    expect(reply.actions).toHaveLength(1);
    expect(reply.actions[0].payload.title).toBe('Enviar propuesta');
  });
});

describe('scoped messages', () => {
  it('round-trips an instruction with its selection', () => {
    const message = buildScopedMessage(
      'Mejora esto.',
      'selection',
      'Un texto\ncon dos líneas',
    );
    expect(describeUserMessage(message)).toEqual({
      text: 'Mejora esto.',
      quote: 'Un texto\ncon dos líneas',
      scope: 'selection',
    });
  });

  it('a fragment with backticks gets a longer fence', () => {
    const fragment = 'Usa ```js\nconsole.log(1)\n``` así';
    const message = buildScopedMessage('Explica.', 'selection', fragment);
    expect(message).toContain('````selection');
    expect(describeUserMessage(message).quote).toBe(fragment);
  });

  it('cursor context is labeled as such', () => {
    const message = buildScopedMessage('Continúa.', 'cursor', 'Hasta aquí');
    expect(describeUserMessage(message).scope).toBe('cursor');
  });

  it('a free-text message has no quote', () => {
    expect(describeUserMessage('¿De qué trata?')).toEqual({
      text: '¿De qué trata?',
      quote: null,
      scope: 'document',
    });
  });

  it('maps actions to their scope', () => {
    expect(actionScope('improve')).toBe('selection');
    expect(actionScope('continue')).toBe('cursor');
    expect(actionScope('extractTasks')).toBe('document');
  });
});

describe('applyFragment', () => {
  const doc = 'Hola mundo cruel.';

  it('replaces the selected range', () => {
    expect(applyFragment({ doc, from: 5, to: 10 }, 'planeta')).toBe(
      'Hola planeta cruel.',
    );
  });

  it('inserts at a cursor, spacing it from the previous word', () => {
    expect(applyFragment({ doc: 'Hola', from: 4, to: 4 }, 'mundo')).toBe(
      'Hola mundo',
    );
    expect(applyFragment({ doc: 'Hola ', from: 5, to: 5 }, 'mundo')).toBe(
      'Hola mundo',
    );
  });
});

describe('history and task links', () => {
  it('assistant history keeps the note, never the block', () => {
    const raw = `Cambié el título.\n${EDIT_PROPOSAL_START}\n# Nuevo\n${EDIT_PROPOSAL_END}`;
    expect(historyContent('assistant', raw)).toBe('Cambié el título.');
    expect(historyContent('user', 'hola')).toBe('hola');
  });

  it('links proposed tasks to the document', () => {
    const actions: ParsedLuminaAction[] = [
      { type: 'CREATE_TASK', payload: { title: 'A' } },
      { type: 'CREATE_WORKSPACE', payload: { title: 'B' } },
    ];
    const linked = linkActionsToWorkspace(actions, 'ws-1');
    expect(linked[0].payload.workspace_id).toBe('ws-1');
    expect(linked[1].payload.workspace_id).toBeUndefined();
    expect(linkActionsToWorkspace(actions, null)).toBe(actions);
  });
});
