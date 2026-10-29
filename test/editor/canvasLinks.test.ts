import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CANVAS_ICON,
  canvasLink,
  canvasNameFrom,
  findCanvasLinks,
  splitCanvasLabel,
} from '@/pages/Workspace/components/Editor/components/EditorContent/canvasLinks.utils';

const ID = '3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b';

describe('canvasLink', () => {
  it('links to the canvas by id, under its name', () => {
    expect(canvasLink(ID, 'Ideas')).toBe(`[🎨 Ideas](#canvas-${ID})`);
  });

  it('keeps brackets and line breaks out of the link text', () => {
    expect(canvasLink(ID, 'a [b]\nc')).toBe(`[🎨 a bc](#canvas-${ID})`);
  });
});

describe('canvasNameFrom', () => {
  it('takes the first line, without heading marks', () => {
    expect(canvasNameFrom('## Plan\nmore text')).toBe('Plan');
  });

  it('caps long names and names empty ones', () => {
    expect(canvasNameFrom('x'.repeat(100))).toHaveLength(61);
    expect(canvasNameFrom('   ')).toBe('Canvas sin título');
  });
});

describe('findCanvasLinks', () => {
  it('finds every link to this canvas and only this one', () => {
    const doc = [
      `Intro ${canvasLink(ID, 'Old name')} text`,
      `[🎨 Other](#canvas-another-id)`,
      `[plain](canvas:${ID})`,
    ].join('\n');

    const found = findCanvasLinks(doc, ID);

    expect(found.map((m) => m.text)).toEqual([
      `[🎨 Old name](#canvas-${ID})`,
      `[plain](canvas:${ID})`,
    ]);
    for (const m of found) expect(doc.slice(m.from, m.to)).toBe(m.text);
  });

  it("doesn't take a longer id that starts with this one", () => {
    expect(findCanvasLinks(`[x](#canvas-${ID}-copy)`, ID)).toEqual([]);
  });
});

describe('canvas icons', () => {
  it('puts the canvas icon in the link, or the default one', () => {
    expect(canvasLink(ID, 'Ideas', '🧠')).toBe(`[🧠 Ideas](#canvas-${ID})`);
    expect(canvasLink(ID, 'Ideas', null)).toBe(
      `[${DEFAULT_CANVAS_ICON} Ideas](#canvas-${ID})`,
    );
  });

  it('reads the icon and the name back from the link text', () => {
    expect(splitCanvasLabel('🧠 Ideas')).toEqual({ icon: '🧠', name: 'Ideas' });
    expect(splitCanvasLabel('Ideas')).toEqual({ icon: null, name: 'Ideas' });
  });

  it('keeps joined emoji and flags whole', () => {
    expect(splitCanvasLabel('👩🏽‍💻 Code').icon).toBe('👩🏽‍💻');
    expect(splitCanvasLabel('❤️ Love').icon).toBe('❤️');
    expect(splitCanvasLabel('🇲🇽 Viaje').icon).toBe('🇲🇽');
  });
});
