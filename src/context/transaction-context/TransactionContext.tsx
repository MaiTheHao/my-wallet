import React from 'react';
import { Transaction, PaginationInfo } from '@/lib/types/transaction.types';

export interface ITransactionContext {
	transactions: Transaction[];
	pagination: PaginationInfo;
	loading: boolean;
	fetchTransactions: (page?: number) => Promise<void>;
	deleteTransaction: (id: string) => Promise<void>;
}

export const TransactionContext = React.createContext<ITransactionContext | undefined>(undefined);
