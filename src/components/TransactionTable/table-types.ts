import { RowData } from '@tanstack/react-table';

export interface TableMetaOptions {
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onDeleteTransaction: (id: string) => void;
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> extends TableMetaOptions {}
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
  }
}
