'use client';
import React from 'react';
import { Section } from './Section';
import {
	RefreshCw,
	ArrowDownRight, // Đổi icon cho hiện đại hơn
	ArrowUpRight,   // Đổi icon cho hiện đại hơn
	Trash2,
	ChevronLeft,
	ChevronRight,
	ListOrdered,
    Clock,          // Dùng icon Clock thay vì SVG vẽ tay
    MoreHorizontal
} from 'lucide-react';
import { useTransactionContext } from '@/context/transaction-context/useTransactionContext';
import { useBalanceContext } from '@/context/balance-context/useBalanceContext';

export function TransactionTable() {
	const { transactions, pagination, loading, fetchTransactions, deleteTransaction } = useTransactionContext();
	const { refetchBalance } = useBalanceContext();

	const formatAmount = (amount: number, type: 'income' | 'expense') => {
		const formatted = amount.toLocaleString('vi-VN');
		// Thêm dấu + - rõ ràng
        return type === 'income' ? `+ ${formatted}` : `- ${formatted}`;
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

	const handleDeleteTransaction = async (id: string) => {
		if (!confirm('Xóa giao dịch này?')) return; // Rút gọn text confirm
		try {
			await deleteTransaction(id);
			await refetchBalance();
		} catch (error) {
			console.error('Lỗi xóa:', error);
		}
	};

	return (
		<Section
			icon={<ListOrdered size={20} className='text-black' />}
			title='Lịch sử giao dịch'
			id='transaction-table'
			headerRight={
				<div className="flex items-center gap-3">
                    {/* Badge đếm số lượng: Đơn giản, text xám */}
					<span className='text-xs font-medium text-gray-500 hidden sm:inline-block'>
						{pagination.total} dòng
					</span>
                    
                    {/* Nút Refresh: Viền mảnh, hover đen */}
					<button
						onClick={() => fetchTransactions(pagination.page)}
						className='p-2 bg-white border border-gray-200 hover:border-black text-gray-600 hover:text-black rounded-md transition-colors duration-200'
						disabled={loading}
                        title="Làm mới"
					>
						<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
					</button>
				</div>
			}
			className='mb-8'
		>
			{loading ? (
				<div className='flex flex-col items-center justify-center py-20 border-t border-gray-100'>
					<div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-3"></div>
					<p className='text-sm text-gray-500 font-mono'>Loading data...</p>
				</div>
			) : transactions.length === 0 ? (
				<div className='text-center py-20 border-t border-gray-100'>
					<div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4'>
						<ListOrdered size={24} className='text-gray-400' />
					</div>
					<p className='text-sm font-medium text-gray-900'>Chưa có dữ liệu</p>
					<p className='text-xs text-gray-500 mt-1'>Các giao dịch sẽ xuất hiện tại đây</p>
				</div>
			) : (
				<div className='w-full'>
					{/* Desktop Table */}
					<div className="hidden md:block overflow-x-auto">
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className='border-b border-gray-200'>
                                    <th className='px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider w-32'>Thời gian</th>
                                    <th className='px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Nội dung</th>
                                    <th className='px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider w-40'>Danh mục</th>
                                    <th className='px-4 py-3 text-right text-xs font-bold text-gray-900 uppercase tracking-wider w-40'>Số tiền (VNĐ)</th>
                                    <th className='px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider w-20'></th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {transactions.map((transaction) => (
                                    <tr
                                        key={transaction._id}
                                        className='group hover:bg-gray-50 transition-colors duration-150'
                                    >
                                        {/* Cột Thời gian: Gom gọn, font nhỏ */}
                                        <td className='px-4 py-3 whitespace-nowrap'>
                                            <div className="flex flex-col">
                                                <span className='text-sm font-medium text-gray-900'>
                                                    {new Date(transaction.createdAt).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})}
                                                </span>
                                                <span className='text-xs text-gray-400 font-mono'>
                                                    {new Date(transaction.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Cột Mô tả */}
                                        <td className='px-4 py-3'>
                                            <div className="flex items-center gap-2">
                                                {transaction.type === 'income' ? (
                                                    <ArrowUpRight size={16} className='text-gray-400 shrink-0' />
                                                ) : (
                                                    <ArrowDownRight size={16} className='text-gray-400 shrink-0' />
                                                )}
                                                <span className='text-sm text-gray-700 font-medium truncate max-w-[200px]'>
                                                    {transaction.description}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Cột Danh mục: Tag style tối giản */}
                                        <td className='px-4 py-3'>
                                            <span className='inline-flex items-center px-2 py-1 rounded border border-gray-200 text-xs font-medium text-gray-600 bg-white'>
                                                {transaction.category}
                                            </span>
                                        </td>

                                        {/* Cột Số tiền: Font Mono, căn phải */}
                                        <td className='px-4 py-3 text-right whitespace-nowrap'>
                                            <span
                                                className={`text-sm font-mono font-medium tracking-tight ${
                                                    transaction.type === 'income'
                                                        ? 'text-green-700' // Giữ màu text để dễ phân biệt
                                                        : 'text-gray-900'
                                                }`}
                                            >
                                                {formatAmount(transaction.amount, transaction.type)}
                                            </span>
                                        </td>

                                        {/* Cột Thao tác: Chỉ hiện khi hover dòng */}
                                        <td className='px-4 py-3 text-center'>
                                            <button
                                                onClick={() => handleDeleteTransaction(transaction._id)}
                                                className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100'
                                                title="Xóa"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

					{/* Mobile List View (Thay thế Card) */}
					<div className='flex flex-col md:hidden border-t border-gray-100'>
						{transactions.map((transaction) => (
							<div
								key={transaction._id}
								className='flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors'
							>
								<div className='flex items-start gap-3 overflow-hidden'>
                                    {/* Icon phân loại */}
                                    <div className={`mt-1 p-1.5 rounded-full flex-shrink-0 ${
                                         transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                         {transaction.type === 'income' ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
                                    </div>

                                    {/* Nội dung chính */}
									<div className="flex flex-col min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className='font-medium text-gray-900 truncate text-sm'>
                                                {transaction.description}
                                            </span>
                                            <span className='text-[10px] px-1.5 py-0.5 border border-gray-200 rounded text-gray-500 bg-white'>
                                                {transaction.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Clock size={12} />
                                            <span>{formatDate(transaction.createdAt)}</span>
                                            <button 
                                                onClick={() => deleteTransaction(transaction._id)}
                                                className="text-red-400 ml-2 hover:underline"
                                            >
                                                Xóa
                                            </button>
                                        </div>
									</div>
								</div>

                                {/* Số tiền bên phải */}
								<div className='flex-shrink-0 ml-4 text-right'>
									<span
										className={`block font-mono font-medium text-sm ${
											transaction.type === 'income'
												? 'text-green-700'
												: 'text-gray-900'
										}`}
									>
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
                        <ChevronLeft size={20} className="text-gray-800" />
                    </button>

                    <span className='text-xs font-medium text-gray-500 font-mono tracking-widest'>
                        PAGE {pagination.page} / {pagination.totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className='p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
                    >
                        <ChevronRight size={20} className="text-gray-800" />
                    </button>
				</div>
			)}
		</Section>
	);
									}
											
