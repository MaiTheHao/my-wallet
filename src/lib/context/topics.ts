export enum Topics {
	ADD_TRANSACTION = 'add-transaction',
	NORMAL = 'normal',
}

export const TopicDescriptions: Record<Topics, string> = {
	[Topics.ADD_TRANSACTION]:
		'Thêm giao dịch thu hoặc chi. Ví dụ: "Chi 10k mua nước ở căng tin", "Hôm nay tôi đã nạp 50k vào điện thoại", "Bạn tôi trả lại 200k đã vay", "Mua vé xem phim 150k", "Nhận 15 triệu tiền hoa hồng dự án", "Được tặng 200k mừng sinh nhật", "Trả tiền điện tháng này 500k", "Đổ xăng xe máy hết 80k".',
	[Topics.NORMAL]:
		'Xử lý các yêu cầu thông thường không liên quan đến giao dịch. Ví dụ: trả lời câu hỏi, cung cấp thông tin, giao tiếp chung.',
};
