import { AIService } from './ai.service';
import { TransactionService } from './transaction.service';
import { ErrorFirst } from '@/lib/types/error-first.type';
import { TTransaction } from '@/lib/models/transaction.model';

export class ChatOrchestrator {
	constructor(
		private readonly aiService: AIService,
		private readonly transactionService: TransactionService
	) {}

	async processChat(prompt: string, options?: any): Promise<ErrorFirst<string>> {
		try {
			const [aiError, result] = await this.aiService.analyzeRequest(prompt, options);

			if (aiError) return [aiError, null];
			if (!result) return [new Error('Không xử lý được yêu cầu.'), null];

			if (result.is_transaction && result.transaction) {
				return await this.handleTransaction(result.transaction as TTransaction);
			} else {
				return [null, result.reply || 'Xin lỗi, tôi không hiểu ý bạn.'];
			}
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Lỗi hệ thống');
			return [err, null];
		}
	}

	private async handleTransaction(transactionData: TTransaction): Promise<ErrorFirst<string>> {
		const [createError] = await this.transactionService.create(transactionData);
		if (createError) return [createError, null];

		return [null, this.formatSuccessMessage(transactionData)];
	}

	private formatSuccessMessage(t: TTransaction): string {
		const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
		const icon = t.type === 'income' ? '💰' : '💸';
		const label = t.type === 'income' ? 'Thu nhập' : 'Chi tiêu';

		return `${icon} Đã thêm ${label}: **${formatter.format(t.amount)}**\n📂 ${t.category}\n📝 ${t.description}`;
	}
}
