export type InsightLevel = 'danger' | 'warning' | 'neutral' | 'good' | 'excellent';

export interface FinancialInsight {
  message: string;
  level: InsightLevel;
}

export type SummaryInput = {
  income: number;
  expense: number;
};

export function generateFinancialInsight({ income, expense }: SummaryInput): FinancialInsight {
  if (income === 0 && expense === 0) {
    return {
      message: 'Chưa có dữ liệu tài chính để phân tích.',
      level: 'neutral',
    };
  }

  const balance = income - expense;
  const savingRate = income > 0 ? (balance / income) * 100 : 0;

  if (income === 0 && expense > 0) {
    return {
      message: 'Bạn đang chi tiêu mà không có thu nhập. Cần kiểm soát tài chính ngay.',
      level: 'danger',
    };
  }

  if (balance < 0) {
    return {
      message: `Bạn đang thâm hụt ${Math.abs(savingRate).toFixed(1)}% thu nhập. Chi tiêu vượt kiểm soát.`,
      level: 'danger',
    };
  }

  if (savingRate >= 0 && savingRate < 10) {
    return {
      message: `Tỷ lệ tiết kiệm chỉ ${savingRate.toFixed(1)}%. Bạn đang chi tiêu gần hết thu nhập.`,
      level: 'warning',
    };
  }

  if (savingRate >= 10 && savingRate < 30) {
    return {
      message: `Bạn tiết kiệm ${savingRate.toFixed(1)}% thu nhập. Mức ổn định, nhưng còn có thể tối ưu hơn.`,
      level: 'neutral',
    };
  }

  if (savingRate >= 30 && savingRate < 50) {
    return {
      message: `Tỷ lệ tiết kiệm ${savingRate.toFixed(1)}% cho thấy bạn đang quản lý tài chính tốt.`,
      level: 'good',
    };
  }

  return {
    message: `Bạn đang tiết kiệm ${savingRate.toFixed(1)}% thu nhập. Kiểm soát tài chính rất hiệu quả.`,
    level: 'excellent',
  };
}
