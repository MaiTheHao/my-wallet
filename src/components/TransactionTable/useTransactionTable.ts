import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { Transaction } from '@/lib/types/transaction.types';
import { columns } from './columns';
import { TableMetaOptions } from './table-types';

interface UseTransactionTableOptions extends TableMetaOptions {
  transactions: Transaction[];
}

export const useTransactionTable = ({
  transactions,
  selectedIds,
  onToggleSelectAll,
  onToggleSelect,
  onDeleteTransaction,
}: UseTransactionTableOptions) => {
  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row._id,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    meta: {
      selectedIds,
      onToggleSelectAll,
      onToggleSelect,
      onDeleteTransaction,
    },
  });

  return table;
};
