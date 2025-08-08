export enum Topics {
	ADD_TRANSACTION = 'add-transaction',
	NORMAL = 'normal',
}

export const TopicDescriptions: Record<Topics, string> = {
	[Topics.ADD_TRANSACTION]:
		'Thêm giao dịch thu hoặc chi. Ví dụ: "Mua cơm 100k" hoặc "Tôi đã nhận được 1.000.000 đồng tiền lương tháng này"',
	[Topics.NORMAL]:
		'Xử lý các yêu cầu thông thường không liên quan đến giao dịch. Ví dụ: trả lời câu hỏi, cung cấp thông tin, giao tiếp chung.',
};
