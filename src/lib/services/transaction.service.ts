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

    async update(
        id: string, 
        data: Partial<Omit<TTransaction, '_id' | 'createdAt' | 'updatedAt'>>
    ): Promise<ErrorFirst<TTransaction>> {
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

    // --- Aggregation & List Operations ---

    async getList(
        filter: Partial<TTransaction> = {},
        page = 1,
        limit = 10,
        sort?: Record<string, 1 | -1>
    ): Promise<ErrorFirst<PaginateResult<TTransaction>>> {
        return this.executeSafely(async () => {
            // Chạy song song để tối ưu hiệu năng
            const [data, total] = await Promise.all([
                this.transactionRepo.getList(filter, sort, limit, page),
                this.transactionRepo.count(filter as any), // Type assertion nếu Repo yêu cầu type lỏng hơn
            ]);

            // Logic cải tiến: Không throw Error khi list rỗng, trả về empty pagination
            const safeData = data || [];
            const safeTotal = total || 0;

            return paginateService.getPaginated(
                { data: safeData, total: safeTotal }, 
                limit, 
                page
            );
        });
    }

    async count(filter: Partial<TTransaction> = {}): Promise<ErrorFirst<number>> {
        return this.executeSafely(async () => {
            return await this.transactionRepo.count(filter as any);
        });
    }

    async getBalance(): Promise<ErrorFirst<Record<TransactionType, number>>> {
        return this.executeSafely(async () => {
            // NOTE: Nếu dữ liệu lớn (>10k records), cân nhắc chuyển logic tính tổng xuống Database (Aggregation) 
            // thay vì fetch all về application layer như hiện tại.
            const transactions = await this.transactionRepo.getAll();
            
            const initialBalance = {
                [TransactionType.INCOME]: 0,
                [TransactionType.EXPENSE]: 0,
            };

            // Dùng reduce để tính toán clean hơn
            return transactions.reduce((acc, curr) => {
                const type = curr.type as TransactionType;
                // Chỉ cộng nếu type hợp lệ
                if (type === TransactionType.INCOME || type === TransactionType.EXPENSE) {
                    acc[type] += curr.amount;
                }
                return acc;
            }, initialBalance);
        });
    }

    // --- Private Helpers ---

    /**
     * Wrapper function để chuẩn hóa việc xử lý lỗi (DRY Principle)
     * Giúp loại bỏ việc lặp lại try-catch ở mọi method
     */
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
