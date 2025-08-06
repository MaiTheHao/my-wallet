import { Schema, model, InferSchemaType, models } from 'mongoose';

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
			enum: ['income', 'expense'],
			required: true,
		},
		category: {
			type: String,
			default: 'Khác',
		},
	},
	{
		timestamps: true,
	}
);

export type TTransaction = InferSchemaType<typeof transactionSchema>;

export const Transaction = models.Transaction || model('Transaction', transactionSchema);
