export enum Topics {
	CHECK_BALANCE = 'check-balance',
	ADD_TRANSACTION = 'add-transaction',
	DELETE_TRANSACTION = 'delete-transaction',
}

export const TopicDescriptions: Record<Topics, string> = {
	[Topics.CHECK_BALANCE]: 'Kiểm tra số dư, tổng thu chi',
	[Topics.ADD_TRANSACTION]: 'Thêm giao dịch thu hoặc chi',
	[Topics.DELETE_TRANSACTION]: 'Xóa giao dịch',
};
