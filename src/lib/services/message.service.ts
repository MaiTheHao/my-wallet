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
			const [topicError, topic] = await this.aiService.getTopic(prompt, options);
			if (topicError) return [topicError, null];

			if (!topic?.topic) {
				return [new Error('Xin lỗi, tôi không hiểu yêu cầu của bạn.'), null];
			}

			if (topic.topic === Topics.ADD_TRANSACTION) {
				const [transactionError, transactionData] = await this.aiService.addTransaction(prompt, options);
				if (transactionError) return [transactionError, null];
				if (!transactionData) return [new Error('Dữ liệu giao dịch không hợp lệ'), null];

				const [createError, createdTransaction] = await this.transactionService.create(transactionData);
				if (createError) return [createError, null];

				const typeText = transactionData.type === 'income' ? 'Thu nhập' : 'Chi tiêu';
				const successMessage = `✅ Đã thêm ${typeText.toLowerCase()}: ${transactionData.amount.toLocaleString(
					'vi-VN'
				)}đ (${transactionData.category}) - ${transactionData.description}`;

				return [null, successMessage];
			}

			if (topic.topic === Topics.RE_ASK) {
				return [null, topic.reply || 'Xin vui lòng cung cấp thêm thông tin để tôi có thể giúp bạn.'];
			}

			return [new Error(topic?.reply || 'Xin lỗi, tôi không hiểu yêu cầu của bạn.'), null];
		} catch (error) {
			return [error instanceof Error ? error : new Error('Đã xảy ra lỗi'), null];
		}
	}
}
