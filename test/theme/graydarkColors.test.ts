import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Graydark is a dark theme (palette.mode === 'dark'), so a ternary like
// `isDark ? '#25272e' : '#E5E5E5'` hands it the bluish near-black meant for the
// regular dark theme. Those colors go through surfaceColor(theme, dark, gray,
// light) instead. This test fails when a new one slips in.

const SRC = join(__dirname, '../../src');
// The theme defines the palettes; the public site has its own token sets.
const SKIP = ['context/theme/', 'pages/Public/Site/'];
// Dark tints that are deliberate accents in every mode, not surfaces.
const ACCENTS: Record<string, string> = {
  'pages/Tasks/components/TasksHeader/TasksHeader.tsx #111c2e':
    'blue stats pill (blue text and border in every mode)',
};

const COLOR = String.raw`(?:#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\))`;
const DARK_TERNARY = new RegExp(
  String.raw`(?:\w+\.palette\.mode\s*===\s*['"]dark['"]|\bisDark(?:Mode)?\b)\s*\?\s*(['"])(${COLOR})\1\s*:\s*(['"])${COLOR}\3`,
  'g',
);

const parse = (c: string): [number, number, number, number] | null => {
  if (c.startsWith('#')) {
    let h = c.slice(1);
    if (h.length <= 4) h = [...h].map((ch) => ch + ch).join('');
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
  }
  const nums = c.match(/[\d.]+/g)?.map(Number) ?? [];
  return nums.length >= 3 ? [nums[0], nums[1], nums[2], nums[3] ?? 1] : null;
};

const luminance = (r: number, g: number, b: number) => {
  const ch = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
};

const hue = (r: number, g: number, b: number) => {
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  if (d === 0) return 0;
  const h =
    max === r
      ? ((g - b) / d) % 6
      : max === g
        ? (b - r) / d + 2
        : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
};

/** A near-black surface/border color that graydark needs a gray for. */
const needsGray = (color: string) => {
  const p = parse(color);
  if (!p) return false;
  const [r, g, b, a] = p;
  if (a < 0.3 || luminance(r, g, b) >= 0.06) return false;
  if (r === 0 && g === 0 && b === 0) return false; // shadows and overlays
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  const h = hue(r, g, b);
  const bluish = h >= 195 && h <= 255;
  // Accent tints (green selection, indigo, strong blues) keep their hue.
  return !(chroma >= 45 || (chroma >= 25 && !bluish));
};

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });

describe('graydark color coverage', () => {
  it('no dark-only near-black color ternaries outside the theme', () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(SRC)) {
      const rel = relative(SRC, file);
      if (SKIP.some((prefix) => rel.startsWith(prefix))) continue;
      const text = readFileSync(file, 'utf-8');
      for (const match of text.matchAll(DARK_TERNARY)) {
        if (needsGray(match[2]) && !ACCENTS[`${rel} ${match[2]}`]) {
          const line = text.slice(0, match.index).split('\n').length;
          offenders.push(`${rel}:${line} ${match[2]}`);
        }
      }
    }
    expect(
      offenders,
      'Use surfaceColor(theme, dark, gray, light) so graydark gets a gray',
    ).toEqual([]);
  });

  it('detects the colors it should and spares accents and shadows', () => {
    expect(needsGray('#25272e')).toBe(true);
    expect(needsGray('rgba(15, 23, 42, 0.9)')).toBe(true);
    expect(needsGray('#102d29')).toBe(false); // green selection tint
    expect(needsGray('#1e1b4b')).toBe(false); // indigo accent
    expect(needsGray('rgba(0, 0, 0, 0.7)')).toBe(false); // shadow
    expect(needsGray('#F3F4F6')).toBe(false); // light text
  });
});
