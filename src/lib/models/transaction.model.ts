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
  MUA_SAM = 'Mua sắm',
  SUC_KHOE = 'Sức khỏe',
  GIAO_DUC = 'Giáo dục',
  TIEN_LUONG = 'Tiền lương',
  CHAM_VO = 'Chăm vợ',
  TIEN_NHA = 'Tiền nhà',
  DIEN_NUOC = 'Điện nước',
  INTERNET = 'Internet',
  XANG_XE = 'Xăng xe',
  BAO_HIEM = 'Bảo hiểm',
  DAU_TU = 'Đầu tư',
  TRA_NO = 'Trả nợ',
  CHO_VAY = 'Cho vay',
  BI_EU_TANG = 'Biếu tặng',
  THUONG = 'Thưởng',
  LAI_SUAT = 'Lãi suất',
  LAM_DEP = 'Làm đẹp',
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
    userId: {
      type: String,
      required: false,
      default: 'system_user',
    },
  },
  {
    timestamps: true,
  },
);

transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ userId: 1 });

export type TTransaction = InferSchemaType<typeof transactionSchema>;

export const Transaction = models.Transaction || model('Transaction', transactionSchema);
