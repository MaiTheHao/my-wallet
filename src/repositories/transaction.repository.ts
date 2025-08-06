import { Transaction, TTransaction } from '../models/transaction.model';
import { connectToDatabase } from '../database';

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

	async getById(id: string) {
		await connectToDatabase();
		return await Transaction.findById(id).exec();
	}

	async getAll(filter: Partial<TTransaction> = {}) {
		await connectToDatabase();
		return await Transaction.find(filter).sort({ createdAt: -1 }).exec();
	}

	async getPaginated(filter: Partial<TTransaction> = {}, page = 1, limit = 10) {
		await connectToDatabase();
		const skip = (page - 1) * limit;

		const [transactions, total] = await Promise.all([
			Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
			Transaction.countDocuments(filter).exec(),
		]);

		return {
			transactions,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		};
	}

	async getTotalBalance() {
		await connectToDatabase();
		const result = await Transaction.aggregate([
			{
				$group: {
					_id: '$type',
					total: { $sum: '$amount' },
				},
			},
		]);

		const income = result.find((r) => r._id === 'income')?.total || 0;
		const expense = result.find((r) => r._id === 'expense')?.total || 0;

		return {
			income,
			expense,
			balance: income - expense,
		};
	}

	async update(id: string, data: Partial<Omit<TTransaction, '_id' | 'createdAt' | 'updatedAt'>>) {
		await connectToDatabase();
		return await Transaction.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	async delete(id: string) {
		await connectToDatabase();
		return await Transaction.findByIdAndDelete(id).exec();
	}
}
