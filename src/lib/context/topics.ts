export enum Topics {
	ADD_TRANSACTION = 'add-transaction',
	NORMAL = 'normal',
}

export const TopicDescriptions: Record<Topics, string> = {
	[Topics.ADD_TRANSACTION]: 'Thêm giao dịch thu/chi (số tiền, nội dung).',
	[Topics.NORMAL]: 'Hội thoại thông thường.',
};
