'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
	X,
	Menu,
	ArrowRight,
	Sparkles,
	Wallet,
	ListOrdered,
	Filter,
	CalendarDays,
	Search
} from 'lucide-react';
import { useFilterContext } from '@/context/filter-context/useFilterContext';
import { TimeRange } from '@/context/filter-context/FilterContext';

const quickLinks = [
	{ href: '#chat-interface', label: 'Trợ lý AI', icon: <Sparkles size={18} /> },
	{ href: '#summary', label: 'Tổng quan ví', icon: <Wallet size={18} /> },
	{ href: '#transaction-table', label: 'Lịch sử giao dịch', icon: <ListOrdered size={18} /> },
];

export function QuickMoveModal() {
	const [open, setOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<'nav' | 'filter'>('filter');
	const { timeRange, setTimeRange, search, setSearch } = useFilterContext();

	return (
		<>
			<button
				className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 md:bottom-8 md:right-8 cursor-pointer flex items-center justify-center
                    ${open ? 'bg-white text-black rotate-90 scale-90 shadow-none ring-2 ring-black' : 'bg-black text-white hover:bg-gray-900 hover:scale-105'}`}
				onClick={() => setOpen(!open)}
				aria-label={open ? 'Đóng panel' : 'Mở Menu Lọc'}
			>
				{open ? <X size={24} /> : <Filter size={24} />}
			</button>

			{open && (
				<>
					<div
						className='fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-[2px] transition-opacity'
						onClick={() => setOpen(false)}
					/>

					<div className='fixed bottom-24 right-6 md:right-8 z-50 w-72 origin-bottom-right animate-in slide-in-from-bottom-5 fade-in duration-200'>
						<div className='bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col'>
							<div className='flex items-center border-b border-gray-100 bg-gray-50/50 p-1'>
								<button
									onClick={() => setActiveTab('filter')}
									className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'filter' ? 'bg-white text-black shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-900'}`}
								>
									<Filter size={14} /> Bộ lọc
								</button>
								<button
									onClick={() => setActiveTab('nav')}
									className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'nav' ? 'bg-white text-black shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-900'}`}
								>
									<Menu size={14} /> Điều hướng
								</button>
							</div>

							<div className='p-4 min-h-[220px]'>
								{activeTab === 'filter' ? (
									<div className='space-y-5 animate-in fade-in slide-in-from-left-2 duration-300'>
										<div className='space-y-2'>
											<label className='text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2'>
												<Search size={14} /> Tìm kiếm nội dung
											</label>
											<div className='relative'>
												<input
													type='text'
													placeholder='Nhập tên giao dịch...'
													value={search}
													onChange={(e) => setSearch(e.target.value)}
													className='w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all'
												/>
												<Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
												{search && (
													<button
														onClick={() => setSearch('')}
														className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors'
													>
														<X size={14} />
													</button>
												)}
											</div>
										</div>

										<div className='space-y-2'>
											<label className='text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2'>
												<CalendarDays size={14} /> Dòng thời gian
											</label>
											<div className='grid gap-2'>
												{(
													[
														{ id: 'all', label: 'Tất cả thời gian' },
														{ id: 'week', label: 'Tuần này' },
														{ id: 'month', label: 'Tháng này' },
													] as const
												).map((period) => (
													<label
														key={period.id}
														className={`flex items-center justify-between px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${timeRange === period.id ? 'border-black bg-gray-900 border-transparent shadow-md' : 'border-gray-200 hover:bg-gray-50 bg-white'}`}
														onClick={() => setTimeRange(period.id)}
													>
														<span className={`text-sm font-medium ${timeRange === period.id ? 'text-white' : 'text-gray-700'}`}>
															{period.label}
														</span>
														<div className={`w-4 h-4 rounded-full border flex items-center justify-center ${timeRange === period.id ? 'border-white' : 'border-gray-300'}`}>
															{timeRange === period.id && <div className='w-2 h-2 rounded-full bg-white' />}
														</div>
													</label>
												))}
											</div>
										</div>
									</div>
								) : (
									<div className='flex flex-col animate-in fade-in slide-in-from-right-2 duration-300'>
										{quickLinks.map((link) => (
											<Link
												key={link.href}
												href={link.href}
												className='group flex items-center justify-between px-1 py-3 text-sm font-medium text-gray-700 hover:text-black transition-colors border-b border-gray-100 last:border-none'
												onClick={() => setOpen(false)}
											>
												<div className='flex items-center gap-3'>
													<span className='p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-black group-hover:bg-gray-100 transition-all'>
														{link.icon}
													</span>
													{link.label}
												</div>
												<ArrowRight size={16} className='opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-gray-400 group-hover:text-black' />
											</Link>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}

export default QuickMoveModal;
