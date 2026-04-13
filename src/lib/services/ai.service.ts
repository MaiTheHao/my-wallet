import { GoogleGenAI, HarmBlockThreshold, HarmCategory, GenerateContentConfig, Schema } from '@google/genai';
import { z } from 'zod';
import { UNIFIED_RESPONSE_SCHEMA, zAIAnalysisResult } from '@/lib/context/schemas';
import { SYSTEM_PROMPTS } from '@/lib/context/prompts';
import { ErrorFirst } from '@/lib/types/error-first.type';
import { TTransaction } from '@/lib/models/transaction.model';
import appConfig from '@/app.config';
import { isJson } from '../utils/validation';

export interface AIAnalysisResult {
	is_transaction: boolean;
	transaction?: TTransaction | null;
	reply?: string | null;
}

export class AIService {
	private static instance: AIService | null = null;

	private readonly model = appConfig.google_ai_studio.model;
	private readonly apiKey = appConfig.google_ai_studio.apiKey;
	private readonly genAI = new GoogleGenAI({ apiKey: this.apiKey });

	private readonly safetySettings = [
		{ category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
		{ category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
		{ category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
		{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF },
	];

	private constructor() {}

	public static getInstance(): AIService {
		if (!AIService.instance) AIService.instance = new AIService();
		return AIService.instance;
	}

	async analyzeRequest(prompt: string, options?: any): Promise<ErrorFirst<AIAnalysisResult>> {
		return this.handleJsonGeneration<AIAnalysisResult>(
			prompt,
			SYSTEM_PROMPTS.FINANCIAL_ASSISTANT,
			UNIFIED_RESPONSE_SCHEMA,
			zAIAnalysisResult,
			options
		);
	}

	private async handleJsonGeneration<T>(
		userPrompt: string,
		systemInstruction: string,
		schema: Schema,
		zodValidator: z.ZodType<any>,
		options?: any
	): Promise<ErrorFirst<T>> {
		try {
			const generateConfig: GenerateContentConfig = {
				responseJsonSchema: schema,
				responseMimeType: 'application/json',
				safetySettings: this.safetySettings,
				...options,
			};

			const contents = `${systemInstruction}\nINPUT:${userPrompt}`;

			const response = await this.genAI.models.generateContent({
				model: this.model,
				contents: contents,
				config: generateConfig,
			});

			const textResponse = response.text;
			if (!textResponse) return [new Error('No response text'), null];

			const [jsonErr, jsonResponse] = isJson(textResponse);
			if (jsonErr) return [new Error('Invalid JSON format from AI'), null];

			const validation = zodValidator.safeParse(jsonResponse);
			if (!validation.success) {
				console.error('AI schema validation error:', z.treeifyError(validation.error));
				return [new Error('Dữ liệu AI không chuẩn định dạng: ' + validation.error.message), null];
			}

			return [null, validation.data as T];
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			return [err, null];
		}
	}
}
