import { NextRequest } from 'next/server';
import { TransactionService } from '@/lib/services/transaction.service';
import { ResponseService } from '@/lib/services/response.service';

const transactionService = TransactionService.getInstance();

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		if (!id) {
			return ResponseService.badRequest('ID là bắt buộc');
		}

		const [error, transaction] = await transactionService.delete(id);

		if (error) {
			return ResponseService.notFound(error.message);
		}

		return ResponseService.success({ message: 'Đã xóa giao dịch thành công', transaction });
	} catch (error) {
		return ResponseService.internalError('Đã xảy ra lỗi');
	}
}
