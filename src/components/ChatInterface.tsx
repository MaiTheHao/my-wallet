'use client';
import React from 'react';
import { Bot, ArrowUp, Sparkles, AlertCircle } from 'lucide-react';
import { Section } from './Section';
import { useChat } from '@/hooks/useChat';
import { useTransactionContext } from '@/context/transaction-context/useTransactionContext';
import { useBalanceContext } from '@/context/balance-context/useBalanceContext';

export const ChatInterface = React.memo(function ChatInterface() {
	const { message, setMessage, chatHistory, chatLoading, sendMessage } = useChat();
	const { fetchTransactions } = useTransactionContext();
	const { refetchBalance } = useBalanceContext();

	const handleSubmitChat = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;

		const success = await sendMessage(message);
		if (success) {
			await Promise.all([fetchTransactions(), refetchBalance()]);
		}
	};

	return (
		<Section
			icon={<Sparkles className='text-black' size={18} />}
			title='Trợ lý AI'
			subtitle='Nhập chi tiêu bằng ngôn ngữ tự nhiên'
			id='chat-interface'
			className=''
		>
			<div className="flex flex-col h-full">
				{/* 1. KHUNG CHAT HISTORY */}
				{/* Tăng chiều cao min-h, dùng bg-white thuần khiết, border bottom để ngăn cách với ô nhập */}
				<div className='min-h-[300px] max-h-[400px] overflow-y-auto px-1 py-4 flex flex-col gap-3'>
					{chatHistory.length === 0 ? (
						<div className='flex flex-col items-center justify-center h-full text-gray-400 my-auto py-8'>
							<div className="bg-gray-50 p-4 rounded-full mb-3">
								<Bot strokeWidth={1.5} className='w-8 h-8 text-gray-400' />
							</div>
							<p className='text-sm font-medium text-gray-900'>Trợ lý sẵn sàng</p>
							<p className='text-xs text-gray-500 mt-1'>
								Thử nhập: "Ăn sáng 30k", "Lương 15tr"
							</p>
						</div>
					) : (
						<>
							{chatHistory.map((chat, index) => (
								<div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
									<div
										className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm ${
											chat.error
												? 'bg-red-50 text-red-700 border border-red-100 rounded-2xl rounded-tl-sm'
												: chat.type === 'user'
												? 'bg-black text-white rounded-2xl rounded-tr-sm' // User: Đen, bo góc kiểu chat hiện đại
												: 'bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm' // Bot: Xám, bo góc ngược lại
										}`}
									>
										{chat.error && <AlertCircle size={14} className="inline mr-1 -mt-0.5"/>}
										<span className="whitespace-pre-wrap">{chat.error ? chat.error : chat.content}</span>
									</div>
								</div>
							))}
							
							{/* Loading Indicator */}
							{chatLoading && (
								<div className='flex justify-start'>
									<div className='bg-gray-50 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 border border-gray-100'>
										<div className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce'></div>
										<div className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75'></div>
										<div className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150'></div>
									</div>
								</div>
							)}
						</>
					)}
				</div>

				{/* 2. INPUT AREA */}
				{/* Tách biệt bằng border-top, tạo thành một "footer" vững chãi cho Section */}
				<div className="pt-4 mt-2 border-t border-gray-100">
					<form onSubmit={handleSubmitChat} className='relative flex items-center gap-2'>
						<input
							className='w-full pl-4 pr-12 py-3.5 bg-gray-50 border-none rounded-lg
									   text-gray-900 text-sm placeholder:text-gray-400
									   focus:bg-white focus:ring-2 focus:ring-black/5 transition-all duration-200'
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder='Nhập giao dịch...'
							disabled={chatLoading}
						/>
						
						{/* Nút gửi nằm đè lên bên phải input hoặc nằm cạnh (ở đây tôi để nằm cạnh cho style Clean) */}
						<button
							type='submit'
							className={`h-[46px] w-[46px] flex items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0 ${
								chatLoading || !message.trim()
									? 'bg-gray-100 text-gray-300 cursor-not-allowed'
									: 'bg-black text-white hover:bg-gray-800 active:scale-95 shadow-md shadow-gray-200'
							}`}
							disabled={chatLoading || !message.trim()}
						>
							{chatLoading ? (
								<div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
							) : (
								<ArrowUp className="w-5 h-5" strokeWidth={2.5} />
							)}
						</button>
					</form>
				</div>
			</div>
		</Section>
	);
});
										
