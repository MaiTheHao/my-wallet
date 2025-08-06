import { useState, useEffect } from 'react';
import { Transaction, PaginationInfo, BalanceInfo, ChatMessage } from '@/types/transaction.types';

export function useTransactions() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [pagination, setPagination] = useState<PaginationInfo>({
		page: 1,
		limit: 5,
		total: 0,
		totalPages: 0,
	});
	const [balance, setBalance] = useState<BalanceInfo>({
		income: 0,
		expense: 0,
		balance: 0,
	});
	const [loading, setLoading] = useState(false);
	const [chatLoading, setChatLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
	const [activeFilter, setActiveFilter] = useState<'all' | 'income' | 'expense'>('all');

	const fetchTransactions = async (page = 1, filter: 'all' | 'income' | 'expense' = activeFilter) => {
		setLoading(true);
		try {
			let url = `/api/v1/transaction?page=${page}&limit=5`;

			// Add filter to URL if not 'all'
			if (filter !== 'all') {
				url += `&type=${filter}`;
			}

			const res = await fetch(url);
			const data = await res.json();

			if (res.ok) {
				setTransactions(data.transactions || []);
				setPagination(data.pagination);
				// Fetch balance as well
				fetchBalance();
			}
		} catch (error) {
			console.error('Không thể tải danh sách giao dịch:', error);
		}
		setLoading(false);
	};

	const fetchBalance = async () => {
		try {
			const res = await fetch('/api/v1/transaction/balance');
			const data = await res.json();
			if (res.ok) {
				setBalance(data);
			}
		} catch (error) {
			console.error('Không thể tải thông tin số dư:', error);
		}
	};

	const deleteTransaction = async (id: string) => {
		if (!confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) return;

		try {
			const res = await fetch(`/api/v1/transaction/${id}`, {
				method: 'DELETE',
			});

			if (res.ok) {
				fetchTransactions(pagination.page, activeFilter);
				setChatHistory((prev) => [...prev, { type: 'bot', content: '✅ Đã xóa giao dịch thành công!' }]);
			} else {
				setChatHistory((prev) => [...prev, { type: 'bot', content: '❌ Không thể xóa giao dịch' }]);
			}
		} catch (error) {
			setChatHistory((prev) => [...prev, { type: 'bot', content: '❌ Lỗi khi xóa giao dịch' }]);
		}
	};

	const handleFilterChange = (filter: 'all' | 'income' | 'expense') => {
		setActiveFilter(filter);
		fetchTransactions(1, filter); // Reset to page 1 when filter changes
	};

	const handleChatSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;

		setChatLoading(true);
		const userMessage = message.trim();

		// Add user message to chat history
		setChatHistory((prev) => [...prev, { type: 'user', content: userMessage }]);
		setMessage('');

		try {
			const res = await fetch('/api/v1/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: userMessage }),
			});

			const data = await res.json();

			if (res.ok) {
				// Add bot response to chat history
				setChatHistory((prev) => [...prev, { type: 'bot', content: data.reply }]);

				// Refresh transactions if it was an add transaction request or balance check
				if (
					userMessage.toLowerCase().includes('thêm') ||
					userMessage.toLowerCase().includes('chi') ||
					userMessage.toLowerCase().includes('thu') ||
					userMessage.toLowerCase().includes('mua') ||
					userMessage.toLowerCase().includes('bán') ||
					userMessage.toLowerCase().includes('nhận') ||
					userMessage.toLowerCase().includes('lương') ||
					userMessage.toLowerCase().includes('kiểm tra') ||
					userMessage.toLowerCase().includes('số dư')
				) {
					fetchTransactions(pagination.page, activeFilter);
				}
			} else {
				const errorMsg = `❌ Lỗi: ${data.error}`;
				setChatHistory((prev) => [...prev, { type: 'bot', content: errorMsg }]);
			}
		} catch (error) {
			const errorMsg = '❌ Không thể xử lý yêu cầu';
			setChatHistory((prev) => [...prev, { type: 'bot', content: errorMsg }]);
		}
		setChatLoading(false);
	};

	useEffect(() => {
		fetchTransactions();
	}, []);

	return {
		transactions,
		pagination,
		balance,
		loading,
		chatLoading,
		message,
		setMessage,
		chatHistory,
		activeFilter,
		fetchTransactions,
		deleteTransaction,
		handleChatSubmit,
		handleFilterChange,
	};
}
