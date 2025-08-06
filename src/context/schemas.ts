import { Type } from '@google/genai';
import { Topics } from './topics';

export const ADD_TRANSACTION_RESPONSE_JSON_SCHEMA = {
	type: Type.OBJECT,
	properties: {
		amount: {
			type: Type.INTEGER,
			description: 'Số tiền giao dịch (đồng Việt Nam)',
		},
		description: {
			type: Type.STRING,
			description: 'Mô tả giao dịch (ngắn gọn)',
		},
		type: {
			type: Type.STRING,
			enum: ['income', 'expense'],
			description: 'Loại giao dịch: income (thu nhập) hoặc expense (chi tiêu)',
		},
		category: {
			type: Type.STRING,
			description: 'Danh mục giao dịch (ví dụ: Ăn uống, Xăng xe, Lương)',
		},
	},
	required: ['amount', 'description', 'type'],
};

export type TAddTransactionResponse = {
	amount: number;
	description: string;
	type: 'income' | 'expense';
	category?: string;
};

export const GET_TOPIC_RESPONSE_JSON_SCHEMA = {
	type: Type.OBJECT,
	properties: {
		topic: {
			type: Type.STRING,
			enum: [...Object.values(Topics), 'unknown'],
		},
	},
	required: ['topic'],
};
export type TGetTopicResponse = {
	topic: Topics | 'unknown';
};
