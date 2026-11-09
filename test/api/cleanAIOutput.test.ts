import { describe, expect, it } from 'vitest';
import {
  cleanTitle,
  isLeakedReasoning,
  stripLeakedReasoning,
} from '@/api/AI/cleanAIOutput';

describe('stripLeakedReasoning', () => {
  it('leaves a normal reply alone', () => {
    expect(stripLeakedReasoning('  Texto corregido.  ')).toBe(
      'Texto corregido.',
    );
  });

  it('drops a reasoning block before the answer', () => {
    expect(
      stripLeakedReasoning(
        'THOUGHT\nThe user wants this shorter. I will keep the key idea.\n\nEl plan está listo.',
      ),
    ).toBe('El plan está listo.');
  });

  it('takes what follows an answer label', () => {
    expect(
      stripLeakedReasoning(
        '**Thinking:** count the words first\nAnswer: Hola mundo',
      ),
    ).toBe('Hola mundo');
  });

  it('gives nothing back when nothing but reasoning came', () => {
    expect(
      stripLeakedReasoning('THOUGHTThe user wants a short title for this'),
    ).toBe('');
  });
});

describe('cleanTitle', () => {
  it('the leaked title from the app: no title rather than that', () => {
    expect(
      cleanTitle(
        'THOUGHTThe user wants a short, specific title for the document',
      ),
    ).toBe('');
  });

  it('keeps the title after the reasoning', () => {
    expect(
      cleanTitle(
        'THOUGHT\nThe user wants a short title.\n\nPlan de lanzamiento de Focusly',
      ),
    ).toBe('Plan de lanzamiento de Focusly');
  });

  it('strips quotes, markdown, a "Title:" label and a final period', () => {
    expect(cleanTitle('"Notas de la reunión."')).toBe('Notas de la reunión');
    expect(cleanTitle('**Brief de Café Aurora**')).toBe('Brief de Café Aurora');
    expect(cleanTitle('Título: Guía de onboarding')).toBe('Guía de onboarding');
  });

  it.each([
    'Thoughtful design system',
    'Thoughts on the launch',
    'Plan de lanzamiento',
    'Análisis de ventas',
  ])('keeps a real title: %s', (title) => {
    expect(cleanTitle(title)).toBe(title);
  });

  it('refuses a sentence of reasoning', () => {
    expect(cleanTitle('The user wants something about tasks')).toBe('');
    expect(cleanTitle('Let me think of a good name here')).toBe('');
  });
});

describe('isLeakedReasoning', () => {
  it('spots a glued THOUGHT label, not a word that starts the same', () => {
    expect(isLeakedReasoning('THOUGHTThe user wants a short...')).toBe(true);
    expect(isLeakedReasoning('Thought: the user')).toBe(true);
    expect(isLeakedReasoning('Thoughtful design')).toBe(false);
    expect(isLeakedReasoning('codigo abierto')).toBe(false);
  });
});
