import { Transaction, TTransaction } from '../models/transaction.model';
import { connectToDatabase } from '../database';
import { FilterQuery } from 'mongoose';

export class TransactionRepository {
	private static instance: TransactionRepository;

	private constructor() {}

	static getInstance() {
		if (!TransactionRepository.instance) {
			TransactionRepository.instance = new TransactionRepository();
		}
		return TransactionRepository.instance;
	}

	async create(data: Omit<TTransaction, '_id' | 'createdAt' | 'updatedAt'>) {
		await connectToDatabase();
		const transaction = new Transaction(data);
		return await transaction.save();
	}

	async getById(
		id: string,
		filter?: FilterQuery<TTransaction>,
		sort?: Record<string, 1 | -1>,
		projection?: Record<string, 0 | 1>
	) {
		await connectToDatabase();
		const query = Transaction.findById(id);
		if (filter) query.where(filter);
		if (sort) query.sort(sort);
		if (projection) query.select(projection);
		return await query.exec();
	}

	async getList(
		filter?: FilterQuery<TTransaction>,
		sort?: Record<string, 1 | -1>,
		limit: number = 10,
		page: number = 1,
		projection?: Record<string, 0 | 1>
	) {
		await connectToDatabase();
		const query = Transaction.find(filter || {});
		if (sort) query.sort(sort);
		if (projection) query.select(projection);
		query.limit(limit).skip((page - 1) * limit);
		return await query.exec();
	}

	async getAll(
		filter?: FilterQuery<TTransaction>,
		sort?: Record<string, 1 | -1>,
		projection?: Record<string, 0 | 1>
	) {
		await connectToDatabase();
		const query = Transaction.find(filter || {});
		if (sort) query.sort(sort);
		if (projection) query.select(projection);
		return await query.exec();
	}

	async update(
		id: string,
		data: Partial<Omit<TTransaction, '_id' | 'createdAt' | 'updatedAt'>>,
		filter?: FilterQuery<TTransaction>,
		sort?: Record<string, 1 | -1>,
		projection?: Record<string, 0 | 1>
	) {
		await connectToDatabase();
		const query = Transaction.findByIdAndUpdate(id, data, { new: true });
		if (filter) query.where(filter);
		if (sort) query.sort(sort);
		if (projection) query.select(projection);
		return await query.exec();
	}

	async delete(
		id: string,
		filter?: FilterQuery<TTransaction>,
		sort?: Record<string, 1 | -1>,
		projection?: Record<string, 0 | 1>
	) {
		await connectToDatabase();
		const query = Transaction.findByIdAndDelete(id);
		if (filter) query.where(filter);
		if (sort) query.sort(sort);
		if (projection) query.select(projection);
		return await query.exec();
	}
}
