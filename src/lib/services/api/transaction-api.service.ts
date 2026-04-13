import appConfig from '@/app.config';
import api from '@/lib/const/api';
import { Transaction } from '@/lib/types/transaction.types';
import { PaginateResult } from '@/lib/types/paginate.type';
import { TResponseData } from '@/lib/types/response.type';

const API_BASE_URL = appConfig.api.getFullApiUrl();

export interface TransactionFilter {
	timeRange?: string;
	search?: string;
}

export class TransactionApiService {
	static async getList(page = 1, limit = 10, filter?: TransactionFilter): Promise<TResponseData<PaginateResult<Transaction>>> {
		let url = `${API_BASE_URL}/${api.transaction}?page=${page}&limit=${limit}`;
		if (filter?.timeRange) url += `&timeRange=${filter.timeRange}`;
		if (filter?.search) url += `&search=${encodeURIComponent(filter.search)}`;
		
		const res = await fetch(url);
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
		const res = await fetch(`${API_BASE_URL}/${api.transaction}/${id}`, { method: 'DELETE' });
		return res.json();
	}

	static async deleteBatch(ids: string[]): Promise<TResponseData<{ message: string; deletedCount?: number }>> {
		const res = await fetch(`${API_BASE_URL}/${api.transactionBatch}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ids }),
		});
		return res.json();
	}

	static async getBalance(filter?: TransactionFilter): Promise<TResponseData<Record<string, number>>> {
		let url = `${API_BASE_URL}/${api.transaction}/${api.transactionBalance}`;
		const query: string[] = [];
		if (filter?.timeRange) query.push(`timeRange=${filter.timeRange}`);
		if (filter?.search) query.push(`search=${encodeURIComponent(filter.search)}`);
		
		if (query.length > 0) {
			url += `?${query.join('&')}`;
		}
		
		const res = await fetch(url);
		return res.json();
	}
}
