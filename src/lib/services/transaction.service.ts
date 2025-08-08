import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionType, TTransaction } from '../models/transaction.model';
import { ErrorFirst } from '@/lib/types/error-first.type';
import { paginateService } from './paginate.service';
import { PaginateResult } from '../types/paginate.type';

export class TransactionService {
	private static instance: TransactionService | null = null;
	private transactionRepo = TransactionRepository.getInstance();

	private constructor() {}

	public static getInstance(): TransactionService {
		if (!TransactionService.instance) {
			TransactionService.instance = new TransactionService();
		}
		return TransactionService.instance;
	}

	async create(data: Omit<TTransaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<ErrorFirst<TTransaction>> {
		try {
			const result = await this.transactionRepo.create(data);
			return [null, result];
		} catch (error) {
			return [error instanceof Error ? error : new Error('Đã xảy ra lỗi'), null];
		}
	}

	async getById(id: string): Promise<ErrorFirst<TTransaction>> {
		try {
			const result = await this.transactionRepo.getById(id);
			if (!result) return [new Error('Không tìm thấy giao dịch'), null];
			return [null, result];
		} catch (error) {
			return [error instanceof Error ? error : new Error('Đã xảy ra lỗi'), null];
		}
	}

	async getList(
		filter: Partial<TTransaction> = {},
		page = 1,
		limit = 10,
		sort?: Record<string, 1 | -1>
	): Promise<ErrorFirst<PaginateResult<TTransaction>>> {
		try {
			const [data, [countErr, total]] = await Promise.all([
				this.transactionRepo.getList(filter, sort, limit, page),
				this.count(filter),
			]);

			if (countErr) return [countErr, null];
			if (!data?.length || !total) return [new Error('Không tìm thấy giao dịch'), null];

			const pagination = paginateService.getPaginated({ data, total }, limit, page);
			return [null, pagination];
		} catch (error) {
			return [error instanceof Error ? error : new Error('Đã xảy ra lỗi'), null];
		}
	}

	async getBalance(): Promise<ErrorFirst<Record<TransactionType, number>>> {
		try {
			const transactions = await this.transactionRepo.getAll();
			const typeTotals: Record<TransactionType, number> = {
				[TransactionType.INCOME]: 0,
				[TransactionType.EXPENSE]: 0,
			};

			for (const { type, amount } of transactions) {
				if (Object.values(TransactionType).includes(type as TransactionType)) {
					typeTotals[type as TransactionType] += amount;
				}
			}

			return [null, { ...typeTotals }];
		} catch (error) {
			return [error instanceof Error ? error : new Error('Đã xảy ra lỗi'), null];
		}
	}

	async update(
		id: string,
		data: Partial<Omit<TTransaction, '_id' | 'createdAt' | 'updatedAt'>>
	): Promise<ErrorFirst<TTransaction>> {
		try {
			const result = await this.transactionRepo.update(id, data);
			if (!result) return [new Error('Không tìm thấy giao dịch để cập nhật'), null];
			return [null, result];
		} catch (error) {
			return [error instanceof Error ? error : new Error('Đã xảy ra lỗi'), null];
		}
	}

	async delete(id: string): Promise<ErrorFirst<TTransaction>> {
		try {
			const result = await this.transactionRepo.delete(id);
			if (!result) return [new Error('Không tìm thấy giao dịch để xoá'), null];
			return [null, result];
		} catch (error) {
			return [error instanceof Error ? error : new Error('Đã xảy ra lỗi'), null];
		}
	}

	async count(filter: Partial<TTransaction> = {}): Promise<ErrorFirst<number>> {
		try {
			const count = await this.transactionRepo.count(filter as any);
			return [null, count];
		} catch (error) {
			return [error instanceof Error ? error : new Error('Đã xảy ra lỗi'), null];
		}
	}
}
