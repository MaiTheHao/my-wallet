import { NextRequest } from 'next/server';
import { TransactionService } from '@/lib/services/transaction.service';
import { ResponseService } from '@/lib/services/response.service';

const transactionService = TransactionService.getInstance();

export async function DELETE(req: NextRequest) {
	try {
		const { ids } = await req.json();

		if (!ids || !Array.isArray(ids) || ids.length === 0) {
			return ResponseService.badRequest('Danh sách ID không hợp lệ');
		}

		const [error, result] = await transactionService.deleteBatch(ids);

		if (error) {
			return ResponseService.internalError(error.message);
		}

		return ResponseService.success({
			message: `Đã xóa thành công ${result?.deletedCount || 0} giao dịch`,
			deletedCount: result?.deletedCount || 0,
		});
	} catch (error) {
		return ResponseService.internalError('Đã xảy ra lỗi khi xử lý yêu cầu');
	}
}
