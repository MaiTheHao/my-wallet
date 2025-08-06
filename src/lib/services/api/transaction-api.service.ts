import appConfig from '@/app.config';
import api from '@/lib/const/api';
import { Transaction } from '@/lib/types/transaction.types';
import { PaginateResult } from '@/lib/types/paginate.type';
import { TResponseData } from '@/lib/types/response.type';

const API_BASE_URL = appConfig.api.getFullApiUrl();

export class TransactionApiService {
	static async getList(page = 1, limit = 10): Promise<TResponseData<PaginateResult<Transaction>>> {
		const res = await fetch(`${API_BASE_URL}/${api.transaction}?page=${page}&limit=${limit}`);
		return res.json();
	}

	static async getById(id: string): Promise<TResponseData<{ transaction: Transaction }>> {
		const res = await fetch(`${API_BASE_URL}/${api.transaction}?id=${id}`);
		return res.json();
	}

	static async create(data: Partial<Transaction>): Promise<TResponseData<{ transaction: Transaction }>> {
		const res = await fetch(`${API_BASE_URL}/${api.transaction}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		return res.json();
	}

	static async update(id: string, data: Partial<Transaction>): Promise<TResponseData<{ transaction: Transaction }>> {
		const res = await fetch(`${API_BASE_URL}/${api.transaction}?id=${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		return res.json();
	}

	static async delete(id: string): Promise<TResponseData<{ message: string; transaction?: Transaction }>> {
		const res = await fetch(`${API_BASE_URL}/${api.transaction}?id=${id}`, { method: 'DELETE' });
		return res.json();
	}
}
