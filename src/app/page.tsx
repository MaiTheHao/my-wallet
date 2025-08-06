'use client';
import { ChatInterface } from '@/components/ChatInterface';
import { Summary } from '@/components/Summary';
import { TransactionTable } from '@/components/TransactionTable';
import { TransactionContextProvider } from '@/context/transaction-context/TransactionContextProvider';
import QuickMoveModal from '@/components/QuickMoveModal';

function Page() {
	return (
		<div className='max-w-6xl mx-auto space-y-8 relative'>
			<TransactionContextProvider>
				<ChatInterface />
				<TransactionTable />
				<Summary />
			</TransactionContextProvider>
			<QuickMoveModal />
		</div>
	);
}

export default Page;
