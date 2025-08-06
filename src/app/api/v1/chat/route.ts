import { NextRequest } from 'next/server';
import { MessageService } from '@/lib/services/message.service';
import { ResponseService } from '@/lib/services/response.service';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const message = body.message;

		const messageService = MessageService.getInstance();
		const [error, reply] = await messageService.processMessage(message);

		if (error) {
			return ResponseService.internalError(error.message);
		}

		return ResponseService.success({ reply });
	} catch (error: any) {
		return ResponseService.internalError(error?.message || 'Đã xảy ra lỗi');
	}
}
