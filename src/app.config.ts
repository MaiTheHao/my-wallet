

const isDev = process.env.NODE_ENV === 'development';

const appConfig = {
	api: {
		baseUrl: isDev ? 'http://localhost:3000/' : (process.env.NEXT_PUBLIC_API_BASE_URL || ''),
		prefix: '/api',
		ver: '/v1',
		getFullApiUrl() {
			const url = `${this.baseUrl}${this.prefix}${this.ver}`.replace(/([^:]\/)\/+/g, '$1');
			if (url.startsWith('/')) return url;
			if (!/^https?:\/\//i.test(url))
				throw new Error('Invalid base URL format at app.config.ts - It must start with http:// or https://');
			return url;
		},
		timeout: isDev ? 10000 : 5000,
	},
	google_ai_studio: {
		apiKey: process.env.GOOGLE_AI_STUDIO_API_KEY || '',
		model: process.env.GOOGLE_AI_MODEL || 'gemini-flash-lite-latest',
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
