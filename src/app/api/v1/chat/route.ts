import { NextRequest } from 'next/server';
import { ChatOrchestrator } from '@/lib/services/chat.orchestrator';
import { AIService } from '@/lib/services/ai.service';
import { TransactionService } from '@/lib/services/transaction.service';
import { ResponseService } from '@/lib/services/response.service';

export async function OPTIONS() {
	return ResponseService.success({});
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const message = body.message;

		const aiService = AIService.getInstance();
		const transactionService = TransactionService.getInstance();
		const chatOrchestrator = new ChatOrchestrator(aiService, transactionService);

		const [error, reply] = await chatOrchestrator.processChat(message);

		if (error) {
			return ResponseService.internalError(error.message);
		}

		return ResponseService.success({ reply });
	} catch (error: any) {
		return ResponseService.internalError(error?.message || 'Đã xảy ra lỗi');
	}
}
