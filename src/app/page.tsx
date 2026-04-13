'use client';
import { ChatInterface } from '@/components/ChatInterface';
import { Summary } from '@/components/Summary';
import { TransactionTable } from '@/components/TransactionTable';
import { TransactionContextProvider } from '@/context/transaction-context/TransactionContextProvider';
import { BalanceContextProvider } from '@/context/balance-context/BalanceContextProvider';
import { FilterContextProvider } from '@/context/filter-context/FilterContextProvider';
import QuickMoveModal from '@/components/QuickMoveModal';

function Page() {
	return (
		<div className='max-w-6xl mx-auto space-y-8 relative'>
			<FilterContextProvider>
				<BalanceContextProvider>
					<TransactionContextProvider>
						<ChatInterface />
						<Summary />
						<TransactionTable />
						<QuickMoveModal />
					</TransactionContextProvider>
				</BalanceContextProvider>
			</FilterContextProvider>
		</div>
	);
}

export default Page;
