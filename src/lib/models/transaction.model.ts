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
	KHAC = 'Khác',
}

const transactionSchema = new Schema(
	{
		amount: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
			required: true,
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
	}
);

export type TTransaction = InferSchemaType<typeof transactionSchema>;

export const Transaction = models.Transaction || model('Transaction', transactionSchema);
