import { describe, expect, it } from 'vitest';
import { removeLegacyStorage } from '@/utils/legacyStorage';
import { withoutLeadingTitle } from '@/components/chat/actionPlan/planFormat';

describe('removeLegacyStorage', () => {
  it('removes only the old action keys', () => {
    localStorage.setItem('focusly_action_completed_CREATE_TASK_{}', 'true');
    localStorage.setItem('themeMode', 'light');
    removeLegacyStorage();
    expect(
      localStorage.getItem('focusly_action_completed_CREATE_TASK_{}'),
    ).toBeNull();
    expect(localStorage.getItem('themeMode')).toBe('light');
    localStorage.clear();
  });
});

describe('withoutLeadingTitle', () => {
  it('drops a first heading that repeats the title', () => {
    expect(withoutLeadingTitle('# Plan\n\nTexto', 'plan')).toBe('Texto');
  });

  it('keeps any other heading', () => {
    expect(withoutLeadingTitle('# Otro\n\nTexto', 'Plan')).toBe(
      '# Otro\n\nTexto',
    );
  });
});
