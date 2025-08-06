'use client';
import React from 'react';
import { BalanceContext } from './BalanceContext';
import { useBalance } from '@/hooks/useBalance';

export function BalanceContextProvider({ children }: { children: React.ReactNode }) {
	const { balance, loading: balanceLoading, error: balanceError, refetch: refetchBalance } = useBalance();

	return (
		<BalanceContext.Provider
			value={{
				balance,
				balanceLoading,
				balanceError,
				refetchBalance,
			}}
		>
			{children}
		</BalanceContext.Provider>
	);
}
