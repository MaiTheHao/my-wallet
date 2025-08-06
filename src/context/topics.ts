export enum Topics {
	ADD_TRANSACTION = 'add-transaction',
	RE_ASK = 're-ask',
	UNKNOWN = 'unknown',
}

export const TopicDescriptions: Record<Topics, string> = {
	[Topics.ADD_TRANSACTION]:
		'Thêm giao dịch thu hoặc chi. Nếu thiếu thông tin, hãy yêu cầu người dùng cung cấp đầy đủ bằng topic "re-ask".',
	[Topics.RE_ASK]: 'Yêu cầu người dùng cung cấp thêm thông tin nếu cần thiết.',
	[Topics.UNKNOWN]: 'Chủ đề không xác định',
};
