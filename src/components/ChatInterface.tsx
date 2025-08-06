import React from 'react';
import { ChatMessage } from '@/types/transaction.types';

interface ChatInterfaceProps {
	message: string;
	setMessage: (message: string) => void;
	chatHistory: ChatMessage[];
	chatLoading: boolean;
	onSubmit: (e: React.FormEvent) => void;
}

export function ChatInterface({ message, setMessage, chatHistory, chatLoading, onSubmit }: ChatInterfaceProps) {
	return (
		<div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/30 overflow-hidden'>
			<div className='p-8 border-b border-slate-200/50'>
				<div className='flex items-center gap-3 mb-6'>
					<div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
						<span className='text-white text-xl font-bold'>🤖</span>
					</div>
					<div>
						<h2 className='text-2xl font-bold text-slate-800'>Trợ Lý AI</h2>
						<p className='text-slate-600 text-sm'>Nhập giao dịch bằng ngôn ngữ tự nhiên</p>
					</div>
				</div>

				{/* Chat History */}
				<div className='bg-slate-50/50 rounded-xl p-4 mb-6 max-h-80 overflow-y-auto space-y-3'>
					{chatHistory.length === 0 ? (
						<div className='text-center py-8 text-slate-400'>
							<div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4'>
								<span className='text-2xl'>💬</span>
							</div>
							<p className='text-lg font-medium'>Bắt đầu ghi chép thu chi</p>
							<p className='text-sm'>
								Ví dụ: "Mua cà phê 25k" (chi tiêu) hoặc "Nhận lương 10 triệu" (thu nhập)
							</p>
						</div>
					) : (
						chatHistory.map((chat, index) => (
							<div
								key={index}
								className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`max-w-[80%] px-4 py-3 rounded-xl ${
										chat.type === 'user'
											? 'bg-blue-500 text-white'
											: 'bg-white border border-slate-200 text-slate-700'
									}`}
								>
									<div className='text-sm font-medium mb-1'>
										{chat.type === 'user' ? 'Bạn' : 'AI'}
									</div>
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
				<form onSubmit={onSubmit} className='flex gap-3'>
					<input
						className='flex-1 px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-200 text-slate-700'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder='Nhập giao dịch... (VD: "Mua cà phê 25k" hoặc "Nhận lương 10 triệu")'
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
						{chatLoading ? 'Đang xử lý...' : 'Gửi'}
					</button>
				</form>
			</div>
		</div>
	);
}
