'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
    X, 
    Menu, // Dùng icon Menu thay cho MoveUpRight để dễ hiểu hơn
    ArrowRight,
    Sparkles,
    Wallet,
    ListOrdered
} from 'lucide-react';

// Định nghĩa lại data, bỏ class màu mè, thêm icon tương ứng
const quickLinks = [
	{
		href: '#chat-interface',
		label: 'Trợ lý AI',
		icon: <Sparkles size={18} />,
	},
	{
		href: '#summary',
		label: 'Tổng quan ví',
		icon: <Wallet size={18} />,
	},
	{
		href: '#transaction-table',
		label: 'Lịch sử giao dịch',
		icon: <ListOrdered size={18} />,
	},
];

export function QuickMoveModal() {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* Floating Action Button (FAB) */}
			<button
				className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-xl transition-all duration-300 md:bottom-8 md:right-8 cursor-pointer flex items-center justify-center
                    ${open ? 'bg-white text-black rotate-90 scale-90 shadow-none ring-2 ring-black' : 'bg-black text-white hover:bg-gray-900 hover:scale-105'}`}
				onClick={() => setOpen(!open)}
				aria-label={open ? 'Đóng menu' : 'Mở menu nhanh'}
			>
                {/* Khi mở thì hiện X, đóng thì hiện Menu */}
				{open ? <X size={24} /> : <Menu size={24} />}
			</button>

			{/* Modal Overlay & Content */}
			{open && (
				<>
                    {/* Backdrop mờ nhẹ */}
					<div 
                        className='fixed inset-0 z-30 bg-white/60 backdrop-blur-sm transition-opacity'
                        onClick={() => setOpen(false)}
                    />
                    
                    {/* Menu Content: Neo vào góc phải dưới, gần nút bấm */}
					<div className='fixed bottom-24 right-6 md:right-8 z-40 w-64 origin-bottom-right animate-in slide-in-from-bottom-5 fade-in duration-200'>
						<div className='bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden'>
							<div className='bg-gray-50 px-4 py-3 border-b border-gray-100'>
                                <h3 className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                                    Điều hướng nhanh
                                </h3>
                            </div>
                            
							<div className='flex flex-col'>
								{quickLinks.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										className='group flex items-center justify-between px-4 py-3.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none'
										onClick={() => setOpen(false)}
									>
                                        <div className="flex items-center gap-3">
                                            {/* Icon mục */}
                                            <span className="text-gray-400 group-hover:text-black transition-colors">
                                                {link.icon}
                                            </span>
										    {link.label}
                                        </div>
                                        {/* Mũi tên chỉ hiện khi hover */}
                                        <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-gray-400" />
									</Link>
								))}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}

export default QuickMoveModal;
		.
