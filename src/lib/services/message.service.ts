import { AIService } from './ai.service';
import { Topics } from '@/lib/context/topics';
import { ErrorFirst } from '@/lib/types/error-first.type';
import { TransactionService } from './transaction.service';

export class MessageService {
	private static instance: MessageService | null = null;
	private aiService = AIService.getInstance();
	private transactionService = TransactionService.getInstance();

	private constructor() {}

	public static getInstance(): MessageService {
		if (!MessageService.instance) {
			MessageService.instance = new MessageService();
		}
		return MessageService.instance;
	}

	async processMessage(prompt: string, options?: any): Promise<ErrorFirst<string>> {
		try {
			const [topicError, topic] = await this.getTopic(prompt, options);
			if (topicError) return [topicError, null];

			if (!topic?.topic) {
				return [new Error('Xin lỗi, tôi không hiểu yêu cầu của bạn.'), null];
			}

			if (topic.topic === Topics.ADD_TRANSACTION) {
				return await this.handleAddTransaction(prompt, options);
			}

			return [new Error(topic?.reply || 'Xin lỗi, tôi không hiểu yêu cầu của bạn.'), null];
		} catch (error) {
			return [error instanceof Error ? error : new Error('Đã xảy ra lỗi'), null];
		}
	}

	private async getTopic(prompt: string, options?: any) {
		return await this.aiService.getTopic(prompt, options);
	}

	private async handleAddTransaction(prompt: string, options?: any): Promise<ErrorFirst<string>> {
		const [transactionError, transactionData] = await this.aiService.addTransaction(prompt, options);
		if (transactionError) return [transactionError, null];
		if (!transactionData) return [new Error('Dữ liệu giao dịch không hợp lệ'), null];

		const [createError] = await this.transactionService.create(transactionData);
		if (createError) return [createError, null];

		return [null, this.buildSuccessMessage(transactionData)];
	}

	private buildSuccessMessage(transactionData: any): string {
		const typeText = transactionData.type === 'income' ? 'Thu nhập' : 'Chi tiêu';
		return `✅ Đã thêm ${typeText.toLowerCase()}: ${transactionData.amount.toLocaleString('vi-VN')}đ (${
			transactionData.category
		}) - ${transactionData.description}`;
	}
}
