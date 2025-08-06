import React from 'react';

export interface IBalanceContext {
	balance: Record<string, number> | null;
	balanceLoading: boolean;
	balanceError: string | null;
	refetchBalance: () => void;
}

export const BalanceContext = React.createContext<IBalanceContext | undefined>(undefined);
