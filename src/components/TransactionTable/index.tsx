'use client';
import React, { useState } from 'react';
import { Section } from '../Section';
import { RefreshCw, Trash2, ListOrdered } from 'lucide-react';
import { useTransactionContext } from '@/context/transaction-context/useTransactionContext';
import { useBalanceContext } from '@/context/balance-context/useBalanceContext';
import { confirmDelete, confirmDeleteBatch } from '@/lib/utils/swal.config';

import { TableDesktop } from './ui/TableDesktop';
import { TableMobile } from './ui/TableMobile';
import { TablePagination } from './ui/TablePagination';
import { useTransactionTable } from './useTransactionTable';

export function TransactionTable() {
  const { transactions, pagination, loading, fetchTransactions, deleteTransaction, deleteBatch } =
    useTransactionContext();
  const { refetchBalance } = useBalanceContext();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchTransactions(page);
      setSelectedIds([]);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!(await confirmDelete('giao dịch'))) return;
    try {
      await deleteTransaction(id);
      await refetchBalance();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!(await confirmDeleteBatch(selectedIds.length, 'giao dịch'))) return;
    try {
      await deleteBatch(selectedIds);
      await refetchBalance();
      setSelectedIds([]);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleDelete = async (ids: string[]) => {
    if (ids.length === 1) {
      await handleDeleteTransaction(ids[0]);
    } else {
      await handleDeleteSelected();
    }
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === transactions.length && transactions.length > 0 ? [] : transactions.map((t) => t._id),
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const table = useTransactionTable({
    transactions,
    selectedIds,
    onToggleSelectAll: toggleSelectAll,
    onToggleSelect: toggleSelect,
    onDeleteTransaction: handleDeleteTransaction,
  });

  return (
    <Section
      icon={<ListOrdered size={20} className='text-black' />}
      title='Lịch sử giao dịch'
      id='transaction-table'
      headerRight={
        <div className='flex items-center gap-3'>
          {selectedIds.length > 0 ? (
            <>
              <span className='text-xs font-medium text-gray-500'>
                {selectedIds.length} đã chọn
              </span>
              <button
                onClick={() => handleDelete(selectedIds)}
                className='px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-xs font-medium flex items-center gap-2'
                title='Xóa đã chọn'
              >
                <Trash2 size={14} />
                Xóa
              </button>
            </>
          ) : (
            <button
              onClick={() => fetchTransactions(pagination.page)}
              className='p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all'
              disabled={loading}
              title='Làm mới'
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      }
    >
      {loading && transactions.length === 0 ? (
        <div className='py-12 text-center text-gray-400 text-sm'>Đang tải dữ liệu...</div>
      ) : transactions.length === 0 ? (
        <div className='py-12 text-center'>
          <div className='inline-flex p-4 rounded-full bg-gray-50 mb-3'>
            <ListOrdered size={24} className='text-gray-300' />
          </div>
          <p className='text-sm text-gray-500'>Chưa có giao dịch nào</p>
        </div>
      ) : (
        <div>
          <TableDesktop table={table} />
          <TableMobile table={table} />
        </div>
      )}

      {/* Pagination Minimal */}
      {!loading && transactions.length > 0 && (
        <TablePagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Section>
  );
}
