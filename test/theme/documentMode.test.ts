import { describe, it, expect, beforeEach } from 'vitest';
import { applyModeToDocument } from '@/context/theme/documentMode';

const classes = () => [...document.documentElement.classList].sort();

describe('applyModeToDocument', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    document.documentElement.style.colorScheme = '';
  });

  it('light: only the light class, light native controls', () => {
    applyModeToDocument('light');
    expect(classes()).toEqual(['light']);
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('dark: only the dark class', () => {
    applyModeToDocument('dark');
    expect(classes()).toEqual(['dark']);
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('graydark: dark plus graydark, so its CSS variables override dark ones', () => {
    applyModeToDocument('graydark');
    expect(classes()).toEqual(['dark', 'graydark']);
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('switching modes clears the previous classes', () => {
    applyModeToDocument('graydark');
    applyModeToDocument('light');
    expect(classes()).toEqual(['light']);
  });
});
