export enum Topics {
	ADD_TRANSACTION = 'add-transaction',
	RE_ASK = 're-ask',
	NORMAL = 'normal',
}

export const TopicDescriptions: Record<Topics, string> = {
	[Topics.ADD_TRANSACTION]:
		'Thêm giao dịch thu hoặc chi. Nếu thiếu thông tin, hãy yêu cầu người dùng cung cấp đầy đủ bằng topic "re-ask".',
	[Topics.RE_ASK]: 'Yêu cầu người dùng cung cấp thêm thông tin nếu cần thiết.',
	[Topics.NORMAL]:
		'Xử lý các yêu cầu thông thường không liên quan đến giao dịch. Ví dụ: trả lời câu hỏi, cung cấp thông tin, giao tiếp chung.',
};
