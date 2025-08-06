import { ChatInterface } from '@/components/ChatInterface';
import { TransactionTable } from '@/components/TransactionTable';

function Page() {
	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			<ChatInterface />
			<TransactionTable />
		</div>
	);
}

export default Page;
