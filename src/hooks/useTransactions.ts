'use client';
import { useState, useEffect } from 'react';
import { Transaction, PaginationInfo } from '@/lib/types/transaction.types';
import { TransactionApiService } from '@/lib/services/api/transaction-api.service';
import { CLIENT_EVENTS } from '@/lib/const/events';
import { confirmDelete, confirmDeleteBatch, showSuccess, showError } from '@/lib/utils/swal.config';

export function useTransactions() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [pagination, setPagination] = useState<PaginationInfo>({
		page: 1,
		limit: 5,
		total: 0,
		totalPages: 0,
	});
	const [loading, setLoading] = useState(false);

	const fetchTransactions = async (page = 1) => {
		setLoading(true);
		try {
			const result = await TransactionApiService.getList(page, pagination.limit);

			if (result.success && result.data) {
				setTransactions(result.data.data);
				setPagination({
					page: result.data.page,
					limit: result.data.limit,
					total: result.data.total,
					totalPages: result.data.totalPages,
				});
			} else {
				setTransactions([]);
				setPagination((prev) => ({ ...prev, total: 0, totalPages: 0 }));
			}
		} catch (error) {
			console.error('Không thể tải danh sách giao dịch:', error);
		}
		setLoading(false);
	};

	const deleteTransaction = async (id: string) => {
		if (!(await confirmDelete('giao dịch'))) return;

		try {
			const response = await TransactionApiService.delete(id);
			if (response.success) {
				await showSuccess('Giao dịch đã được xóa thành công.', 'Đã xóa!');
				fetchTransactions(pagination.page);
			} else {
				await showError(response.message || 'Không thể xóa giao dịch.');
			}
		} catch (error) {
			console.error('❌ Lỗi khi xóa giao dịch', error);
			await showError('Đã xảy ra lỗi khi xóa giao dịch.');
		}
	};

	const deleteBatch = async (ids: string[]) => {
		if (ids.length === 0) return;
		if (!(await confirmDeleteBatch(ids.length, 'giao dịch'))) return;

		try {
			const response = await TransactionApiService.deleteBatch(ids);
			if (response.success) {
				await showSuccess(`Đã xóa thành công ${response.data?.deletedCount || ids.length} giao dịch.`, 'Đã xóa!');
				fetchTransactions(pagination.page);
			} else {
				await showError(response.message || 'Không thể xóa các giao dịch.');
			}
		} catch (error) {
			console.error('❌ Lỗi khi xóa nhiều giao dịch', error);
			await showError('Đã xảy ra lỗi khi xóa các giao dịch.');
		}
	};

	useEffect(() => {
		fetchTransactions();
	}, []);

	return {
		transactions,
		pagination,
		loading,
		fetchTransactions,
		deleteTransaction,
		deleteBatch,
	};
}
