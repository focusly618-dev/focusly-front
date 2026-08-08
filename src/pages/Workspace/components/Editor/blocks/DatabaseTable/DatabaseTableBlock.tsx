import { useMemo, useState } from 'react';
import { createReactBlockSpec } from '@blocknote/react';
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import type { Theme } from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  MoreHoriz as MoreHorizIcon,
  TextFields as TextIcon,
  Numbers as NumberIcon,
  Circle as StatusIcon,
  CheckBoxOutlined as CheckboxIcon,
} from '@mui/icons-material';
import type {
  DatabaseCalc,
  DatabaseColumn,
  DatabaseColumnType,
  DatabaseRow,
  DatabaseStatusOption,
  DatabaseTableData,
} from './DatabaseTable.types';
import {
  CALC_LABELS,
  CALC_OPTIONS_BY_TYPE,
  COLUMN_TYPE_LABELS,
  computeCalc,
  convertColumnType,
  createDefaultDatabaseTableData,
  generateId,
  nextStatusColor,
  parseDatabaseTableData,
} from './DatabaseTable.utils';

const COLUMN_WIDTH: Record<DatabaseColumnType, number> = {
  text: 200,
  number: 120,
  status: 170,
  checkbox: 90,
};

const TYPE_ICON: Record<DatabaseColumnType, typeof TextIcon> = {
  text: TextIcon,
  number: NumberIcon,
  status: StatusIcon,
  checkbox: CheckboxIcon,
};

const headerBg = (theme: Theme) =>
  theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.04)'
    : 'rgba(15, 23, 42, 0.03)';

const rowHoverBg = (theme: Theme) =>
  theme.palette.mode === 'dark'
    ? 'rgba(99, 102, 241, 0.1)'
    : 'rgba(99, 102, 241, 0.06)';

const zebraBg = (theme: Theme) =>
  theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.015)'
    : 'rgba(15, 23, 42, 0.015)';

interface StatusPillProps {
  option?: DatabaseStatusOption;
  placeholder?: string;
}

const StatusPill = ({ option, placeholder }: StatusPillProps) => {
  if (!option) {
    return (
      <Box component="span" sx={{ color: 'text.disabled', fontSize: '13px' }}>
        {placeholder ?? 'Empty'}
      </Box>
    );
  }
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.7,
        px: 1,
        py: 0.3,
        borderRadius: '6px',
        fontSize: '12.5px',
        fontWeight: 600,
        maxWidth: '100%',
        bgcolor: (theme) =>
          alpha(option.color, theme.palette.mode === 'dark' ? 0.18 : 0.12),
        color: option.color,
      }}
    >
      <Box
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: option.color,
          flexShrink: 0,
        }}
      />
      <Box
        component="span"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {option.label}
      </Box>
    </Box>
  );
};

interface StatusPickerProps {
  anchorEl: HTMLElement | null;
  options: DatabaseStatusOption[];
  onClose: () => void;
  onSelect: (optionId: string) => void;
  onCreate: (label: string) => void;
  onDeleteOption: (optionId: string) => void;
}

const StatusPicker = ({
  anchorEl,
  options,
  onClose,
  onSelect,
  onCreate,
  onDeleteOption,
}: StatusPickerProps) => {
  const [query, setQuery] = useState('');
  const trimmed = query.trim();
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(trimmed.toLowerCase()),
  );
  const exactMatch = options.some(
    (o) => o.label.toLowerCase() === trimmed.toLowerCase(),
  );

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => {
        setQuery('');
        onClose();
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{ paper: { sx: { borderRadius: '10px', mt: 0.5 } } }}
    >
      <Box
        sx={{ width: 230, p: 1 }}
        contentEditable={false}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search or create a status..."
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '13px',
            padding: '6px 4px',
            fontFamily: 'inherit',
          }}
        />
        <Divider sx={{ my: 0.5 }} />
        <Box sx={{ maxHeight: 220, overflowY: 'auto' }}>
          <Box
            onClick={() => {
              onSelect('');
              setQuery('');
              onClose();
            }}
            sx={{
              px: 1,
              py: 0.7,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12.5px',
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            No status
          </Box>
          {filtered.map((option) => (
            <Box
              key={option.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1,
                py: 0.5,
                borderRadius: '6px',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
                '&:hover .status-option-delete': { opacity: 1 },
              }}
              onClick={() => {
                onSelect(option.id);
                setQuery('');
                onClose();
              }}
            >
              <StatusPill option={option} />
              <IconButton
                size="small"
                className="status-option-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteOption(option.id);
                }}
                sx={{ opacity: 0, p: 0.3, transition: 'opacity 0.15s' }}
              >
                <CloseIcon sx={{ fontSize: 13 }} />
              </IconButton>
            </Box>
          ))}
          {trimmed && !exactMatch && (
            <Box
              onClick={() => {
                onCreate(trimmed);
                setQuery('');
                onClose();
              }}
              sx={{
                px: 1,
                py: 0.7,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'primary.main',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              + Create "{trimmed}"
            </Box>
          )}
        </Box>
      </Box>
    </Popover>
  );
};

interface ColumnHeaderCellProps {
  column: DatabaseColumn;
  canDelete: boolean;
  onRename: (name: string) => void;
  onChangeType: (type: DatabaseColumnType) => void;
  onDelete: () => void;
}

const ColumnHeaderCell = ({
  column,
  canDelete,
  onRename,
  onChangeType,
  onDelete,
}: ColumnHeaderCellProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(column.name);
  const TypeIcon = TYPE_ICON[column.type];

  const commitName = () => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== column.name) onRename(trimmed);
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        width: COLUMN_WIDTH[column.type],
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 0.6,
        px: 1.5,
        py: 1,
        borderRight: '1px solid',
        borderColor: 'divider',
        '&:hover .column-menu-btn': { opacity: 1 },
      }}
      contentEditable={false}
    >
      <TypeIcon sx={{ fontSize: 14, color: 'text.disabled', flexShrink: 0 }} />
      {isEditing ? (
        <input
          autoFocus
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitName();
            else if (e.key === 'Escape') {
              setDraftName(column.name);
              setIsEditing(false);
            }
          }}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '12.5px',
            fontWeight: 700,
            fontFamily: 'inherit',
          }}
        />
      ) : (
        <Box
          onClick={() => {
            setDraftName(column.name);
            setIsEditing(true);
          }}
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: '12.5px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'text',
          }}
        >
          {column.name}
        </Box>
      )}
      <IconButton
        size="small"
        className="column-menu-btn"
        onClick={(e) => setMenuAnchor(e.currentTarget)}
        sx={{
          opacity: 0,
          transition: 'opacity 0.15s',
          p: 0.2,
          color: 'text.secondary',
          flexShrink: 0,
        }}
      >
        <MoreHorizIcon sx={{ fontSize: 15 }} />
      </IconButton>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        slotProps={{ paper: { sx: { borderRadius: '10px', minWidth: 180 } } }}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            setDraftName(column.name);
            setIsEditing(true);
          }}
          sx={{ fontSize: '13px' }}
        >
          Rename
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        {(Object.keys(COLUMN_TYPE_LABELS) as DatabaseColumnType[]).map(
          (type) => {
            const Icon = TYPE_ICON[type];
            return (
              <MenuItem
                key={type}
                selected={type === column.type}
                onClick={() => {
                  setMenuAnchor(null);
                  onChangeType(type);
                }}
                sx={{ fontSize: '13px', gap: 1 }}
              >
                <Icon sx={{ fontSize: 15, color: 'text.secondary' }} />
                {COLUMN_TYPE_LABELS[type]}
              </MenuItem>
            );
          },
        )}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          disabled={!canDelete}
          onClick={() => {
            setMenuAnchor(null);
            onDelete();
          }}
          sx={{ fontSize: '13px', color: 'error.main' }}
        >
          Delete column
        </MenuItem>
      </Menu>
    </Box>
  );
};

interface CellProps {
  column: DatabaseColumn;
  value: string;
  onChange: (value: string) => void;
  onOpenStatusPicker: (el: HTMLElement) => void;
}

const DataCell = ({
  column,
  value,
  onChange,
  onOpenStatusPicker,
}: CellProps) => {
  const [draft, setDraft] = useState(value);

  const cellSx = {
    width: COLUMN_WIDTH[column.type],
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    px: 1.5,
    py: 0.9,
    borderRight: '1px solid',
    borderColor: 'divider',
    fontSize: '13.5px',
    color: 'text.primary',
    minWidth: 0,
  } as const;

  if (column.type === 'checkbox') {
    return (
      <Box sx={cellSx} contentEditable={false}>
        <Checkbox
          size="small"
          checked={value === 'true'}
          onChange={(e) => onChange(e.target.checked ? 'true' : '')}
          sx={{ p: 0 }}
        />
      </Box>
    );
  }

  if (column.type === 'status') {
    const option = column.options?.find((o) => o.id === value);
    return (
      <Box
        sx={{ ...cellSx, cursor: 'pointer' }}
        contentEditable={false}
        onClick={(e) => onOpenStatusPicker(e.currentTarget)}
      >
        <StatusPill option={option} />
      </Box>
    );
  }

  const commit = () => {
    if (draft !== value) onChange(draft);
  };

  return (
    <Box sx={cellSx} contentEditable={false}>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        type={column.type === 'number' ? 'text' : 'text'}
        inputMode={column.type === 'number' ? 'decimal' : 'text'}
        placeholder={column.type === 'number' ? '0' : 'Empty'}
        style={{
          width: '100%',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: 'inherit',
          fontFamily: 'inherit',
          color: 'inherit',
          textAlign: column.type === 'number' ? 'right' : 'left',
        }}
      />
    </Box>
  );
};

interface CalcFooterCellProps {
  column: DatabaseColumn;
  rows: DatabaseRow[];
  onChangeCalc: (calc: DatabaseCalc) => void;
}

const CalcFooterCell = ({
  column,
  rows,
  onChangeCalc,
}: CalcFooterCellProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const value = computeCalc(column.calc, column, rows);
  const options = CALC_OPTIONS_BY_TYPE[column.type];

  return (
    <Box
      sx={{
        width: COLUMN_WIDTH[column.type],
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: column.calc === 'none' ? 'flex-start' : 'space-between',
        px: 1.5,
        py: 0.7,
        borderRight: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        fontSize: '12px',
        color: column.calc === 'none' ? 'text.disabled' : 'text.secondary',
        fontWeight: 600,
        '&:hover': { color: 'primary.main' },
      }}
      contentEditable={false}
      onClick={(e) => setAnchorEl(e.currentTarget)}
    >
      <Box component="span">
        {column.calc === 'none' ? 'Calculate' : CALC_LABELS[column.calc]}
      </Box>
      {column.calc !== 'none' && <Box component="span">{value}</Box>}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { borderRadius: '10px', minWidth: 190 } } }}
      >
        {options.map((calc) => (
          <MenuItem
            key={calc}
            selected={calc === column.calc}
            onClick={() => {
              setAnchorEl(null);
              onChangeCalc(calc);
            }}
            sx={{ fontSize: '12.5px' }}
          >
            {CALC_LABELS[calc]}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useDatabaseTableController = (block: any, editor: any) => {
  const data = useMemo<DatabaseTableData>(
    () => parseDatabaseTableData(block.props.data),
    [block.props.data],
  );

  const commit = (next: DatabaseTableData) => {
    editor.updateBlock(block, { props: { data: JSON.stringify(next) } });
  };

  return {
    data,
    renameColumn: (columnId: string, name: string) =>
      commit({
        ...data,
        columns: data.columns.map((c) =>
          c.id === columnId ? { ...c, name } : c,
        ),
      }),
    changeColumnType: (columnId: string, type: DatabaseColumnType) => {
      const column = data.columns.find((c) => c.id === columnId);
      if (!column) return;
      const { column: nextColumn, rows } = convertColumnType(
        column,
        data.rows,
        type,
      );
      commit({
        columns: data.columns.map((c) => (c.id === columnId ? nextColumn : c)),
        rows,
      });
    },
    deleteColumn: (columnId: string) => {
      if (data.columns.length <= 1) return;
      commit({
        columns: data.columns.filter((c) => c.id !== columnId),
        rows: data.rows.map((r) => {
          const cells = { ...r.cells };
          delete cells[columnId];
          return { ...r, cells };
        }),
      });
    },
    addColumn: () =>
      commit({
        ...data,
        columns: [
          ...data.columns,
          {
            id: generateId('col'),
            name: `Column ${data.columns.length + 1}`,
            type: 'text',
            calc: 'none',
          },
        ],
      }),
    addRow: () =>
      commit({
        ...data,
        rows: [...data.rows, { id: generateId('row'), cells: {} }],
      }),
    deleteRow: (rowId: string) =>
      commit({ ...data, rows: data.rows.filter((r) => r.id !== rowId) }),
    setCell: (rowId: string, columnId: string, value: string) =>
      commit({
        ...data,
        rows: data.rows.map((r) =>
          r.id === rowId
            ? { ...r, cells: { ...r.cells, [columnId]: value } }
            : r,
        ),
      }),
    setCalc: (columnId: string, calc: DatabaseCalc) =>
      commit({
        ...data,
        columns: data.columns.map((c) =>
          c.id === columnId ? { ...c, calc } : c,
        ),
      }),
    createStatusOption: (columnId: string, rowId: string, label: string) => {
      const column = data.columns.find((c) => c.id === columnId);
      if (!column) return;
      const option: DatabaseStatusOption = {
        id: generateId('opt'),
        label,
        color: nextStatusColor((column.options ?? []).length),
      };
      commit({
        columns: data.columns.map((c) =>
          c.id === columnId
            ? { ...c, options: [...(c.options ?? []), option] }
            : c,
        ),
        rows: data.rows.map((r) =>
          r.id === rowId
            ? { ...r, cells: { ...r.cells, [columnId]: option.id } }
            : r,
        ),
      });
    },
    deleteStatusOption: (columnId: string, optionId: string) =>
      commit({
        columns: data.columns.map((c) =>
          c.id === columnId
            ? {
                ...c,
                options: (c.options ?? []).filter((o) => o.id !== optionId),
              }
            : c,
        ),
        rows: data.rows.map((r) =>
          r.cells[columnId] === optionId
            ? { ...r, cells: { ...r.cells, [columnId]: '' } }
            : r,
        ),
      }),
  };
};

interface DatabaseTableRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  block: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any;
}

// BlockNote's `render` option is consumed as a plain object property, so an
// inline arrow there reads as anonymous/lowercase to eslint's rules-of-hooks
// naming heuristic. Keeping the actual hook calls in this separately named,
// PascalCase component keeps the lint rule (correctly) happy.
const DatabaseTableRenderer = ({
  block,
  editor,
}: DatabaseTableRendererProps) => {
  const theme = useTheme();
  const controller = useDatabaseTableController(block, editor);
  const { data } = controller;

  const [statusPicker, setStatusPicker] = useState<{
    el: HTMLElement;
    columnId: string;
    rowId: string;
  } | null>(null);

  const activeColumn = statusPicker
    ? data.columns.find((c) => c.id === statusPicker.columnId)
    : undefined;

  return (
    <Box contentEditable={false} sx={{ my: 1, minWidth: 0 }}>
      <Box
        sx={{
          display: 'inline-block',
          maxWidth: '100%',
          overflowX: 'auto',
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 2px 8px rgba(0, 0, 0, 0.25)'
              : '0 1px 4px rgba(15, 23, 42, 0.06)',
          bgcolor: 'background.paper',
        }}
      >
        {/* Header row */}
        <Box sx={{ display: 'flex', bgcolor: headerBg(theme) }}>
          {data.columns.map((column) => (
            <ColumnHeaderCell
              key={column.id}
              column={column}
              canDelete={data.columns.length > 1}
              onRename={(name) => controller.renameColumn(column.id, name)}
              onChangeType={(type) =>
                controller.changeColumnType(column.id, type)
              }
              onDelete={() => controller.deleteColumn(column.id)}
            />
          ))}
          <Tooltip title="Add column">
            <IconButton
              size="small"
              onClick={controller.addColumn}
              sx={{ borderRadius: 0, width: 36, color: 'text.secondary' }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Body rows */}
        {data.rows.map((row, rowIndex) => (
          <Box
            key={row.id}
            sx={{
              display: 'flex',
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: rowIndex % 2 === 1 ? zebraBg(theme) : 'transparent',
              '&:hover': { bgcolor: rowHoverBg(theme) },
              '&:hover .row-delete-btn': { opacity: 1 },
            }}
          >
            {data.columns.map((column) => (
              <DataCell
                key={column.id}
                column={column}
                value={row.cells[column.id] ?? ''}
                onChange={(value) =>
                  controller.setCell(row.id, column.id, value)
                }
                onOpenStatusPicker={(el) =>
                  setStatusPicker({ el, columnId: column.id, rowId: row.id })
                }
              />
            ))}
            <IconButton
              size="small"
              className="row-delete-btn"
              onClick={() => controller.deleteRow(row.id)}
              sx={{
                opacity: 0,
                transition: 'opacity 0.15s',
                width: 36,
                borderRadius: 0,
                color: 'text.disabled',
                '&:hover': { color: 'error.main' },
              }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        ))}

        {/* Add row */}
        <Box
          onClick={controller.addRow}
          contentEditable={false}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.7,
            px: 1.5,
            py: 0.9,
            borderTop: '1px solid',
            borderColor: 'divider',
            cursor: 'pointer',
            color: 'text.disabled',
            fontSize: '13px',
            fontWeight: 600,
            '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
          }}
        >
          <AddIcon sx={{ fontSize: 15 }} />
          New row
        </Box>

        {/* Calculate footer */}
        <Box
          sx={{
            display: 'flex',
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: headerBg(theme),
          }}
        >
          {data.columns.map((column) => (
            <CalcFooterCell
              key={column.id}
              column={column}
              rows={data.rows}
              onChangeCalc={(calc) => controller.setCalc(column.id, calc)}
            />
          ))}
        </Box>
      </Box>

      {statusPicker && activeColumn && (
        <StatusPicker
          anchorEl={statusPicker.el}
          options={activeColumn.options ?? []}
          onClose={() => setStatusPicker(null)}
          onSelect={(optionId) =>
            controller.setCell(
              statusPicker.rowId,
              statusPicker.columnId,
              optionId,
            )
          }
          onCreate={(label) =>
            controller.createStatusOption(
              statusPicker.columnId,
              statusPicker.rowId,
              label,
            )
          }
          onDeleteOption={(optionId) =>
            controller.deleteStatusOption(statusPicker.columnId, optionId)
          }
        />
      )}
    </Box>
  );
};

export const DatabaseTableBlock = createReactBlockSpec(
  {
    type: 'databaseTable',
    propSchema: {
      data: { default: JSON.stringify(createDefaultDatabaseTableData()) },
    },
    content: 'none',
  },
  {
    render: (props) => <DatabaseTableRenderer {...props} />,
  },
);
