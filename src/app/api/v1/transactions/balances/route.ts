import { NextRequest } from 'next/server';
import { TransactionService } from '@/lib/services/transaction.service';
import { ResponseService } from '@/lib/services/response.service';

export async function GET(req: NextRequest) {
	const service = TransactionService.getInstance();

	const [error, balance] = await service.getBalance();

	if (error) {
		return ResponseService.badRequest(error.message);
	}

	return ResponseService.success(balance);
}
