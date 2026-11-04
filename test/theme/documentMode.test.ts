import { describe, it, expect, beforeEach } from 'vitest';
import {
  applyModeToDocument,
  THEME_COLORS,
} from '@/context/theme/documentMode';

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

  it("colors the installed app's title bar with the mode's background", () => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
    try {
      applyModeToDocument('light');
      expect(meta.content).toBe(THEME_COLORS.light);
      applyModeToDocument('graydark');
      expect(meta.content).toBe('#19191A');
    } finally {
      meta.remove();
    }
  });

  it('works without a theme-color meta', () => {
    expect(() => applyModeToDocument('dark')).not.toThrow();
  });
});
