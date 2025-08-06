import { Type } from '@google/genai';
import { TransactionType, TransactionCategory } from '../models/transaction.model';
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
			enum: Object.values(TransactionType),
			description: 'Loại giao dịch: income (thu nhập) hoặc expense (chi tiêu)',
		},
		category: {
			type: Type.STRING,
			enum: Object.values(TransactionCategory),
			description: 'Danh mục giao dịch',
		},
	},
	required: ['amount', 'description', 'type'],
};

export const GET_TOPIC_RESPONSE_JSON_SCHEMA = {
	type: Type.OBJECT,
	properties: {
		topic: {
			type: Type.STRING,
			enum: Object.values(Topics),
		},
		reply: {
			type: Type.STRING,
			description: 'Phản hồi của AI nếu có, có thể là yêu cầu thêm thông tin hoặc xác nhận',
		},
	},
	required: ['topic', 'reply'],
};
