import { NextRequest, NextResponse } from 'next/server';
import { TransactionService } from '@/services/TransactionService';

const transactionService = TransactionService.getInstance();

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const id = params.id;

		if (!id) {
			return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
		}

		const [error, transaction] = await transactionService.delete(id);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 404 });
		}

		return NextResponse.json({ message: 'Đã xóa giao dịch thành công', transaction });
	} catch (error) {
		return NextResponse.json({ error: 'Đã xảy ra lỗi' }, { status: 500 });
	}
}
