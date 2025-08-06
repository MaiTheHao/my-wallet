'use client';
import React from 'react';
import { Section } from './Section';
import { RefreshCw, ArrowDownCircle, ArrowUpCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { CLIENT_EVENTS } from '@/lib/const/events';

export function TransactionTable() {
	const { transactions, pagination, loading, fetchTransactions, deleteTransaction } = useTransactions();
	const eventEmitter = useEventEmitter();

	React.useEffect(() => {
		const handler = eventEmitter.on(CLIENT_EVENTS.TRANSACTION_CREATED, () => {
			fetchTransactions(pagination.page);
		});
		return () => {
			eventEmitter.off(CLIENT_EVENTS.TRANSACTION_CREATED, handler);
		};
	}, [pagination.page, fetchTransactions]);

	const formatAmount = (amount: number, type: 'income' | 'expense') => {
		const formatted = amount.toLocaleString('vi-VN');
		return type === 'income' ? `+${formatted}đ` : `-${formatted}đ`;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= pagination.totalPages) {
			fetchTransactions(page);
		}
	};

	return (
		<Section
			icon={<span className='text-white text-lg font-bold'>📋</span>}
			title='Lịch Sử Giao Dịch'
			headerRight={
				<>
					<button
						onClick={() => fetchTransactions(pagination.page)}
						className='px-4 py-2 bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2'
						disabled={loading}
					>
						<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
						{loading ? 'Đang tải...' : 'Làm mới'}
					</button>
					<span className='px-4 py-2 bg-slate-100 rounded-full text-sm font-semibold text-slate-600'>
						{pagination.total} giao dịch
					</span>
				</>
			}
			className='mb-8'
		>
			{loading ? (
				<div className='flex flex-col items-center justify-center py-16 text-slate-400'>
					<RefreshCw size={32} className='animate-spin mb-4 text-blue-500' />
					<p className='text-lg font-medium'>Đang tải dữ liệu...</p>
				</div>
			) : transactions.length === 0 ? (
				<div className='text-center py-16 text-slate-400'>
					<div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4'>
						<span className='text-2xl'>📝</span>
					</div>
					<p className='text-lg font-medium'>Chưa có giao dịch nào</p>
					<p className='text-sm'>Hãy bắt đầu ghi chép chi tiêu của bạn!</p>
				</div>
			) : (
				<div className='overflow-x-auto'>
					{/* Desktop Table */}
					<table className='w-full hidden md:table'>
						<thead className='bg-slate-50/50'>
							<tr>
								<th className='px-6 py-4 text-left text-sm font-semibold text-slate-600'>Loại</th>
								<th className='px-6 py-4 text-left text-sm font-semibold text-slate-600'>Mô tả</th>
								<th className='px-6 py-4 text-left text-sm font-semibold text-slate-600'>Danh mục</th>
								<th className='px-6 py-4 text-right text-sm font-semibold text-slate-600'>Số tiền</th>
								<th className='px-6 py-4 text-left text-sm font-semibold text-slate-600'>Thời gian</th>
								<th className='px-6 py-4 text-center text-sm font-semibold text-slate-600'>Thao tác</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-slate-200/50'>
							{transactions.map((transaction) => (
								<tr
									key={transaction._id}
									className='hover:bg-slate-50/30 transition-colors duration-200'
								>
									<td className='px-6 py-4'>
										<div
											className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
												transaction.type === 'income'
													? 'bg-green-100 text-green-600'
													: 'bg-red-100 text-red-600'
											}`}
										>
											{transaction.type === 'income' ? (
												<ArrowUpCircle size={16} />
											) : (
												<ArrowDownCircle size={16} />
											)}
											{transaction.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
										</div>
									</td>
									<td className='px-6 py-4'>
										<span className='font-medium text-slate-800'>{transaction.description}</span>
									</td>
									<td className='px-6 py-4'>
										<span className='px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-600'>
											{transaction.category}
										</span>
									</td>
									<td className='px-6 py-4 text-right'>
										<span
											className={`font-bold ${
												transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
											}`}
										>
											{formatAmount(transaction.amount, transaction.type)}
										</span>
									</td>
									<td className='px-6 py-4 text-slate-600 text-sm'>
										{formatDate(transaction.createdAt)}
									</td>
									<td className='px-6 py-4 text-center'>
										<button
											onClick={() => deleteTransaction(transaction._id)}
											className='px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 mx-auto'
										>
											<Trash2 size={14} />
											Xóa
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* Mobile Cards */}
					<div className='grid grid-cols-1 gap-4 md:hidden'>
						{transactions.map((transaction) => (
							<div
								key={transaction._id}
								className='bg-white rounded-lg shadow-sm border border-slate-200 p-4'
							>
								<div className='flex items-center justify-between mb-3'>
									<div
										className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
											transaction.type === 'income'
												? 'bg-green-100 text-green-700'
												: 'bg-red-100 text-red-700'
										}`}
									>
										{transaction.type === 'income' ? (
											<ArrowUpCircle size={12} />
										) : (
											<ArrowDownCircle size={12} />
										)}
										{transaction.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
									</div>
									<span className='px-2 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600'>
										{transaction.category}
									</span>
								</div>
								<div className='mb-2'>
									<h4 className='font-medium text-slate-800'>{transaction.description}</h4>
								</div>
								<div className='flex items-center justify-between mb-3'>
									<span className='text-slate-500 text-xs'>{formatDate(transaction.createdAt)}</span>
									<span
										className={`font-bold ${
											transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
										}`}
									>
										{formatAmount(transaction.amount, transaction.type)}
									</span>
								</div>
								<button
									onClick={() => deleteTransaction(transaction._id)}
									className='w-full px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1'
								>
									<Trash2 size={14} />
									Xóa
								</button>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Pagination */}
			{pagination.totalPages > 1 && (
				<div className='px-4 md:px-8 py-4 md:py-6 bg-slate-50/30 border-t border-slate-200/50'>
					<div className='flex items-center justify-between'>
						<p className='text-xs md:text-sm text-slate-600'>
							Trang {pagination.page} / {pagination.totalPages}
						</p>
						<div className='flex gap-2'>
							<button
								onClick={() => handlePageChange(pagination.page - 1)}
								disabled={pagination.page <= 1}
								className='px-3 md:px-4 py-1 md:py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1'
							>
								<ChevronLeft size={16} />
								<span className='hidden md:inline'>Trước</span>
							</button>
							<button
								onClick={() => handlePageChange(pagination.page + 1)}
								disabled={pagination.page >= pagination.totalPages}
								className='px-3 md:px-4 py-1 md:py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1'
							>
								<span className='hidden md:inline'>Sau</span>
								<ChevronRight size={16} />
							</button>
						</div>
					</div>
				</div>
			)}
		</Section>
	);
}
