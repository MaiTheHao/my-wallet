import { Type, Schema } from '@google/genai';
import { z } from 'zod';
import { TransactionType, TransactionCategory } from '../models/transaction.model';

export const UNIFIED_RESPONSE_SCHEMA: Schema = {
	type: Type.OBJECT,
	properties: {
		is_transaction: {
			type: Type.BOOLEAN,
			description: 'True nếu là yêu cầu thêm thu/chi. False nếu là chat thường.',
		},
		transaction: {
			type: Type.OBJECT,
			nullable: true,
			properties: {
				amount: { type: Type.INTEGER, description: 'VND' },
				description: { type: Type.STRING, description: 'Nội dung' },
				type: { type: Type.STRING, enum: Object.values(TransactionType) },
				category: { type: Type.STRING, enum: Object.values(TransactionCategory) },
			},
			required: ['amount', 'description', 'type', 'category'],
		},
		reply: {
			type: Type.STRING,
			nullable: true,
			description: 'Trả lời hội thoại nếu không phải giao dịch.',
		},
	},
	required: ['is_transaction'],
};

export const zAIAnalysisResult = z.object({
	is_transaction: z.boolean(),
	transaction: z.object({
		amount: z.number(),
		description: z.string(),
		type: z.enum(TransactionType),
		category: z.enum(TransactionCategory),
	}).nullable().optional(),
	reply: z.string().nullable().optional(),
});
