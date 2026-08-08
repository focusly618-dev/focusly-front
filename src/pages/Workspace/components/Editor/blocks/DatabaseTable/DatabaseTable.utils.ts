import type {
  DatabaseCalc,
  DatabaseColumn,
  DatabaseColumnType,
  DatabaseRow,
  DatabaseStatusOption,
  DatabaseTableData,
} from './DatabaseTable.types';

export const STATUS_COLOR_PALETTE = [
  { name: 'Gray', value: '#6b7280' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Indigo', value: '#6366f1' },
] as const;

export const nextStatusColor = (index: number): string =>
  STATUS_COLOR_PALETTE[index % STATUS_COLOR_PALETTE.length].value;

export const generateId = (prefix: string): string => {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}_${rand}`;
};

export const COLUMN_TYPE_LABELS: Record<DatabaseColumnType, string> = {
  text: 'Text',
  number: 'Number',
  status: 'Status',
  checkbox: 'Checkbox',
};

const COMMON_CALC_OPTIONS: DatabaseCalc[] = [
  'none',
  'count_all',
  'count_values',
  'count_unique',
  'count_empty',
  'count_not_empty',
  'percent_empty',
  'percent_not_empty',
];

const NUMBER_CALC_OPTIONS: DatabaseCalc[] = [
  ...COMMON_CALC_OPTIONS,
  'sum',
  'average',
  'median',
  'min',
  'max',
  'range',
];

const CHECKBOX_CALC_OPTIONS: DatabaseCalc[] = [
  'none',
  'count_all',
  'count_checked',
  'count_unchecked',
  'percent_checked',
  'percent_unchecked',
];

export const CALC_OPTIONS_BY_TYPE: Record<DatabaseColumnType, DatabaseCalc[]> =
  {
    text: COMMON_CALC_OPTIONS,
    status: COMMON_CALC_OPTIONS,
    number: NUMBER_CALC_OPTIONS,
    checkbox: CHECKBOX_CALC_OPTIONS,
  };

export const CALC_LABELS: Record<DatabaseCalc, string> = {
  none: 'Calculate',
  count_all: 'Count all',
  count_values: 'Count values',
  count_unique: 'Count unique values',
  count_empty: 'Count empty',
  count_not_empty: 'Count not empty',
  percent_empty: 'Percent empty',
  percent_not_empty: 'Percent not empty',
  sum: 'Sum',
  average: 'Average',
  median: 'Median',
  min: 'Min',
  max: 'Max',
  range: 'Range',
  count_checked: 'Count checked',
  count_unchecked: 'Count unchecked',
  percent_checked: 'Percent checked',
  percent_unchecked: 'Percent unchecked',
};

const formatNumber = (n: number): string =>
  Number.isInteger(n) ? String(n) : n.toFixed(2);

export const computeCalc = (
  calc: DatabaseCalc,
  column: DatabaseColumn,
  rows: DatabaseRow[],
): string => {
  if (calc === 'none') return '';

  const total = rows.length;
  if (total === 0) return calc.startsWith('percent') ? '0%' : '0';

  const rawValues = rows.map((r) => r.cells[column.id] ?? '');
  const nonEmpty = rawValues.filter((v) => v.trim() !== '');
  const emptyCount = total - nonEmpty.length;
  const pct = (n: number) => `${Math.round((n / total) * 100)}%`;

  switch (calc) {
    case 'count_all':
      return String(total);
    case 'count_values':
    case 'count_not_empty':
      return String(nonEmpty.length);
    case 'count_unique':
      return String(new Set(nonEmpty).size);
    case 'count_empty':
      return String(emptyCount);
    case 'percent_empty':
      return pct(emptyCount);
    case 'percent_not_empty':
      return pct(nonEmpty.length);
    case 'count_checked':
      return String(rawValues.filter((v) => v === 'true').length);
    case 'count_unchecked':
      return String(rawValues.filter((v) => v !== 'true').length);
    case 'percent_checked':
      return pct(rawValues.filter((v) => v === 'true').length);
    case 'percent_unchecked':
      return pct(rawValues.filter((v) => v !== 'true').length);
    case 'sum':
    case 'average':
    case 'median':
    case 'min':
    case 'max':
    case 'range': {
      const nums = nonEmpty
        .map((v) => Number(v))
        .filter((n) => !Number.isNaN(n));
      if (nums.length === 0) return '–';
      if (calc === 'sum') return formatNumber(nums.reduce((a, b) => a + b, 0));
      if (calc === 'average')
        return formatNumber(nums.reduce((a, b) => a + b, 0) / nums.length);
      if (calc === 'min') return formatNumber(Math.min(...nums));
      if (calc === 'max') return formatNumber(Math.max(...nums));
      if (calc === 'range')
        return formatNumber(Math.max(...nums) - Math.min(...nums));
      // median
      const sorted = [...nums].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median =
        sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];
      return formatNumber(median);
    }
    default:
      return '';
  }
};

export const createDefaultDatabaseTableData = (): DatabaseTableData => {
  const statusOptions: DatabaseStatusOption[] = [
    { id: generateId('opt'), label: 'To do', color: nextStatusColor(0) },
    { id: generateId('opt'), label: 'In progress', color: nextStatusColor(1) },
    { id: generateId('opt'), label: 'Done', color: nextStatusColor(2) },
  ];
  return {
    columns: [
      { id: generateId('col'), name: 'Name', type: 'text', calc: 'none' },
      {
        id: generateId('col'),
        name: 'Status',
        type: 'status',
        options: statusOptions,
        calc: 'none',
      },
    ],
    rows: [
      { id: generateId('row'), cells: {} },
      { id: generateId('row'), cells: {} },
      { id: generateId('row'), cells: {} },
    ],
  };
};

export const parseDatabaseTableData = (raw: string): DatabaseTableData => {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.columns) && Array.isArray(parsed.rows)) {
      return parsed as DatabaseTableData;
    }
  } catch {
    // fall through to default
  }
  return createDefaultDatabaseTableData();
};

/**
 * Re-maps a column's cells (and, for status, its options) when its type
 * changes — mirrors Notion's behavior of turning existing plain-text values
 * into freshly minted select/status options instead of discarding them.
 */
export const convertColumnType = (
  column: DatabaseColumn,
  rows: DatabaseRow[],
  newType: DatabaseColumnType,
): { column: DatabaseColumn; rows: DatabaseRow[] } => {
  if (column.type === newType) return { column, rows };

  if (newType === 'status') {
    const optionByLabel = new Map<string, DatabaseStatusOption>();
    const options: DatabaseStatusOption[] = [];
    rows.forEach((row) => {
      const raw = (row.cells[column.id] ?? '').trim();
      if (!raw || optionByLabel.has(raw)) return;
      const option: DatabaseStatusOption = {
        id: generateId('opt'),
        label: raw,
        color: nextStatusColor(options.length),
      };
      optionByLabel.set(raw, option);
      options.push(option);
    });
    const nextRows = rows.map((row) => {
      const raw = (row.cells[column.id] ?? '').trim();
      const option = raw ? optionByLabel.get(raw) : undefined;
      return {
        ...row,
        cells: { ...row.cells, [column.id]: option ? option.id : '' },
      };
    });
    return {
      column: { ...column, type: 'status', options, calc: 'none' },
      rows: nextRows,
    };
  }

  if (column.type === 'status') {
    const optionsById = new Map(
      (column.options ?? []).map((o) => [o.id, o] as const),
    );
    const nextRows = rows.map((row) => {
      const label = optionsById.get(row.cells[column.id] ?? '')?.label ?? '';
      return {
        ...row,
        cells: {
          ...row.cells,
          [column.id]: newType === 'checkbox' ? '' : label,
        },
      };
    });
    return {
      column: { ...column, type: newType, options: undefined, calc: 'none' },
      rows: nextRows,
    };
  }

  if (newType === 'checkbox') {
    const nextRows = rows.map((row) => ({
      ...row,
      cells: {
        ...row.cells,
        [column.id]: row.cells[column.id] === 'true' ? 'true' : '',
      },
    }));
    return {
      column: { ...column, type: 'checkbox', options: undefined, calc: 'none' },
      rows: nextRows,
    };
  }

  return {
    column: { ...column, type: newType, options: undefined, calc: 'none' },
    rows,
  };
};
