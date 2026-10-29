import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGES } from '@/i18n';

type Tree = { [key: string]: Tree | Tree[] | string };

const read = (lang: string): Tree =>
  JSON.parse(
    readFileSync(
      join(__dirname, `../../src/i18n/locales/${lang}/translation.json`),
      'utf-8',
    ),
  );

/** Every string in a locale by its path, e.g. "billing.usage". */
const leaves = (node: unknown, path = '', out = new Map<string, string>()) => {
  if (typeof node === 'string') out.set(path, node);
  else if (node && typeof node === 'object')
    for (const [key, value] of Object.entries(node))
      leaves(value, path ? `${path}.${key}` : key, out);
  return out;
};

// Languages pick different plural categories (Japanese only has "other"),
// so a key is compared without its plural suffix.
const PLURAL = /_(zero|one|two|few|many|other)$/;
const keysOf = (strings: Map<string, string>) =>
  new Set([...strings.keys()].map((key) => key.replace(PLURAL, '')));

const PLACEHOLDERS = /\{\{\s*[\w.]+\s*\}\}|\$t\([^)]*\)|<\/?\w+>/g;
const placeholders = (text: string) =>
  [...new Set(text.match(PLACEHOLDERS) ?? [])].sort();

const english = leaves(read('en'));

describe('locales', () => {
  const full = SUPPORTED_LANGUAGES.filter((l) => l !== 'en' && l !== 'en-GB');

  it.each(full)('%s translates every English key', (lang) => {
    const strings = leaves(read(lang));
    expect([...keysOf(strings)].sort()).toEqual([...keysOf(english)].sort());
    for (const [key, text] of strings) {
      expect(text.trim(), key).not.toBe('');
    }
  });

  it.each(full)('%s keeps the variables and tags of each string', (lang) => {
    for (const [key, text] of leaves(read(lang))) {
      const source =
        english.get(key) ?? english.get(`${key.replace(PLURAL, '')}_other`);
      if (source === undefined) continue;
      expect(placeholders(text), key).toEqual(placeholders(source));
    }
  });

  it('en-GB only overrides keys that exist in English', () => {
    for (const [key, text] of leaves(read('en-GB'))) {
      expect(english.has(key), key).toBe(true);
      expect(placeholders(text), key).toEqual(placeholders(english.get(key)!));
    }
  });
});
