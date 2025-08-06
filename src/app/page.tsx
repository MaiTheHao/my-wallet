'use client';

import React from 'react';
import { BalanceDashboard } from '@/components/BalanceDashboard';
import { ChatInterface } from '@/components/ChatInterface';
import { TransactionTable } from '@/components/TransactionTable';
import { useTransactions } from '@/hooks/useTransactions';

function Page() {
	const {
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
	} = useTransactions();

	const handlePageChange = (page: number) => {
		fetchTransactions(page, activeFilter);
	};

	const handleRefresh = () => {
		fetchTransactions(pagination.page, activeFilter);
	};

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Balance Summary */}
			{/* <BalanceDashboard balance={balance} loading={loading} /> */}

			{/* Chat Interface */}
			<ChatInterface
				message={message}
				setMessage={setMessage}
				chatHistory={chatHistory}
				chatLoading={chatLoading}
				onSubmit={handleChatSubmit}
			/>

			{/* Transactions Table */}
			<TransactionTable
				transactions={transactions}
				pagination={pagination}
				loading={loading}
				activeFilter={activeFilter}
				onRefresh={handleRefresh}
				onDelete={deleteTransaction}
				onPageChange={handlePageChange}
				onFilterChange={handleFilterChange}
			/>
		</div>
	);
}

export default Page;
