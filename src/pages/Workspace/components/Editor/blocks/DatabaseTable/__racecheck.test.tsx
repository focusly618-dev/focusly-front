import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  type PartialBlock,
} from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import { DatabaseTableBlock } from './DatabaseTableBlock';
import type { DatabaseColumn } from './DatabaseTable.types';

// jsdom doesn't implement matchMedia; @mantine/core's color-scheme hook needs it.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

// @mui/icons-material's package entry is a single barrel file that re-exports
// every icon (thousands of modules). Under this sandbox's OS-level open-file
// cap, transforming that barrel blows past the fd limit (EBADF) before any
// test code runs. The icons themselves are irrelevant to the race being
// tested, so stub the whole package with cheap stand-ins.
vi.mock('@mui/icons-material', () => {
  const Stub = () => null;
  return {
    Add: Stub,
    Close: Stub,
    MoreHoriz: Stub,
    TextFields: Stub,
    Numbers: Stub,
    Circle: Stub,
    CheckBoxOutlined: Stub,
  };
});

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    databaseTable: DatabaseTableBlock(),
  },
});

type EditorType = ReturnType<typeof useCreateBlockNote>;

function TestEditor({ onReady }: { onReady: (editor: EditorType) => void }) {
  const editor = useCreateBlockNote({
    schema,
    initialContent: [{ type: 'databaseTable' } as PartialBlock],
  });
  onReady(editor);
  return <BlockNoteView editor={editor} />;
}

describe('DatabaseTableBlock blur/click race', () => {
  it('does not lose a just-typed cell value when a click on another control fires in the same tick as the blur commit', async () => {
    let editorRef!: EditorType;
    render(<TestEditor onReady={(e) => (editorRef = e)} />);

    const updateBlockCalls: string[] = [];
    const originalUpdateBlock = editorRef.updateBlock.bind(editorRef);
    editorRef.updateBlock = (
      ...args: Parameters<typeof originalUpdateBlock>
    ) => {
      const blockUpdate = args[1] as { props?: { data?: string } } | undefined;
      updateBlockCalls.push(JSON.stringify(blockUpdate?.props?.data));
      return originalUpdateBlock(...args);
    };

    // Sanity: locate the Name cell input for the first row.
    const inputs = await screen.findAllByPlaceholderText('Empty');
    expect(inputs.length).toBeGreaterThan(0);
    const nameInput = inputs[0] as HTMLInputElement;

    // Type into the cell (does not commit yet - only local `draft` state).
    fireEvent.change(nameInput, { target: { value: 'Alice' } });
    expect(nameInput.value).toBe('Alice');

    // Locate the "New row" control.
    const newRowEl = screen.getByText('New row').closest('div')!;

    // Fire blur (commits 'Alice' via setCell -> commit()) and, in the SAME
    // synchronous script execution (no await in between, i.e. no chance for
    // a task/microtask boundary to let React flush first), fire a click on
    // the New Row control. This is the scenario the reviewer describes.
    fireEvent.blur(nameInput);
    fireEvent.click(newRowEl);

    const finalDoc = editorRef.document;
    const block = finalDoc[0];
    const data = JSON.parse(block.props.data);

    console.log('rows after interaction:', JSON.stringify(data.rows));
    console.log(
      'columns:',
      JSON.stringify(data.columns.map((c: DatabaseColumn) => c.id)),
    );
    console.log('updateBlock call count:', updateBlockCalls.length);
    updateBlockCalls.forEach((c, i) =>
      console.log(`updateBlock call #${i}:`, c),
    );

    const nameColumnId = data.columns[0].id;
    const row0Value = data.rows[0].cells[nameColumnId];

    // Also check row count to confirm addRow happened.
    expect(data.rows.length).toBe(4); // 3 default rows + 1 new row

    // This is the actual assertion under test: was 'Alice' preserved?
    expect(row0Value).toBe('Alice');
  });

  it('same race, dispatched as raw native events bypassing RTL/act() batching helpers', async () => {
    let editorRef!: EditorType;
    render(<TestEditor onReady={(e) => (editorRef = e)} />);

    const inputs = await screen.findAllByPlaceholderText('Empty');
    const nameInput = inputs[0] as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'Alice' } });

    const newRowEl = screen.getByText('New row').closest('div')!;

    fireEvent.blur(nameInput);
    fireEvent.click(newRowEl);

    const data = JSON.parse(editorRef.document[0].props.data);
    console.log('[raw] rows:', JSON.stringify(data.rows));
    const nameColumnId = data.columns[0].id;
    expect(data.rows.length).toBe(4);
    expect(data.rows[0].cells[nameColumnId]).toBe('Alice');
  });
});
