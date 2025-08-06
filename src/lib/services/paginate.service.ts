import { PaginateResult } from '../types/paginate.type';

class PaginateService {
	private static instance: PaginateService;

	private constructor() {}

	static getInstance(): PaginateService {
		if (!PaginateService.instance) {
			PaginateService.instance = new PaginateService();
		}
		return PaginateService.instance;
	}

	paginate<T>(array: T[], limit: number, page: number): PaginateResult<T> {
		const total = array.length;
		const totalPages = Math.ceil(total / limit);
		const start = (page - 1) * limit;
		const data = array.slice(start, start + limit);

		return {
			data,
			total,
			page,
			limit,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1,
		};
	}

	getPaginated<T>(dbResult: { data: T[]; total: number }, limit: number, page: number): PaginateResult<T> {
		const totalPages = Math.ceil(dbResult.total / limit);
		return {
			data: dbResult.data,
			total: dbResult.total,
			page,
			limit,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1,
		};
	}
}

export const paginateService = PaginateService.getInstance();
