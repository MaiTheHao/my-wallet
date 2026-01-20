import { Schema, model, InferSchemaType, models } from 'mongoose';

export enum TransactionType {
	INCOME = 'income',
	EXPENSE = 'expense',
}

export enum TransactionCategory {
	AN_UONG = 'Ăn uống',
	DI_LAI = 'Đi lại',
	DICH_VU = 'Dịch vụ',
	GIAI_TRI = 'Giải trí',
	CHAM_VO = 'Chăm vợ',
	KHAC = 'Khác',
}

const transactionSchema = new Schema(
	{
		amount: {
			type: Number,
			required: true,
			min: 0,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		type: {
			type: String,
			enum: Object.values(TransactionType),
			required: true,
		},
		category: {
			type: String,
			enum: Object.values(TransactionCategory),
			default: TransactionCategory.KHAC,
		},
	},
	{
		timestamps: true,
	},
);

transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ type: 1 });

export type TTransaction = InferSchemaType<typeof transactionSchema>;

export const Transaction = models.Transaction || model('Transaction', transactionSchema);
