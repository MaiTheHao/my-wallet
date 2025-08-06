import { useContext } from 'react';
import { TransactionContext } from './TransactionContext';

export function useTransactionContext() {
	const ctx = useContext(TransactionContext);
	if (!ctx) throw new Error('useTransactionContext must be used within TransactionContextProvider');
	return ctx;
}
