'use client';
import { useCallback } from 'react';
import { confirmDelete, confirmDeleteBatch, showSuccess, showError, showInfo } from '@/lib/utils/swal.config';

export function useSwal() {
	const confirm = useCallback(async (itemName?: string) => {
		return await confirmDelete(itemName);
	}, []);

	const confirmBatch = useCallback(async (count: number, itemName?: string) => {
		return await confirmDeleteBatch(count, itemName);
	}, []);

	const success = useCallback(async (message: string, title?: string) => {
		return await showSuccess(message, title);
	}, []);

	const error = useCallback(async (message: string, title?: string) => {
		return await showError(message, title);
	}, []);

	const info = useCallback(async (message: string, title?: string) => {
		return await showInfo(message, title);
	}, []);

	return {
		confirm,
		confirmBatch,
		success,
		error,
		info,
	};
}
