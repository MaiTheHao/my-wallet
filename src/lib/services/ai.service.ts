import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';
import { TopicDescriptions, Topics } from '@/lib/context/topics';
import { ADD_TRANSACTION_RESPONSE_JSON_SCHEMA, GET_TOPIC_RESPONSE_JSON_SCHEMA } from '@/lib/context/schemas';
import { ErrorFirst } from '@/lib/types/error-first.type';
import { TTransaction } from '@/lib/models/transaction.model';
import appConfig from '@/app.config';

export class AIService {
	private static instance: AIService | null = null;
	private model = appConfig.google_ai_studio.model;
	private apiKey = appConfig.google_ai_studio.apiKey;
	private basePrompt = appConfig.google_ai_studio.basePrompt;
	private genAI = new GoogleGenAI({ apiKey: this.apiKey });
	private safetySettings = [
		{
			category: HarmCategory.HARM_CATEGORY_HARASSMENT,
			threshold: HarmBlockThreshold.BLOCK_NONE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
			threshold: HarmBlockThreshold.BLOCK_NONE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
			threshold: HarmBlockThreshold.BLOCK_NONE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
			threshold: HarmBlockThreshold.BLOCK_NONE,
		},
	];

	private constructor() {}

	public static getInstance(): AIService {
		if (!AIService.instance) {
			AIService.instance = new AIService();
		}
		return AIService.instance;
	}

	async getTopic(prompt: string, options?: any): Promise<ErrorFirst<{ topic: Topics; reply: string }>> {
		try {
			const contents = [
				this.basePrompt,
				'Dựa trên mô tả sau, hãy chọn một topic phù hợp nhất trong số các topic sau:',
				JSON.stringify(TopicDescriptions),
				'Mô tả:',
				prompt,
			].join('\n');

			const response = await this.genAI.models.generateContent({
				model: this.model,
				contents,
				config: {
					responseJsonSchema: GET_TOPIC_RESPONSE_JSON_SCHEMA,
					responseMimeType: 'application/json',
					safetySettings: this.safetySettings,
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
			const contents = [this.basePrompt, 'Hãy phân tích mô tả giao dịch sau và xác định giao dịch:', prompt].join(
				'\n'
			);

			const response = await this.genAI.models.generateContent({
				model: this.model,
				contents,
				config: {
					responseJsonSchema: ADD_TRANSACTION_RESPONSE_JSON_SCHEMA,
					responseMimeType: 'application/json',
					safetySettings: this.safetySettings,
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
