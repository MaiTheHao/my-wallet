import { useEffect, useState } from 'react';
import { TransactionApiService } from '@/lib/services/api/transaction-api.service';
import { showError } from '@/lib/utils/swal.config';

type Balance = Record<string, number>;

interface UseBalanceResult {
	balance: Balance | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export function useBalance(): UseBalanceResult {
	const [balance, setBalance] = useState<Balance | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchBalance = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await TransactionApiService.getBalance();
			if (!res.success) {
				const errorMsg = res.error || res.message || 'không thể lấy số dư';
				setError(errorMsg);
				setBalance(null);
				await showError(errorMsg, 'Lỗi tải số dư');
			} else {
				setBalance(res.data ?? null);
			}
		} catch (err) {
			const errorMsg = (err as Error).message;
			setError(errorMsg);
			setBalance(null);
			await showError(errorMsg, 'Lỗi kết nối');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBalance();
	}, []);

	return {
		balance,
		loading,
		error,
		refetch: fetchBalance,
	};
}
