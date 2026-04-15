import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Transaction } from '@/lib/types/transaction.types';
import { CheckSquare, Square, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import { formatAmount } from './utils';
import './table-types';

export const columns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
    meta: {
      headerClassName: 'text-center w-12',
      cellClassName: 'text-center',
    },
    header: ({ table }) => {
      const meta = table.options.meta;
      const rowCount = table.getRowCount();
      const selectedCount = meta?.selectedIds.length || 0;
      const isAllSelected = rowCount > 0 && selectedCount === rowCount;

      return (
        <button
          onClick={meta?.onToggleSelectAll}
          className='p-1 hover:bg-gray-100 rounded transition-colors'
          title={isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
        >
          {isAllSelected ? (
            <CheckSquare size={18} className='text-gray-900' />
          ) : (
            <Square size={18} className='text-gray-400' />
          )}
        </button>
      );
    },
    cell: ({ row, table }) => {
      const meta = table.options.meta;
      const isSelected = meta?.selectedIds.includes(row.original._id);

      return (
        <button
          onClick={() => meta?.onToggleSelect(row.original._id)}
          className='p-1 hover:bg-gray-100 rounded transition-colors'
        >
          {isSelected ? (
            <CheckSquare size={18} className='text-blue-600' />
          ) : (
            <Square size={18} className='text-gray-300' />
          )}
        </button>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Thời gian',
    meta: {
      headerClassName: 'text-left text-xs font-bold text-gray-900 uppercase tracking-wider w-32',
      cellClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className='flex flex-col'>
          <span className='text-sm font-medium text-gray-900'>
            {date.toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
            })}
          </span>
          <span className='text-xs text-gray-400 font-mono'>
            {date.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Nội dung',
    meta: {
      headerClassName: 'text-left text-xs font-bold text-gray-900 uppercase tracking-wider',
      cellClassName: '',
    },
    cell: ({ row }) => {
      return (
        <div className='flex items-center gap-2'>
          {row.original.type === 'income' ? (
            <ArrowUpRight size={16} className='text-gray-400 shrink-0' />
          ) : (
            <ArrowDownRight size={16} className='text-gray-400 shrink-0' />
          )}
          <span className='text-sm text-gray-700 font-medium truncate max-w-[200px]'>
            {row.original.description}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Danh mục',
    meta: {
      headerClassName: 'text-left text-xs font-bold text-gray-900 uppercase tracking-wider w-40',
      cellClassName: '',
    },
    cell: ({ row }) => {
      return (
        <span className='inline-flex items-center px-2 py-1 rounded border border-gray-200 text-xs font-medium text-gray-600 bg-white'>
          {row.original.category}
        </span>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Số tiền (VNĐ)',
    meta: {
      headerClassName: 'text-right text-xs font-bold text-gray-900 uppercase tracking-wider w-40',
      cellClassName: 'text-right whitespace-nowrap',
    },
    cell: ({ row }) => {
      return (
        <span
          className={`text-sm font-mono font-medium tracking-tight ${
            row.original.type === 'income' ? 'text-green-700' : 'text-gray-900'
          }`}
        >
          {formatAmount(row.original.amount, row.original.type)}
        </span>
      );
    },
  },
  {
    id: 'actions',
    meta: {
      headerClassName: 'text-center text-xs font-bold text-gray-900 uppercase tracking-wider w-20',
      cellClassName: 'text-center',
    },
    header: '',
    cell: ({ row, table }) => {
      const meta = table.options.meta;
      return (
        <button
          onClick={() => meta?.onDeleteTransaction(row.original._id)}
          className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100'
          title='Xóa'
        >
          <Trash2 size={16} />
        </button>
      );
    },
  },
];
