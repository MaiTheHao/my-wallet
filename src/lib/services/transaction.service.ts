import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionType, TTransaction } from '../models/transaction.model';
import { ErrorFirst } from '@/lib/types/error-first.type';
import { paginateService } from './paginate.service';
import { PaginateResult } from '../types/paginate.type';

export class TransactionService {
	private static instance: TransactionService | null = null;
	private readonly transactionRepo = TransactionRepository.getInstance();

	private constructor() {}

	public static getInstance(): TransactionService {
		if (!TransactionService.instance) {
			TransactionService.instance = new TransactionService();
		}
		return TransactionService.instance;
	}

	// --- CRUD Operations ---

	async create(data: Omit<TTransaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<ErrorFirst<TTransaction>> {
		return this.executeSafely(async () => {
			return await this.transactionRepo.create(data);
		});
	}

	async getById(id: string): Promise<ErrorFirst<TTransaction>> {
		return this.executeSafely(async () => {
			const result = await this.transactionRepo.getById(id);
			if (!result) throw new Error('Không tìm thấy giao dịch');
			return result;
		});
	}

	async update(id: string, data: Partial<Omit<TTransaction, '_id' | 'createdAt' | 'updatedAt'>>): Promise<ErrorFirst<TTransaction>> {
		return this.executeSafely(async () => {
			const result = await this.transactionRepo.update(id, data);
			if (!result) throw new Error('Không tìm thấy giao dịch để cập nhật');
			return result;
		});
	}

	async delete(id: string): Promise<ErrorFirst<TTransaction>> {
		return this.executeSafely(async () => {
			const result = await this.transactionRepo.delete(id);
			if (!result) throw new Error('Không tìm thấy giao dịch để xoá');
			return result;
		});
	}

	async deleteBatch(ids: string[]): Promise<ErrorFirst<{ deletedCount: number }>> {
		return this.executeSafely(async () => {
			const result = await this.transactionRepo.deleteBatch(ids);
			return { deletedCount: result.deletedCount };
		});
	}

	// --- Aggregation & List Operations ---

	async getList(filter: Partial<TTransaction> = {}, page = 1, limit = 10, sort?: Record<string, 1 | -1>): Promise<ErrorFirst<PaginateResult<TTransaction>>> {
		return this.executeSafely(async () => {
			const [data, total] = await Promise.all([this.transactionRepo.getList(filter, sort, limit, page), this.transactionRepo.count(filter as any)]);

			return paginateService.getPaginated({ data: data || [], total: total || 0 }, limit, page);
		});
	}

	async count(filter: Partial<TTransaction> = {}): Promise<ErrorFirst<number>> {
		return this.executeSafely(async () => {
			return await this.transactionRepo.count(filter as any);
		});
	}

	async getBalance(): Promise<ErrorFirst<Record<TransactionType, number>>> {
		return this.executeSafely(async () => {
			const stats = await this.transactionRepo.getBalanceStats();

			const balance = {
				[TransactionType.INCOME]: 0,
				[TransactionType.EXPENSE]: 0,
			};

			stats.forEach((stat: { _id: string; total: number }) => {
				if (stat._id === TransactionType.INCOME) balance[TransactionType.INCOME] = stat.total;
				if (stat._id === TransactionType.EXPENSE) balance[TransactionType.EXPENSE] = stat.total;
			});

			return balance;
		});
	}

	// --- Private Helpers ---

	private async executeSafely<T>(operation: () => Promise<T>): Promise<ErrorFirst<T>> {
		try {
			const result = await operation();
			return [null, result];
		} catch (error) {
			const normalizedError = error instanceof Error ? error : new Error('Đã xảy ra lỗi không xác định');
			return [normalizedError, null];
		}
	}
}
