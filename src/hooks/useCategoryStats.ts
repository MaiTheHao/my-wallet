import { useEffect, useState, useCallback } from 'react';
import { TransactionApiService } from '@/lib/services/api/transaction-api.service';
import { showError } from '@/lib/utils/swal.config';
import { useFilterContext } from '@/context/filter-context/useFilterContext';

interface UseCategoryStatsResult {
	stats: Record<string, number> | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export function useCategoryStats(): UseCategoryStatsResult {
	const [stats, setStats] = useState<Record<string, number> | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	
	const { timeRange, search } = useFilterContext();

	const fetchStats = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await TransactionApiService.getCategoryStats({ timeRange, search });
			if (!res.success) {
				const errorMsg = res.error || res.message || 'không thể lấy thống kê danh mục';
				setError(errorMsg);
				setStats(null);
				await showError(errorMsg, 'Lỗi tải thống kê');
			} else {
				setStats(res.data ?? null);
			}
		} catch (err) {
			const errorMsg = (err as Error).message;
			setError(errorMsg);
			setStats(null);
			await showError(errorMsg, 'Lỗi kết nối');
		} finally {
			setLoading(false);
		}
	}, [timeRange, search]);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	return {
		stats,
		loading,
		error,
		refetch: fetchStats,
	};
}
