import { NextRequest, NextResponse } from 'next/server';
import { MessageService } from '@/services/MessageService';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const message = body.message;

		const messageService = MessageService.getInstance();
		const [error, reply] = await messageService.processMessage(message);

		if (error) {
			return NextResponse.json(
				{
					error: error.message,
				},
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		}

		return NextResponse.json(
			{
				reply,
			},
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	} catch (error: any) {
		return NextResponse.json(
			{
				error: error?.message || 'Đã xảy ra lỗi',
			},
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
}
