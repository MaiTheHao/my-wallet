import { NextResponse } from 'next/server';
import { TransactionService } from '@/services/TransactionService';

const transactionService = TransactionService.getInstance();

export async function GET() {
	try {
		const [error, balance] = await transactionService.getTotalBalance();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(balance);
	} catch (error) {
		return NextResponse.json({ error: 'Đã xảy ra lỗi' }, { status: 500 });
	}
}
