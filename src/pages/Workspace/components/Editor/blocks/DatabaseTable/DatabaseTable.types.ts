export type DatabaseColumnType = 'text' | 'number' | 'status' | 'checkbox';

export interface DatabaseStatusOption {
  id: string;
  label: string;
  color: string;
}

export type DatabaseCalc =
  | 'none'
  | 'count_all'
  | 'count_values'
  | 'count_unique'
  | 'count_empty'
  | 'count_not_empty'
  | 'percent_empty'
  | 'percent_not_empty'
  | 'sum'
  | 'average'
  | 'median'
  | 'min'
  | 'max'
  | 'range'
  | 'count_checked'
  | 'count_unchecked'
  | 'percent_checked'
  | 'percent_unchecked';

export interface DatabaseColumn {
  id: string;
  name: string;
  type: DatabaseColumnType;
  options?: DatabaseStatusOption[];
  calc: DatabaseCalc;
}

export interface DatabaseRow {
  id: string;
  cells: Record<string, string>;
}

export interface DatabaseTableData {
  columns: DatabaseColumn[];
  rows: DatabaseRow[];
}
