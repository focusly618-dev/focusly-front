import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const headerSource = readFileSync(
  resolve(
    __dirname,
    '../../src/pages/Tasks/components/TasksContentView/TasksContentView.tsx',
  ),
  'utf8',
);

const stylesSource = readFileSync(
  resolve(
    __dirname,
    '../../src/pages/Tasks/components/ListViewTask/ListViewTask.styles.ts',
  ),
  'utf8',
);

const rowSource = readFileSync(
  resolve(
    __dirname,
    '../../src/pages/Tasks/components/ListViewTask/ListViewTask.tsx',
  ),
  'utf8',
);

const hookSource = readFileSync(
  resolve(__dirname, '../../src/pages/Tasks/Tasks.hook.ts'),
  'utf8',
);

describe('Tasks table layout & data-fetch contract', () => {
  it('header cells must match the 8-column grid used by TaskRow', () => {
    const headerCells = [
      'Task Name',
      'Priority',
      'Due Date',
      'Estimated',
      'Actual',
      'Actions',
    ];
    for (const label of headerCells) {
      expect(headerSource).toContain(label);
    }

    const headerGrid = stylesSource.match(
      /export const TableHeader[\s\S]*?gridTemplateColumns:\s*'([^']+)'/,
    )?.[1];
    const rowGrid = stylesSource.match(
      /export const TaskRow[\s\S]*?gridTemplateColumns:\s*'([^']+)'/,
    )?.[1];

    expect(headerGrid).toBeDefined();
    expect(rowGrid).toBe(headerGrid);

    const columnCount = headerGrid!.match(/minmax\([^)]+\)|[^\s]+/g)?.length;
    expect(columnCount).toBe(8);

    const headerBlock = headerSource.slice(
      headerSource.indexOf('<TableHeader>'),
      headerSource.indexOf('</TableHeader>'),
    );
    const namedHeaderCount = headerBlock.match(/<TableHeaderCell/g)?.length;
    expect(namedHeaderCount).toBe(columnCount);
    expect(headerBlock).toMatch(/>\s*AI\s*</);
  });

  it('row cells include an AI switch column that the header must label', () => {
    expect(rowSource).toContain('className="cell-ai"');
  });

  it('server fetch pageSize must be large enough for the table infinite-scroll window', () => {
    const contentViewHook = readFileSync(
      resolve(
        __dirname,
        '../../src/pages/Tasks/components/TasksContentView/useTasksContentView.hook.ts',
      ),
      'utf8',
    );
    expect(contentViewHook).toMatch(/useState\(24\)/);
    expect(hookSource).not.toMatch(/useState\(10\)/);
  });
});
