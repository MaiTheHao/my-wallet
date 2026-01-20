import Swal from 'sweetalert2';

export const swalConfig = {
	confirmDelete: (itemName: string = 'giao dịch') => ({
		title: `Xóa ${itemName}?`,
		text: `Bạn có chắc chắn muốn xóa ${itemName} này?`,
		icon: 'warning' as const,
		showCancelButton: true,
		confirmButtonColor: '#dc2626',
		cancelButtonColor: '#6b7280',
		confirmButtonText: 'Xóa',
		cancelButtonText: 'Hủy',
	}),

	confirmDeleteBatch: (count: number, itemName: string = 'giao dịch') => ({
		title: `Xóa nhiều ${itemName}?`,
		text: `Bạn có chắc chắn muốn xóa ${count} ${itemName} đã chọn?`,
		icon: 'warning' as const,
		showCancelButton: true,
		confirmButtonColor: '#dc2626',
		cancelButtonColor: '#6b7280',
		confirmButtonText: `Xóa ${count} ${itemName}`,
		cancelButtonText: 'Hủy',
	}),

	success: (message: string, title: string = 'Thành công!') => ({
		title,
		text: message,
		icon: 'success' as const,
		timer: 1500,
		showConfirmButton: false,
	}),

	error: (message: string, title: string = 'Lỗi!') => ({
		title,
		text: message,
		icon: 'error' as const,
	}),

	info: (message: string, title: string = 'Thông báo') => ({
		title,
		text: message,
		icon: 'info' as const,
		timer: 2000,
	}),
};

export const showSuccess = (message: string, title?: string) => {
	return Swal.fire(swalConfig.success(message, title));
};

export const showError = (message: string, title?: string) => {
	return Swal.fire(swalConfig.error(message, title));
};

export const showInfo = (message: string, title?: string) => {
	return Swal.fire(swalConfig.info(message, title));
};

export const confirmDelete = async (itemName?: string) => {
	const result = await Swal.fire(swalConfig.confirmDelete(itemName));
	return result.isConfirmed;
};

export const confirmDeleteBatch = async (count: number, itemName?: string) => {
	const result = await Swal.fire(swalConfig.confirmDeleteBatch(count, itemName));
	return result.isConfirmed;
};

export default Swal;
