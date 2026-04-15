import React from 'react';
import { Table } from '@tanstack/react-table';
import { CheckSquare, Square, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { Transaction } from '@/lib/types/transaction.types';
import { formatAmount } from '../utils';

export interface TableMobileProps {
  table: Table<Transaction>;
}

export function TableMobile({ table }: TableMobileProps) {
  const meta = table.options.meta;

  return (
    <div className='flex flex-col md:hidden border-t border-gray-100'>
      {table.getRowModel().rows.map((row) => {
        const transaction = row.original;
        const isSelected = meta?.selectedIds.includes(transaction._id);

        return (
          <div
            key={transaction._id}
            className='flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors'
          >
            <div className='flex items-center gap-3 overflow-hidden flex-1'>
              <button
                onClick={() => meta?.onToggleSelect(transaction._id)}
                className='mt-1 p-1 hover:bg-gray-100 rounded transition-colors shrink-0'
              >
                {isSelected ? (
                  <CheckSquare size={20} className='text-blue-600' />
                ) : (
                  <Square size={20} className='text-gray-300' />
                )}
              </button>

              <div
                className={`mt-1 p-1.5 rounded-full shrink-0 ${
                  transaction.type === 'income'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {transaction.type === 'income' ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
              </div>

              <div className='flex flex-col min-w-0 flex-1'>
                <div className='flex flex-col gap-1 items-start'>
                  <span className='text-[10px] px-1.5 py-0.5 border border-gray-200 rounded text-gray-500 bg-white shrink-0'>
                    {transaction.category}
                  </span>
                  <span className='font-medium text-gray-900 text-sm'>
                    {transaction.description}
                  </span>
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-400'>
                  <Clock size={12} />
                  <span>
                    {new Date(transaction.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className='shrink-0 ml-4 text-right'>
              <span
                className={`block font-mono font-medium text-sm ${
                  transaction.type === 'income' ? 'text-green-700' : 'text-gray-900'
                }`}
              >
                {formatAmount(transaction.amount, transaction.type)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
