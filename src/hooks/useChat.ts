'use client';
import { useState } from 'react';
import { ChatMessage } from '@/lib/types/transaction.types';
import { TResponseData } from '@/lib/types/response.type';
import { AiApiService } from '@/lib/services/api/ai-api.service';
import { useEventEmitter } from './useEventEmitter';
import { CLIENT_EVENTS } from '@/lib/const/events';

export function useChat() {
	const [chatLoading, setChatLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
	const eventEmitter = useEventEmitter();

	const handleChatSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;

		setChatLoading(true);
		const userMessage = message.trim();

		setChatHistory((prev) => [...prev, { type: 'user', content: userMessage }]);
		setMessage('');

		try {
			const result: TResponseData<{ reply: string }> = await AiApiService.chat(userMessage);

			if (result.success && result.data) {
				setChatHistory((prev) => [...prev, { type: 'bot', content: result.data?.reply ?? '' }]);
				eventEmitter.emit(CLIENT_EVENTS.TRANSACTION_CREATED, {});
			} else {
				setChatHistory((prev) => [
					...prev,
					{ type: 'bot', content: `${result.error || 'Không thể xử lý yêu cầu'}` },
				]);
			}
		} catch (error) {
			setChatHistory((prev) => [...prev, { type: 'bot', content: 'Không thể xử lý yêu cầu' }]);
		}
		setChatLoading(false);
	};

	return {
		chatLoading,
		message,
		setMessage,
		chatHistory,
		handleChatSubmit,
	};
}
