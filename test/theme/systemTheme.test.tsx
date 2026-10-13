import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useContext } from 'react';
import { useTheme } from '@mui/material';
import { AppThemeProvider, ColorModeContext } from '@/context/theme';
import {
  readSavedPreference,
  resolveThemeMode,
} from '@/context/theme/themePreference';

// A matchMedia whose answer can be flipped, as when the OS switches mode.
const fakeSystem = (dark: boolean) => {
  const listeners = new Set<() => void>();
  const mq = {
    get matches() {
      return dark;
    },
    addEventListener: (_: string, cb: () => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
  };
  window.matchMedia = vi.fn(() => mq) as unknown as typeof window.matchMedia;
  return {
    set: (next: boolean) => {
      dark = next;
      listeners.forEach((cb) => cb());
    },
    listeners,
  };
};

const Probe = () => {
  const { mode, preference, setMode, toggleColorMode } =
    useContext(ColorModeContext);
  const theme = useTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="preference">{preference}</span>
      <span data-testid="palette">{theme.palette.mode}</span>
      <button onClick={() => setMode('system')}>system</button>
      <button onClick={() => setMode('graydark')}>graydark</button>
      <button onClick={toggleColorMode}>toggle</button>
    </div>
  );
};

const renderApp = () =>
  render(
    <AppThemeProvider>
      <Probe />
    </AppThemeProvider>,
  );

const text = (id: string) => screen.getByTestId(id).textContent;
const originalMatchMedia = window.matchMedia;

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = '';
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

describe('theme preference', () => {
  it("'system' follows the OS; a chosen theme ignores it", () => {
    expect(resolveThemeMode('system', true)).toBe('dark');
    expect(resolveThemeMode('system', false)).toBe('light');
    expect(resolveThemeMode('light', true)).toBe('light');
    expect(resolveThemeMode('graydark', false)).toBe('graydark');
  });

  it('reads what was saved; nothing or junk means follow the system', () => {
    expect(readSavedPreference()).toBe('system');
    localStorage.setItem('themeMode', 'graydark');
    expect(readSavedPreference()).toBe('graydark');
    localStorage.setItem('themeMode', 'system');
    expect(readSavedPreference()).toBe('system');
    localStorage.setItem('themeMode', 'blue');
    expect(readSavedPreference()).toBe('system');
  });

  it('blocked storage does not break the app', () => {
    const spy = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(readSavedPreference()).toBe('system');
    spy.mockRestore();
  });
});

describe('AppThemeProvider on automatic', () => {
  it('a first visit takes the OS theme', () => {
    fakeSystem(false);
    renderApp();
    expect(text('preference')).toBe('system');
    expect(text('mode')).toBe('light');
    expect(text('palette')).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(localStorage.getItem('themeMode')).toBe('system');
  });

  it('switches live when the OS changes, and keeps the preference', () => {
    const os = fakeSystem(false);
    renderApp();
    act(() => os.set(true));
    expect(text('mode')).toBe('dark');
    expect(text('palette')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('themeMode')).toBe('system');
  });

  it('a chosen theme stays put when the OS changes', () => {
    localStorage.setItem('themeMode', 'graydark');
    const os = fakeSystem(false);
    renderApp();
    expect(text('mode')).toBe('graydark');
    act(() => os.set(true));
    act(() => os.set(false));
    expect(text('mode')).toBe('graydark');
  });

  it('the quick toggle flips what is on screen into a fixed choice', () => {
    fakeSystem(true);
    renderApp();
    fireEvent.click(screen.getByText('toggle'));
    expect(text('preference')).toBe('light');
    expect(text('mode')).toBe('light');
    expect(localStorage.getItem('themeMode')).toBe('light');
  });

  it('going back to automatic picks up the OS again', () => {
    localStorage.setItem('themeMode', 'graydark');
    fakeSystem(false);
    renderApp();
    fireEvent.click(screen.getByText('system'));
    expect(text('mode')).toBe('light');
    expect(localStorage.getItem('themeMode')).toBe('system');
  });

  it('stops listening to the OS once unmounted', () => {
    const os = fakeSystem(true);
    const { unmount } = renderApp();
    expect(os.listeners.size).toBeGreaterThan(0);
    unmount();
    expect(os.listeners.size).toBe(0);
  });

  it('without matchMedia it falls back to dark', () => {
    // @ts-expect-error simulating a browser without matchMedia
    window.matchMedia = undefined;
    renderApp();
    expect(text('mode')).toBe('dark');
  });
});

describe('index.html pre-paint script', () => {
  // The same choice before React loads, so there is no flash of the wrong theme.
  const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)![1];
  const run = () => new Function(script)();
  const root = document.documentElement;

  it.each([
    [null, false, 'light'],
    [null, true, 'dark'],
    ['system', false, 'light'],
    ['system', true, 'dark'],
    ['light', true, 'light'],
    ['dark', false, 'dark'],
    ['graydark', false, 'graydark'],
  ])('saved %s, OS dark %s → %s', (saved, dark, expected) => {
    if (saved) localStorage.setItem('themeMode', saved);
    fakeSystem(dark);
    run();
    expect(root.classList.contains('light')).toBe(expected === 'light');
    expect(root.classList.contains('dark')).toBe(expected !== 'light');
    expect(root.classList.contains('graydark')).toBe(expected === 'graydark');
    expect(resolveThemeMode(readSavedPreference(), dark)).toBe(expected);
  });
});
