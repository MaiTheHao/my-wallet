import { Transaction, TTransaction } from '../models/transaction.model';
import dbConnect from '../database';
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
		await this.connectToDatabase();
		const transaction = new Transaction(data);
		return await transaction.save();
	}

	async getById(id: string) {
		await this.connectToDatabase();
		return await Transaction.findById(id).exec();
	}

	async getList(filter?: FilterQuery<TTransaction>, sort: Record<string, 1 | -1> = { createdAt: -1 }, limit: number = 10, page: number = 1) {
		await this.connectToDatabase();
		const skip = (page - 1) * limit;

		return await Transaction.find(filter || {})
			.sort(sort)
			.skip(skip)
			.limit(limit)
			.lean<TTransaction[]>()
			.exec();
	}

	async update(id: string, data: Partial<TTransaction>) {
		await this.connectToDatabase();
		return await Transaction.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	async delete(id: string) {
		await this.connectToDatabase();
		return await Transaction.findByIdAndDelete(id).exec();
	}

	async deleteBatch(ids: string[]) {
		await this.connectToDatabase();
		return await Transaction.deleteMany({ _id: { $in: ids } }).exec();
	}

	async count(filter?: FilterQuery<TTransaction>): Promise<number> {
		await this.connectToDatabase();
		return await Transaction.countDocuments(filter || {});
	}

	async getBalanceStats() {
		await this.connectToDatabase();

		const stats = await Transaction.aggregate([
			{
				$group: {
					_id: '$type',
					total: { $sum: '$amount' },
				},
			},
		]);

		return stats;
	}

	private async connectToDatabase() {
		try {
			await dbConnect();
		} catch (error) {
			console.error('Database connection failed:', error);
			throw new Error('Database connection failed');
		}
	}
}
