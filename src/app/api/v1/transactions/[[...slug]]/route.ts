import { NextRequest } from 'next/server';
import { TransactionService } from '@/lib/services/transaction.service';
import { ResponseService } from '@/lib/services/response.service';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const transactionService = TransactionService.getInstance();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const filter: any = { userId: searchParams.get('userId') || 'system_user' };

  const timeRange = searchParams.get('timeRange');
  if (timeRange === 'week') {
    filter.createdAt = {
      $gte: dayjs().startOf('isoWeek').toDate(),
      $lte: dayjs().endOf('isoWeek').toDate(),
    };
  } else if (timeRange === 'month') {
    filter.createdAt = {
      $gte: dayjs().startOf('month').toDate(),
      $lte: dayjs().endOf('month').toDate(),
    };
  }

  const search = searchParams.get('search');
  if (search && search.trim() !== '') {
    filter.description = { $regex: search.trim(), $options: 'i' };
  }

  if (slug && slug[0] === 'balances') {
    const [error, balance] = await transactionService.getBalance(filter);
    if (error) return ResponseService.badRequest(error.message);
    return ResponseService.success(balance);
  }

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const sort: any = { createdAt: -1 };

    const [error, result] = await transactionService.getList(filter, page, limit, sort);
    if (error) return ResponseService.internalError(error.message);
    return ResponseService.success(result);
  } catch (error) {
    return ResponseService.internalError('Đã xảy ra lỗi');
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    data.userId = data.userId || 'system_user';

    const [error, transaction] = await transactionService.create(data);

    if (error) return ResponseService.badRequest(error.message);
    return ResponseService.created({ transaction });
  } catch (error) {
    return ResponseService.internalError('Đã xảy ra lỗi');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return ResponseService.badRequest('ID là bắt buộc');

    const data = await request.json();
    const [error, transaction] = await transactionService.update(id, data);

    if (error) return ResponseService.badRequest(error.message);
    return ResponseService.success({ transaction });
  } catch (error) {
    return ResponseService.internalError('Đã xảy ra lỗi');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return ResponseService.badRequest('Yêu cầu không hợp lệ');
  }

  if (slug[0] === 'batch') {
    try {
      const { ids } = await request.json();
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return ResponseService.badRequest('Danh sách ID không hợp lệ');
      }
      const [error, result] = await transactionService.deleteBatch(ids);
      if (error) return ResponseService.internalError(error.message);
      return ResponseService.success({
        message: `Đã xóa thành công ${result?.deletedCount || 0} giao dịch`,
        deletedCount: result?.deletedCount || 0,
      });
    } catch (error) {
      return ResponseService.internalError('Đã xảy ra lỗi khi xử lý yêu cầu');
    }
  }

  try {
    const id = slug[0];
    const [error, transaction] = await transactionService.delete(id);
    if (error) return ResponseService.notFound(error.message);
    return ResponseService.success({ message: 'Đã xóa giao dịch thành công', transaction });
  } catch (error) {
    return ResponseService.internalError('Đã xảy ra lỗi');
  }
}
