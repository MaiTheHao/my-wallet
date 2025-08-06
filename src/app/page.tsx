'use client';

import React from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { TransactionTable } from '@/components/TransactionTable';
import { useTransactions } from '@/hooks/useTransactions';

function Page() {
	const {
		transactions,
		pagination,
		loading,
		chatLoading,
		message,
		setMessage,
		chatHistory,
		fetchTransactions,
		deleteTransaction,
		handleChatSubmit,
	} = useTransactions();

	const handlePageChange = (page: number) => {
		fetchTransactions(page);
	};

	const handleRefresh = () => {
		fetchTransactions(pagination.page);
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
				onRefresh={handleRefresh}
				onDelete={deleteTransaction}
				onPageChange={handlePageChange}
			/>
		</div>
	);
}

export default Page;
