'use client';
import React from 'react';
import { Bot, ArrowUp, Sparkles } from 'lucide-react'; // Đổi icon send thành ArrowUp cho gọn
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
            // Icon màu đen, bỏ màu trắng cũ
			icon={<Sparkles className='text-black' size={20} />} 
			title='Trợ lý AI'
			subtitle='Nhập giao dịch tự nhiên'
			id='chat-interface'
			className='' // Giữ nguyên props, Section sẽ handle layout ngoài
		>
			{/* Chat History Area */}
            {/* Chuyển nền sang trắng, viền xám mảnh, vuông vức hơn */}
			<div className='bg-white border border-gray-200 rounded-lg p-4 mb-4 h-80 overflow-y-auto flex flex-col'>
				{chatHistory.length === 0 ? (
					<div className='flex flex-col items-center justify-center h-full text-gray-400 space-y-3'>
                        {/* Empty State tối giản */}
						<Bot strokeWidth={1.5} className='w-10 h-10 text-gray-300' />
						<div className='text-center space-y-1'>
                            <p className='text-sm font-medium text-gray-900'>Sẵn sàng ghi chép</p>
                            <p className='text-xs text-gray-500'>
                                "Cà phê 25k", "Lương 10tr", "Xăng 50k"
                            </p>
                        </div>
					</div>
				) : (
					<div className='space-y-4'>
						{chatHistory.map((chat, index) => (
							<div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
								<div
									className={`max-w-[85%] px-4 py-2.5 text-sm rounded-lg ${
										chat.error
											? 'bg-white border border-red-500 text-red-600' // Error style: viền đỏ mảnh
											: chat.type === 'user'
											? 'bg-black text-white' // User style: Đen tuyền
											: 'bg-gray-100 text-gray-900' // Bot style: Xám nhạt nền nã
									}`}
								>
									<div className='whitespace-pre-wrap leading-relaxed'>
										{chat.error ? chat.error : chat.content}
									</div>
								</div>
							</div>
						))}
                        {/* Loading Indicator Style tối giản */}
						{chatLoading && (
							<div className='flex justify-start'>
								<div className='bg-gray-100 px-4 py-3 rounded-lg flex items-center gap-1.5'>
									<div className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse'></div>
									<div className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-75'></div>
									<div className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-150'></div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Chat Input Area */}
			<form onSubmit={handleSubmitChat} className='flex items-end gap-2'>
				<div className='relative flex-1'>
                    <input
                        className='w-full pl-4 pr-4 py-3 bg-white border border-gray-300 rounded-lg 
                                   focus:outline-none focus:border-black focus:ring-1 focus:ring-black 
                                   transition-colors duration-200 text-gray-900 placeholder:text-gray-400 text-sm'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='Nhập giao dịch (ví dụ: Ăn trưa 30k)...'
                        disabled={chatLoading}
                    />
                </div>
				
                {/* Button: Đen tuyền, vuông vức, hiệu ứng hover nhẹ */}
				<button
					type='submit'
					className={`p-3 rounded-lg border border-transparent transition-all duration-200 flex-shrink-0 ${
						chatLoading || !message.trim()
							? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
							: 'bg-black text-white hover:bg-gray-800 active:scale-95'
					}`}
					disabled={chatLoading || !message.trim()}
				>
                    {/* Dùng icon ArrowUp thay vì chữ "Gửi" để tiết kiệm không gian và hiện đại hơn */}
					{chatLoading ? (
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
                    )}
				</button>
			</form>
		</Section>
	);
});
					
