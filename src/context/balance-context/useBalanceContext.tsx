import { useContext } from 'react';
import { BalanceContext } from './BalanceContext';

export function useBalanceContext() {
	const ctx = useContext(BalanceContext);
	if (!ctx) throw new Error('useBalanceContext must be used within BalanceContextProvider');
	return ctx;
}
