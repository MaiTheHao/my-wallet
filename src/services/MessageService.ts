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

			switch (topic) {
				case Topics.CHECK_BALANCE:
					// Lấy tổng số dư
					const [balanceError, balanceData] = await this.transactionService.getTotalBalance();
					if (balanceError) return [balanceError, null];

					const balanceMessage = [
						`💰 **Tổng thu nhập**: ${balanceData.income.toLocaleString('vi-VN')}đ`,
						`💸 **Tổng chi tiêu**: ${balanceData.expense.toLocaleString('vi-VN')}đ`,
						`📊 **Số dư hiện tại**: ${balanceData.balance.toLocaleString('vi-VN')}đ`,
					].join('\n');

					return [null, balanceMessage];

				case Topics.ADD_TRANSACTION:
					// Xử lý thêm giao dịch
					const [transactionError, transactionData] = await this.aiService.addTransaction(prompt, options);
					if (transactionError) return [transactionError, null];
					if (!transactionData) return [new Error('Dữ liệu giao dịch không hợp lệ'), null];

					// Sử dụng TransactionService để lưu giao dịch
					const [createError, createdTransaction] = await this.transactionService.create(transactionData);
					if (createError) return [createError, null];

					const typeText = transactionData.type === 'income' ? 'Thu nhập' : 'Chi tiêu';
					const successMessage = [
						`✅ **Đã thêm ${typeText.toLowerCase()}**`,
						`💰 **Số tiền**: ${transactionData.amount.toLocaleString('vi-VN')}đ`,
						`📝 **Mô tả**: ${transactionData.description}`,
						`🏷️ **Danh mục**: ${transactionData.category || 'Khác'}`,
					].join('\n');

					return [null, successMessage];

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
