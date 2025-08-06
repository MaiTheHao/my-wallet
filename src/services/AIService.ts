import { GoogleGenAI } from '@google/genai';
import { TopicDescriptions, Topics } from '@/context/topics';
import { ADD_TRANSACTION_RESPONSE_JSON_SCHEMA, GET_TOPIC_RESPONSE_JSON_SCHEMA } from '@/context/schemas';
import { ErrorFirst } from '@/types/error-first.type';
import { TTransaction } from '@/models/transaction.model';

export class AIService {
	private static instance: AIService | null = null;
	private model = 'gemini-2.5-flash';
	private apiKey: string = process.env.GEMINI_API_KEY || '';
	private genAI: GoogleGenAI = new GoogleGenAI({ apiKey: this.apiKey });

	private constructor() {}

	public static getInstance(): AIService {
		if (!AIService.instance) {
			AIService.instance = new AIService();
		}
		return AIService.instance;
	}

	async getTopic(
		prompt: string,
		options?: any
	): Promise<
		ErrorFirst<{
			topic: Topics;
			description: string;
		}>
	> {
		try {
			const contents = [
				'Dựa trên mô tả sau, hãy chọn một topic phù hợp nhất trong số các topic sau:',
				JSON.stringify(TopicDescriptions),
				'Chỉ trả về một topic duy nhất dưới dạng JSON: { "topic": "<topic>" }',
				'Mô tả:',
				prompt,
			].join('\n');

			const response = await this.genAI.models.generateContent({
				model: this.model,
				contents,
				config: {
					responseJsonSchema: GET_TOPIC_RESPONSE_JSON_SCHEMA,
					responseMimeType: 'application/json',
				},
				...options,
			});

			if (!response.text) return [new Error('Không nhận được phản hồi'), null];

			try {
				const jsonResponse = JSON.parse(response.text);
				return [null, jsonResponse];
			} catch {
				return [new Error('Phản hồi không phải là JSON hợp lệ'), null];
			}
		} catch (error) {
			return [error instanceof Error ? error : new Error('Đã xảy ra lỗi'), null];
		}
	}

	async addTransaction(prompt: string, options?: any): Promise<ErrorFirst<TTransaction>> {
		try {
			const response = await this.genAI.models.generateContent({
				model: this.model,
				contents: [
					'Hãy phân tích mô tả giao dịch sau và xác định:',
					'- amount: số tiền (chỉ số, không có đơn vị)',
					'- description: mô tả ngắn gọn',
					'- type: "income" nếu là thu nhập, "expense" nếu là chi tiêu',
					'- category: danh mục (ví dụ: Ăn uống, Xăng xe, Lương, Di chuyển, Mua sắm, Khác)',
					'',
					'Mô tả giao dịch:',
					prompt,
				].join('\n'),
				config: {
					responseJsonSchema: ADD_TRANSACTION_RESPONSE_JSON_SCHEMA,
					responseMimeType: 'application/json',
				},
				...options,
			});

			if (!response.text) return [new Error('Không nhận được phản hồi'), null];

			try {
				const jsonResponse: TTransaction = JSON.parse(response.text);
				if (!jsonResponse || typeof jsonResponse !== 'object') {
					return [new Error('Phản hồi không phải là JSON hợp lệ'), null];
				}
				return [null, jsonResponse];
			} catch {
				return [new Error('Phản hồi không phải là JSON hợp lệ'), null];
			}
		} catch (error) {
			return [error instanceof Error ? error : new Error('Đã xảy ra lỗi'), null];
		}
	}
}
