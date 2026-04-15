export const formatAmount = (amount: number, type: 'income' | 'expense') => {
  const formatted = amount.toLocaleString('vi-VN');
  return type === 'income' ? `+${formatted}` : `-${formatted}`;
};
