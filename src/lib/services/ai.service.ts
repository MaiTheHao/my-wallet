import { GoogleGenAI, HarmBlockThreshold, HarmCategory, GenerateContentConfig } from '@google/genai';
import { UNIFIED_RESPONSE_SCHEMA } from '@/lib/context/schemas';
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
		const sysInstruction = `Role:Tro ly tai chinh.Task:Phan tich input.Neu la giao dich(thu/chi)->JSON{is_transaction:true,transaction:{...}}.Neu la chat->JSON{is_transaction:false,reply:"..."}.Quy tac:Currency=VND(k=nghin);Date=Relative;Category=Auto;Type=income/expense.`;

		return this.handleJsonGeneration<AIAnalysisResult>(prompt, sysInstruction, UNIFIED_RESPONSE_SCHEMA, options);
	}

	private async handleJsonGeneration<T>(userPrompt: string, systemInstruction: string, schema: any, options?: any): Promise<ErrorFirst<T>> {
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
			if (jsonErr) return [new Error('Invalid JSON'), null];

			return [null, jsonResponse as T];
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			return [err, null];
		}
	}
}
