import { NextRequest } from 'next/server';
import { TransactionService } from '@/lib/services/transaction.service';
import { ResponseService } from '@/lib/services/response.service';

const transactionService = TransactionService.getInstance();

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const page = parseInt(searchParams.get('page') || '1');
	const limit = parseInt(searchParams.get('limit') || '10');
	try {
		const filter: any = { createdAt: { $exists: true } };
		const sort: any = { createdAt: -1 };

		const [error, result] = await transactionService.getList(filter, page, limit, sort);
		if (error) {
			return ResponseService.internalError(error.message);
		}

		return ResponseService.success(result);
	} catch (error) {
		return ResponseService.internalError('Đã xảy ra lỗi');
	}
}

export async function POST(request: NextRequest) {
	try {
		const data = await request.json();
		const [error, transaction] = await transactionService.create(data);

		if (error) {
			return ResponseService.badRequest(error.message);
		}

		return ResponseService.created({ transaction });
	} catch (error) {
		return ResponseService.internalError('Đã xảy ra lỗi');
	}
}

export async function PUT(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return ResponseService.badRequest('ID là bắt buộc');
		}

		const data = await request.json();
		const [error, transaction] = await transactionService.update(id, data);

		if (error) {
			return ResponseService.badRequest(error.message);
		}

		return ResponseService.success({ transaction });
	} catch (error) {
		return ResponseService.internalError('Đã xảy ra lỗi');
	}
}
