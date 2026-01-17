import { GoogleGenAI, HarmBlockThreshold, HarmCategory, GenerateContentConfig } from '@google/genai';
import { TopicDescriptions, Topics } from '@/lib/context/topics';
import { ADD_TRANSACTION_RESPONSE_JSON_SCHEMA, GET_TOPIC_RESPONSE_JSON_SCHEMA } from '@/lib/context/schemas';
import { ErrorFirst } from '@/lib/types/error-first.type';
import { TTransaction } from '@/lib/models/transaction.model';
import appConfig from '@/app.config';
import { isJson } from '../utils/validation';

export class AIService {
    private static instance: AIService | null = null;
    
    // Core Configuration
    private readonly model = appConfig.google_ai_studio.model;
    private readonly apiKey = appConfig.google_ai_studio.apiKey;
    private readonly basePrompt = appConfig.google_ai_studio.basePrompt;
    private readonly genAI = new GoogleGenAI({ apiKey: this.apiKey });
    
    // Safety Settings - Relaxed as per original requirement
    private readonly safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF },
    ];

    private constructor() {}

    public static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    /**
     * Xác định chủ đề (Topic) từ câu nói của người dùng
     */
    async getTopic(prompt: string, options?: any): Promise<ErrorFirst<{ topic: Topics; reply: string }>> {
        // Prompt được tối ưu: Định nghĩa vai trò rõ ràng, cung cấp danh sách topic context
        const sysInstruction = `
            ${this.basePrompt}
            
            ROLE: Bạn là một trợ lý phân loại nội dung thông minh.
            TASK: Phân tích ý định của người dùng và khớp nó với một trong các Topic có sẵn bên dưới.
            
            AVAILABLE TOPICS:
            ${JSON.stringify(TopicDescriptions, null, 2)}
            
            INSTRUCTION:
            1. Xác định "topic" phù hợp nhất dựa trên danh sách trên.
            2. Tạo một câu trả lời ngắn gọn, tự nhiên bằng tiếng Việt trong trường "reply" phản hồi lại người dùng.
            3. Trả về định dạng JSON chính xác.
        `;

        return this.handleJsonGeneration<{ topic: Topics; reply: string }>(
            prompt,
            sysInstruction,
            GET_TOPIC_RESPONSE_JSON_SCHEMA,
            options
        );
    }

    /**
     * Phân tích và trích xuất thông tin giao dịch
     */
    async addTransaction(prompt: string, options?: any): Promise<ErrorFirst<TTransaction>> {
        // Prompt được tối ưu: Xử lý các edge case như đơn vị tiền tệ (k, tr), ngày tháng tương đối
        const sysInstruction = `
            ${this.basePrompt}

            ROLE: Bạn là một chuyên gia kế toán cá nhân và phân tích dữ liệu tài chính.
            TASK: Trích xuất thông tin giao dịch tài chính từ ngôn ngữ tự nhiên thành cấu trúc dữ liệu chuẩn.

            CONTEXT & RULES:
            1. Currency: Mặc định là VND. Tự động chuyển đổi các từ lóng: "k" -> nghìn, "củ/tr" -> triệu.
            2. Date: Xử lý các mốc thời gian tương đối (hôm nay, hôm qua) dựa trên thời gian thực tế.
            3. Category: Tự động suy luận danh mục chi tiêu/thu nhập phù hợp nhất.
            4. Type: Xác định là 'expense' (chi tiêu) hay 'income' (thu nhập).

            INPUT DATA: "${prompt}"
        `;

        return this.handleJsonGeneration<TTransaction>(
            prompt,
            sysInstruction,
            ADD_TRANSACTION_RESPONSE_JSON_SCHEMA,
            options
        );
    }

    /**
     * Private Helper: Centralized logic for calling AI and parsing JSON safely
     * Giúp code DRY (Don't Repeat Yourself) và dễ bảo trì hơn.
     */
    private async handleJsonGeneration<T>(
        userPrompt: string,
        systemInstruction: string,
        schema: any,
        options?: any
    ): Promise<ErrorFirst<T>> {
        try {
            // Combine system instruction and user prompt cleanly
            const contents = [
                systemInstruction,
                '---',
                'USER REQUEST:',
                userPrompt
            ].join('\n');

            const generateConfig: GenerateContentConfig = {
                responseJsonSchema: schema,
                responseMimeType: 'application/json',
                safetySettings: this.safetySettings,
                ...options, // Merge external options if needed
            };

            const response = await this.genAI.models.generateContent({
                model: this.model,
                contents: contents, // SDK v0.x accepts string or Part[], passing string works for simple text
                config: generateConfig,
            });

            const textResponse = response.text;
            if (!textResponse) {
                return [new Error('AI Service: Không nhận được phản hồi text từ model'), null];
            }

            // Validate JSON format
            const [jsonErr, jsonResponse] = isJson(textResponse);
            if (jsonErr) {
                // Log raw response for debugging in production if needed
                console.warn('AI Service JSON Parse Error. Raw:', textResponse);
                return [new Error('AI Service: Phản hồi không phải là JSON hợp lệ'), null];
            }

            // Optional: Deep validation against T could happen here, 
            // but we rely on schema enforcement from the model and basic JSON check.
            
            return [null, jsonResponse as T];

        } catch (error) {
            // Normalize error
            const err = error instanceof Error ? error : new Error(String(error));
            return [err, null];
        }
    }
}
