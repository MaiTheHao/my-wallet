import { useEffect, useState } from 'react';
import { TransactionApiService } from '@/lib/services/api/transaction-api.service';
import { CLIENT_EVENTS } from '@/lib/const/events';

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
				setError(res.error || res.message || 'không thể lấy số dư');
				setBalance(null);
			} else {
				setBalance(res.data ?? null);
			}
		} catch (err) {
			setError((err as Error).message);
			setBalance(null);
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
