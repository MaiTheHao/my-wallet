import { AIService } from './ai.service';
import { TransactionService } from './transaction.service';
import { Topics } from '@/lib/context/topics';
import { ErrorFirst } from '@/lib/types/error-first.type';
import { TTransaction } from '@/lib/models/transaction.model';

export class MessageService {
    private static instance: MessageService | null = null;
    
    // Dependencies injected internally
    private readonly aiService = AIService.getInstance();
    private readonly transactionService = TransactionService.getInstance();

    private constructor() {}

    public static getInstance(): MessageService {
        if (!MessageService.instance) {
            MessageService.instance = new MessageService();
        }
        return MessageService.instance;
    }

    /**
     * Entry point chính để xử lý tin nhắn người dùng
     */
    async processMessage(prompt: string, options?: any): Promise<ErrorFirst<string>> {
        try {
            // 1. Xác định Topic và Intent của người dùng
            const [topicError, topicResult] = await this.aiService.getTopic(prompt, options);
            
            if (topicError) return [topicError, null];
            if (!topicResult) return [new Error('Không thể xác định yêu cầu của bạn.'), null];

            // 2. Routing xử lý dựa trên Topic
            switch (topicResult.topic) {
                case Topics.ADD_TRANSACTION:
                    return await this.handleTransactionIntent(prompt, options);
                
                // Mở rộng: Có thể thêm các case khác như Topics.VIEW_REPORT, Topics.DELETE_TRANSACTION v.v...
                
                default:
                    // 3. Nếu là giao tiếp thông thường, trả về reply của AI (Success case, không phải Error)
                    return this.handleConversationIntent(topicResult.reply);
            }

        } catch (error) {
            // Catch-all cho các lỗi runtime không mong muốn
            const err = error instanceof Error ? error : new Error('Lỗi hệ thống không xác định');
            return [err, null];
        }
    }

    // --- Private Handlers ---

    /**
     * Xử lý luồng thêm giao dịch
     */
    private async handleTransactionIntent(prompt: string, options?: any): Promise<ErrorFirst<string>> {
        // Bước 1: AI phân tích dữ liệu giao dịch
        const [parseError, transactionData] = await this.aiService.addTransaction(prompt, options);
        if (parseError) return [parseError, null];
        if (!transactionData) return [new Error('Dữ liệu giao dịch không hợp lệ'), null];

        // Bước 2: Lưu xuống Database
        const [createError] = await this.transactionService.create(transactionData);
        if (createError) return [createError, null];

        // Bước 3: Trả về thông báo thành công đã format đẹp
        return [null, this.formatSuccessMessage(transactionData)];
    }

    /**
     * Xử lý luồng hội thoại thông thường
     */
    private handleConversationIntent(reply: string): ErrorFirst<string> {
        // Fallback text nếu AI trả về rỗng
        const finalReply = reply || 'Xin lỗi, tôi không hiểu yêu cầu của bạn.';
        return [null, finalReply];
    }

    // --- Helpers ---

    private formatSuccessMessage(t: TTransaction): string {
        const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
        const amountStr = formatter.format(t.amount);
        
        // Icon tương ứng cho UI sinh động hơn
        const icon = t.type === 'income' ? '💰' : '💸';
        const typeText = t.type === 'income' ? 'Thu nhập' : 'Chi tiêu';

        return `${icon} Đã thêm ${typeText}: **${amountStr}**\n📂 Danh mục: ${t.category}\n📝 Ghi chú: ${t.description}`;
    }
}
