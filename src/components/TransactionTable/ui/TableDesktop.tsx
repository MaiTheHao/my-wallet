import React from 'react';
import { Table, flexRender } from '@tanstack/react-table';
import { Transaction } from '@/lib/types/transaction.types';

export interface TableDesktopProps {
  table: Table<Transaction>;
}

export function TableDesktop({ table }: TableDesktopProps) {
  return (
    <div className='hidden md:block overflow-x-auto'>
      <table className='w-full border-collapse'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className='border-b border-gray-200'>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`px-4 py-3 ${header.column.columnDef.meta?.headerClassName || ''}`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className='group hover:bg-gray-50 transition-colors duration-150'
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`px-4 py-3 ${cell.column.columnDef.meta?.cellClassName || ''}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
