import { NextRequest, NextResponse } from 'next/server';
import { TransactionService } from '@/services/TransactionService';

const transactionService = TransactionService.getInstance();

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');
	const page = parseInt(searchParams.get('page') || '1');
	const limit = parseInt(searchParams.get('limit') || '10');
	const type = searchParams.get('type'); // 'income' or 'expense' or null for all

	try {
		if (id) {
			const [error, transaction] = await transactionService.getById(id);
			if (error) {
				return NextResponse.json({ error: error.message }, { status: 404 });
			}
			return NextResponse.json({ transaction });
		}

		// Build filter object
		const filter: any = {};
		if (type && (type === 'income' || type === 'expense')) {
			filter.type = type;
		}

		// Use paginated service method with filter
		const [error, result] = await transactionService.getPaginated(filter, page, limit);
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json({ error: 'Đã xảy ra lỗi' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const data = await request.json();
		const [error, transaction] = await transactionService.create(data);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json({ transaction }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: 'Đã xảy ra lỗi' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
		}

		const data = await request.json();
		const [error, transaction] = await transactionService.update(id, data);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json({ transaction });
	} catch (error) {
		return NextResponse.json({ error: 'Đã xảy ra lỗi' }, { status: 500 });
	}
}
