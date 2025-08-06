'use client';
import React from 'react';
import { Bot, MessageCircle } from 'lucide-react';
import { Section } from './Section';
import { useChat } from '@/hooks/useChat';

export const ChatInterface = React.memo(function ChatInterface() {
	const { message, setMessage, chatHistory, chatLoading, handleChatSubmit } = useChat();

	return (
		<Section
			icon={<Bot className='text-white' size={28} />}
			title='Trợ Lý AI'
			subtitle='Nhập giao dịch bằng ngôn ngữ tự nhiên'
			className=''
		>
			{/* Chat History */}
			<div className='bg-slate-50/50 rounded-xl p-4 mb-6 max-h-80 overflow-y-auto space-y-3'>
				{chatHistory.length === 0 ? (
					<div className='text-center py-8 text-slate-400'>
						<div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<MessageCircle className='text-slate-400' size={32} />
						</div>
						<p className='text-lg font-medium'>Bắt đầu ghi chép thu chi</p>
						<p className='text-sm'>
							Ví dụ: "Mua cà phê 25k" (chi tiêu) hoặc "Nhận lương 10 triệu" (thu nhập)
						</p>
					</div>
				) : (
					chatHistory.map((chat, index) => (
						<div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
							<div
								className={`max-w-[80%] px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl ${
									chat.type === 'user'
										? 'bg-blue-500 text-white'
										: 'bg-white border border-slate-200 text-slate-700'
								}`}
							>
								<div className='whitespace-pre-wrap text-sm'>{chat.content}</div>
							</div>
						</div>
					))
				)}
				{chatLoading && (
					<div className='flex justify-start'>
						<div className='bg-white border border-slate-200 px-4 py-3 rounded-xl'>
							<div className='flex items-center gap-2'>
								<div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce'></div>
								<div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100'></div>
								<div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200'></div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Chat Input */}
			<form onSubmit={handleChatSubmit} className='flex gap-3 pb-4 pl-2 pr-2 sm:pl-4 sm:pr-4'>
				<input
					className='flex-1 px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-200 text-slate-700'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder='Nhập giao dịch...'
					disabled={chatLoading}
				/>
				<button
					type='submit'
					className={`px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 ${
						chatLoading || !message.trim()
							? 'bg-slate-400 cursor-not-allowed'
							: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
					}`}
					disabled={chatLoading || !message.trim()}
				>
					{chatLoading ? '...' : 'Gửi'}
				</button>
			</form>
		</Section>
	);
});
