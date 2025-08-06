export interface Transaction {
	_id: string;
	amount: number;
	description: string;
	type: 'income' | 'expense';
	category: string;
	createdAt: string;
}

export interface PaginationInfo {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface BalanceInfo {
	income: number;
	expense: number;
	balance: number;
}

export interface ChatMessage {
	type: 'user' | 'bot';
	content: string;
}
