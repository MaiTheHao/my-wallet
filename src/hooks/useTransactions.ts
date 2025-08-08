'use client';
import { useState, useEffect } from 'react';
import { Transaction, PaginationInfo } from '@/lib/types/transaction.types';
import { TransactionApiService } from '@/lib/services/api/transaction-api.service';
import { CLIENT_EVENTS } from '@/lib/const/events';

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
		if (!confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) return;
		try {
			const result = await TransactionApiService.delete(id);
			if (result.success) fetchTransactions(pagination.page);
		} catch (error) {
			console.error('❌ Lỗi khi xóa giao dịch', error);
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
	};
}
