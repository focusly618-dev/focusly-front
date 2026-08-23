import { describe, it, expect } from 'vitest';
import { buildGraph } from '@/pages/Workspace/components/Editor/components/EditorSidebar/GraphSidebar/utils/graphLayout.utils';
import type { HeadingItem } from '@/pages/Workspace/components/Editor/components/EditorSidebar/GraphSidebar/markdownHeadings';

const heading = (
  level: number,
  text: string,
  pos: number,
): HeadingItem => ({ level, text, pos });

describe('buildGraph — heading-level hierarchy (Note Map)', () => {
  it('returns only the root node when there are no headings', () => {
    const { nodes, edges } = buildGraph('My Task', [], 1);
    expect(nodes).toEqual([
      { id: 'root', x: 200, y: 200, label: 'My Task', level: 0, pos: null },
    ]);
    expect(edges).toEqual([]);
  });

  it('connects every H1 directly to root (unchanged flat behavior for H1-only notes)', () => {
    const headings = [heading(1, 'First', 0), heading(1, 'Second', 10)];
    const { nodes, edges } = buildGraph('Root', headings, 1);

    const h1Nodes = nodes.filter((n) => n.level === 1);
    expect(h1Nodes).toHaveLength(2);
    expect(edges).toEqual(
      expect.arrayContaining([
        { from: 'root', to: 'h-0' },
        { from: 'root', to: 'h-10' },
      ]),
    );
  });

  it('FIXED: nests H2/H3 under their nearest preceding shallower heading instead of being dropped', () => {
    // Before this fix, buildGraph filtered `headings` down to level === 1
    // only — any ## or ### in the note was silently invisible in the map.
    const headings = [
      heading(1, 'Chapter 1', 0),
      heading(2, 'Section 1.1', 10),
      heading(3, 'Sub 1.1.1', 20),
      heading(2, 'Section 1.2', 30),
      heading(1, 'Chapter 2', 40),
    ];

    const { nodes, edges } = buildGraph('Root', headings, 1);

    // All 5 headings must be present as nodes now, not just the two H1s.
    expect(nodes).toHaveLength(6); // root + 5 headings
    const byPos = (pos: number) => nodes.find((n) => n.pos === pos);
    expect(byPos(0)?.level).toBe(1);
    expect(byPos(10)?.level).toBe(2);
    expect(byPos(20)?.level).toBe(3);
    expect(byPos(30)?.level).toBe(2);
    expect(byPos(40)?.level).toBe(1);

    // Parent/child edges follow markdown nesting, not flat root attachment.
    expect(edges).toEqual(
      expect.arrayContaining([
        { from: 'root', to: 'h-0' }, // Chapter 1 -> root
        { from: 'h-0', to: 'h-10' }, // Section 1.1 -> Chapter 1
        { from: 'h-10', to: 'h-20' }, // Sub 1.1.1 -> Section 1.1
        { from: 'h-0', to: 'h-30' }, // Section 1.2 -> Chapter 1 (not 1.1)
        { from: 'root', to: 'h-40' }, // Chapter 2 -> root
      ]),
    );
  });

  it('attaches a heading with no preceding shallower heading directly to root (e.g. a note starting with ##)', () => {
    const headings = [heading(2, 'Starts at H2', 0), heading(3, 'Nested', 10)];
    const { nodes, edges } = buildGraph('Root', headings, 1);

    expect(nodes).toHaveLength(3);
    expect(edges).toEqual(
      expect.arrayContaining([
        { from: 'root', to: 'h-0' },
        { from: 'h-0', to: 'h-10' },
      ]),
    );
  });

  it('deeper headings are placed on a wider ring (larger distance from center) than their parents', () => {
    const headings = [
      heading(1, 'Chapter', 0),
      heading(2, 'Section', 10),
      heading(3, 'Sub', 20),
    ];
    const { nodes } = buildGraph('Root', headings, 1);
    const center = { x: nodes[0].x, y: nodes[0].y };
    const distanceFromCenter = (n: (typeof nodes)[number]) =>
      Math.hypot(n.x - center.x, n.y - center.y);

    const h1 = nodes.find((n) => n.pos === 0)!;
    const h2 = nodes.find((n) => n.pos === 10)!;
    const h3 = nodes.find((n) => n.pos === 20)!;

    expect(distanceFromCenter(h2)).toBeGreaterThan(distanceFromCenter(h1));
    expect(distanceFromCenter(h3)).toBeGreaterThan(distanceFromCenter(h2));
  });
});
