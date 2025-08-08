'use client';
import { useState } from 'react';
import { ChatMessage } from '@/lib/types/transaction.types';
import { AiApiService } from '@/lib/services/api/ai-api.service';

export function useChat() {
	const [chatLoading, setChatLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

	async function sendMessage(msg: string): Promise<boolean> {
		if (!msg.trim()) return false;
		setChatLoading(true);
		setChatHistory((prev) => [...prev, { type: 'user', content: msg }]);
		try {
			const res = await AiApiService.chat(msg);
			if (res.success && res.data) {
				setChatHistory((prev) => [
					...prev,
					{ type: 'bot', content: res.data?.reply || 'Không có phản hồi từ AI' },
				]);
				setMessage('');
				setChatLoading(false);
				return true;
			} else {
				setChatHistory((prev) => [
					...prev,
					{ type: 'bot', error: res.error || 'Có lỗi xảy ra, vui lòng thử lại.', content: '' },
				]);
			}
		} catch (err) {
			setChatHistory((prev) => [...prev, { type: 'bot', content: 'Có lỗi xảy ra, vui lòng thử lại.' }]);
		}
		setChatLoading(false);
		return false;
	}

	return {
		message,
		setMessage,
		chatHistory,
		chatLoading,
		sendMessage,
	};
}
