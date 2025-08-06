import { AIService } from './AIService';
import { Topics } from '@/context/topics';
import { ErrorFirst } from '@/types/error-first.type';
import { TransactionService } from './TransactionService';

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
			// Phân loại topic từ prompt
			const [topicError, topic] = await this.aiService.getTopic(prompt, options);
			if (topicError) return [topicError, null];

			switch (topic?.topic) {
				case Topics.ADD_TRANSACTION:
					// Xử lý thêm giao dịch
					const [transactionError, transactionData] = await this.aiService.addTransaction(prompt, options);
					if (transactionError) return [transactionError, null];
					if (!transactionData) return [new Error('Dữ liệu giao dịch không hợp lệ'), null];

					// Sử dụng TransactionService để lưu giao dịch
					const [createError, createdTransaction] = await this.transactionService.create(transactionData);
					if (createError) return [createError, null];

					const typeText = transactionData.type === 'income' ? 'Thu nhập' : 'Chi tiêu';
					const successMessage = `✅ Đã thêm ${typeText.toLowerCase()}: ${transactionData.amount.toLocaleString(
						'vi-VN'
					)}đ (${transactionData.category || 'Khác'}) - ${transactionData.description}`;

					return [null, successMessage];

				case Topics.RE_ASK:
					// Yêu cầu người dùng cung cấp thêm thông tin
					return [null, topic.description || 'Xin vui lòng cung cấp thêm thông tin để tôi có thể giúp bạn.'];

				default:
					return [
						new Error(
							'Xin lỗi, tôi không hiểu yêu cầu của bạn. Hãy thử lại với các câu lệnh như "thêm giao dịch" hoặc "kiểm tra số dư".'
						),
						null,
					];
			}
		} catch (error) {
			return [error instanceof Error ? error : new Error('Đã xảy ra lỗi'), null];
		}
	}
}
