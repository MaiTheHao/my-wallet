'use client';
import React, { useState } from 'react';
import { Section } from './Section';
import { RefreshCw, ArrowDownRight, ArrowUpRight, Trash2, ChevronLeft, ChevronRight, ListOrdered, Clock, MoreHorizontal, CheckSquare, Square } from 'lucide-react';
import { useTransactionContext } from '@/context/transaction-context/useTransactionContext';
import { useBalanceContext } from '@/context/balance-context/useBalanceContext';
import { confirmDelete, confirmDeleteBatch } from '@/lib/utils/swal.config';

export function TransactionTable() {
	const { transactions, pagination, loading, fetchTransactions, deleteTransaction, deleteBatch } = useTransactionContext();
	const { refetchBalance } = useBalanceContext();
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	const formatAmount = (amount: number, type: 'income' | 'expense') => {
		const formatted = amount.toLocaleString('vi-VN');
		return type === 'income' ? `+${formatted}` : `-${formatted}`;
	};

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
		setSelectedIds(selectedIds.length === transactions.length ? [] : transactions.map((t) => t._id));
	};

	const toggleSelect = (id: string) => {
		setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
	};

	return (
		<Section
			icon={<ListOrdered size={20} className='text-black' />}
			title='Lịch sử giao dịch'
			id='transaction-table'
			headerRight={
				<div className='flex items-center gap-3'>
					{selectedIds.length > 0 ? (
						<>
							<span className='text-xs font-medium text-gray-500'>{selectedIds.length} đã chọn</span>
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
					<div className='hidden md:block overflow-x-auto'>
						<table className='w-full border-collapse'>
							<thead>
								<tr className='border-b border-gray-200'>
									<th className='px-4 py-3 text-center w-12'>
										<button
											onClick={toggleSelectAll}
											className='p-1 hover:bg-gray-100 rounded transition-colors'
											title={selectedIds.length === transactions.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
										>
											{selectedIds.length === transactions.length ? (
												<CheckSquare size={18} className='text-gray-900' />
											) : (
												<Square size={18} className='text-gray-400' />
											)}
										</button>
									</th>
									<th className='px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider w-32'>Thời gian</th>
									<th className='px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Nội dung</th>
									<th className='px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider w-40'>Danh mục</th>
									<th className='px-4 py-3 text-right text-xs font-bold text-gray-900 uppercase tracking-wider w-40'>Số tiền (VNĐ)</th>
									<th className='px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider w-20'></th>
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-100'>
								{transactions.map((transaction) => (
									<tr key={transaction._id} className='group hover:bg-gray-50 transition-colors duration-150'>
										<td className='px-4 py-3 text-center'>
											<button onClick={() => toggleSelect(transaction._id)} className='p-1 hover:bg-gray-100 rounded transition-colors'>
												{selectedIds.includes(transaction._id) ? (
													<CheckSquare size={18} className='text-blue-600' />
												) : (
													<Square size={18} className='text-gray-300' />
												)}
											</button>
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='flex flex-col'>
												<span className='text-sm font-medium text-gray-900'>
													{new Date(transaction.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
												</span>
												<span className='text-xs text-gray-400 font-mono'>
													{new Date(transaction.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
												</span>
											</div>
										</td>

										<td className='px-4 py-3'>
											<div className='flex items-center gap-2'>
												{transaction.type === 'income' ? (
													<ArrowUpRight size={16} className='text-gray-400 shrink-0' />
												) : (
													<ArrowDownRight size={16} className='text-gray-400 shrink-0' />
												)}
												<span className='text-sm text-gray-700 font-medium truncate max-w-[200px]'>{transaction.description}</span>
											</div>
										</td>

										<td className='px-4 py-3'>
											<span className='inline-flex items-center px-2 py-1 rounded border border-gray-200 text-xs font-medium text-gray-600 bg-white'>
												{transaction.category}
											</span>
										</td>

										<td className='px-4 py-3 text-right whitespace-nowrap'>
											<span className={`text-sm font-mono font-medium tracking-tight ${transaction.type === 'income' ? 'text-green-700' : 'text-gray-900'}`}>
												{formatAmount(transaction.amount, transaction.type)}
											</span>
										</td>

										<td className='px-4 py-3 text-center'>
											<button
												onClick={() => handleDeleteTransaction(transaction._id)}
												className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100'
												title='Xóa'
											>
												<Trash2 size={16} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className='flex flex-col md:hidden border-t border-gray-100'>
						{transactions.map((transaction) => (
							<div key={transaction._id} className='flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors'>
								<div className='flex items-start gap-3 overflow-hidden flex-1'>
									<button onClick={() => toggleSelect(transaction._id)} className='mt-1 p-1 hover:bg-gray-100 rounded transition-colors shrink-0'>
										{selectedIds.includes(transaction._id) ? (
											<CheckSquare size={20} className='text-blue-600' />
										) : (
											<Square size={20} className='text-gray-300' />
										)}
									</button>

									<div
										className={`mt-1 p-1.5 rounded-full shrink-0 ${
											transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
										}`}
									>
										{transaction.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
									</div>

									<div className='flex flex-col min-w-0 flex-1'>
										<div className='flex items-center gap-2 mb-0.5'>
											<span className='font-medium text-gray-900 truncate text-sm'>{transaction.description}</span>
											<span className='text-[10px] px-1.5 py-0.5 border border-gray-200 rounded text-gray-500 bg-white shrink-0'>{transaction.category}</span>
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
									<span className={`block font-mono font-medium text-sm ${transaction.type === 'income' ? 'text-green-700' : 'text-gray-900'}`}>
										{formatAmount(transaction.amount, transaction.type)}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Pagination Minimal */}
			{pagination.totalPages > 1 && (
				<div className='px-4 py-4 border-t border-gray-200 flex items-center justify-between bg-white'>
					<button
						onClick={() => handlePageChange(pagination.page - 1)}
						disabled={pagination.page <= 1}
						className='p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
					>
						<ChevronLeft size={20} className='text-gray-800' />
					</button>

					<span className='text-xs font-medium text-gray-500 font-mono tracking-widest'>
						PAGE {pagination.page} / {pagination.totalPages}
					</span>

					<button
						onClick={() => handlePageChange(pagination.page + 1)}
						disabled={pagination.page >= pagination.totalPages}
						className='p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
					>
						<ChevronRight size={20} className='text-gray-800' />
					</button>
				</div>
			)}
		</Section>
	);
}
