'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { X, MoveUpRight } from 'lucide-react';

const quickLinks = [
	{
		href: '#chat-interface',
		label: 'Trợ Lý AI',
		className: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
	},
	{
		href: '#transaction-table',
		label: 'Lịch Sử Giao Dịch',
		className: 'bg-green-50 hover:bg-green-100 text-green-700',
	},
	{
		href: '#summary',
		label: 'Tổng Quan Ví',
		className: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
	},
];

export function QuickMoveModal() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				className='fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-blue-500 to-purple-500 hover:scale-105 hover:shadow-xl text-white rounded-full shadow-lg p-2 flex items-center justify-center transition-all duration-200 md:bottom-8 md:right-8 cursor-pointer border-4 border-white'
				onClick={() => setOpen(true)}
				aria-label='Di chuyển nhanh'
			>
				<MoveUpRight size={24} />
			</button>
			{open && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
					<div className='bg-white sm:rounded-xl shadow-lg w-full sm:max-w-xs p-4 relative'>
						<button
							onClick={() => setOpen(false)}
							className='absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer'
							aria-label='Đóng'
						>
							<X size={22} />
						</button>
						<h3 className='text-base font-semibold mb-3 text-center'>Di chuyển nhanh</h3>
						<div className='flex flex-col gap-3'>
							{quickLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={`px-3 py-2 rounded-lg font-medium text-center transition cursor-pointer ${link.className}`}
									onClick={() => setOpen(false)}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default QuickMoveModal;
