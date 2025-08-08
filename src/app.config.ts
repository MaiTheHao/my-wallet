/**
 * App configuration for My Wallet.
 *
 * - api.baseUrl: Uses NEXT_PUBLIC_API_BASE_URL in production, or localhost in development.
 * - api.getFullApiUrl(): Returns the full API endpoint (baseUrl + prefix + version).
 * - google_ai_studio.apiKey: Reads from GOOGLE_AI_STUDIO_API_KEY environment variable.
 * - google_ai_studio.model: Default is 'gemini-2.5-flash', change as needed.
 * - google_ai_studio.basePrompt: Prompt for AI assistant (Vietnamese, customizable).
 *
 * Usage:
 *   import appConfig from './src/app.config';
 *   const apiUrl = appConfig.api.getFullApiUrl();
 */

const isDev = process.env.NODE_ENV === 'development';

const appConfig = {
	api: {
		// Base URL for API requests
		baseUrl: isDev ? 'http://localhost:3000/' : process.env.NEXT_PUBLIC_API_BASE_URL,
		// API prefix and version
		prefix: '/api',
		ver: '/v1',
		/**
		 * Returns the full API URL (baseUrl + prefix + version)
		 * Throws error if baseUrl is not valid (must start with http:// or https://)
		 */
		getFullApiUrl() {
			const url = `${this.baseUrl}${this.prefix}${this.ver}`.replace(/([^:]\/)\/+/g, '$1');
			if (!/^https?:\/\//i.test(url))
				throw new Error('Invalid base URL format at app.config.ts - It must start with http:// or https://');
			return url;
		},
		// Request timeout (ms)
		timeout: isDev ? 10000 : 5000,
	},
	google_ai_studio: {
		// API key for Google AI Studio
		apiKey: process.env.GOOGLE_AI_STUDIO_API_KEY || '',
		// AI model name (default: gemini-2.5-flash-lite)
		model: 'gemini-2.5-flash-lite',
		// Base prompt for AI assistant (Vietnamese, can be customized)
		basePrompt: [
			'🌟 Bạn là Sổ Tay Chi Tiêu Thông Minh của tôi! 🌟',
			'Ngôn ngữ: tiếng Việt 🇻🇳',
			'Vai trò: trợ lý tài chính cá nhân, giúp quản lý giao dịch tài chính (thu/chi), phân tích, báo cáo, đề xuất tiết kiệm.',
			'Nguyên tắc: ghi nhận thông minh 📝, phân loại tự động, hỏi thông tin nếu thiếu, trả lời câu hỏi tài chính 💬, phân tích chi tiêu 📊, đề xuất tiết kiệm 💡, trò chuyện và giao tiếp thông thường',
			'Giao diện: sử dụng icon UTF-8, biểu cảm, thân thiện, rõ ràng, hữu ích, tiếng Việt chuẩn, ví dụ: ✔️ 💸 💳 🍽️ 🚌 🧾 🎉 🎯 💰🤏 🤔 😊 🥳.',
			'Hãy bắt đầu hành trình quản lý tài chính cùng tôi nhé! 🚀',
		].join('\n'),
	},
};

export default appConfig;
